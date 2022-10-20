import jsdom from "jsdom";
import https from "https";
import tar from 'tar-stream';
import zlib from 'zlib';
import fs from 'fs/promises';

const dataRoot = 'https://data.iana.org/time-zones/releases/';
const filenameRe = /^tzdata(\d{4}\w*)\.tar\.gz$/;

const filename = await getLatestFilename();
const zoneTab = await getZoneTab(`${dataRoot}${filename}`);
const entries = parseZoneTab(zoneTab);
const timeZoneSet = new Set(entries.filter(e => e[2]).map(entry => entry[2]));
const timeZones = [...timeZoneSet];
timeZones.sort((a,b) => a.localeCompare(b));
const serialized = JSON.stringify(timeZones, null, 2);
await fs.mkdir("src", { recursive: true });
fs.writeFile("src/timeZones.json", serialized);
// Update package.json
const filenameMatch = filenameRe.exec(filename);
if (filenameMatch) {
    const pkg = JSON.parse(await fs.readFile("./package.json", { encoding: "utf-8" }));
    const { version } = pkg;
    const versionPrefix = version.substring(0, version.lastIndexOf("."));
    pkg.version = `${versionPrefix}.${filenameMatch[1]}`;
    fs.writeFile("./package.json", JSON.stringify(pkg, null, 2));
}

async function getLatestFilename () {
    const res = await fetch(dataRoot);
    if (res.ok) {
        const data = await res.text();
        const dom = new jsdom.JSDOM(data);
        const links = dom.window.document.querySelectorAll("a[href^=tzdata]");
        let filenames = [...links].map(l => l.textContent||"");
        filenames = filenames.filter(f => filenameRe.test(f))
        filenames.sort((a,b) => -a.localeCompare(b))
        return filenames[0];
    }
    throw Error("Failed to get release list");
}

function getZoneTab (archivePath) {
    return new Promise (resolve => {
        var extract = tar.extract();
        var data = '';

        extract.on('entry', function(header, stream, cb) {
            stream.on('data', function(chunk) {
                if (header.name == 'zone1970.tab')
                    data += chunk;
            });

            stream.on('end', function() {
                cb();
            });

            stream.resume();
        });

        extract.on('finish', function() {
            resolve(data);
        });

        https.get(archivePath, res => {
            res.pipe(zlib.createGunzip()).pipe(extract);
        });
    });
}

function parseZoneTab (contents) {
    const lines = contents.split("\n");
    const entries = lines.filter(l => l[0] !== "#");

    return entries.map(entry => entry.split("\t"));
}
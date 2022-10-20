import timeZones from "./timeZones.json";
const timeZoneList: string[] = timeZones;

declare namespace Intl {
  type Key = 'calendar' | 'collation' | 'currency' | 'numberingSystem' | 'timeZone' | 'unit';

  function supportedValuesOf(input: Key): string[];
}

function getTimeZones (): string[] {
    if (typeof Intl["supportedValuesOf"] === "function") {
        return Intl.supportedValuesOf("timeZone");
    }

    return timeZones;
}

export { getTimeZones, timeZoneList };
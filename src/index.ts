import timeZones from "./timeZones.json";
const timeZoneList: string[] = timeZones;

declare namespace Intl {
  type Key = 'calendar' | 'collation' | 'currency' | 'numberingSystem' | 'timeZone' | 'unit';

  function supportedValuesOf(input: Key): string[];
}

function getTimeZones (): string[] {
    try {
        return Intl.supportedValuesOf("timeZone");
    }
    catch (e) {
        return timeZoneList;
    }
}

export { getTimeZones, timeZoneList };

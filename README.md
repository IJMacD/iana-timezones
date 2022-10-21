# IANA Time Zone Name List

Package which just provides a list of IANA time zone names.

In development the package can download the latest IANA time zone database automatically and convert to JSON array of time zone names.

## Usage
To use the package:
1. `> yarn add iana-timezones`
2. Get a list of time zone names. If your platform supports `Intl.supportedValuesOf()` then this function will return the supported list.
  If the platform doesn't support it then the function will fall back to the built-in list included in this package.

        const iana = require ('iana-timezones');

        // Get a list of timezones
        const timeZoneNames = iana.getTimeZones();
3. To just get the built-in list use this:

        const iana = require ('iana-timezones');

        // Get a list of timezones
        const timeZoneNames = iana.timeZoneList;

## Installing/Building

1. `git clone https://github.com/IJMacD/iana-timezones.git`
2. `cd iana-timezones`
3. `yarn install`

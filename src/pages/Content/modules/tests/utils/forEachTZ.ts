import TimezoneMock, { TimeZone } from 'timezone-mock';

export default function forEachTZ(cb: (tz?: TimeZone) => void): void {
  const zones: TimeZone[] = [
    'UTC',
    'US/Eastern',
    'US/Pacific',
    'Brazil/East',
    'Europe/London',
    'Australia/Adelaide',
  ];

  zones.forEach((tz: TimeZone) => {
    TimezoneMock.register(tz);
    cb(tz);
  });
}

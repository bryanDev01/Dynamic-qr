export function buildWifiUri(ssid: string, password: string): string {
  const escape = (value: string) => value.replace(/([\\;,:"])/g, "\\$1");

  return `WIFI:T:WPA;S:${escape(ssid)};P:${escape(password)};;`;
}

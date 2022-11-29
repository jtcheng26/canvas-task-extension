export default function baseURL(): string {
  return `${window.location.protocol + '//' + window.location.host}`;
}

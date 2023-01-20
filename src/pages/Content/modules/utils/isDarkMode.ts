function isColorDark(r: number, g: number, b: number, a: number): boolean {
  if (a === 0) return false;
  return r < 100 || g < 100 || b < 100;
}

function parseRGBA(rgba: string): [number, number, number, number] {
  const pfxLen = rgba.substring(0, 4) === 'rgba' ? 5 : 4;
  const rgbaNums = rgba
    .substring(pfxLen, rgba.length - 1)
    .split(',')
    .map((a) => parseInt(a.trim()));
  const r = rgbaNums[0] || 255;
  const g = rgbaNums[1] || 255;
  const b = rgbaNums[2] || 255;
  const a = rgbaNums[3] || 255;
  return [r, g, b, a];
}

export default function isDarkMode(): boolean {
  const extRoot = document.body;
  const bgColor = getComputedStyle(extRoot).backgroundColor;
  if (bgColor) {
    const [r, g, b, a] = parseRGBA(bgColor);
    return isColorDark(r, g, b, a);
  }

  return false;
}

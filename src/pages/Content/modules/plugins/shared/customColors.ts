import { DEFAULT_DASHBOARD_COLORS } from '../../constants';

export type StoredCustomColors = Record<string, string>;

function colorsKey(platformKey: string) {
  return `${platformKey}_colors`;
}

export function colorFromId(id: string | number) {
  if (typeof id === 'number')
    return DEFAULT_DASHBOARD_COLORS[id % DEFAULT_DASHBOARD_COLORS.length];
  let hash = 0;
  for (let i = 0, len = id.length; i < len; i++) {
    hash = hash + id.charCodeAt(i);
    hash |= 0;
  }
  return DEFAULT_DASHBOARD_COLORS[hash % DEFAULT_DASHBOARD_COLORS.length];
}

export async function loadCustomColors(
  platformKey: string
): Promise<StoredCustomColors> {
  const key = colorsKey(platformKey);
  const colors = await chrome.storage.sync.get(key);
  if (!(key in colors)) return {};
  return colors[key] as StoredCustomColors;
}

export async function setCustomColors(
  platformKey: string,
  customColors: StoredCustomColors
) {
  const colors = await loadCustomColors(platformKey);
  const key = colorsKey(platformKey);
  chrome.storage.sync.set({
    [key]: {
      ...colors,
      ...customColors,
    },
  });
}

// does not actually set the defaults in storage
export async function loadCustomColorsWithDefaults(
  platformKey: string,
  courses: string[]
): Promise<StoredCustomColors> {
  const currColors = await loadCustomColors(platformKey);
  const defaultColors = courses.reduce((colors: StoredCustomColors, cid) => {
    colors[cid] = colorFromId(cid);
    return colors;
  }, {});
  const res = {
    ...defaultColors,
    ...currColors,
  };
  return res;
}

export function watchCustomColors(
  platformKey: string,
  callback: (id: string, color: string) => void
) {
  const key = colorsKey(platformKey);
  const listener = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    if (key in changes) {
      Object.entries(changes[key].newValue).forEach(
        (entry: [string, unknown]) => {
          if (
            entry[0] in changes[key].oldValue &&
            changes[key].oldValue[entry[0]] == entry[1]
          )
            return;
          callback(entry[0], entry[1] as string);
        }
      );
    }
  };
  chrome.storage.onChanged.addListener(listener);
  return listener;
}

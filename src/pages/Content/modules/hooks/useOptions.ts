import { useContext, useEffect } from 'react';
import { OptionsDefaults } from '../constants';
import { Options } from '../types';
import isDarkMode from '../utils/isDarkMode';
import { useConfigStore } from './useStore';
import { OptionsContext } from '../contexts/contexts';
import { getExperimentGroup } from './useExperiment';

const storedUserOptions = Object.keys(OptionsDefaults);

async function applyDefaults(options: Options): Promise<Options> {
  if (Object.keys(options).length === 0) {
    const isTreated = await getExperimentGroup('courses_default_setting');
    // experiment: show courses with active assignments only vs show all courses
    options.dash_courses = isTreated;
  }
  const opts = {
    ...OptionsDefaults,
    ...options,
  };
  opts.dark_mode = isDarkMode(); // auto detect, might change to option in the future
  return opts;
}

export async function getOptions(): Promise<Options> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(storedUserOptions, async function (result) {
      chrome.storage.sync.set(
        await applyDefaults(result as Options),
        function () {
          chrome.storage.sync.get(null, function (result2) {
            resolve(result2 as Options);
          });
        }
      );
    });
  });
}

export interface OptionsInterface {
  state: Options;
  update: (key: string, value: unknown) => Options;
}

export function useOptionsStore(
  arg?: Options,
  onUpdateCallback?: () => void
): OptionsInterface {
  const { state, update } = useConfigStore<Options>(
    arg || OptionsDefaults,
    true
  );
  function updateKey(key: string, value: unknown) {
    return update([key], value, true);
  }
  useEffect(() => {
    // add observers here
    const storageListener = (changes: {
      [key: string]: chrome.storage.StorageChange;
    }) => {
      for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (storedUserOptions.includes(key) && oldValue !== newValue) {
          update([key], newValue, false);
          if (onUpdateCallback) onUpdateCallback();
        }
      }
    };
    chrome.storage.onChanged.addListener(storageListener);
    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
    };
  }, []);

  return { state, update: updateKey };
}

/* Use cached options */
export default function useOptions(): OptionsInterface {
  return useContext(OptionsContext);
}

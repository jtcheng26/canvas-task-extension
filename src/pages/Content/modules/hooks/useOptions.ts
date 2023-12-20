import { useContext } from 'react';
import { OptionsDefaults } from '../constants';
import { Options } from '../types';
import isDarkMode from '../utils/isDarkMode';
import { useConfigStore } from './useStore';
import { OptionsContext } from '../contexts/contexts';

const storedUserOptions = Object.keys(OptionsDefaults);

function applyDefaults(options: Options): Options {
  const opts = {
    ...OptionsDefaults,
    ...options,
  };
  opts.dark_mode = isDarkMode(); // auto detect, might change to option in the future
  return opts;
}

export async function getOptions(): Promise<Options> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(storedUserOptions, function (result) {
      chrome.storage.sync.set(applyDefaults(result as Options), function () {
        chrome.storage.sync.get(null, function (result2) {
          resolve(result2 as Options);
        });
      });
    });
  });
}

export interface OptionsInterface {
  state: Options;
}

export function useOptionsStore(arg?: Options): OptionsInterface {
  const { state } = useConfigStore<Options>(arg || OptionsDefaults, true);

  return { state };
}

/* Use cached options */
export default function useOptions(): OptionsInterface {
  return useContext(OptionsContext);
}

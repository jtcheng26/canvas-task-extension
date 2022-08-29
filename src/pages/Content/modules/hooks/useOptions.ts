import { useQuery, UseQueryResult } from 'react-query';
import { OptionsDefaults } from '../constants';
import { Options } from '../types';

const storedUserOptions = Object.keys(OptionsDefaults);

function applyDefaults(options: Options): Options {
  return {
    ...OptionsDefaults,
    ...options,
  };
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

/* Use cached options */
export default function useOptions(): UseQueryResult<Options> {
  return useQuery('options', () => getOptions(), { staleTime: Infinity });
}

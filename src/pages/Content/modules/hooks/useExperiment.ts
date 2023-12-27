import { ExperimentConfig } from '../types';
import { CLIENT_ID_LENGTH, EXPERIMENT_CONFIG_URL } from '../constants';
import { useEffect, useState, useMemo, useContext } from 'react';
import isDemo from '../utils/isDemo';
import { ExperimentsContext } from '../contexts/contexts';

// cryptographically secure random number of length N
// https://codeql.github.com/codeql-query-help/javascript/js-biased-cryptographic-random/
function generateClientId(length: number): string {
  let num = '';
  let i = 0;
  while (num.length < length) {
    i += 1;
    if (i > 100) break; // failsafe to not hang everything in case something breaks
    const byte = window.crypto.getRandomValues(new Uint8Array(1))[0];
    if (byte >= 250) {
      continue;
    }
    num += (byte % 10).toString();
  }

  return num;
}

async function getClientId(): Promise<string> {
  return new Promise((resolve) => {
    if (isDemo()) {
      resolve('000000000');
      return;
    }
    chrome.storage.sync.get(['client_id'], function (result) {
      let client_id = result['client_id'];
      if (!client_id) {
        client_id = generateClientId(CLIENT_ID_LENGTH);
        chrome.storage.sync.set({ client_id: client_id }, () => {
          resolve(client_id);
        });
      } else resolve(client_id);
    });
  });
}

async function getExperimentConfigs(): Promise<ExperimentConfig[]> {
  if (isDemo()) return [];
  try {
    const res = await fetch(EXPERIMENT_CONFIG_URL);
    return (await res.json())['experiments'] as ExperimentConfig[];
  } catch (err) {
    return [];
  }
}

export interface ExperimentsHubInterface {
  configs: ExperimentConfig[];
  userId: string;
}

export function useExperiments(): ExperimentsHubInterface {
  const [userId, setUserId] = useState<string>('');
  const [experimentConfigs, setExperimentConfigs] = useState<
    ExperimentConfig[]
  >([]);

  useEffect(() => {
    if (isDemo()) return;
    (async () => {
      setExperimentConfigs(await getExperimentConfigs());
      setUserId(await getClientId());
    })();
  }, []);

  return { configs: experimentConfigs, userId };
}

export interface ExperimentInterface {
  config: ExperimentConfig;
  userId: string;
  treated: boolean;
}

export function useExperiment(id: string): ExperimentInterface {
  const exp = useContext(ExperimentsContext);
  const [config, setConfig] = useState<ExperimentConfig>(
    {} as ExperimentConfig
  );
  useEffect(() => {
    const filtered = exp.configs.filter((e) => e.id == id);
    if (filtered.length) setConfig(filtered[0]);
  }, [exp.configs]);
  const treated = useMemo(() => {
    if (exp.userId && config) {
      if (new Date(config.start_time).valueOf() > Date.now()) return false;
      const rolloutSeed =
        (parseInt(exp.userId.slice(CLIENT_ID_LENGTH - 2)) +
          config.random_offset) %
        100;
      const treatmentSeed =
        (parseInt(
          exp.userId.slice(CLIENT_ID_LENGTH - 4, CLIENT_ID_LENGTH - 2)
        ) +
          config.random_offset) %
        100;
      return (
        rolloutSeed < config.rollout && treatmentSeed < config.treatment_split
      );
    }
    return false;
  }, [config, exp.userId]);

  return { config, userId: exp.userId, treated };
}

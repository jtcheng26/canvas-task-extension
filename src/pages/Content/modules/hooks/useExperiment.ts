import { ExperimentConfig } from '../types';
import { CLIENT_ID_LENGTH, EXPERIMENT_CONFIG_URL } from '../constants';
import { useEffect, useState, useMemo, useContext } from 'react';
import isDemo from '../utils/isDemo';
import { ExperimentsContext } from '../contexts/contexts';
import axios from 'axios';

// cryptographically secure random number of length N
// https://codeql.github.com/codeql-query-help/javascript/js-biased-cryptographic-random/
function generateRandomNumber(length: number): string {
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
  const clientId = await chrome.storage.sync.get('client_id');
  if ('client_id' in clientId && clientId['client_id'])
    return clientId['client_id'];
  if (isDemo()) {
    // for an A/B test that starts before the user opens an LMS
    let future_id = generateRandomNumber(CLIENT_ID_LENGTH);
    const existing = await chrome.storage.local.get('client_id');
    if ('client_id' in existing && existing['client_id'])
      future_id = existing['client_id'];
    else await chrome.storage.local.set({ client_id: future_id });
    return future_id;
  } else {
    let savedId = '';
    const result = await chrome.storage.local.get('client_id');
    if ('client_id' in result && result['client_id'])
      savedId = result['client_id'];
    else savedId = generateRandomNumber(CLIENT_ID_LENGTH);
    chrome.storage.sync.set({ client_id: savedId });
    return savedId;
  }
}

async function getExperimentConfigs(): Promise<ExperimentConfig[]> {
  try {
    const res = await axios.get(EXPERIMENT_CONFIG_URL);
    return (await res.data)['experiments'] as ExperimentConfig[];
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

export function isTreated(userId: string, config: ExperimentConfig) {
  if (new Date(config.start_time).valueOf() > Date.now()) return false;
  const rolloutSeed =
    (parseInt(userId.slice(CLIENT_ID_LENGTH - 2)) + config.random_offset) % 100;
  const treatmentSeed =
    (parseInt(userId.slice(CLIENT_ID_LENGTH - 4, CLIENT_ID_LENGTH - 2)) +
      config.random_offset) %
    100;
  return rolloutSeed < config.rollout && treatmentSeed < config.treatment_split;
}

export async function getExperimentGroup(id: string) {
  const [configs, userId] = await Promise.all([
    getExperimentConfigs(),
    getClientId(),
  ]);
  const config = configs.filter((e) => e.id === id);
  if (!config.length || !userId) return false;
  return isTreated(userId, config[0]);
}

export function useExperiment(id: string): ExperimentInterface {
  const exp = useContext(ExperimentsContext);
  const [config, setConfig] = useState<ExperimentConfig>(
    {} as ExperimentConfig
  );
  useEffect(() => {
    const filtered = exp.configs.filter((e) => e.id === id);
    if (filtered.length) setConfig(filtered[0]);
  }, [exp.configs]);
  const treated = useMemo(() => {
    if (exp.userId && config) {
      return isTreated(exp.userId, config);
    }
    return false;
  }, [config, exp.userId]);

  return { config, userId: exp.userId, treated };
}

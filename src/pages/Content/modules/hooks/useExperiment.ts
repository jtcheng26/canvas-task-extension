import { useQuery, UseQueryResult } from 'react-query';
import { ExperimentConfig } from '../types';
import { CLIENT_ID_LENGTH, EXPERIMENT_CONFIG_URL } from '../constants';
import { useEffect, useState, useMemo } from 'react';
import isDemo from '../utils/isDemo';

function generateClientId(length: number): string {
  let num = '';
  let seed = Math.random();
  for (let i = 0; i < length; i++) {
    seed = (seed - Math.floor(seed)) * 10;
    num += Math.floor(seed);
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

export function useClientId(): UseQueryResult<string> {
  return useQuery('client_id', () => getClientId(), { staleTime: Infinity });
}

async function getExperimentConfigs(): Promise<ExperimentConfig[]> {
  if (isDemo()) return [];
  const res = await fetch(EXPERIMENT_CONFIG_URL);
  return (await res.json())['experiments'] as ExperimentConfig[];
}

function useExperimentConfigs(): UseQueryResult<ExperimentConfig[]> {
  return useQuery('experiments', () => getExperimentConfigs(), {
    staleTime: Infinity,
  });
}

export function useExperiment(
  id: string
): Record<string, ExperimentConfig | string | boolean | undefined> {
  const { data: userId } = useClientId();
  const { data: experimentConfigs } = useExperimentConfigs();

  const [config, setConfig] = useState({} as ExperimentConfig);

  useEffect(() => {
    if (userId && experimentConfigs) {
      const experiment = experimentConfigs.filter((e) => e.id === id);
      if (experiment.length === 1) {
        setConfig(experiment[0]);
      }
    }
  }, [userId, experimentConfigs]);

  const treated = useMemo(() => {
    if (userId && config) {
      if (new Date(config.start_time).valueOf() > Date.now()) return false;
      const rolloutSeed =
        (parseInt(userId.slice(CLIENT_ID_LENGTH - 2)) + config.random_offset) %
        100;
      const treatmentSeed =
        (parseInt(userId.slice(CLIENT_ID_LENGTH - 4, CLIENT_ID_LENGTH - 2)) +
          config.random_offset) %
        100;
      return (
        rolloutSeed < config.rollout && treatmentSeed < config.treatment_split
      );
    }
    return false;
  }, [config, userId]);

  return { config, userId, treated };
}

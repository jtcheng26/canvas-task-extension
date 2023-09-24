// Remotely fetched experiment configs. Loaded once daily.
export interface ExperimentConfig {
  start_time: number;
  end_time: number;
  id: string;
  random_offset: number; // 0-99 offset so that we don't choose the same users in every experiment
  rollout: number; // 0-100 percent of users in experiment
  treatment_split: number; // 0-100 percent of experimental units treated
}

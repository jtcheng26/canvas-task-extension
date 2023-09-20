import { useExperiment } from '../../hooks/useExperiment';

type Props = {
  id: string;
  children: JSX.Element[];
};

export default function Experiment({ id, children }: Props): JSX.Element {
  const controlElement = children[0];
  const treatmentElement = children[1];
  const { treated } = useExperiment(id);
  return treated ? treatmentElement : controlElement;
}

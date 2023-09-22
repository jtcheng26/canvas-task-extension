import { useExperiment } from '../../hooks/useExperiment';

type Props = {
  id: string;
  children: JSX.Element | JSX.Element[];
};

export default function Experiment({
  id,
  children,
}: Props): JSX.Element | null {
  const multiple = Array.isArray(children);
  const controlElement = multiple ? (children as JSX.Element[])[0] : null;
  const treatmentElement = multiple
    ? (children as JSX.Element[])[1]
    : (children as JSX.Element);
  const { treated } = useExperiment(id);
  return treated ? treatmentElement : controlElement;
}

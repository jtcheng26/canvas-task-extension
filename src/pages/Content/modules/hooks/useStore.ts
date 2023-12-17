import { useState } from 'react';
import update, { Spec } from 'immutability-helper';

// nested state object store for dynamic data
export default function useStore<Type>(
  arg: Record<string, Type>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): [{ [key: string]: Type }, (root: string[], value: any) => void] {
  const [state, updateState] = useState<Record<string, Type>>(arg);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateKey(root: string[], value: any) {
    const spec = root.toReversed().reduce((spec, key, i) => {
      if (i == 0) return { $set: value };
      return { [key]: spec };
    }, {}) as Spec<Record<string, Type>, never>;
    const newState = update(state, spec);
    updateState(newState);
  }
  return [state, updateKey];
}

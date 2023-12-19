import { useState } from 'react';
import update, { Spec } from 'immutability-helper';

// nested state object store for dynamic data
export default function useStore<Type>(
  arg: Record<string, Type>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): [{ [key: string]: Type }, (root: string[], value: any) => void] {
  const [state, updateState] = useState<Record<string, Type>>(arg);
  let cached = state; // so sequenced updates (i.e. using another extension to change all colors quickly) aren't lost
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateKey(root: string[], value: any) {
    // no error handling is done, assume all entries filled when initialized
    root.push(''); // for the { $set: value } in the reduction
    const spec = root
      .reverse()
      .reduce(
        (spec: Spec<Record<string, Type>, never>, key: string, i: number) => {
          if (i == 0)
            return { $set: value } as Spec<Record<string, Type>, never>;
          return { [key]: spec } as Spec<Record<string, Type>, never>;
        },
        {} as Spec<Record<string, Type>, never>
      );
    const newState = update(cached, spec);
    cached = newState;
    updateState(cached);
  }
  return [state, updateKey];
}

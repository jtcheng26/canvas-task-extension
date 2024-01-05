// Type, but where each value is an array of possible states for that property (works recursively!)
export type TestSpace<Type> =
  | {
      [Property in keyof Type]: TestSpace<Type[Property]>[];
    }
  | Type;

export function numUniqueInstances<Type>(space: TestSpace<Type>): number {
  if (typeof space !== 'object' || space === null) return 1;
  const spaceObj = space as {
    [Property in keyof Type]: TestSpace<Type[Property]>[];
  };

  return Object.keys(spaceObj).reduce((sum, key) => {
    return (
      sum *
      spaceObj[key as keyof Type].reduce((sum, entry) => {
        return sum + numUniqueInstances(entry);
      }, 0)
    );
  }, 1);
}

export function generateTestInstance<Type>(space: TestSpace<Type>): Type {
  if (typeof space === 'string' && space === 'gen_random_number')
    return ('' + Math.floor(Math.random() * 100000)) as Type;
  if (typeof space !== 'object' || space === null) return space;
  const res: Partial<Type> = {};
  const spaceObj = space as {
    [Property in keyof Type]: TestSpace<Type[Property]>[];
  };
  Object.keys(spaceObj).forEach((key) => {
    const i = Math.floor(Math.random() * spaceObj[key as keyof Type].length);
    const entry = generateTestInstance(spaceObj[key as keyof Type][i]);
    if (typeof entry !== 'undefined') res[key as keyof Type] = entry;
  });
  return res as Type;
}

export function generateTestSample<Type>(
  N: number,
  space: TestSpace<Type>
): Type[] {
  const data: Type[] = [];
  for (let i = 0; i < N; i++) {
    data.push(generateTestInstance<Type>(space));
  }
  return data;
}

export function generateRandomNumberArray(length: number): number[] {
  const num: number[] = [];
  let i = 0;
  while (num.length < length) {
    i += 1;
    if (i > 1000) break; // failsafe to not hang everything in case something breaks
    num.push(Math.floor(Math.random() * 100000));
  }

  return num;
}

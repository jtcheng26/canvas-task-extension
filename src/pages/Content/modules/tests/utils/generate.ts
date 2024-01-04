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

export type TypePath<T, Depth extends number> = [Depth] extends [never]
  ? ''
  : T extends object
  ? {
      [K in keyof T & (string | number)]:
        NonNullable<T[K]> extends Array<any>
        ? `${K}`
        : NonNullable<T[K]> extends object
        ? `${K}` | `${K}.${TypePath<NonNullable<T[K]>, Prev<Depth>>}`
        : `${K}`
    }[keyof T & (string | number)]
  : '';

// Utility type to decrease the depth
export type Prev<N extends number> =
  N extends 1 ? never :
  N extends 2 ? 1 :
  N extends 3 ? 2 :
  N extends 4 ? 3 :
  N extends 5 ? 4 :
  never;

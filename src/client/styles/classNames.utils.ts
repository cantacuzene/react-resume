// CSS Module lookups are `string | undefined` (noUncheckedIndexedAccess): join the defined ones
export const classNames = (...names: ReadonlyArray<string | undefined>): string =>
  names.filter((name): name is string => name !== undefined && name !== '').join(' ')

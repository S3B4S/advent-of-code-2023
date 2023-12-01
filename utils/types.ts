export type ElementOfArray<T> = T extends (infer E)[] ? E : never
export type ElementOfReadOnlyArray<T> = T extends readonly (infer E)[] ? E : never

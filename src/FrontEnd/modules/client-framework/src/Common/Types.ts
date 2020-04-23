export interface Dictionary<T> {
    [key: string]: T;
}

/** `Dictionary`, but without assuming lookups will always find an item. */
export type SafeDictionary<T> = Dictionary<T | undefined>;

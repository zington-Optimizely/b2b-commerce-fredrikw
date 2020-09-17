import deepFreezeObject from "@insite/client-framework/Common/Utilities/deepFreezeObject";

/** IE doesn't support `Object.freeze` on an array, so don't try if this is false. */
let canFreezeArray: true | undefined;

try {
    Object.freeze([]);
    canFreezeArray = true;
    // eslint-disable-next-line no-empty
} catch (e) {}

/**
 * Recursively calls `Object.freeze` on the entries of an array and its contents.
 * @param object The object to freeze.
 * @param seen Optional, prevents infinitely recursive loops by tracking objects that have already been frozen.
 */
function deepFreezeArray<T>(array: T[], seen?: WeakSet<object>): readonly T[];
function deepFreezeArray<T>(array: T[] | null | undefined, seen?: WeakSet<object>) {
    if (!array) {
        return array; // Preserves null vs. undefined of input.
    }

    if (!seen) {
        seen = new WeakSet();
    }

    for (const value of array as unknown[]) {
        if (value && typeof value === "object" && !Object.isFrozen(value)) {
            if (value && !seen.has(value)) {
                if (Array.isArray(value)) {
                    deepFreezeArray(value, seen);
                } else {
                    deepFreezeObject(value, seen);
                }
                seen.add(value);
            }
        }
    }

    if (canFreezeArray) {
        return Object.freeze(array);
    }

    return array as readonly T[];
}

export default deepFreezeArray;

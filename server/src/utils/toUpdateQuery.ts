import type { Nullable } from "./nullable.js";

type sets<T> = Partial<T>;
type unsets<T> = Partial<Record<keyof T, "">>

/**
 * Transforms a partial object with nullable values into a mongoose-compatible update query.
 *
 * - Keys with non-null values go into `$set`. Those fields will be updates upon running this query.
 * - Keys explicitly set to `null` go into `$unset`. Fields in a document with such keys will be removed.
 * - Not defined values from `T` are ignored. Upon running this update query, they won't be set (updated) nor unset.
 *
 * @template T - The shape of the original object being updated.
 * @param {Partial<Nullable<T>>} updateData - An object containing fields to update.
 *   Values can be non-null (to be set), null (to be unset), or undefined (ignored).
 * @returns {{ $set?: Partial<T>; $unset?: Partial<Record<keyof T, "">> }} A mongoose-compatible update object.
 *
 * @example
 * const update = toUpdateQuery({
 *   name: "Alice",
 *   age: null,
 *   email: undefined
 * });
 * // Returns:
 * // {
 * //   $set: { name: "Alice" },
 * //   $unset: { age: "" }
 * // }
 */
export function toUpdateQuery<T>(updateData: Partial<Nullable<T>>): { $set?: Partial<T>; $unset?: Partial<Record<keyof T, "">>; } {
    const setFields: sets<T> = {};
    const unsetFields: unsets<T> = {};

    const updateKeys = Object.keys(updateData) as (keyof T)[];
    for (const key of updateKeys) {
        const value = updateData[key];
        if (value !== null && value !== undefined) {
            setFields[key] = value;
        } else if (value === null) {
            unsetFields[key] = "";
        }
    }

    const update: { $set?: sets<T>; $unset?: unsets<T> } = {};
    if (Object.keys(setFields).length > 0) {
        update.$set = setFields;
    }
    if (Object.keys(unsetFields).length > 0) {
        update.$unset = unsetFields;
    }

    return update;
}

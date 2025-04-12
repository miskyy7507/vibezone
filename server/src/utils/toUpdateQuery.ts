import { Nullable } from "./nullable.js";

type sets<T> = Partial<T>;
type unsets<T> = Partial<Record<keyof T, null>>

export function toUpdateQuery<T>(updateData: Partial<Nullable<T>>) {
    const setFields: sets<T> = {};
    const unsetFields: unsets<T> = {};

    const updateKeys = Object.keys(updateData) as (keyof T)[];
    for (const key of updateKeys) {
        const value = updateData[key];
        if (value !== null && value !== undefined) {
            setFields[key] = value;
        } else if (value === null) {
            unsetFields[key] = null;
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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Types } from "mongoose";
import { ProfileModel } from "../models/profile.model.js";
import { IProfile } from "../interfaces/profile.interface.js";

type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

export class ProfileService {
    public async createProfile(username: string, displayName: string) {
        const dataModel = new ProfileModel<IProfile>({ username, displayName });
        return dataModel.save();
    }

    public async getById(id: Types.ObjectId) {
        return await ProfileModel.findById(id);
    }

    public async updateProfile(
        id: Types.ObjectId,
        updateData: Partial<Nullable<IProfile>>
    ) {
        const setFields: Record<string, any> = {};
        const unsetFields: Record<string, any> = {};

        for (const key in updateData) {
            const value = (updateData as Record<string, any>)[key]
            if (value !== null) {
                setFields[key] = value;
            } else {
                unsetFields[key] = "";
            }
        }

        const update: Record<"$set" | "$unset", Record<string, any>> = {"$set": setFields, "$unset": unsetFields};

        return await ProfileModel.findByIdAndUpdate(id, update, { new: true });
    }
}

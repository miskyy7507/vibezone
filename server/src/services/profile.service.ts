import { ProfileModel } from "../models/profile.model.js";
import { toUpdateQuery } from "../utils/toUpdateQuery.js";

import type { Types } from "mongoose";
import type { IProfile } from "../interfaces/profile.interface.js";
import type { Nullable } from "../utils/nullable.js";

export class ProfileService {
    public async createProfile(username: string, displayName?: string) {
        const dataModel = new ProfileModel<IProfile>();
        dataModel.username = username.trim();
        if (displayName) {
            dataModel.displayName = displayName
        }
        return dataModel.save();
    }

    public async getById(id: Types.ObjectId) {
        return await ProfileModel.findById(id);
    }

    public async getByUsername(username: string) {
        return await ProfileModel.findOne({ username });
    }

    public async getAllProfiles() {
        return await ProfileModel.find();
    }

    public async updateProfile(
        id: Types.ObjectId,
        updateData: Partial<Nullable<IProfile>>
    ) {
        const updateQuery = toUpdateQuery(updateData);

        return await ProfileModel.findByIdAndUpdate(id, updateQuery, {
            new: true,
        });
    }

    public async removeProfile(id: Types.ObjectId) {
        return await ProfileModel.findByIdAndDelete(id);
    }
}

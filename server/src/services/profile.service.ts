import { Types } from "mongoose";
import { ProfileModel } from "../models/profile.model.js";
import { IProfile } from "../interfaces/profile.interface.js";

export class ProfileService {
    public async createProfile(username: string, displayName: string) {
        const dataModel = new ProfileModel<IProfile>({username, displayName});
        return dataModel.save();
    }

    public async getById(id: Types.ObjectId) {
        return await ProfileModel.findById(id);
    }
}

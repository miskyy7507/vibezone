import argon2 from "argon2";
import { UserModel } from "../models/user.model.js";
import { ProfileModel } from "../models/profile.model.js";

import type { Types } from "mongoose";
import type { IUser } from "../interfaces/user.interface.js";

export class UserService {
    public async createUser(
        profileId: Types.ObjectId,
        clearPassword: string
    ) {
        // first registered user will be a moderator
        const firstUser = (await UserModel.countDocuments()) === 0;
        const role = firstUser ? "moderator" : "user"

        const passwordHash = await this.hashPassword(clearPassword);

        const dataModel = new UserModel<Omit<IUser, "active">>({
            profileId,
            role,
            passwordHash,
        });
        return await dataModel.save();
    }

    public async authenticate(login: string, clearPassword: string) {
        const user = await this.getByLogin(login);

        if (
            !user ||
            !(await argon2.verify(user.passwordHash, clearPassword))
        ) {
            return null;
        }

        return user;
    }

    public async getByLogin(login: string) {
        const profile = await ProfileModel.findOne({ username: login });
        if (!profile) return null;

        return await UserModel.findOne({ profileId: profile._id });
    }

    private async getById(id: Types.ObjectId) {
        const result = await UserModel.findById(id);
        return result;
    }

    public async deactivateAccount(profileId: Types.ObjectId) {
        return await UserModel.updateOne(
            { profileId: profileId },
            { active: false }
        );
    }

    private async hashPassword(clearPassword: string) {
        const hashedPassword = await argon2.hash(clearPassword, {
            type: argon2.argon2id,
            memoryCost: 32768, // 32 MB
            timeCost: 3,
            parallelism: 1,
        });
        return hashedPassword;
    }
}

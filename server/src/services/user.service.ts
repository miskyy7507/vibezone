import argon2 from "argon2";
import { UserModel } from "../models/user.model.js";

import type { Types } from "mongoose";
import type { IUser } from "../interfaces/user.interface.js";

export class UserService {
    public async createUser(
        profileId: Types.ObjectId,
        username: string,
        role: IUser["role"],
        clearPassword: string
    ) {
        const passwordHash = await this.hashPassword(clearPassword);

        const dataModel = new UserModel<Omit<IUser, "active">>({
            profileId,
            username,
            role,
            passwordHash,
        });
        return await dataModel.save();
    }

    public async authenticate(login: string, clearPassword: string) {
        const user = await this.getByLogin(login);
        const truncatedPassword = clearPassword.substring(0, 2049);

        if (
            !user ||
            !(await argon2.verify(user.passwordHash, truncatedPassword))
        ) {
            return null;
        }

        return user;
    }

    public async getByLogin(login: string) {
        return await UserModel.findOne({ username: login });
    }

    private async getById(id: Types.ObjectId) {
        const result = await UserModel.findById(id);
        return result;
    }

    // public async changePassword(
    //     userId: string,
    //     oldPassword: string,
    //     newPassword: string
    // ) {
    //     // TODO:
    // }

    public async deactivateAccount(profileId: Types.ObjectId) {
        return await UserModel.updateOne(
            { profileId: profileId },
            { active: false }
        );
    }

    private async hashPassword(clearPassword: string) {
        const truncatedPassword = clearPassword.substring(0, 2048);

        const hashedPassword = await argon2.hash(truncatedPassword, {
            type: argon2.argon2id,
            memoryCost: 32768, // 32 MB
            timeCost: 3,
            parallelism: 1,
        });
        return hashedPassword;
    }
}

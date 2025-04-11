import argon2 from "argon2";
import { Types } from "mongoose";

import { UserModel } from "../models/user.model.js";
import { IUser } from "../interfaces/user.interface.js";

export class UserService {
    public async createUser(
        profileId: Types.ObjectId,
        email: string,
        role: IUser["role"],
        active: boolean,
        clearPassword: string
    ) {
        const passwordHash = await this.hashPassword(clearPassword);

        const dataModel = new UserModel<IUser>({
            profileId, email, role, active, passwordHash
        });
        return await dataModel.save();
    }

    public async authenticate(login: string, clearPassword: string) {
        const user = await this.getByLogin(login);
        if (!user || !(await argon2.verify(user.passwordHash, clearPassword))) {
            return null;
        }
        // return await bcrypt.compare(password, result.password);
        return user;
    }

    public async getByLogin(login: string) {
        // TODO: allow login by the username
        return await UserModel.findOne({ email: login });
    }

    public async getById(id: string | Types.ObjectId) {
        const result = await UserModel.findById(id);
        return result;
    }

    // public async createOrUpdatePassword(
    //     userId: Types.ObjectId,
    //     clearPassword: string
    // ) {
    //     const hashedPassword = await this.hashPassword(clearPassword);

    //     return await UserModel.findOneAndUpdate(
    //         { userId: userId },
    //         { $set: { passwordHash: hashedPassword } },
    //         { new: true, upsert: true }
    //     );
    // }

    public async changePassword(
        userId: string,
        oldPassword: string,
        newPassword: string
    ) {
        // TODO:
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

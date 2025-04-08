import argon2 from "argon2";
import { Types } from "mongoose";

import { UserModel } from "../models/user.model.js";
import { IUser, IUserRegisterForm } from "../interfaces/user.interface.js";

export class UserService {
    public async createUser(validatedUserRegisterForm: IUserRegisterForm) {
        const passwordHash = await this.hashPassword(
            validatedUserRegisterForm.password
        );

        const dataModel = new UserModel<IUser>({
            email: validatedUserRegisterForm.email,
            passwordHash: passwordHash,
            username: validatedUserRegisterForm.username,
            role: "user",
        });
        return await dataModel.save();
    }

    public async getByLogin(login: string) {
        return await UserModel.findOne({ email: login });
    }

    public async getById(id: string | Types.ObjectId) {
        const result = await UserModel.findById(id);
        return result;
    }

    public async createOrUpdatePassword(
        userId: Types.ObjectId,
        clearPassword: string
    ) {
        const hashedPassword = await this.hashPassword(clearPassword);

        return await UserModel.findOneAndUpdate(
            { userId: userId },
            { $set: { passwordHash: hashedPassword } },
            { new: true, upsert: true }
        );
    }

    public async changePassword(
        userId: string,
        oldPassword: string,
        newPassword: string
    ) {
        // TODO: 
    }

    public async authenticate(userId: Types.ObjectId, clearPassword: string) {
        try {
            const result = await UserModel.findOne({ userId });
            if (!result) {
                return false;
            }
            // return await bcrypt.compare(password, result.password);
            return await argon2.verify(result.passwordHash, clearPassword);
        } catch (error) {
            console.error("Wystąpił błąd podczas tworzenia danych:", error);
            throw new Error("Wystąpił błąd podczas tworzenia danych");
        }
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

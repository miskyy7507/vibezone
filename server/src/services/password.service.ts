import { Types } from "mongoose";
import argon2 from "argon2";
import PasswordModel from "../models/password.model.js";

export default class PasswordService {
    public async createOrUpdateUserPassword(
        userId: Types.ObjectId,
        clearPassword: string
    ) {
        const hashedPassword = await this.hashPassword(clearPassword);

        return await PasswordModel.findOneAndUpdate(
            { userId: userId },
            { $set: { passwordHash: hashedPassword } },
            { new: true, upsert: true }
        );
    }

    // public async resetPassword(data: any) {
    //     try {
    //         return await PasswordModel.findOneAndDelete({
    //             userId: data.userId,
    //         });
    //     } catch (error) {
    //         console.error("Wystąpił błąd podczas tworzenia danych:", error);
    //         throw new Error("Wystąpił błąd podczas tworzenia danych");
    //     }
    // }

    // public async changePassword(
    //     userId: string,
    //     oldPassword: string,
    //     newPassword: string
    // ) {
    //     try {
    //         const old = await PasswordModel.findOne({ userId });
    //         // jeżeli hasło nie istnieje (zostało zresetowane) lub stare hasło jest poprawne, to zmień hasło
    //         if (!old || (await bcrypt.compare(oldPassword, old.password))) {
    //             const hashedPassword = await this.hashPassword(newPassword);
    //             const result = await this.createOrUpdate({
    //                 userId,
    //                 password: hashedPassword,
    //             });
    //             return result;
    //         } else {
    //             return false;
    //         }
    //     } catch (error) {
    //         console.error("Wystąpił błąd podczas tworzenia danych:", error);
    //         throw new Error("Wystąpił błąd podczas tworzenia danych");
    //     }
    // }

    public async authenticate(userId: Types.ObjectId, clearPassword: string) {
        try {
            const result = await PasswordModel.findOne({userId});
            if (!result) {
                return false;
            }
            // return await bcrypt.compare(password, result.password);
            return await argon2.verify(result.passwordHash, clearPassword)
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

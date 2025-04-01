import jwt from "jsonwebtoken";

import TokenModel from "../models/token.model.js";
import { config } from "../config.js";
import { IUser } from "../interfaces/user.interface.js";
import { Types } from "mongoose";

export default class TokenService {
    public async createUserToken(userId: Types.ObjectId) {
        const value = jwt.sign(
            userId.toString(),
            config.jwtSecret
            // { expiresIn: '3h' } // TODO: implement refresh tokens and then expiration
        );

        try {
            return await new TokenModel({ userId, value }).save();
        } catch (error) {
            console.error("Wystąpił błąd podczas tworzenia danych:", error);
            throw new Error("Wystąpił błąd podczas tworzenia danych");
        }
    }

    // public getToken(token: any) {
    //     return { token: token.value };
    // }

    public async removeUserTokens(userId: Types.ObjectId) {
        try {
            return await TokenModel.deleteMany({ userId });
        } catch (error) {
            console.error("Wystąpił błąd podczas usuwania danych:", error);
            throw new Error("Wystąpił błąd podczas usuwania danych");
        }
    }
}

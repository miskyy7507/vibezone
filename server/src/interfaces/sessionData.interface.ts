import { IUser } from "./user.interface.js";

declare module "express-session" {
    interface SessionData {
        user: {
            id: string;
            role: IUser["role"];
        }
    }
}

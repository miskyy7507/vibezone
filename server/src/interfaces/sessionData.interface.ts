import type { IUser } from "./user.interface.js";

declare module "express-session" {
    interface SessionData {
        profileId: string;
        role: IUser["role"];
    }
}

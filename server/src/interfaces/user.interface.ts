import { z } from "zod";

export interface IUser {
    email: string;
    username: string;
    displayName: string;
    role: "admin" | "moderator" | "user";
}

export const userSchema: z.ZodType<IUser> = z.object({
    email: z.string().email("Invalid email"),
    username: z.string().min(2, "Username too short").max(32, "Username too long"),
    displayName: z.string().nonempty("Display name cannot be empty").max(40, "Display name too long"),
    role: z.enum(["admin", "moderator", "user"])
});

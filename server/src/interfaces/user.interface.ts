import { z } from "zod";

export interface IUser {
    email: string;
    username: string;
    role: "admin" | "moderator" | "user";
    passwordHash: string;
}

// export const userSchema: z.ZodType<IUser> = z.object({
//     email: z.string().email("Invalid email"),
//     username: z.string().min(2, "Username too short").max(32, "Username too long"),
//     role: z.enum(["admin", "moderator", "user"]),
//     passwordHash: z.string(),
// });

export interface IUserRegisterForm {
    email: string;
    username: string;
    displayName: string;
    password: string;
}

export const userRegisterFormSchema: z.ZodType<IUserRegisterForm> = z.object({
    email: z.string().email("Invalid email"),
    username: z
        .string()
        .min(3, "Username too short")
        .max(32, "Username too long"),
    displayName: z
        .string()
        .nonempty("Display name cannot be empty")
        .max(32, "Display name too long"),
    password: z
        .string()
        .nonempty("Missing password")
        .max(256, "Password too long"),
});

export interface IUser {
    email: string;
    username: string;
    displayName: string;
    role: "admin" | "moderator" | "user";
}

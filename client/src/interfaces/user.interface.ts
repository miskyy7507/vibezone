export interface User {
    _id: string,
    username: string;
    displayName?: string;
    profilePictureUri?: string;
    aboutDesc?: string;
    createdAt: string;
    role? : "moderator" | "user"
}

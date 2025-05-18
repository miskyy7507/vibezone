import { uploadsUrl } from "../config";
import type { User } from "../interfaces/user.interface";

export function ProfilePicture({
    user,
    size = "normal",
}: {
    user: User;
    size?: "small" | "normal";
}) {
    const { profilePictureUri, displayName, username } = user;

    const altText = profilePictureUri
        ? `Profile picture of user ${displayName ?? username}`
        : "Default profile picture";

    const sizeMap = {
        small: 32,
        normal: 48,
    };

    const sizePx = `${sizeMap[size].toString()}px`;

    return (
        <img
            style={{ width: sizePx, height: sizePx }}
            className="size-12 rounded-full object-cover"
            src={profilePictureUri ? `${uploadsUrl}/${profilePictureUri}` : "/pfp_placeholder.svg"}
            alt={altText}
        />
    );
}

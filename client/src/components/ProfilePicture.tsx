export function ProfilePicture({
    uri,
    username,
    size = "normal"
}: {
    uri?: string;
    username: string;
    size?: "small" | "normal"
}) {
    const altText = uri ? `Profile picture of user ${username}` : "Default profile picture";

    const sizeMap = {
        small: 32,
        normal: 48,
    };

    const sizePx = `${sizeMap[size].toString()}px`;

    return (
        <img
            style={{ width: sizePx, height: sizePx }}
            className="size-12 rounded-full object-cover"
            src={uri ?? "pfp_placeholder.svg"}
            alt={altText}
        />
    );
}

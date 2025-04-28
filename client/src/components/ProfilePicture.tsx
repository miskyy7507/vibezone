export function ProfilePicture({
    uri,
    username,
}: {
    uri?: string;
    username: string;
}) {
    const altText = uri ? `Profile picture of user ${username}` : "Default profile picture";
    return (
        <img
            className="size-12 rounded-full object-cover"
            src={uri ?? "pfp_placeholder.svg"}
            alt={altText}
        />
    );
}

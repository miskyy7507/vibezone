export function ProfilePicture({
    uri,
    username,
}: {
    uri: string | null;
    username?: string;
}) {
    return (
        <img
            className="size-12 rounded-full object-cover"
            src={uri ?? "pfp_placeholder.svg"}
            alt={`Profile picture${username ? `of user ${username}` : ""}`}
        />
    );
}

export function UserNamesDisplay({
    username,
    displayName,
}: {
    username: string;
    displayName?: string;
}) {
    return (
        <div className="flex flex-row space-x-2 items-center">
            <span className="font-semibold">@{username}</span>
            {displayName && (
                <span className="text-gray-500 text-sm">{displayName}</span>
            )}
        </div>
    );
}

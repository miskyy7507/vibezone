import { User } from "../interfaces/user.interface";

export function UserNamesDisplay({ user }: { user: User }) {
    const { displayName, username } = user;

    return (
        <div className="flex flex-row space-x-2 items-center">
            <span className="font-semibold">
                {displayName || `@${username}`}
            </span>
            {displayName && (
                <span className="text-gray-500 text-sm">@{username}</span>
            )}
        </div>
    );
}

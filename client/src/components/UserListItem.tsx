import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";

export interface UserData {
    id: string,
    username: string;
    displayName?: string;
    profilePictureUri?: string;
    aboutDesc?: string;
}

export function UserListItem({ user }: { user: UserData }) {
    return (
        <div className="flex flex-row p-4 border-b border-gray-200 max-w-2xl w-full">
            <ProfilePicture
                uri={user.profilePictureUri}
                username={user.displayName ?? user.username}
            />
            <div className="flex flex-col ml-2 ">
                <div className="flex flex-row space-x-2 items-center">
                    <UserNamesDisplay
                        username={user.username}
                        displayName={user.displayName}
                    />
                </div>
                {user.aboutDesc && (
                    <span className="text-gray-400">
                        {user.aboutDesc}
                    </span>
                )}
            </div>
        </div>
    );
}

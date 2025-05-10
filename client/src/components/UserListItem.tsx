import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import type { User } from "../interfaces/user.interface";

export function UserListItem({ user }: { user: User }) {
    return (
        <div className="flex flex-row p-4 border-b border-gray-200 max-w-2xl w-full">
            <ProfilePicture user={user} />
            <div className="flex flex-col ml-2 ">
                <div className="flex flex-row space-x-2 items-center">
                    <UserNamesDisplay user={user} />
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

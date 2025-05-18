import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import type { User } from "../interfaces/user.interface";
import { useAuth } from "../hooks/useAuth";
import { DropdownMenu } from "./DropdownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEllipsisVertical,
    faHammer,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { Link } from "react-router";
import { DropdownItem } from "./DropdownItem";
import { handleFetchError } from "../utils/handleFetchError";
import { toast } from "react-toastify";
import { apiUrl } from "../config";

export function UserListItem({ user, deleteUserCb }: { user: User, deleteUserCb: (id: string) => void; }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownBtnRef = useRef<HTMLButtonElement | null>(null);

    const { user: authedUser, logout } = useAuth();

    const banUser = async () => {
        const confirmation = confirm(
            `WARNING!\nAre you sure you want to ban user ${user.username}? This will delete their profile and posts. This cannot be undone!`
        );
        if (!confirmation) return;

        const _id = user._id // user ID to ban;

        try {
            const response = await fetch(
                `${apiUrl}/profile/${_id}/ban`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );
            if (response.status === 204 || response.status === 404) {
                deleteUserCb(_id);
            } else if (response.status === 401) {
                toast.error("Your session has expired. Please log in back.");
                logout();
            } else if (response.status === 403) {
                toast.warn("Permission denied - you cannot ban users.");
            } else {
                console.error(await response.text());
                toast.error("Something went wrong when trying to do this action. Try to reload the page.");
            }
        } catch (error) {
            handleFetchError(error);
        }
    };

    return (
        <article
            className="flex flex-row max-w-2xl w-full bg-zinc-800 rounded-xl shadow-sm ring-1 ring-zinc-700 hover:shadow-2xl hover:cursor-pointer transition-shadow"
        >
            <Link to={`/user/${user._id}`} className="flex-1 flex flex-row px-5 py-4 gap-3 items-center">
                <ProfilePicture user={user} />
                <div className="flex flex-col justify-center">
                    <UserNamesDisplay user={user} />
                    {user.aboutDesc && (
                        <span className="text-zinc-400">{user.aboutDesc}</span>
                    )}
                </div>
            </Link>
            {authedUser && (
                <button
                    className="my-8 px-3.5 border-l border-zinc-700 cursor-pointer text-zinc-500"
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen((p) => !p);
                    }}
                    ref={dropdownBtnRef}
                >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
            )}
            {menuOpen && (
                <DropdownMenu
                    anchorRef={dropdownBtnRef}
                    onClose={() => {
                        setMenuOpen(false);
                    }}
                >
                    <DropdownItem
                        text="Ban user"
                        icon={faHammer}
                        onClick={() => {setMenuOpen(false); void banUser()}}
                        danger
                    />
                </DropdownMenu>
            )}
        </article>
    );
}

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
import { useNavigate } from "react-router";
import { DropdownItem } from "./DropdownItem";
import { handleFetchError } from "../utils/handleFetchError";
import { toast } from "react-toastify";

export function UserListItem({ user, deleteUserCb }: { user: User, deleteUserCb: (id: string) => void; }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownBtnRef = useRef<HTMLButtonElement | null>(null);

    const { user: authedUser, logout } = useAuth();

    const navigate = useNavigate();

    const handleClick = () => {
        void navigate(`/user/${user._id}`);
    };

    const banUser = async () => {
        const confirmation = confirm(
            `WARNING!\nAre you sure you want to ban user ${user.username}? This will delete their profile and posts. This cannot be undone!`
        );
        if (!confirmation) return;

        const _id = user._id // user ID to ban;

        try {
            const response = await fetch(
                `http://localhost:6660/api/profile/${_id}/ban`,
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
            className="flex flex-row gap-3 px-5 py-4 max-w-2xl w-full bg-zinc-800 rounded-xl shadow-sm ring-1 ring-zinc-700 hover:shadow-2xl hover:cursor-pointer transition-shadow"
            onClick={handleClick}
        >
            <ProfilePicture user={user} />
            <div className="flex flex-1 flex-col justify-center">
                <div className="flex flex-row space-x-2 items-center">
                    <UserNamesDisplay user={user} />
                </div>
                {user.aboutDesc && (
                    <span className="text-zinc-400">{user.aboutDesc}</span>
                )}
            </div>
            <div className="flex items-center">
                {authedUser && (
                    <button
                        className="w-[20px] cursor-pointer text-zinc-500"
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
            </div>
        </article>
    );
}

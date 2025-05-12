import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import type { User } from "../interfaces/user.interface";
import { useAuth } from "../hooks/useAuth";
import DropdownMenu from "./DropdownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEllipsisVertical,
    faUserSlash,
    faHammer,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { DropdownItem } from "./DropdownItem";

export function UserListItem({ user }: { user: User }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownBtnRef = useRef<HTMLButtonElement | null>(null);

    const { user: authedUser } = useAuth();

    const navigate = useNavigate();

    const handleClick = () => {
        void navigate(`/user/${user._id}`);
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
                    <span className="text-gray-400">{user.aboutDesc}</span>
                )}
            </div>
            <div className="flex items-center">
                {authedUser && (
                    <button
                        className="w-[20px] cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen((p) => !p);
                        }}
                        ref={dropdownBtnRef}
                    >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                )}
                {menuOpen && <DropdownMenu
                    anchorRef={dropdownBtnRef}
                    onClose={() => {
                        setMenuOpen(false);
                    }}
                >
                    <DropdownItem
                        text="Ban user"
                        icon={faHammer}
                        onClick={() => {
                            console.log("test");
                        }}
                        danger
                    />
                    <hr className="text-zinc-700" />
                    <DropdownItem
                        text="Purge user"
                        icon={faUserSlash}
                        onClick={() => {
                            console.log("test");
                        }}
                        danger
                    />
                </DropdownMenu>}
            </div>
        </article>
    );
}

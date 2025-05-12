import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import type { User } from "../interfaces/user.interface";
import { useAuth } from "../hooks/useAuth";
import DropdownMenu from "./DropdownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faUserSlash, faBan } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";

export function UserListItem({ user }: { user: User }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownBtnRef = useRef<HTMLButtonElement | null>(null);

    const { user: authedUser } = useAuth();

    return (
        <div className="flex flex-row gap-3 p-4 border-b border-gray-200 max-w-2xl w-full">
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
                        onMouseDown={() => {
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
                        <button
                            className="flex flex-row gap-2 items-center cursor-pointer text-red-400"
                            onMouseUp={() => {
                                setMenuOpen(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faBan} />
                            <span>Ban user</span>
                        </button>
                        <button
                            className="flex flex-row gap-2 items-center cursor-pointer text-red-400"
                            onMouseUp={() => {
                                setMenuOpen(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faUserSlash} />
                            <span>Purge user</span>
                        </button>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}

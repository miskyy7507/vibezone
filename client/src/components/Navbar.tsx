import { useState, useRef } from "react";
import { NavLink } from "react-router";
import { clsx } from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faPencil,
    faRightFromBracket,
    faUser,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../hooks/useAuth";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import { DropdownMenu } from "./DropdownMenu";
import { DropdownItem } from "./DropdownItem";
import { DropdownLink } from "./DropdownLink";

export function Navbar() {
    const { user, logout } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);

    const dropdownBtnRef = useRef<HTMLButtonElement | null>(null);

    return (
        <nav className="w-full bg-zinc-900/75 flex py-4 px-6 justify-between items-center shadow-xl sticky top-0 backdrop-blur-sm z-1">
            <div className="flex justify-start flex-1 gap-x-4">
                {/* left section of the navbar */}
            </div>
            <div className="flex justify-center flex-1 gap-x-4">
                {/* middle section of the navbar */}
                <NavLink
                    className={({ isActive }) =>
                        clsx("hover:underline", isActive && "text-pink-500")
                    }
                    to="/"
                    end
                >
                    <FontAwesomeIcon icon={faHouse} />
                    <span className="pl-2">Home</span>
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        clsx("hover:underline", isActive && "text-pink-500")
                    }
                    to="users"
                    end
                >
                    <FontAwesomeIcon icon={faUsers} />
                    <span className="pl-2">Users</span>
                </NavLink>
            </div>
            <div className="flex justify-end flex-1 gap-x-4">
                {/* right section of the navbar */}
                {user ? (
                    <>
                        <button
                            ref={dropdownBtnRef}
                            className="flex gap-x-4 p-3 -m-3 rounded-xl cursor-pointer hover:bg-zinc-50/5 transition"
                            onClick={() => {
                                setMenuOpen(p => !p);
                            }}
                        >
                            <div className="-m-[4px]">
                                <ProfilePicture user={user} size="small" />
                            </div>
                            <UserNamesDisplay user={user} />
                        </button>
                        {menuOpen && (
                            <DropdownMenu
                                anchorRef={dropdownBtnRef}
                                absolutelyPositionedAnchor
                                onClose={() => {
                                    setMenuOpen(false);
                                }}
                            >
                                <DropdownLink
                                    text="View profile"
                                    icon={faUser}
                                    link={`/user/${user._id}`}
                                    onClick={() => {
                                        setMenuOpen(false);
                                    }}
                                />
                                <DropdownLink
                                    text="Edit your profile"
                                    icon={faPencil}
                                    onClick={() => {
                                        setMenuOpen(false);
                                    }}
                                    link={`/update-profile`}
                                />
                                <DropdownItem
                                    text="Sign out"
                                    icon={faRightFromBracket}
                                    onClick={() => {
                                        setMenuOpen(false);
                                        logout();
                                    }}
                                    danger
                                />
                            </DropdownMenu>
                        )}
                    </>
                ) : (
                    <button className="flex gap-x-4 p-3 -m-3 rounded-xl cursor-pointer hover:bg-zinc-50/5 transition">
                        <NavLink to="login" end>
                            Sign in
                        </NavLink>
                    </button>
                )}
            </div>
        </nav>
    );
}

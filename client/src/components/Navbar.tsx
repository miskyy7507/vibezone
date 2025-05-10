import { NavLink } from "react-router";
import { useAuth } from "../auth";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="w-full bg-zinc-900/75 flex py-4 px-6 justify-between items-center shadow-lg sticky top-0 backdrop-blur-sm">
            <div className="flex justify-start flex-1 gap-x-4">Left</div>
            <div className="flex justify-center flex-1 gap-x-4">
                <NavLink to="/" end>
                    Home
                </NavLink>
                <NavLink to="users" end>
                    Users
                </NavLink>
            </div>
            <div className="flex justify-end flex-1 gap-x-4">
                {user ? (
                    <div className="flex gap-x-4" onClick={logout}>
                        <UserNamesDisplay
                            user={user}
                        />
                        <div className="-m-[4px]">
                            <ProfilePicture
                                user={user}
                                size="small"
                            />
                        </div>
                    </div>
                ) : (
                    <NavLink to="login" end>
                        Sign in
                    </NavLink>
                )}
            </div>
        </nav>
    );
}

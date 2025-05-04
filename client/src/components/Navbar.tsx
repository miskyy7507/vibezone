import { NavLink } from "react-router";
import { useAuth } from "../auth";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="w-full bg-zinc-900/75 flex p-4 justify-between shadow-lg sticky top-0 backdrop-blur-sm">
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
                { user ? (
                    <div onClick={logout}>
                        <ProfilePicture uri={user.profilePictureUri} username={user.username} />
                        <UserNamesDisplay username={user.username} displayName={user.displayName} />
                    </div>
                ) : <NavLink to="login" end>Sign in</NavLink>}
            </div>
        </nav>
    );
}

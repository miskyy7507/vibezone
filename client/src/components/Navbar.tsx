import { NavLink } from "react-router";

export function Navbar() {
    return (
        <nav className="w-full bg-zinc-900/75 flex p-4 justify-center gap-x-4 shadow-lg sticky top-0 backdrop-blur-sm">
            <NavLink to="/" end>
                <h1>Home</h1>
            </NavLink>
            <NavLink to="users" end>
                Users
            </NavLink>
        </nav>
    );
}

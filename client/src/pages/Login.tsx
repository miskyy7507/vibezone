import { useState } from "react";
import { useNavigate, Link } from "react-router";

import { useAuth } from "../auth";
import { placeholderUsers } from "../placeholderUsers";

export function Login() {
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Simulate API call
        const userToLogIn = placeholderUsers.find(
            (user) => user.username === username
        );

        if (!userToLogIn) {
            alert("Incorrect username or password.");
            return false;
        }

        login(userToLogIn);

        navigate("/");
    };

    return (
        <div className="m-auto max-w-2xl w-full">
            <h1 className="text-5xl text-center my-6 font-bold">Welcome back!</h1>
            <form className="flex flex-col gap-5 text-xl " onSubmit={handleSubmit}>
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="text-zinc-900 bg-zinc-200 rounded-xl p-5.25 cursor-pointer focus:outline-none"
                    type="submit"
                >
                    Login
                </button>
                <p className="text-sm">Don't have an account yet? <Link to={"/signup"}>Sign up today!</Link></p>
            </form>
        </div>
    );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { clsx } from "clsx";

import { useAuth } from "../auth";
import { placeholderUsers } from "../placeholderUsers";
import { Spinner } from "../components/Spinner";

export function Login() {
    const { login } = useAuth();

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsLoggingIn(true);

        // Simulate API call
        setTimeout(() => {
            const userToLogIn = placeholderUsers.find(
                (user) => user.username === username
            );

            if (!userToLogIn) {
                alert("Incorrect username or password.");
                setIsLoggingIn(false);
                return false;
            }

            login(userToLogIn);

            navigate("/");
        }, 2500);
    };

    return (
        <div className="m-auto p-4 max-w-2xl w-full">
            <h1 className="text-5xl text-center my-6 font-bold">
                Welcome back!
            </h1>
            <form
                className="flex flex-col gap-5 text-xl "
                onSubmit={handleSubmit}
            >
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className={clsx(
                        isLoggingIn
                            ? "py-4.75 bg-zinc-200/55"
                            : "py-5.25 bg-zinc-200 hover:bg-zinc-200/85",
                        "text-zinc-900 rounded-xl cursor-pointer h-80px focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    )}
                    type="submit"
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <Spinner size="small" theme="light" />
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>
            <p className="text-sm mt-5">
                    Don't have an account yet?{" "}
                    <Link to={"/signup"}>Sign up today!</Link>
            </p>
        </div>
    );
}

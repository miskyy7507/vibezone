import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { clsx } from "clsx";

import { useAuth } from "../auth";
import { placeholderUsers } from "../placeholderUsers";
import { Spinner } from "../components/Spinner";

export function Login() {
    // type LoginFormNames = "login" | "password";

    const { login } = useAuth();

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const buttonDisabled = isLoggingIn || !username || !password;

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

            void navigate("/");
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
                    onChange={(e) => {setUsername(e.target.value)}}
                />
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <button
                    className={clsx(
                        buttonDisabled
                            ? "opacity-55"
                            : "hover:opacity-85 cursor-pointer",
                        "py-5.25 text-zinc-900 bg-zinc-200 rounded-xl h-80px focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    )}
                    type="submit"
                    disabled={buttonDisabled}
                >
                    {isLoggingIn ? (
                        <div className="-m-0.5"><Spinner size="small" theme="light" /></div>
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

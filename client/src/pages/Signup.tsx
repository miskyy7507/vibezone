import { useState } from "react";
import { clsx } from "clsx";

import { Spinner } from "../components/Spinner";
import { Link } from "react-router";

export function Signup() {
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    return (
        <div className="m-auto p-4 max-w-2xl w-full">
            <h1 className="text-5xl text-center my-6 font-bold">
                Create your account
            </h1>
            <form
                className="flex flex-col gap-5 text-xl "
                onSubmit={handleSubmit}
            >
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="email" required
                    placeholder="Email"
                />
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="text" required
                    placeholder="Username"
                    // value={username}
                    // onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="text" required
                    placeholder="Display name"
                />
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="password" required
                    placeholder="Password"
                    // value={password}
                    // onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="password" required
                    placeholder="Confirm password"
                    // value={password}
                    // onChange={(e) => setPassword(e.target.value)}
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
                        "Sign up"
                    )}
                </button>
            </form>
            <p className="text-sm mt-5">
                Already have an account? <Link to={"/login"}>Sign in here</Link>
            </p>
        </div>
    );
}

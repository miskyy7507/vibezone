import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { clsx } from "clsx";

import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/Spinner";

import type { User } from "../interfaces/user.interface";
import { handleFetchError } from "../utils/handleFetchError";

export function Login() {
    // type LoginFormNames = "login" | "password";

    const { login } = useAuth();

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [loginInput, setLoginInput] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const buttonDisabled = isLoggingIn || !loginInput || !password;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsLoggingIn(true);

        try {
            const response = await fetch(
                "http://localhost:6660/api/auth/login",
                {
                    method: "POST",
                    body: JSON.stringify({ login: loginInput, password }),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    credentials: 'include', // crucial for cookies
                }
            );

            if (response.status === 200) {
                const user = (await response.json()) as User;
                login(user);
                await navigate("/");
            } else if (response.status === 401) {
                alert("Incorrect username or password.");
            } else {
                console.error(await response.text());
                alert(`Something went wrong when trying to log in.`);
            }
        } catch (error) {
            handleFetchError(error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <main className="m-auto p-4 pb-16 max-w-2xl w-full">
            <h1 className="text-5xl text-center my-6 font-bold">
                Welcome back!
            </h1>
            <form
                className="flex flex-col gap-5 text-xl "
                onSubmit={(e) => void handleSubmit(e)}
            >
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="text"
                    placeholder="Username"
                    value={loginInput}
                    onChange={(e) => {
                        setLoginInput(e.target.value);
                    }}
                />
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
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
                        <div className="-m-0.5">
                            <Spinner size="small" theme="light" />
                        </div>
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>
            <p className="text-sm mt-5">
                Don't have an account yet?{" "}
                <Link to={"/signup"}>Sign up today!</Link>
            </p>
        </main>
    );
}

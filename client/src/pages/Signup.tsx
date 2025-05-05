import { useState } from "react";
import { clsx } from "clsx";

import { Spinner } from "../components/Spinner";
import { Link, useNavigate } from "react-router";

import type { RegisterForm } from "../interfaces/registerForm.interface";

export function Signup() {
    const [isLoading, setLoading] = useState(false);
    const [form, setForm] = useState<RegisterForm>({
        email: "",
        username: "",
        displayName: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<Partial<RegisterForm>>({});

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const trimValues = () => {
        const newForm = {
            ...form,
            email: form.email.trim(),
            username: form.username.trim(),
        }
        setForm(newForm);

        return newForm;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const newErrors: Partial<RegisterForm> = {...errors};

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        if (!/[^a-zA-Z\d]/.test(form.password)) {
            newErrors.password = "Password must contain at least one special character.";
        }
        if (!/\d/.test(form.password)) {
            newErrors.password = "Password must contain at least one digit.";
        }
        if (!/[A-Z]/.test(form.password)) {
            newErrors.password = "Password must contain at least one capital letter.";
        }
        if (form.password.length < 8) {
            newErrors.password = "Password must contain at least 8 characters.";
        }

        setErrors(newErrors);

        if (
            Object.keys(newErrors).length !== 0 &&
            Object.values(newErrors).some((e) => e !== null)
        ) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:6660/api/auth/register",
                {
                    method: "POST",
                    body: JSON.stringify(trimValues()),
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                alert("Registered successfully! Now you can sign in.");
                navigate("/login");
            } else if (response.status === 400 || response.status === 422) {
                const data = await response.json();
                setErrors({ [data.item]: data.error });
            } else {
                const error = await response.json();
                alert(`Something went wrong. Error message: ${error}`);
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error("Fetch failed.", error);
                alert(`Something went wrong. Error message: ${error.message}`);
            } else {
                throw error;
            }
        } finally {
            setLoading(false);
        }
    };

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
                    className={clsx(
                        "border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1",
                        errors?.email &&
                            "outline-3 outline-red-500 outline-offset-1"
                    )}
                    type="text"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={trimValues}
                    name="email"
                    autoComplete="email"
                />
                {errors?.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                )}
                <input
                    className={clsx(
                        "peer border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1",
                        errors?.username &&
                            "outline-3 outline-red-500 outline-offset-1"
                    )}
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    onBlur={trimValues}
                    name="username"
                    autoComplete="off"
                />
                <p className="hidden peer-focus:block text-sm">
                    Your unique user identifier.
                </p>
                {errors?.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                )}
                <input
                    className={clsx(
                        "peer border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1",
                        errors?.displayName &&
                            "outline-3 outline-red-500 outline-offset-1"
                    )}
                    type="text"
                    placeholder="Display name"
                    value={form.displayName}
                    onChange={handleChange}
                    name="displayName"
                    autoComplete="off"
                />
                <p className="hidden peer-focus:block text-sm">
                    Custom name displayed next to posts and comments. Optional,
                    can be changed later.
                </p>
                {errors?.displayName && (
                    <p className="text-red-500 text-sm">{errors.displayName}</p>
                )}
                <input
                    className={clsx(
                        "border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1",
                        errors?.password &&
                            "outline-3 outline-red-500 outline-offset-1"
                    )}
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    name="password"
                    autoComplete="new-password"
                />
                {errors?.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                )}
                <input
                    className={clsx(
                        "border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1",
                        errors?.confirmPassword &&
                            "outline-3 outline-red-500 outline-offset-1"
                    )}
                    type="password"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    name="confirmPassword"
                    autoComplete="new-password"
                />
                {errors?.confirmPassword && (
                    <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                    </p>
                )}
                <button
                    className={clsx(
                        isLoading
                            ? "py-4.75 bg-zinc-200/55"
                            : "py-5.25 bg-zinc-200 hover:bg-zinc-200/85",
                        "text-zinc-900 rounded-xl cursor-pointer h-80px focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    )}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
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

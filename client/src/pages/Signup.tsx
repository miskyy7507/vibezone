import { useState } from "react";
// import { clsx } from "clsx";
import { Link, useNavigate } from "react-router";

// import { Spinner } from "../components/Spinner";
// import { FormItemInput } from "../components/FormItemInput";
import { Form2 } from "../components/Form2";
import { ItemInfo } from "../components/Form2";

import type { RegisterForm } from "../interfaces/registerForm.interface";

export function Signup() {
    type RegisterFormKeys =
        | "email"
        | "username"
        | "displayName"
        | "password"
        | "confirmPassword";

    const registerForm: Record<RegisterFormKeys, ItemInfo> = {
        email: {
            type: "text",
            placeholder: "Email",
            autoComplete: "email",
        },
        username: {
            type: "text",
            placeholder: "Username",
            autoComplete: "off",
            tip: "Your unique user identifier.",
        },
        displayName: {
            type: "text",
            placeholder: "Display name",
            autoComplete: "off",
            tip: "Custom name displayed next to posts and comments. Optional, can be changed later.",
        },
        password: {
            type: "password",
            placeholder: "Password",
        },
        confirmPassword: {
            type: "password",
            placeholder: "Confirm password",
        },
    } as const;

    const [form, setForm] = useState<Record<RegisterFormKeys, string>>({
        email: "",
        username: "",
        displayName: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<
        Partial<Record<RegisterFormKeys, string>>
    >({});

    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => {
            delete prev[name as keyof RegisterForm];
            return prev;
        });
    };

    const trimValues = () => {
        const newForm = {
            ...form,
            email: form.email.trim(),
            username: form.username.trim(),
        };
        setForm(newForm);

        return newForm;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const newErrors: Partial<RegisterForm> = { ...errors };

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        if (form.password.length < 8) {
            newErrors.password = "Password must contain at least 8 characters.";
        } else if (!/[A-Z]/.test(form.password)) {
            newErrors.password =
                "Password must contain at least one capital letter.";
        } else if (!/\d/.test(form.password)) {
            newErrors.password = "Password must contain at least one digit.";
        } else if (!/[^a-zA-Z\d]/.test(form.password)) {
            newErrors.password =
                "Password must contain at least one special character.";
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
                        Accept: "application/json",
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
            <Form2
                items={registerForm}
                values={form}
                errors={errors}
                onChange={handleChange}
                onBlur={trimValues}
                onSubmit={handleSubmit}
                loading={isLoading}
                submitButtonText="Sign up"
            ></Form2>
            {/* <form
                className="flex flex-col gap-5 text-xl "
                onSubmit={handleSubmit}
            >
                <FormItemInput
                    name="email"
                    value={form.email}
                    type="text"
                    placeholder="Email"
                    autoComplete="email"
                    onChange={handleChange}
                    onBlur={trimValues}
                    errorMsg={errors.email}
                />
                <FormItemInput
                    name="username"
                    value={form.username}
                    type="text"
                    placeholder="Username"
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={trimValues}
                    errorMsg={errors.username}
                    tip="Your unique user identifier."
                />
                <FormItemInput
                    name="displayName"
                    value={form.displayName}
                    type="text"
                    placeholder="Display name"
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={trimValues}
                    errorMsg={errors.displayName}
                    tip="Custom name displayed next to posts and comments. Optional, can be changed later."
                />
                <FormItemInput
                    name="password"
                    value={form.password}
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    onBlur={trimValues}
                    errorMsg={errors.password}
                />
                <FormItemInput
                    name="confirmPassword"
                    value={form.confirmPassword}
                    type="password"
                    placeholder="Confirm password"
                    onChange={handleChange}
                    onBlur={trimValues}
                    errorMsg={errors.confirmPassword}
                />

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
            </form> */}
            <p className="text-sm mt-5">
                Already have an account? <Link to={"/login"}>Sign in here</Link>
            </p>
        </div>
    );
}

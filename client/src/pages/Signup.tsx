import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { Form2 } from "../components/Form2";
import { ItemInfo } from "../components/Form2";
import { ValidationErrorResponse } from "../interfaces/validationErrorResponse.interface";

export function Signup() {
    type RegisterFormNames =
        | "email"
        | "username"
        | "displayName"
        | "password"
        | "confirmPassword";

    const registerForm: Record<RegisterFormNames, ItemInfo> = {
        email: {
            type: "text",
            placeholder: "Email",
            autoComplete: "email",
            required: true,
        },
        username: {
            type: "text",
            placeholder: "Username",
            autoComplete: "off",
            tip: "Your unique user identifier.",
            required: true,
        },
        displayName: {
            type: "text",
            placeholder: "Display name",
            autoComplete: "off",
            tip: "Custom name displayed next to your posts and comments. Optional, can be changed later.",
        },
        password: {
            type: "password",
            placeholder: "Password",
            required: true,
        },
        confirmPassword: {
            type: "password",
            placeholder: "Confirm password",
            required: true,
        },
    } as const;

    const [form, setForm] = useState<Record<RegisterFormNames, string>>({
        email: "",
        username: "",
        displayName: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<
        Partial<Record<RegisterFormNames, string>>
    >({});

    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => {
            delete prev[name as RegisterFormNames];
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

        const newErrors: Partial<Partial<Record<RegisterFormNames, string>>> = {
            ...errors,
        };

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

        if (Object.keys(newErrors).length !== 0) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:6660/api/auth/register",
                {
                    method: "POST",
                    body: JSON.stringify(
                        Object.fromEntries(
                            Object.entries(trimValues()).filter(
                                ([_, value]) => value !== ""
                            )
                        )
                    ),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                alert("Registered successfully! Now you can sign in.");
                void navigate("/login");
            } else if (response.status === 400 || response.status === 422) {
                const data = (await response.json()) as ValidationErrorResponse;
                setErrors({ [data.item]: data.error });
            } else {
                // const error = await response.json();
                // alert(`Something went wrong. Error message: ${error}`);
                alert("Something went wrong.");
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
                Create a new account
            </h1>
            <Form2
                items={registerForm}
                values={form}
                errors={errors}
                onInput={handleInput}
                onBlur={trimValues}
                onSubmit={handleSubmit}
                loading={isLoading}
                submitButtonText="Sign up"
            ></Form2>
            <p className="text-sm mt-5">
                Already have an account? <Link to={"/login"}>Sign in here</Link>
            </p>
        </div>
    );
}

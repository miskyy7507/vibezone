import { Link, useNavigate } from "react-router";

import { TextForm } from "../components/TextForm";
import { TextFormItemOptions } from "../interfaces/itemInfo.interface";
import { ValidationErrorResponse } from "../interfaces/validationErrorResponse.interface";
import { useForm } from "../hooks/useForm";
import { handleFetchError } from "../utils/handleFetchError";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export function Signup() {
    type RegisterFormNames =
        | "username"
        | "displayName"
        | "password"
        | "confirmPassword";

    const registerForm: Record<RegisterFormNames, TextFormItemOptions> = {
        username: {
            type: "text",
            placeholder: "Username",
            autoComplete: "username",
            tip: "Your unique user identifier.",
            required: true,
            trim: true,
        },
        displayName: {
            type: "text",
            placeholder: "Display name",
            autoComplete: "nickname",
            tip: "Custom name displayed next to your posts and comments. Optional, can be changed later.",
        },
        password: {
            type: "password",
            placeholder: "Password",
            autoComplete: "new-password",
            required: true,
        },
        confirmPassword: {
            type: "password",
            placeholder: "Confirm password",
            autoComplete: "new-password",
            required: true,
        },
    } as const;

    const { user } = useAuth();

    const navigate = useNavigate();

    const {
        values,
        errors,
        loading,
        buttonDisabled,
        handleInput,
        handleSubmit,
        handleBlur,
    } = useForm(registerForm, async (form, setErrors) => {
        const newErrors = { ...errors };

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        const passwordErrors: string[] = [];
        if (form.password.length < 8) {
            // newErrors.password = "Password must contain at least 8 characters.";
            passwordErrors.push("Password must contain at least 8 characters.");
        }
        if (!/[A-Z]/.test(form.password)) {
            passwordErrors.push(
                "Password must contain at least one capital letter."
            );
        }
        if (!/\d/.test(form.password)) {
            passwordErrors.push("Password must contain at least one digit.");
        }
        if (!/[^a-zA-Z\d]/.test(form.password)) {
            passwordErrors.push(
                "Password must contain at least one special character."
            );
        }
        if (passwordErrors.length !== 0) {
            newErrors.password = passwordErrors.join("\n");
        }

        setErrors(newErrors);

        // do not call server if client-side validation errors haven't been resolved yet
        if (Object.keys(newErrors).length !== 0) return;

        const reqBody: Record<string, string> = {
            username: form.username,
            password: form.password,
        };
        if (form.displayName !== "") {
            reqBody.displayName = form.displayName;
        }

        try {
            const response = await fetch(
                "http://localhost:6660/api/auth/register",
                {
                    method: "POST",
                    body: JSON.stringify(reqBody),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                alert("Registered successfully! Now you can sign in.");
                void navigate("/login");
            } else if (response.status === 400 || response.status === 422) {
                const data = (await response.json()) as ValidationErrorResponse;
                setErrors((prev) => ({ ...prev, [data.item]: data.error }));
            } else {
                const error = await response.text();
                console.error(error);
                alert(`Something went wrong when trying to do this action. Try to reload the page.`);
            }
        } catch (error) {
            handleFetchError(error);
        }
    });

    // if user is already logged in, move it to the home page
    useEffect(() => {
        if (user) {
            void navigate("/");
        }
    });

    return (
        <main className="m-auto p-4 pb-16 max-w-2xl w-full">
            <h1 className="text-5xl text-center my-6 font-bold">
                Create a new account
            </h1>
            <TextForm
                items={registerForm}
                values={values}
                errors={errors}
                onInput={handleInput}
                onBlur={handleBlur}
                onSubmit={handleSubmit}
                loading={loading}
                buttonDisabled={buttonDisabled}
                submitButtonText="Sign up"
            />
            <p className="text-sm mt-5">
                Already have an account? <Link to={"/login"}>Sign in here</Link>
            </p>
        </main>
    );
}

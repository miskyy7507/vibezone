import { useState } from "react";

import type { TextFormItemOptions } from "../interfaces/itemInfo.interface";

export function useForm<T extends Record<keyof T, TextFormItemOptions>>(
    formItems: T,
    submitCallback: (
        values: Record<keyof T, string>,
        setErrors: React.Dispatch<
            React.SetStateAction<Partial<Record<keyof T, string>>>
        >
    ) => Promise<void>
) {
    const [values, setValues] = useState<Record<keyof T, string>>(() => {
        const values = {} as Record<keyof T, string>;
        for (const name of Object.keys(formItems) as (keyof T)[]) {
            values[name] = "";
        }
        return values;
    });
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const trimValues = () => {
        const trimmed: Partial<Record<keyof T, string>> = {};
        for (const name of Object.keys(formItems) as (keyof T)[]) {
            if (formItems[name].trim) {
                trimmed[name] = values[name].trim();
            }
        }
        setValues((prev) => ({ ...prev, ...trimmed }));
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        const fieldName = name as keyof T;

        setValues((prev) => ({ ...prev, [fieldName]: value }));

        // clear the previously set error
        const { ...newErrors } = errors;
        delete newErrors[fieldName]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
        if (formItems[fieldName].required && value === "") {
            newErrors[fieldName] = "Required";
        }
        setErrors(newErrors);

        setButtonDisabled(
            !e.currentTarget.form?.checkValidity() ||
                Object.keys(newErrors).length !== 0
        );
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        trimValues();

        const { name, value } = e.currentTarget;
        const fieldName = name as keyof T;

        const { ...newErrors } = errors;
        if (formItems[fieldName].required && value === "") {
            newErrors[fieldName] = "Required";
        }
        setErrors(newErrors);

        setButtonDisabled(
            !e.currentTarget.form?.checkValidity() ||
                Object.keys(newErrors).length !== 0
        );
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setButtonDisabled(true);

        trimValues();

        await submitCallback(values, setErrors);

        setLoading(false);
    };

    return {
        values,
        errors,
        loading,
        buttonDisabled,
        handleInput,
        handleSubmit,
        handleBlur,
    };
}

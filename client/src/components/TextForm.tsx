import { useState, useRef } from "react";
import { clsx } from "clsx";

import { TextFormInput } from "./TextFormInput";
import { Spinner } from "./Spinner";
import { TextFormItemOptions } from "../interfaces/itemInfo.interface";

interface TextFormProps<T> {
    items: Record<keyof T, TextFormItemOptions>;
    values: { [key in keyof T]: string };
    errors: Map<keyof T, string>;
    onInput: (e: React.FormEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    loading: boolean;
    submitButtonText: string;
}

export function TextForm<T>({
    items,
    values,
    errors,
    onInput,
    onBlur,
    onSubmit,
    loading,
    submitButtonText,
}: TextFormProps<T>) {
    const form = useRef<HTMLFormElement | null>(null);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        setButtonDisabled(
            !form.current?.checkValidity() ||
            errors.size !== 0 // disable button if there are any "unresolved" errors in the form
        );

        onInput(e);
    };

    return (
        <form
            ref={form}
            className="flex flex-col gap-5 text-xl "
            onSubmit={(e) => void onSubmit(e)}
        >
            {(Object.keys(items) as (keyof T)[]).map((i) => (
                <TextFormInput
                    key={i as string}
                    name={i as string}
                    value={values[i]}
                    type={items[i].type}
                    required={items[i].required}
                    placeholder={items[i].placeholder}
                    autoComplete={items[i].autoComplete}
                    onInput={handleInput}
                    // onInput={onInput}
                    onBlur={onBlur}
                    errorMsg={errors.get(i)}
                    tip={items[i].tip}
                />
            ))}
            <button
                className={clsx(
                    buttonDisabled
                        ? "opacity-55 cursor-not-allowed"
                        : "hover:opacity-85 cursor-pointer",
                    "py-5.25 text-zinc-900 bg-zinc-200 rounded-xl h-80px focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                )}
                type="submit"
                disabled={loading || buttonDisabled}
            >
                {loading ? (
                    <div className="-m-0.5">
                        <Spinner size="small" theme="light" />
                    </div>
                ) : (
                    submitButtonText
                )}
            </button>
        </form>
    );
}

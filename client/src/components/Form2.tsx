import { useState, useRef } from "react";
import { clsx } from "clsx";

import { FormItemInput } from "./FormItemInput";
import { Spinner } from "./Spinner";

export interface ItemInfo {
    type: React.HTMLInputTypeAttribute;
    placeholder?: string;
    autoComplete?: React.HTMLInputAutoCompleteAttribute;
    tip?: string;
    required?: boolean;
}

interface Form2Props<T> {
    items: Record<keyof T, ItemInfo>;
    values: { [key in keyof T]: string };
    errors: Map<keyof T, string>;
    onInput: (e: React.FormEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    loading: boolean;
    submitButtonText: string;
}

export function Form2<T>({
    items,
    values,
    errors,
    onInput,
    onBlur,
    onSubmit,
    loading,
    submitButtonText,
}: Form2Props<T>) {
    const form = useRef<HTMLFormElement | null>(null);
    // const [buttonDisabled, setButtonDisabled] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    // const [formState, setFormState] = useState<Record<keyof T, string>>(() => {
    //     const initialState = {} as Record<keyof T, string>;
    //     for (const key in items) {
    //         initialState[key] = ""; // or maybe values[key] if you want to prefill
    //     }
    //     return initialState;
    // });

    // const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    //     if (!form.current?.checkValidity()) {
    //         setButtonDisabled(true);
    //     }

    //     // disable button if there are any "unresolved" errors in the form
    //     if (Object.values(errors).some((e) => e !== null)) {
    //         setButtonDisabled(true);
    //     }

    //     onInput(e);
    // };

    return (
        <form
            ref={form}
            className="flex flex-col gap-5 text-xl "
            onSubmit={(e) => void onSubmit(e)}
        >
            {(Object.keys(items) as (keyof T)[]).map((i) => (
                <FormItemInput
                    key={i as string}
                    name={i as string}
                    value={values[i]}
                    type={items[i].type}
                    required={items[i].required}
                    placeholder={items[i].placeholder}
                    autoComplete={items[i].autoComplete}
                    // onInput={handleInput}
                    onInput={onInput}
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

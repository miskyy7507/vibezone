import { clsx } from "clsx";

import { FormItemInput } from "./FormItemInput";
import { Spinner } from "./Spinner";

export interface ItemInfo {
    type: React.HTMLInputTypeAttribute;
    placeholder?: string;
    autoComplete?: React.HTMLInputAutoCompleteAttribute;
    tip?: string;
}

interface Form2Props<T> {
    items: Record<keyof T, ItemInfo>;
    values: { [key in keyof T]: string };
    errors: { [key in keyof T]: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e?: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
    submitButtonText: string;
}

export function Form2<T>({
    items,
    values,
    errors,
    onChange,
    onBlur,
    onSubmit,
    loading,
    submitButtonText
}: Form2Props<T>) {
    return (
        <form className="flex flex-col gap-5 text-xl " onSubmit={onSubmit}>
            {(Object.keys(items) as (keyof T)[]).map((i) => (
                <FormItemInput
                    name={i as string}
                    value={values[i]}
                    type={items[i].type}
                    placeholder={items[i].placeholder}
                    autoComplete={items[i].autoComplete}
                    onChange={onChange}
                    onBlur={onBlur}
                    errorMsg={errors[i]}
                    tip={items[i].tip}
                />
            ))}
            <button
                className={clsx(
                    loading
                        ? "py-4.75 bg-zinc-200/55"
                        : "py-5.25 bg-zinc-200 hover:bg-zinc-200/85",
                    "text-zinc-900 rounded-xl cursor-pointer h-80px focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                )}
                type="submit"
                disabled={loading}
            >
                {loading ? <Spinner size="small" theme="light" /> : submitButtonText}
            </button>
        </form>
    );
}

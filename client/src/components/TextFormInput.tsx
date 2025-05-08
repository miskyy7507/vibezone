import { clsx } from "clsx";

interface TextFormInputParams {
    name: string;
    value: string;
    type: React.HTMLInputTypeAttribute;
    placeholder?: string;
    required?: boolean;
    autoComplete?: React.HTMLInputAutoCompleteAttribute;
    errorMsg?: string;
    tip?: string;
    onInput: (e: React.FormEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function TextFormInput({
    name,
    value,
    type,
    placeholder,
    required,
    autoComplete,
    errorMsg,
    tip,
    onInput,
    onBlur,
}: TextFormInputParams) {
    return (
        <div className="flex flex-col gap-1.5">
            <input
                className={clsx(
                    "peer border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1",
                    (errorMsg !== undefined) && "outline-3 outline-red-500 outline-offset-1"
                )}
                name={name}
                value={value}
                type={type}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
                onInput={onInput}
                onBlur={onBlur}
            />
            {errorMsg ? (
                <p className="text-red-500 text-sm whitespace-pre-line">{errorMsg}</p>
            ) : (
                tip && <p className="hidden peer-focus:block text-sm">{tip}</p>
            )}
        </div>
    );
}

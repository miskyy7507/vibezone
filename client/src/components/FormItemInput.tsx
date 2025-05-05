import { clsx } from "clsx";

interface FormItemInputParams {
    name: string;
    value: string;
    type: React.HTMLInputTypeAttribute;
    placeholder?: string;
    autoComplete?: React.HTMLInputAutoCompleteAttribute;
    errorMsg?: string | null;
    tip?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e?: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormItemInput(params: FormItemInputParams) {
    return (
        <div className="flex flex-col gap-1.5">
            <input
                className={clsx(
                    "peer border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1",
                    params?.errorMsg &&
                        "outline-3 outline-red-500 outline-offset-1"
                )}
                name={params.name}
                value={params.value}
                type={params.type}
                placeholder={params.placeholder}
                autoComplete={params.autoComplete}
                onChange={params.onChange}
                onBlur={params.onBlur}
            />
            {(params.errorMsg && (
                <p className="text-red-500 text-sm">{params.errorMsg}</p>
            )) ||
                (params.tip && (
                    <p className="hidden peer-focus:block text-sm">
                        {params.tip}
                    </p>
                ))}
        </div>
    );
}

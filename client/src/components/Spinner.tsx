import { clsx } from "clsx";

interface SpinnerProps {
    size: "tiny" | "small" | "medium" | "large";
    theme: "light" | "dark";
}

export function Spinner({ size, theme }: SpinnerProps) {
    const sizeMap = {
        tiny: 24,
        small: 32,
        medium: 64,
        large: 96,
    };

    const sizePx = sizeMap[size];

    return (
        <div className="mx-auto" style={{ width: `${sizePx.toString()}px`, height: `${sizePx.toString()}px` }}>
            <svg className="animate-spin" viewBox="0 0 32 32">
                <circle
                    className={clsx(
                        theme === "light" && "stroke-zinc-900",
                        theme === "dark"  && "stroke-zinc-200",
                        "animate-spinner",
                    )}
                    cx="16"
                    cy="16"
                    r="13.5"
                    fill="none"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="63.617 21.206"
                    strokeDashoffset="-23.206"
                ></circle>
            </svg>
        </div>
    );
}

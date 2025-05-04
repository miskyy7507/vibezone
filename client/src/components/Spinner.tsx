import { clsx } from "clsx";

interface SpinnerProps {
    size: "small" | "medium" | "large";
    theme: "light" | "dark";
}

export function Spinner({ size, theme }: SpinnerProps) {
    const sizeMap = {
        small: 32,
        medium: 64,
        large: 96,
    };

    const sizePx = sizeMap[size];

    return (
        <div className="mx-auto" style={{ width: `${sizePx}px`, height: `${sizePx}px` }}>
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
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-dasharray="63.617 21.206"
                    stroke-dashoffset="-23.206"
                ></circle>
            </svg>
        </div>
    );
}

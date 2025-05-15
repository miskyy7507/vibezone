import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { clsx } from "clsx";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";


interface DropdownItemProps {
    text: string;
    icon?: IconDefinition;
    danger?: boolean;
    onClick: () => void;
}

export function DropdownItem({
    text,
    icon,
    danger,
    onClick,
}: DropdownItemProps) {
    return (
        <button
            className={clsx(
                "flex flex-row gap-2 items-center px-4 py-2 cursor-pointer hover:bg-zinc-50/5 transition",
                danger && "text-red-400"
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {icon && <FontAwesomeIcon icon={icon} />}
            <span className="whitespace-nowrap">{text}</span>
        </button>
    );
}

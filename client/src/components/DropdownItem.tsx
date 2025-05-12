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
                "flex flex-row gap-2 items-center cursor-pointer",
                danger && "text-red-400"
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {icon && <FontAwesomeIcon icon={icon} />}
            <span>{text}</span>
        </button>
    );
}

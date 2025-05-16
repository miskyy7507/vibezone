import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import { clsx } from "clsx";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface DropdownLinkProps {
    text: string;
    icon?: IconDefinition;
    danger?: boolean;
    link: string;
}

export function DropdownLink({
    text,
    icon,
    danger,
    link,
}: DropdownLinkProps) {
    return (
        <Link
            className={clsx(
                "flex flex-row gap-2 items-center px-4 py-2 cursor-pointer hover:bg-zinc-50/5 transition",
                danger && "text-red-400"
            )}
            to={link}
        >
            {icon && <FontAwesomeIcon icon={icon} />}
            <span className="whitespace-nowrap">{text}</span>
        </Link>
    );
}

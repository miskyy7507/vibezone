import { getRelativeTime } from "../utils/getRelativeDate";

export function CreationDate({ dateString }: { dateString: string }) {
    const timestamp = Date.parse(dateString);
    if (isNaN(timestamp)) {
        return;
    }

    const date = new Date(timestamp);

    return (
        <span
            className="text-zinc-500"
            title={date.toLocaleString("en-GB", {
                dateStyle: "long",
                timeStyle: "short",
            })}
        >
            {getRelativeTime(date)}
        </span>
    );
}

export function getRelativeTime(date: Date) {
    const rtf = new Intl.RelativeTimeFormat("en-GB", {
        style: "long",
        numeric: "always",
    });
    const diff = date.getTime() - Date.now();

    if (diff > -5000) { // 5 seconds
        return "just now";
    }

    const seconds = diff / 1000;
    const minutes = diff / (1000 * 60);
    const hours = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);
    const months = diff / (1000 * 60 * 60 * 24 * 30);
    const years = diff / (1000 * 60 * 60 * 24 * 365);

    if (seconds > -60) {
        return rtf.format(Math.ceil(seconds), "second");
    } else if (minutes > -60) {
        return rtf.format(Math.ceil(minutes), "minute");
    } else if (hours > -24) {
        return rtf.format(Math.ceil(hours), "hour");
    } else if (days > -30) {
        return rtf.format(Math.ceil(days), "day");
    } else if (months > -12) {
        return rtf.format(Math.ceil(months), "month");
    } else {
        return rtf.format(Math.ceil(years), "year");
    }
}

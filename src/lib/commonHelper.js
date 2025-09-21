export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short", // "Jan", "Feb", etc.
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
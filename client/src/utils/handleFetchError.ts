export function handleFetchError(error: unknown) {
    if (error instanceof TypeError) {
        console.error("Fetch failed.", error);
        alert(`Something went wrong: ${error.message}`);
    } else {
        throw error;
    }
}

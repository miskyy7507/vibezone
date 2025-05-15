import { toast } from "react-toastify";

export function handleFetchError(error: unknown) {
    if (error instanceof TypeError) {
        console.error("Fetch failed.", error);
        toast.error(`Fetch failed. Error message: ${error.message}`);
    } else {
        throw error;
    }
}

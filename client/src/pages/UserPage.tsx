import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { User } from "../interfaces/user.interface";
import { NotFound } from "./NotFound";
import { Spinner } from "../components/Spinner";
import { handleFetchError } from "../utils/handleFetchError";
import { toast } from "react-toastify";
import { apiUrl } from "../config";

export function UserPage() {
    const [user, setUser] = useState<User | null>(null);
    const [notFound, setNotFound] = useState(false);

    const { userId } = useParams();

    useEffect(() => {
        if (!userId || !/^[a-f0-9]{24}$/.test(userId)) {
            setNotFound(true);
            return;
        }

        void (async () => {
            try {
                const response = await fetch(
                    `${apiUrl}/profile/${userId}`, {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (response.status === 200) {
                    const userData = await response.json() as User;
                    setUser(userData);
                } else if (response.status === 404) {
                    setNotFound(true);
                } else {
                    console.error(await response.text());
                    toast.error("Something went wrong when trying to fetch user info. Try to reload the page.");
                }
            } catch (error) {
                handleFetchError(error);
            }
        })()
    }, [userId]);

    return notFound ? (
        <NotFound />
    ) : user ? (
        <div>User ID: {user._id}</div>
    ) : (
        <Spinner size="large" theme="dark" />
    );
}

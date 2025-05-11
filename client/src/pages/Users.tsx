import { useState, useEffect } from "react";

import { UserListItem } from "../components/UserListItem";
import { Spinner } from "../components/Spinner";
import { handleFetchError } from "../utils/handleFetchError";

import type { User } from "../interfaces/user.interface";

export function Users() {
    const [users, setUsers] = useState<User[] | null>(null);

    useEffect(() => { void (async () => {
        try {
            const response = await fetch("http://localhost:6660/api/profile/all", {
                method: "GET",
                credentials: "include",
            });
            if (response.status === 200) {
                const data = (await response.json()) as User[];
            setUsers(data);
            } else {
                const error = await response.text();
                console.error(error);
                alert(`Something went wrong when trying to do this action. Try to reload the page.`);
            }
        } catch (error) {
            handleFetchError(error);
        }
    })();
    }, []);

    return (
        <div className="flex flex-col items-center">
            {users ? (
                users.map((user) => <UserListItem user={user} key={user._id} />)
            ) : (
                <Spinner size="large" theme="dark" />
            )}
        </div>
    );
}

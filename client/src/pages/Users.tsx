import { useState, useEffect } from "react";

import { UserListItem } from "../components/UserListItem";
import { Spinner } from "../components/Spinner";

import type { User } from "../interfaces/user.interface";

export function Users() {
    const [users, setUsers] = useState<User[] | null>(null);

    useEffect(() => { void (async () => {
        try {
            const response = await fetch("http://localhost:6660/api/profile/all", {
                method: "GET",
                credentials: "include",
            });
            if (response.status !== 200) {
                console.error(await response.text());
                alert(
                    `An unexpected error occured when trying to get list of users. The server responsed with code: ${response.status.toString()}`
                );
            }
            const data = (await response.json()) as User[];
            setUsers(data);
        } catch (error) {
            if (error instanceof TypeError) {
                console.error("Fetch failed.", error);
                alert(`Something went wrong: ${error.message}`);
            } else {
                throw error;
            }
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

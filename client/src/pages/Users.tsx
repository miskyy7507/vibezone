import { useState, useEffect } from "react";

import { UserListItem } from "../components/UserListItem";
import { Spinner } from "../components/Spinner";
import { handleFetchError } from "../utils/handleFetchError";

import type { User } from "../interfaces/user.interface";
import { toast } from "react-toastify";

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
                toast.error("Something went wrong when trying to do this action. Try to reload the page.");
            }
        } catch (error) {
            handleFetchError(error);
        }
    })();
    }, []);

    const deleteUserFromList = (id: string) => {
        setUsers((prev) => {
            if (!prev) return null;
            return prev.filter((i) => i._id !== id);
        })
    }

    return (
        <main className="flex-1 flex flex-col items-center gap-6 m-6">
            {users ? (
                users.map((user) => (
                    <UserListItem
                        user={user}
                        key={user._id}
                        deleteUserCb={deleteUserFromList}
                    />
                ))
            ) : (
                <div className="flex-1 flex items-center">
                    <Spinner size="large" theme="dark"></Spinner>
                </div>
            )}
        </main>
    );
}

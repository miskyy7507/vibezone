import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import { apiUrl } from "../config";
import { AuthContext } from "../hooks/useAuth";
import { handleFetchError } from "../utils/handleFetchError";

import type { User } from "../interfaces/user.interface";


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const getUser = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/profile`, {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 200) {
                const user = (await response.json()) as User;
                return user;
            } else if (response.status === 401) {
                // not logged in, ignore
            } else {
                console.error(await response.text());
                toast.error(
                    "Something went wrong when trying to retrieve logged in user information."
                );
            }
        } catch (error) {
            handleFetchError(error);
        }
    }, []);

    useEffect(() => {
        void (async () => {
            const user = await getUser();

            if (user) {
                setUser(user);
            }

            setLoading(false);
        })();
    }, [getUser]);

    const login = (user: User) => {
        setUser(user);
    };

    const logout = async () => {
        if (user === null) return;

        try {
            const response = await fetch(
                `${apiUrl}/auth/logout`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (response.status === 200 || response.status === 401) {
                setUser(null);
                window.location.href = "/";
            } else {
                console.error(await response.text());
                toast.error(
                    "Something went wrong when trying to log out user. Try to reload the page."
                );
            }
        } catch (error) {
            handleFetchError(error);
        }
    };

    const value = { user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

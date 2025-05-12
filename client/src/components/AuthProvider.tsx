import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "../hooks/useAuth";

import type { User } from "../interfaces/user.interface";
import { handleFetchError } from "../utils/handleFetchError";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const getUser = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:6660/api/profile", {
                method: "GET",
                credentials: 'include', // crucial for cookies
            });

            if (response.status === 200) {
                const user = await response.json() as User;
                return user;
            } else if (response.status === 401) {
                // not logged in, ignore
            } else {
                console.error(await response.text());
                alert(`Something went wrong when trying to retrieve logged in user information.`);
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
        console.log(user);
        setUser(user);
    };

    const logout = async () => {
        if (user === null) return;

        try {
            const response = await fetch("http://localhost:6660/api/auth/logout", {
                method: "POST",
                credentials: 'include', // crucial for cookies
            });

            if (response.status === 200 || response.status === 401) {
                setUser(null);
                document.location.reload();
            } else {
                console.error(await response.text());
                alert(`Something went wrong when trying to log out user. Try to reload the page.`);
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

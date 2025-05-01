import { useState, useEffect } from "react";
import { AuthContext } from "../auth";

import { placeholderUsers } from "../placeholderUsers";

import type { User } from "../interfaces/user.interface";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(placeholderUsers.find((e) => e._id === storedUser)!);
        }

        setLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", userData._id);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const value = { user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

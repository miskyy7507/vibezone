import { createContext, useContext } from "react";

import type { User } from "../interfaces/user.interface";


interface AuthContextValue {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth hook has been used outside of Auth Context Provider.");
    }

    return context;
};

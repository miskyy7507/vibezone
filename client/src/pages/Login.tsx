import { useState } from "react";

import { useAuth } from "../auth";
import { placeholderUsers } from "../placeholderUsers";
import { useNavigate } from "react-router";

export function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Simulate API call
        const userToLogIn = placeholderUsers.find(user => user.username === username);

        if (!userToLogIn) {
            alert("Incorrect username or password.");
            return false;
        }

        login(userToLogIn);

        navigate("/");
    };

    return (
        <form onSubmit={(handleSubmit)}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
}

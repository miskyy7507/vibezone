import { Routes, Route } from "react-router";

import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Users } from "./pages/Users";
import { AuthProvider } from "./components/AuthProvider";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { UserPage } from "./pages/UserPage";
import { Post } from "./pages/Post";
import { NotFound } from "./pages/NotFound";

function App() {
    return (
        <AuthProvider>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="users" element={<Users />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="user/:userId" element={<UserPage />} />
                <Route path="post/:postId" element={<Post />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;

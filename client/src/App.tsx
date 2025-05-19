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
import { Slide, ToastContainer } from "react-toastify";
import { UpdateProfile } from "./pages/UpdateProfile";

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
                <Route path="update-profile" element={<UpdateProfile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="colored"
                closeButton={false}
                transition={Slide}
            />
        </AuthProvider>
    );
}

export default App;

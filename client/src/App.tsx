import { Routes, Route } from "react-router";

import { Navbar } from "./Navbar";
import { Home } from "./pages/Home";
import { Users } from "./pages/Users";

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="users" element={<Users />} />
            </Routes>
        </>
    );
}

export default App;

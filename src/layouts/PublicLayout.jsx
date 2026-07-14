import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-secondary font-unison">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;
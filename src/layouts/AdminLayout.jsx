import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/Navbar/AdminNavbar";

const AdminLayout = () => {
    return ( 
        <> 
            <div className=" font-unison text-primary">
                {/* Header Layout*/}
                <AdminNavbar />
             
                {/* Page Layout*/}
                <main className="main-content">
                    <Outlet /> 
                </main>
            </div>
        </>
     );
}
 
export default AdminLayout;
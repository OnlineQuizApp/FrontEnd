import { Outlet, Link } from "react-router-dom";
import "../css/admin-layout.css"
import Sidebar from "./Sidebar";
import HeaderComponent from "./HeaderComponent";
const AdminLayout = () => {
    return (
        <div className="app-layout">
            <Sidebar/>
            <HeaderComponent />
            <div className="main-content">
                <Outlet/>
            </div>
        </div>
    );
};

export default AdminLayout;
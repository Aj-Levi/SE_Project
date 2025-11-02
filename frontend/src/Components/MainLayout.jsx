import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Outlet, useLocation } from "react-router-dom";


export function MainLayout() {

    const location = useLocation();
    const isEarthPage = location.pathname === "/";

    return (
        <>
            <Nav />
            <Outlet />
            { isEarthPage && <Footer/>}
        </>
    );
}
import Header from "./Header";
import {Outlet} from "react-router-dom";

function Layout(){
    return(
        <main>
            <Header></Header>
            <Outlet></Outlet>
        </main>
    )
}

export default Layout
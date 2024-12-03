import './App.css';
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/Create";
import IndexPage from "./pages/IndexPage";
import SinglePost from "./pages/SinglePost";
import EditPost from "./pages/EditPost";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<IndexPage/>}/>
                <Route path="/create" element={<CreatePost/>}/>
                <Route path="/post/:id" element={<SinglePost />} />
                <Route path="/edit/:id" element={<EditPost />} />
            </Route>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

        </Routes>

    );
}

export default App;

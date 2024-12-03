import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate(); // Hook for programmatic navigation

    useEffect(() => {
        // Fetch user profile information when the component mounts
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(response => {
            if (response.ok) {
                response.json().then(userInfo => {
                    setUserInfo(userInfo); // Set the user info on successful response
                });
            } else {
                setUserInfo(null); // In case of an error, clear the user info
            }
        });
    }, []);

    function logout() {
        // Log the user out by making a POST request to the logout endpoint
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        }).then(() => {
            setUserInfo(null); // Clear user info after logging out
            navigate('/login'); // Redirect to the login page
        });
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link to="/" className="logo">
                <img src="travel-logo.jpg" alt="TravelTrek Logo" className="logo-img" />
                TravelTrek
            </Link>
            <nav>
                {username && (
                    <>
                        <Link to="/create">Create new post</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;

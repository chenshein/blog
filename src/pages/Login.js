import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import './LoginRegister.css'


function Login(){
    const [username,setUsername]= useState('')
    const [password,setPassword]= useState('')
    const navigate = useNavigate();

    async function login(event){
        event.preventDefault();
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
             credentials:'include', //for the cookie
        });
        const result = await response.json();

        if (response.status === 404) {
            alert('User not found, please register.');
        } else if (response.status === 401) {
            alert('Invalid password. Please try again.');
        } else if (response.status !== 200) {
            alert('Login failed, try again!');
        } else {
            alert('Login succeeded');
            navigate('/'); // Redirect to home or dashboard
        }
    }


    return (
        <div className="login-wrapper">
            <form className="login" onSubmit={login}>
                <h2>Login</h2>
                <input type="text" placeholder="Username" required
                       value={username} onChange={event => setUsername(event.target.value)} />
                <input type="password" placeholder="Password" required
                       value={password} onChange={event => setPassword(event.target.value)} />
                <button type="submit">Login</button>
                <div className="register">
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </form>
        </div>
    );
}

export default Login
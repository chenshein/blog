import React,{useState} from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css'


function Register() {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [confPassword,setConfPassword] = useState('')
    const navigate = useNavigate();
    async function register(event) {
        event.preventDefault();
        if (password !== confPassword) { // check if the confirm password and the password match
            alert('Passwords do not match!');
            return;
        }
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type':'application/json'},
        });
        if(response.status !== 200) alert('Register Failed, try again!')
        else {
            alert('Register Succeeded')
            navigate('/login');
        }
    }

    return (
        <div className="register-wrapper">
            <form className="register" onSubmit={register}>
                <h2>Register</h2>
                <input type="text" placeholder="Username" required
                       value={username}
                       onChange={event => setUsername(event.target.value)} />
                <input type="password" placeholder="Password" required
                       value={password}
                       onChange={event => setPassword(event.target.value)} />
                <input type="password" placeholder="Confirm Password" required
                       value={confPassword}
                       onChange={event => setConfPassword(event.target.value)} />
                <button type="submit">Register</button>
                <div className="login">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </form>
        </div>
    );
}

export default Register;

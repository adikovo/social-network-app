import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin(event) {
        event.preventDefault();

        const userData = {
            command: 'login',
            data: {
                email: email,
                password: password
            }
        };

        // API call using axios
        axios.post('http://localhost:3001/api/auth', userData)
            .then(response => {
                console.log('Login response:', response.data);

                //check if login was actually successful
                if (response.data.message === 'login successful') {
                    console.log('Login successful:', response.data);
                    alert('Login successful!');
                    // Navigate to feed only on successful login
                    navigate('/feed');
                } else {
                    //handle login failure
                    alert('Login failed: ' + response.data.message);
                }
            })
            .catch(error => {
                console.error('Login error:', error.response?.data || error.message);
                alert('Login failed: ' + (error.response?.data?.message || error.message));
            });
    }



    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h1>Login</h1>
            <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
                <div className="form-group">
                    <label htmlFor="email" style={{ textAlign: 'left', display: 'block' }}>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" style={{ textAlign: 'left', display: 'block' }}>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Login</button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>Don't have an account?</p>
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                        navigate('/register')
                    }}>
                    Sign Up
                </button>
            </div>
        </div>
    )
}

export default Login;
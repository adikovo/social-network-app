import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import MyAlert from '../components/MyAlert';
import useMyAlert from '../hooks/useMyAlert';


function Login() {

    const navigate = useNavigate();
    const { login } = useUserContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { alert, showSuccess, showError, hideAlert } = useMyAlert();

    function handleLogin(event) {
        event.preventDefault();

        //validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address!');
            return;
        }

        //check if fields are filled
        if (!email || !password) {
            showError('Please fill in all fields!');
            return;
        }

        const userData = {
            email: email,
            password: password
        };

        // API call using axios
        axios.post('http://localhost:3001/api/auth/login', userData)
            .then(res => {
                console.log('Login response:', res.data);

                //check if login was actually successful
                if (res.data.message === 'login successful') {

                    console.log('Login successful:', res.data);

                    //save user data to context
                    login(res.data.user);
                    showSuccess('Login successful!');

                    //navigate to feed only on successful login
                    navigate('/feed');
                } else {
                    //handle login failure
                    showError('Login failed: ' + res.data.message);
                }
            })
            .catch(error => {
                console.error('Login error:', error.res?.data || error.message);
                showError('Login failed: ' + (error.res?.data?.message || error.message));
            });
    }



    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#8B5CF6',
                textAlign: 'center',
                marginBottom: '2rem',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                textShadow: '2px 2px 4px rgba(139, 92, 246, 0.3)',
                letterSpacing: '-0.02em'
            }}>Login</h1>
            <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label" style={{ textAlign: 'left', display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label" style={{ textAlign: 'left', display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', width: '40%' }}>Login</button>
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

            {/* MyAlert Component */}
            <MyAlert
                show={alert.show}
                message={alert.message}
                type={alert.type}
                duration={alert.duration}
                onClose={hideAlert}
            />
        </div>
    )
}

export default Login;
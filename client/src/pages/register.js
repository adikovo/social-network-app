import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyAlert from '../components/MyAlert';
import useMyAlert from '../hooks/useMyAlert';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const { alert, showSuccess, showError, showWarning, hideAlert } = useMyAlert();

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);

        if (value.length > 0 && value.length < 2) {
            setNameError('Name must be at least 2 characters');
        } else if (value.length > 50) {
            setNameError('Name must be less than 50 characters');
        } else {
            setNameError('');
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (value.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setEmailError('Please enter a valid email address');
            } else {
                setEmailError('');
            }
        } else {
            setEmailError('');
        }
    };

    function handleRegister(event) {
        event.preventDefault();

        //validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address!');
            return;
        }

        //check if passwords match
        if (password !== verifyPassword) {
            showError('Passwords do not match!');
            return;
        }

        //check if all fields are filled
        if (!name || !email || !password) {
            showWarning('Please fill in all fields!');
            return;
        }

        //validate password length
        if (password.length < 6) {
            showError('Password must be at least 6 characters long!');
            return;
        }

        //validate name length
        if (name.length < 2 || name.length > 50) {
            showError('Name must be between 2 and 50 characters!');
            return;
        }

        const userData = {
            name: name,
            email: email,
            password: password
        };

        //API call using axios
        axios.post('http://localhost:3001/api/auth/register', userData)
            .then(response => {
                console.log('Register successful:', response.data);
                showSuccess('Registration successful! You can now login.');

                //clearsthe  form
                setName('');
                setEmail('');
                setPassword('');
                setVerifyPassword('');

                //navigate to login page
                navigate('/login');
            })
            .catch(error => {
                console.error('Register error:', error.response?.data || error.message);

                showError('Registration failed: ' + (error.response?.data?.message || error.message));
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
            }}>Register</h1>
            <form onSubmit={handleRegister} style={{ marginTop: '20px' }}>
                <div className="form-group">
                    <label htmlFor="name" style={{ textAlign: 'left', display: 'block', marginTop: '7px' }}>Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter your name"
                        maxLength="50"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" style={{ textAlign: 'left', display: 'block', marginTop: '7px' }}>Email:</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            maxLength="100"
                        />
                        <small style={{
                            color: '#6c757d',
                            fontSize: '12px',
                            position: 'absolute',
                            bottom: '-18px',
                            right: '0px'
                        }}>
                            {email.length}/100 characters
                        </small>
                    </div>
                    {emailError && (
                        <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px' }}>
                            {emailError}
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="password" style={{ textAlign: 'left', display: 'block', marginTop: '7px' }}>Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        maxLength="100"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="verifyPassword" style={{ textAlign: 'left', display: 'block', marginTop: '7px' }}>Verify Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="verifyPassword"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        placeholder="Confirm your password"
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Register</button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '25px' }}>
                <p>Already have an account?</p>
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                        navigate('/login')
                    }}
                >
                    Back to Login
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

export default Register;
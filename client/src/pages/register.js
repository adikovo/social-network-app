import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');

    function handleRegister(event) {
        event.preventDefault();

        //check if passwords match
        if (password !== verifyPassword) {
            alert('Passwords do not match!');
            return;
        }

        //check if all fields are filled
        if (!name || !email || !password) {
            alert('Please fill in all fields!');
            return;
        }

        const userData = {
            command: 'register',
            data: {
                name: name,
                email: email,
                password: password
            }
        };

        //API call using axios
        axios.post('http://localhost:3001/api/auth', userData)
            .then(response => {
                console.log('Register successful:', response.data);
                alert('Registration successful! You can now login.');

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

                alert('Registration failed: ' + (error.response?.data?.message || error.message));
            });
    }

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h1>Register</h1>
            <form onSubmit={handleRegister} style={{ marginTop: '20px' }}>
                <div className="form-group">
                    <label htmlFor="name" style={{ textAlign: 'left', display: 'block', marginTop: '7px' }}>Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" style={{ textAlign: 'left', display: 'block', marginTop: '7px' }}>Email:</label>
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
                    <label htmlFor="password" style={{ textAlign: 'left', display: 'block', marginTop: '7px' }}>Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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
        </div>
    )
}

export default Register;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css'; // Importing the CSS file for styles

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Change this from name to username
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message before each submission
        setSuccessMessage(''); // Reset success message before each submission

        if (!isLogin && password !== confirmPassword) {
            setErrorMessage('Passwords do not match'); // Set error message
            return; 
        }

        const url = isLogin ? 'http://localhost:5001/api/login' : 'http://localhost:5001/api/signup';
        const data = isLogin ? { email, password } : { username, email, password }; 

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Use .json() to read JSON responses
                setErrorMessage(errorData.message || 'An error occurred'); // Extract and set error message
                setTimeout(() => {
                    setErrorMessage(''); // Clear error message after 2 seconds
                }, 2000);
                return; // Exit the function
            }

            const result = await response.json();
            console.log(result);

            // If it's a signup, show success message
            if (!isLogin) {
                setSuccessMessage('Sign up successful! You can now log in.'); // Set success message
                setTimeout(() => {
                    setSuccessMessage(''); // Clear success message after 2 seconds
                }, 2000);
                return; // Prevent navigation for now, just show success message
            }

            // Store the JWT token in local storage for login
            if (result.token) {
                localStorage.setItem('token', result.token); // Store token
                console.log('Token stored in local storage:', result.token);
            }

            navigate('/main'); // Redirect to the main page

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(`An error occurred: ${error.message}`); // Set error message
            setTimeout(() => {
                setErrorMessage(''); // Clear error message after 2 seconds
            }, 2000);
        }
    };

    return (
        <div className="auth-container">
            <div className="button-container">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`toggle-button login ${isLogin ? 'active' : ''}`}
                >
                    Login
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`toggle-button signup ${!isLogin ? 'active' : ''}`}
                >
                    Sign Up
                </button>
            </div>
            <div className="card">
                <h2>{isLogin ? "Welcome back" : "Create an account"}</h2>
                <p>{isLogin ? "Enter your credentials to access your account" : "Fill in the information below to get started"}</p>
                <form className="form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p> // Display error message
                    )}
                    {successMessage && (
                        <p className="success-message">{successMessage}</p> // Display success message
                    )}
                    <button type="submit" className="submit-button">
                        {isLogin ? 'Log in' : 'Sign up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

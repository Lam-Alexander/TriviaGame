import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css'; // Importing the CSS file for styles

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? 'http://localhost:5001/api/login' : 'http://localhost:5001/api/signup';
        const data = isLogin ? { email, password } : { name, email, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            console.log(result); // Handle successful response (e.g., save token, redirect user)

            // Redirect to the main page of the trivia game
            navigate('/main'); // Adjust the path according to your routing setup

        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., show notification)
        }
    };

    return (
        <div className="auth-container">
            <div className="button-container">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`toggle-button login ${isLogin ? 'active' : ''}`} // Add login class
                >
                    Login
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`toggle-button signup ${!isLogin ? 'active' : ''}`} // Add signup class
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
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                    <button type="submit" className="submit-button">
                        {isLogin ? 'Log in' : 'Sign up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

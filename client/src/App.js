import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import MainPage from './pages/main/MainPage'; 

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/main" element={<MainPage />} /> 
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;

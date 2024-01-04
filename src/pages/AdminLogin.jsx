// AdminLogin.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import '../styles/AdminLogin.css'; // Import your CSS file for styling

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'LOGIN_START' });

        try {
            const response = await fetch(`${BASE_URL}/users/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const result = await response.json();

            if (!response.ok) {
                dispatch({ type: 'LOGIN_FAILURE', payload: result.message });
            } else if (result.data.role !== 'admin') {
                dispatch({ type: 'LOGIN_FAILURE', payload: 'Access Denied: Admin Only' });
            } else {
                dispatch({ type: 'LOGIN_SUCCESS', payload: result.data });
                navigate('/admin/dashboard');
            }
        } catch (error) {
            dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
        }
    };

    return (
        <div className="admin-login">
            <form onSubmit={handleSubmit} className="admin-login-form">
                <h2>Admin Login</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    onChange={handleChange}
                />
                <button type="submit" className="login-btn">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔐</div>
                <h2 style={{ border: 'none' }}>Welcome Back</h2>
                <p>Login to continue your journey</p>

                <form onSubmit={handleSubmit} style={{ textAlign: 'left', marginTop: '30px' }}>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Login Now
                    </button>
                </form>

                <div style={{ marginTop: '20px' }}>
                    <p>Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign up here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;

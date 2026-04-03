import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <span>⚡</span> SkillSwap
            </Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/events" className={isActive('/events')}>Events</Link>
                        <Link to="/search" className={isActive('/search')}>Search</Link>
                        <Link to="/requests" className={isActive('/requests')}>Requests</Link> {/* Renamed from Inbox */}
                        <Link to="/recommendations" className={isActive('/recommendations')}>Network</Link>
                        <Link to="/ds-visualize" className={isActive('/ds-visualize')}>Data Viz</Link>

                        <Link to="/profile" className={isActive('/profile')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: isActive('/profile') ? 'var(--surface-light)' : 'transparent', border: '1px solid var(--border)' }}>
                            <div style={{ width: '35px', height: '35px', background: 'linear-gradient(to right, #6366f1, #a855f7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                                {user.username[0].toUpperCase()}
                            </div>
                            <span>My Profile</span>
                        </Link>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '10px 20px', fontSize: '1rem' }}>
                            Logout ➡️
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ fontSize: '1.2rem' }}>Login</Link>
                        <Link to="/signup" className="btn btn-primary" style={{ color: 'white', textDecoration: 'none' }}>Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

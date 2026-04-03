import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh' }}>
            <div className="hero" style={{ width: '100%' }}>
                <div style={{ fontSize: '6rem', marginBottom: '20px', animation: 'float 6s ease-in-out infinite' }}>
                    🚀
                </div>
                <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Level Up with <span style={{ color: '#818cf8' }}>SkillSwap</span></h1>
                <p style={{ textAlign: 'center', fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto 50px auto', color: '#cbd5e1', lineHeight: '1.8' }}>
                    The advanced social platform for developers. <br />
                    Exchange knowledge, join real-time events, and visualize your social graph.
                </p>

                {!user ? (
                    <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                        <Link to="/signup" className="btn btn-primary" style={{ fontSize: '1.4rem', padding: '18px 40px' }}>
                            ✨ Get Started
                        </Link>
                        <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.4rem', padding: '18px 40px' }}>
                            🔐 Login
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                        <Link to="/search" className="btn btn-primary" style={{ fontSize: '1.3rem' }}>
                            🔍 Find Skills
                        </Link>
                        <Link to="/ds-visualize" className="btn btn-secondary" style={{ fontSize: '1.3rem' }}>
                            📊 My Data Graph
                        </Link>
                    </div>
                )}
            </div>

            {user && (
                <div style={{ marginTop: '80px', width: '100%', maxWidth: '1200px' }}>
                    <h2 style={{ textAlign: 'center', border: 'none', fontSize: '3rem', marginBottom: '40px' }}>Your Dashboard ⚡</h2>
                    <div className="grid">
                        <Link to="/events" style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📅</div>
                                <h3>Live Events</h3>
                                <p>Join active sessions and meet mutual connections instantly.</p>
                            </div>
                        </Link>

                        <Link to="/recommendations" style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤝</div>
                                <h3>Smart Connect</h3>
                                <p>Friend recommendations powered by Graph Shortest Path.</p>
                            </div>
                        </Link>

                        <Link to="/profile" style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👤</div>
                                <h3>Your Profile</h3>
                                <p>Track your Karma points, followers, and skill portfolio.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;

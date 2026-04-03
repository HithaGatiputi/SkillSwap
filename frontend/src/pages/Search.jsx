import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [prefix, setPrefix] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleInputChange = async (e) => {
        const val = e.target.value;
        setPrefix(val);
        if (val.length > 0) {
            try {
                const res = await api.get(`/skills/autocomplete?prefix=${val}`);
                setSuggestions(res.data);
            } catch (e) { console.error(e); }
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = async (skill) => {
        setPrefix(skill);
        setSuggestions([]);
        try {
            const res = await api.get(`/skills/search?skill=${skill}`);
            setResults(res.data);
        } catch (e) { console.error(e); }
    };

    const handleRequest = async (providerId) => {
        try {
            await api.post('/requests', { providerId, skill: prefix });
            alert('Request sent!');
            navigate('/requests');
        } catch (e) {
            alert('Error: ' + (e.response?.data?.message || e.message));
        }
    };

    return (
        <div className="container">
            <h1>Search Skills</h1>

            <div style={{ position: 'relative', marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <input
                        value={prefix}
                        onChange={handleInputChange}
                        placeholder="Type a skill (e.g. React, Python)..."
                        style={{
                            padding: '20px',
                            fontSize: '1.4rem',
                            border: '2px solid var(--primary)',
                            borderRadius: '15px',
                            marginBottom: 0
                        }}
                    />
                    <button
                        onClick={() => handleSearch(prefix)}
                        className="btn btn-primary"
                        style={{ padding: '0 40px', borderRadius: '15px', fontSize: '1.2rem' }}
                    >
                        Search
                    </button>
                </div>

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: 'calc(100% - 140px)',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '0 0 15px 15px',
                        zIndex: 10,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                        marginTop: '5px'
                    }}>
                        {suggestions.map((s, i) => (
                            <div
                                key={i}
                                style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #334155', fontSize: '1.2rem', color: 'white' }}
                                onMouseEnter={(e) => e.target.style.background = '#334155'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                onClick={() => handleSearch(s)}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {results.length > 0 && (
                <div className="animate-fade">
                    <h3>Top Providers for "{prefix}"</h3>
                    <div className="grid">
                        {results.map(user => (
                            <div key={user._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="avatar" style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>{user.username[0].toUpperCase()}</div>
                                        <h2 style={{ margin: 0, border: 0, fontSize: '1.8rem' }}>{user.username}</h2>
                                    </div>
                                    <span className="badge badge-green" style={{ fontSize: '1rem' }}>Karma: {user.karmaPoints}</span>
                                </div>

                                <p><strong>Skills:</strong> {user.skillsOffered.join(', ')}</p>

                                <button onClick={() => handleRequest(user._id)} className="btn btn-primary" style={{ marginTop: 'auto' }}>
                                    Request Mentorship
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;

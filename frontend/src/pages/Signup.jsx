import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', skillsOffered: '', skillsWanted: ''
    });
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()),
                skillsWanted: formData.skillsWanted.split(',').map(s => s.trim())
            };
            await signup(data);
            navigate('/');
        } catch (err) {
            alert('Signup failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
            <div className="card">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Skills Offered (comma separated)</label>
                        <input placeholder="e.g. React, Node, Python" value={formData.skillsOffered} onChange={e => setFormData({ ...formData, skillsOffered: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Skills Wanted (comma separated)</label>
                        <input placeholder="e.g. Design, Go" value={formData.skillsWanted} onChange={e => setFormData({ ...formData, skillsWanted: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;

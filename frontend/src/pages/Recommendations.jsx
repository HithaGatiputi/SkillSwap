import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Recommendations = () => {
    const [recs, setRecs] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        api.get('/users/recommendations')
            .then(res => setRecs(res.data))
            .catch(console.error);
    }, []);

    const handleFollow = async (id) => {
        try {
            await api.post(`/users/follow/${id}`);
            // Remove from list or mark as followed
            setRecs(recs.filter(r => r.user._id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="container">
            <h2>Friend Recommendations</h2>
            <p>Based on your social graph (Friends of Friends via BFS)</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {recs.map(({ user, distance }) => (
                    <div key={user._id} className="card">
                        <h3>{user.username}</h3>
                        <p>Karma: {user.karmaPoints}</p>
                        <p>Degree of separation: {distance}</p>
                        <button onClick={() => handleFollow(user._id)} className="btn btn-primary">Follow</button>
                    </div>
                ))}
                {recs.length === 0 && <p>No new recommendations.</p>}
            </div>
        </div>
    );
};

export default Recommendations;

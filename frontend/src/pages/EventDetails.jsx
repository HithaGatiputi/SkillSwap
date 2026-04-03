import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleProfileClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const fetchDetails = async () => {
        try {
            const res = await api.get(`/events/${id}`);
            setEventData(res.data);
            setLoading(false);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchDetails();
        if (socket) {
            socket.emit('joinEventRoom', id);
            socket.on('participantUpdate', (data) => { if (data.eventId === id) fetchDetails(); });
            socket.on('eventStatusUpdate', (data) => { if (data.eventId === id) setEventData(prev => ({ ...prev, isActive: data.isActive })); });
        }
        return () => { if (socket) { socket.off('participantUpdate'); socket.off('eventStatusUpdate'); } }
    }, [id, socket]);

    const handleJoin = async () => { await api.post(`/events/${id}/join`); fetchDetails(); };
    const handleLeave = async () => { await api.post(`/events/${id}/leave`); fetchDetails(); };

    if (!eventData) return <div className="container">Loading...</div>;

    const { event, mutuals, others, isActive } = eventData;
    const isJoined = event.participants.some(p => p._id === user._id);

    return (
        <div className="container">
            <div className="card" style={{ borderLeft: isActive ? '10px solid #10b981' : '10px solid #64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '3.5rem' }}>{event.title}</h1>
                    {isActive && <span className="badge badge-green" style={{ fontSize: '1.2rem', padding: '10px 20px' }}>LIVE NOW</span>}
                </div>
                <p style={{ marginTop: '10px', fontSize: '1.3rem' }}>
                    {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                </p>
                <p style={{ fontSize: '1.3rem' }}>📍 {event.location}</p>

                <div style={{ marginTop: '30px' }}>
                    {isActive ? (
                        isJoined ? (
                            <button onClick={handleLeave} className="btn btn-danger">Leave Event</button>
                        ) : (
                            <button onClick={handleJoin} className="btn btn-success">Join Event</button>
                        )
                    ) : (
                        <button disabled className="btn btn-secondary" style={{ opacity: 0.7 }}>Not Active Yet</button>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3>Mutual Connections ({mutuals.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {mutuals.map(m => (
                            <div
                                key={m._id}
                                onClick={() => handleProfileClick(m._id)}
                                style={{
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid #6366f1',
                                    padding: '15px 20px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div className="avatar" style={{ width: '40px', height: '40px' }}>{m.username[0]}</div>
                                <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{m.username}</span>
                            </div>
                        ))}
                        {mutuals.length === 0 && <p style={{ opacity: 0.6 }}>No mutual connections present.</p>}
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3>Other Participants ({others.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {others.map(m => (
                            <div
                                key={m._id}
                                onClick={() => handleProfileClick(m._id)}
                                style={{
                                    background: '#334155',
                                    padding: '15px 20px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#475569';
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#334155';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div className="avatar" style={{ width: '40px', height: '40px', background: '#64748b', borderColor: '#94a3b8' }}>{m.username[0]}</div>
                                <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{m.username}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;

import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Events = () => {
    const [events, setEvents] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleJoin = async (eventId) => {
        try {
            await api.post(`/events/${eventId}/join`);
            fetchEvents(); // Refresh the events list
        } catch (err) {
            console.error('Error joining event:', err);
        }
    };

    const handleLeave = async (eventId) => {
        try {
            await api.post(`/events/${eventId}/leave`);
            fetchEvents(); // Refresh the events list
        } catch (err) {
            console.error('Error leaving event:', err);
        }
    };

    // Separate events into active and upcoming
    const activeEvents = events.filter(event => event.isActive);
    const upcomingEvents = events.filter(event => !event.isActive);

    return (
        <div className="container">
            <h2>Events</h2>

            {/* Active Events Section */}
            <div style={{ marginBottom: '50px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                    <h3 style={{ margin: 0, fontSize: '2rem' }}>🔴 Active Events</h3>
                    {activeEvents.length > 0 && (
                        <span className="badge badge-green" style={{
                            fontSize: '1rem',
                            padding: '8px 16px',
                            animation: 'pulse 2s infinite'
                        }}>
                            {activeEvents.length} LIVE NOW
                        </span>
                    )}
                </div>

                {activeEvents.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                        {activeEvents.map(event => (
                            <div
                                key={event._id}
                                className="card"
                                style={{
                                    borderLeft: '8px solid #10b981',
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                                    transform: 'scale(1.02)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                                    <h3 style={{ margin: 0 }}>{event.title}</h3>
                                    <span className="badge badge-green" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
                                        LIVE
                                    </span>
                                </div>
                                <p><strong>Time:</strong> {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleTimeString()}</p>
                                <p><strong>Location:</strong> {event.location || 'TBD'}</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                                    👥 {event.participants.length} Participants
                                </p>
                                <Link to={`/events/${event._id}`} className="btn btn-success">Join Now</Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
                        <p style={{ fontSize: '1.2rem', margin: 0 }}>No active events at the moment. Check back soon!</p>
                    </div>
                )}
            </div>

            {/* Upcoming Events Section */}
            <div>
                <h3 style={{ marginBottom: '25px', fontSize: '2rem' }}>📅 Upcoming Events</h3>
                {upcomingEvents.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {upcomingEvents.map(event => {
                            const isJoined = event.participants.some(p => p._id === user._id);
                            return (
                                <div key={event._id} className="card" style={{ borderLeft: '5px solid #64748b' }}>
                                    <h3>{event.title}</h3>
                                    <p><strong>Time:</strong> {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleTimeString()}</p>
                                    <p><strong>Location:</strong> {event.location || 'TBD'}</p>
                                    <p>👥 {event.participants.length} Participants</p>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {isJoined ? (
                                            <button
                                                onClick={() => handleLeave(event._id)}
                                                className="btn btn-danger"
                                                style={{ flex: '1', minWidth: '120px' }}
                                            >
                                                Leave Event
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleJoin(event._id)}
                                                className="btn btn-success"
                                                style={{ flex: '1', minWidth: '120px' }}
                                            >
                                                Join Event
                                            </button>
                                        )}
                                        <Link
                                            to={`/events/${event._id}`}
                                            className="btn btn-primary"
                                            style={{ flex: '1', minWidth: '120px', textAlign: 'center' }}
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
                        <p style={{ fontSize: '1.2rem', margin: 0 }}>No upcoming events scheduled.</p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div >
    );
};

export default Events;

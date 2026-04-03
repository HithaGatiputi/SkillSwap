import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchRequests = async () => {
        const res = await api.get('/requests/mine');
        setRequests(res.data);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatus = async (id, status) => {
        try {
            await api.post(`/requests/${id}/status`, { status });
            fetchRequests();
        } catch (e) {
            alert('Error: ' + (e.response?.data?.message || e.message));
        }
    };

    return (
        <div className="container">
            <h2>Skill Requests</h2>

            {requests.map(req => {
                const isProvider = req.provider._id === user._id;
                const isRequester = req.requester._id === user._id;

                return (
                    <div key={req._id} className="card" style={{ borderLeft: `5px solid ${getColor(req.status)}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <h4>{req.skill}</h4>
                                <p>From: {req.requester.username} | To: {req.provider.username}</p>
                                <p>Status: <strong>{req.status}</strong></p>
                            </div>
                            <div>
                                {req.status === 'PENDING' && isProvider && (
                                    <>
                                        <button onClick={() => handleStatus(req._id, 'ACCEPTED')} className="btn btn-success" style={{ marginRight: '5px' }}>Accept</button>
                                        <button onClick={() => handleStatus(req._id, 'REJECTED')} className="btn btn-danger">Reject</button>
                                    </>
                                )}
                                {(req.status === 'ACCEPTED') && isProvider && (
                                    <button onClick={() => handleStatus(req._id, 'COMPLETED')} className="btn btn-primary">Mark Complete</button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const getColor = (status) => {
    switch (status) {
        case 'PENDING': return 'orange';
        case 'ACCEPTED': return 'blue';
        case 'COMPLETED': return 'green';
        case 'REJECTED': return 'red';
        default: return 'gray';
    }
}

export default Requests;

import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, login } = useContext(AuthContext); // 'login' just to refresh if needed, but not typical.
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Tabs: 'skills' | 'followers' | 'following'
    const [activeTab, setActiveTab] = useState('skills');

    // Logic to view self or other
    const targetId = id || (currentUser ? currentUser._id : null);
    const isSelf = currentUser && targetId === currentUser._id;

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/users/${targetId}`);
            setProfile(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (targetId) fetchProfile();
    }, [targetId]);

    const handleFollow = async () => {
        if (!profile) return;
        try {
            await api.post(`/users/follow/${profile._id}`);
            fetchProfile(); // refresh to show "Unfollow" or update follower count
        } catch (e) { alert(e.message); }
    };

    const handleUnfollow = async () => {
        if (!profile) return;
        try {
            await api.post(`/users/unfollow/${profile._id}`);
            fetchProfile();
        } catch (e) { alert(e.message); }
    };

    if (loading) return <div className="container">Loading Profile...</div>;
    if (!profile) return <div className="container">User not found</div>;

    const isFollowing = profile.followers.some(f => f._id === currentUser?._id);

    return (
        <div className="container">
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div className="avatar" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                    {profile.username[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                    <h1>{profile.username}</h1>
                    <p>{profile.email}</p>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div className="badge badge-blue">Karma: {profile.karmaPoints}</div>
                        <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('followers')}><strong>{profile.followers.length}</strong> Followers</div>
                        <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('following')}><strong>{profile.following.length}</strong> Following</div>
                    </div>
                </div>

                {!isSelf && (
                    <div>
                        {isFollowing ? (
                            <button onClick={handleUnfollow} className="btn btn-secondary">Unfollow</button>
                        ) : (
                            <button onClick={handleFollow} className="btn btn-primary">Follow</button>
                        )}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <button className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-secondary'}`} style={{ marginRight: '10px' }} onClick={() => setActiveTab('skills')}>Skills</button>
                <button className={`btn ${activeTab === 'followers' ? 'btn-primary' : 'btn-secondary'}`} style={{ marginRight: '10px' }} onClick={() => setActiveTab('followers')}>Followers</button>
                <button className={`btn ${activeTab === 'following' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('following')}>Following</button>
            </div>

            {/* Content */}
            <div className="animate-fade">
                {activeTab === 'skills' && (
                    <div className="grid">
                        <div className="card">
                            <h3>Skills Offered</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {profile.skillsOffered.length ? profile.skillsOffered.map(s => <span key={s} className="badge badge-green">{s}</span>) : <p>None listed.</p>}
                            </div>
                        </div>
                        <div className="card">
                            <h3>Skills Wanted</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {profile.skillsWanted.length ? profile.skillsWanted.map(s => <span key={s} className="badge badge-blue">{s}</span>) : <p>None listed.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'followers' && (
                    <div className="grid">
                        {profile.followers.map(u => (
                            <Link to={`/profile/${u._id}`} key={u._id} style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="avatar">{u.username[0].toUpperCase()}</div>
                                    <div>
                                        <h4>{u.username}</h4>
                                        <span className="badge">Karma: {u.karmaPoints}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {profile.followers.length === 0 && <p>No followers yet.</p>}
                    </div>
                )}

                {activeTab === 'following' && (
                    <div className="grid">
                        {profile.following.map(u => (
                            <Link to={`/profile/${u._id}`} key={u._id} style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="avatar">{u.username[0].toUpperCase()}</div>
                                    <div>
                                        <h4>{u.username}</h4>
                                        <span className="badge">Karma: {u.karmaPoints}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {profile.following.length === 0 && <p>Not following anyone.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

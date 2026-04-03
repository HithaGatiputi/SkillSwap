import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const DSVisualizer = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/ds/visualize')
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="container" style={{ fontSize: '2rem' }}>Loading Data Structures...</div>;
    if (!data) return <div className="container">No Data Found</div>;

    const { graph, trie, heap, sets, hashTables } = data;

    // Helper for Trie rendering (Recursive) - Horizontal
    const renderTrie = (node) => {
        if (!node) return null;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '20px' }}>
                <span style={{
                    background: node.isWord ? '#10b981' : '#334155',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    marginBottom: '10px',
                    border: '1px solid #475569',
                    boxShadow: node.isWord ? '0 0 10px rgba(16,185,129,0.5)' : 'none',
                    minWidth: '40px',
                    textAlign: 'center'
                }}>
                    {node.name === 'root' ? 'RT' : node.name}
                </span>
                <div style={{ display: 'flex', gap: '5px' }}>
                    {node.children && node.children.map((child, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '1px', height: '10px', background: '#64748b', marginBottom: '5px' }}></div>
                            {renderTrie(child)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container" style={{ maxWidth: '100%', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>🧠 System Data Visualization</h1>
            <p style={{ textAlign: 'center', marginBottom: '40px', fontSize: '1.4rem' }}>Visualizing the Engine under the Hood</p>

            {/* Horizontal Sections Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                {/* 1. Sets */}
                <div className="card" style={{ borderLeft: '8px solid #f472b6', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2>1. Sets (Active Groups)</h2>
                        <span className="badge badge-blue">Unique Collections</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', paddingBottom: '10px' }}>
                        {sets.length > 0 ? sets.map((s, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '20px',
                                borderRadius: '15px',
                                minWidth: '300px',
                                border: '1px solid #475569'
                            }}>
                                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', color: '#f472b6' }}>{s.name}</h3>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {s.items.map((p, j) => (
                                        <span key={j} style={{ background: '#db2777', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold' }}>{p}</span>
                                    ))}
                                    {s.items.length === 0 && <span style={{ opacity: 0.5 }}>Empty</span>}
                                </div>
                            </div>
                        )) : <p>No events active.</p>}
                    </div>
                </div>

                {/* 2. Priority Queue */}
                <div className="card" style={{ borderLeft: '8px solid #facc15', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2>2. Priority Queue (Max Heap)</h2>
                        <span className="badge badge-green">Karma Ranking</span>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', paddingBottom: '10px' }}>
                        {heap.map((item, idx) => (
                            <div key={idx} style={{
                                background: idx === 0 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : '#1e293b',
                                color: idx === 0 ? 'black' : 'white',
                                padding: '15px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                minWidth: '140px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                flexShrink: 0
                            }}>
                                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '5px' }}>Rank #{idx + 1}</div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.username}</div>
                                <div style={{ fontSize: '1.2rem' }}>★ {item.karma}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Graph */}
                <div className="card" style={{ borderLeft: '8px solid #818cf8', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2>3. Social Graph</h2>
                        <span className="badge badge-blue">Adjacency List</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', paddingBottom: '10px' }}>
                        {graph.nodes.slice(0, 30).map(node => {
                            const connections = graph.links.filter(l => l.source === node.id).map(l => l.target);
                            return (
                                <div key={node.id} style={{
                                    background: '#1e293b',
                                    padding: '15px',
                                    borderRadius: '15px',
                                    border: '1px solid #475569',
                                    minWidth: '280px',
                                    flexShrink: 0
                                }}>
                                    <div style={{ fontSize: '1.3rem', color: '#a5b4fc', fontWeight: 'bold', marginBottom: '8px' }}>
                                        {node.id}
                                    </div>
                                    <div style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: '1.4' }}>
                                        <span style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Follows:</span>
                                        {connections.length ? connections.join(', ') : 'None'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 4. Hash Tables */}
                <div className="card" style={{ borderLeft: '8px solid #ec4899', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2>4. Hash Table (Profiles)</h2>
                        <span className="badge badge-green">Key-Value Map</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', paddingBottom: '10px' }}>
                        {hashTables.users.map((item) => (
                            <div key={item.index} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                background: '#1e293b',
                                padding: '15px',
                                borderRadius: '15px',
                                border: '1px solid #475569',
                                minWidth: '180px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: '#ec4899',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                    fontSize: '1.2rem'
                                }}>
                                    {item.index}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                                    {item.bucket.map((entry, j) => (
                                        <div key={j} style={{
                                            background: '#334155',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            fontSize: '0.9rem'
                                        }}>
                                            <div style={{ fontWeight: 'bold', color: '#fbcfe8', marginBottom: '2px' }}>{entry.key}</div>
                                            <div>{entry.value.karma} KP</div>
                                        </div>
                                    ))}
                                    {item.bucket.length === 0 && <span style={{ opacity: 0.3, textAlign: 'center' }}>- Empty -</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Trie */}
                <div className="card" style={{ borderLeft: '8px solid #10b981', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2>5. Trie (Skills)</h2>
                        <span className="badge badge-blue">Prefix Tree</span>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        padding: '20px',
                        borderRadius: '15px',
                        display: 'inline-block',
                        minWidth: '100%'
                    }}>
                        {renderTrie(trie)}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DSVisualizer;

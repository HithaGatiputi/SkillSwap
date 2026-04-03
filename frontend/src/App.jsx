import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Search from './pages/Search';
import Recommendations from './pages/Recommendations';
import Requests from './pages/Requests';
import Profile from './pages/Profile';
import DSVisualizer from './pages/DSVisualizer'; // new
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<Home />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/:id" element={<EventDetails />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/recommendations" element={<Recommendations />} />
                        <Route path="/requests" element={<Requests />} />

                        {/* View Own Profile */}
                        <Route path="/profile" element={<Profile />} />
                        {/* View Others Profile */}
                        <Route path="/profile/:id" element={<Profile />} />

                        <Route path="/ds-visualize" element={<DSVisualizer />} />
                    </Route>
                </Routes>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;

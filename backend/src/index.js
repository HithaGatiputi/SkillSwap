require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const globalState = require('./services/GlobalState');
const User = require('./models/User');
const Event = require('./models/Event');
const startEventScheduler = require('./services/eventScheduler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const eventRoutes = require('./routes/eventRoutes');
const requestRoutes = require('./routes/requestRoutes');
const dsRoutes = require('./routes/dsRoutes');

const app = express();
const server = http.createServer(app);

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ds', dsRoutes);

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.set('io', io);

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('joinEventRoom', (eventId) => {
        socket.join(eventId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Server Startup Logic
const startServer = async () => {
    await connectDB();

    console.log('Loading data into Global State...');

    const users = await User.find({});
    users.forEach(user => {
        globalState.getGraph().addUser(user._id);
        user.following.forEach(f => globalState.getGraph().follow(user._id, f));

        if (user.skillsOffered) {
            user.skillsOffered.forEach(s => globalState.getTrie().insert(s));
        }

        globalState.getQueue().insert({
            userId: user._id,
            karma: user.karmaPoints,
            skills: user.skillsOffered
        });

        // Populate Hash Table
        globalState.getUserHashTable().set(user.username, {
            email: user.email,
            karma: user.karmaPoints
        });
    });

    const activeEvents = await Event.find({ isActive: true });
    activeEvents.forEach(e => {
        const participantSet = new Set(e.participants.map(p => p.toString()));
        globalState.getActiveEvents().set(e._id.toString(), participantSet);
    });

    // Populate Event Hash Table
    const allEvents = await Event.find({});
    allEvents.forEach(e => {
        globalState.getEventHashTable().set(e.title, {
            location: e.location,
            active: e.isActive
        });
    });

    console.log('Global State Hydrated.');

    startEventScheduler(io);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

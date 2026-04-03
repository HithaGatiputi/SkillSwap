const Event = require('../models/Event');
const globalState = require('../services/GlobalState');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('participants', 'username');
        // Augment with active status from memory for absolute truth, although DB has it too
        // We trust DB for persistent display, memory for logic
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('participants', 'username');
        if (!event) return res.status(404).json({ message: "Event not found" });

        let mutuals = [];
        let others = [];
        const participants = event.participants;

        if (req.headers.authorization) {
            // Slight hack: if token exists, we might be hitting this publicly or protected. 
            // If controller usage depends on `protect` middleware, `req.user` is set.
            // If public route, we check middleware manually or split logic.
            // For now, assume this is used in contexts where if auth'd, req.user exists.
        }

        // Check if req.user exists (from optional auth or protect)
        if (req.user) {
            const currentId = req.user._id.toString();
            const graph = globalState.getGraph();

            participants.forEach(p => {
                const pId = p._id.toString();
                if (pId === currentId) return; // Skip current user

                // Mutual: I follow them AND they follow me
                // Using SocialGraph data structure for O(1) lookup
                const iFollowThem = graph.isFollowing(currentId, pId);
                const theyFollowMe = graph.isFollowing(pId, currentId);

                if (iFollowThem && theyFollowMe) {
                    mutuals.push(p);
                } else {
                    others.push(p);
                }
            });

        } else {
            others = participants;
        }

        res.json({
            event,
            mutuals,
            others,
            isActive: event.isActive
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEvent = async (req, res) => {
    const { title, startTime, endTime, location } = req.body;
    try {
        const event = await Event.create({
            title,
            startTime,
            endTime,
            location,
            participants: [req.user._id]
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const joinEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (!event.participants.includes(req.user._id)) {
            event.participants.push(req.user._id);
            await event.save();

            // If active, update in-memory
            if (globalState.getActiveEvents().has(event._id.toString())) {
                globalState.getActiveEvents().get(event._id.toString()).add(req.user._id.toString());
                // Emit Socket update
                const io = req.app.get('io');
                io.to(event._id.toString()).emit('participantUpdate', { eventId: event._id, userId: req.user._id, action: 'join' });
            }
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const leaveEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.participants = event.participants.filter(id => id.toString() !== req.user._id.toString());
        await event.save();

        if (globalState.getActiveEvents().has(event._id.toString())) {
            globalState.getActiveEvents().get(event._id.toString()).delete(req.user._id.toString());
            // Emit Socket update
            const io = req.app.get('io');
            io.to(event._id.toString()).emit('participantUpdate', { eventId: event._id, userId: req.user._id, action: 'leave' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEvents, getEventById, createEvent, joinEvent, leaveEvent };

const Event = require('../models/Event');
const globalState = require('../services/GlobalState');

const startEventScheduler = (io) => {
    setInterval(async () => {
        const now = new Date();

        // Find events that should be active but aren't
        const eventsToStart = await Event.find({
            startTime: { $lte: now },
            endTime: { $gt: now },
            isActive: false
        });

        for (const event of eventsToStart) {
            event.isActive = true;
            await event.save();

            // Init in-memory set
            const participantSet = new Set(event.participants.map(p => p.toString()));
            globalState.getActiveEvents().set(event._id.toString(), participantSet);

            io.emit('eventStatusUpdate', { eventId: event._id, isActive: true });
            console.log(`Event activated: ${event.title}`);
        }

        // Find events that are active but should be closed
        const eventsToEnd = await Event.find({
            endTime: { $lte: now },
            isActive: true
        });

        for (const event of eventsToEnd) {
            event.isActive = false;
            await event.save();

            globalState.getActiveEvents().delete(event._id.toString());

            io.emit('eventStatusUpdate', { eventId: event._id, isActive: false });
            console.log(`Event ended: ${event.title}`);
        }
    }, 5000); // Check every 5 seconds
};

module.exports = startEventScheduler;

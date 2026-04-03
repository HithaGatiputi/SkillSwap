const express = require('express');
const { getEvents, getEventById, createEvent, joinEvent, leaveEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getEvents);
router.get('/:id', protect, getEventById); // Protected to calculate mutuals properly
router.post('/', protect, createEvent);
router.post('/:id/join', protect, joinEvent);
router.post('/:id/leave', protect, leaveEvent);

module.exports = router;

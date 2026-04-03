const express = require('express');
const { createRequest, getMyRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createRequest);
router.get('/mine', protect, getMyRequests);
router.post('/:id/status', protect, updateRequestStatus); // Generic status update

module.exports = router;

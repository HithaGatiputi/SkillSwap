const express = require('express');
const { getVisualizationData } = require('../controllers/dsController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/visualize', protect, getVisualizationData);

module.exports = router;

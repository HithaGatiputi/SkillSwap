const express = require('express');
const { getMe, getUserById, followUser, unfollowUser, getRecommendations } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/me', protect, getMe);
router.get('/recommendations', protect, getRecommendations);
router.get('/:id', getUserById); // Public
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);

module.exports = router;

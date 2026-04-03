const User = require('../models/User');
const globalState = require('../services/GlobalState');

const getMe = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
};

const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password')
        .populate('followers', 'username karmaPoints')
        .populate('following', 'username karmaPoints');

    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
};

const followUser = async (req, res) => {
    const targetId = req.params.id;
    const currentId = req.user._id;

    if (targetId === currentId.toString()) return res.status(400).json({ message: "Cannot follow yourself" });

    try {
        const targetUser = await User.findById(targetId);
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        if (!req.user.following.includes(targetId)) {
            req.user.following.push(targetId);
            targetUser.followers.push(currentId);

            await req.user.save();
            await targetUser.save();

            globalState.getGraph().follow(currentId, targetId);
        }

        res.json({ message: 'Followed user' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unfollowUser = async (req, res) => {
    const targetId = req.params.id;
    const currentId = req.user._id;

    try {
        const targetUser = await User.findById(targetId);
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        req.user.following = req.user.following.filter(id => id.toString() !== targetId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentId.toString());

        await req.user.save();
        await targetUser.save();

        globalState.getGraph().unfollow(currentId, targetId);

        res.json({ message: 'Unfollowed user' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecommendations = async (req, res) => {
    const currentId = req.user._id;
    try {
        // 1. Try Graph-based Recommendations (BFS)
        const recs = globalState.getGraph().getRecommendations(currentId, 15);

        let validRecs = [];
        const seenIds = new Set(); // To avoid dupes if mixing strategies

        // Hydrate Graph Recs
        if (recs.length > 0) {
            const recDetails = await Promise.all(recs.map(async r => {
                const user = await User.findById(r.userId).select('username skillsOffered karmaPoints');
                if (user) seenIds.add(user._id.toString());
                return { user, distance: r.distance };
            }));
            validRecs = recDetails.filter(r => r.user);
        }

        // 2. Cold Start Strategy (If Graph returns few/no results)
        if (validRecs.length < 5) {
            // Exclude self and already followed
            const me = await User.findById(currentId); // Re-fetch to be safe on 'following' array
            const excludeIds = [...me.following, me._id];

            // Find Top Karma Users we don't follow
            const topUsers = await User.find({ _id: { $nin: excludeIds } })
                .sort({ karmaPoints: -1 })
                .limit(10);

            topUsers.forEach(u => {
                if (!seenIds.has(u._id.toString())) {
                    validRecs.push({ user: u, distance: 0 }); // Distance 0 or -1 to indicate 'Popularity' vs 'Graph'
                    seenIds.add(u._id.toString());
                }
            });
        }

        // Sort logic
        validRecs.sort((a, b) => {
            // Prefer Graph (Distance > 0) over Cold Start (Distance 0)? Or actually Cold Start is "Far"?
            // Let's treat valid distances:
            // If both have distance > 0, compare distance.
            // If one is distance 0 (Cold Start), put it AFTER graph recs? Or Mix by Karma?
            // User Requirement: "Based off karma points" if deg separation is same.

            const distA = a.distance || 999;
            const distB = b.distance || 999;

            if (distA !== distB) return distA - distB;
            return b.user.karmaPoints - a.user.karmaPoints;
        });

        res.json(validRecs.slice(0, 20));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMe, getUserById, followUser, unfollowUser, getRecommendations };

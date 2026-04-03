const SkillRequest = require('../models/SkillRequest');
const User = require('../models/User');
const globalState = require('../services/GlobalState');

const createRequest = async (req, res) => {
    const { providerId, skill } = req.body;
    const requesterId = req.user._id.toString();

    // Custom Blocking Logic
    const blockKey = `${providerId}:${requesterId}:${skill}`;
    const blockedUntil = globalState.getBlockedRequests().get(blockKey);

    if (blockedUntil && blockedUntil > Date.now()) {
        return res.status(429).json({ message: "You are temporarily blocked from requesting this skill from this provider." });
    }

    try {
        const request = await SkillRequest.create({
            requester: requesterId,
            provider: providerId,
            skill
        });
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyRequests = async (req, res) => {
    try {
        const requests = await SkillRequest.find({
            $or: [{ requester: req.user._id }, { provider: req.user._id }]
        }).populate('requester', 'username').populate('provider', 'username').sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRequestStatus = async (req, res) => {
    const { status } = req.body; // ACCEPTED, REJECTED, COMPLETED
    const { id } = req.params;

    try {
        const request = await SkillRequest.findById(id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        // Authorization checks
        if (status === 'ACCEPTED' || status === 'REJECTED') {
            if (request.provider.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Only provider can accept/reject" });
            }
        }

        if (status === 'COMPLETED') {
            // Either can mark complete? Let's say provider for now to claim karma
            // Or requester to confirm. Let's stick to Provider for simplicity, or Requester. 
            // User request says "On completion: provider.karmaPoints += 10". 
            // Usually requester confirms completion if provider did the job?
            // Let's allow Provider to mark complete for now (self-report) or Requester checks.
            // Let's say Requester marks complete to verify service? 
            // Actually, user req says "Only provider can accept/reject", doesn't specify completion.
            // Let's assume Provider marks it done.
            if (request.provider.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Only provider can complete" });
            }
        }

        request.status = status;
        await request.save();

        if (status === 'COMPLETED') {
            const provider = await User.findById(request.provider);
            provider.karmaPoints += 10;
            await provider.save();

            // Update Priority Queue
            globalState.getQueue().update(provider._id, provider.karmaPoints);
        }
        else if (status === 'REJECTED') {
            // BLOCKING LOGIC
            const blockKey = `${request.provider}:${request.requester}:${request.skill}`;
            // Block for 10 mins
            globalState.getBlockedRequests().set(blockKey, Date.now() + 10 * 60 * 1000);
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createRequest, getMyRequests, updateRequestStatus };

const globalState = require('../services/GlobalState');
const User = require('../models/User');

const autocompleteSkills = (req, res) => {
    const { prefix } = req.query;
    const suggestions = globalState.getTrie().search(prefix);
    res.json(suggestions);
};

const searchProviders = async (req, res) => {
    const { skill } = req.query;
    if (!skill) return res.status(400).json({ message: "Skill required" });

    try {
        // Get all from PQ sorted by karma
        const allProviders = globalState.getQueue().getAllSorted();

        // Filter by skill match
        const matches = allProviders.filter(p =>
            p.skills && p.skills.some(s => s.toLowerCase() === skill.toLowerCase())
        );

        // Hydrate data
        const populated = await Promise.all(matches.map(async p => {
            const user = await User.findById(p.userId).select('username email karmaPoints skillsOffered');
            return user;
        }));

        res.json(populated.filter(u => u));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { autocompleteSkills, searchProviders };

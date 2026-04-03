const globalState = require('../services/GlobalState');
const User = require('../models/User'); // Need User model to resolve names
const Event = require('../models/Event');
const PriorityQueue = require('../ds/PriorityQueue'); // We'll instantiate a temporary one for personalized view

const getVisualizationData = async (req, res) => {
    try {
        const currentUserId = req.user._id.toString();
        const globalGraph = globalState.getGraph();
        const globalTrie = globalState.getTrie();
        const globalHeap = globalState.getQueue();
        const activeEvents = globalState.getActiveEvents();
        const hashTables = {
            users: globalState.getUserHashTable().getAll(),
            events: globalState.getEventHashTable().getAll()
        };

        // --- Helpers to resolve Names ---
        const users = await User.find({}).select('username _id');
        const userMap = new Map();
        users.forEach(u => userMap.set(u._id.toString(), u.username));

        const events = await Event.find({}).select('title _id');
        const eventMap = new Map();
        events.forEach(e => eventMap.set(e._id.toString(), e.title));


        // 1. Personalized Graph (Ego Network: Depth 2 BFS from Me)
        // We manually traverse to build a subgraph
        const egoNodes = new Set();
        const egoLinks = [];
        const queue = [{ id: currentUserId, depth: 0 }];
        const visited = new Set([currentUserId]);

        egoNodes.add(currentUserId);

        while (queue.length > 0) {
            const { id, depth } = queue.shift();
            if (depth >= 2) continue; // Limit depth

            const neighbors = globalGraph.adjacencyList.get(id) || [];
            neighbors.forEach(neighborId => {
                // Add Node
                if (!egoNodes.has(neighborId)) {
                    egoNodes.add(neighborId);
                    // Only push to queue if we want to explore THEIR neighbors (depth < 1)
                    if (depth < 1 && !visited.has(neighborId)) {
                        visited.add(neighborId);
                        queue.push({ id: neighborId, depth: depth + 1 });
                    }
                }
                // Add Link
                egoLinks.push({ source: id, target: neighborId });
            });
        }

        // Serialize Ego Graph
        const nodes = Array.from(egoNodes).map(id => ({
            id: userMap.get(id) || id.substring(0, 6),
            isMe: id === currentUserId
        }));

        // Resolve link names
        const links = egoLinks.map(l => ({
            source: userMap.get(l.source) || l.source.substring(0, 6),
            target: userMap.get(l.target) || l.target.substring(0, 6)
        }));


        // 2. Personalized Priority Queue (Recommendation Heap)
        // We'll create a new Heap of "Recommended Users" based on Karma
        // This makes the PQ "according to the user" -> Who should I connect with?
        // We'll calculate recommendations (same logic as userController roughly) or just pick randoms for variety if graph is small
        const friendRecs = globalGraph.getRecommendations(currentUserId, 50);
        // If empty (Cold Start), pull top Global Users
        let potentialMatches = [];

        if (friendRecs.length > 0) {
            potentialMatches = friendRecs.map(r => ({ userId: r.userId, karma: 0 })); // We need to fetch Karma... expensive to fetch specifically?
            // Let's just use the Global Heap to look them up if efficient? No.
            // Let's just re-query DB for these users.
            const recUsers = await User.find({ _id: { $in: friendRecs.map(r => r.userId) } }).select('username karmaPoints skillsOffered');
            potentialMatches = recUsers;
        } else {
            // Cold Start PQ: Top Users I don't follow
            const me = await User.findById(currentUserId);
            const alreadyFollowing = new Set(me.following.map(id => id.toString()));
            alreadyFollowing.add(currentUserId);

            const topUsers = await User.find({ _id: { $nin: Array.from(alreadyFollowing) } })
                .sort('-karmaPoints')
                .limit(10)
                .select('username karmaPoints skillsOffered');
            potentialMatches = topUsers;
        }

        // Build the Heap
        const personalQueue = new PriorityQueue();
        potentialMatches.forEach(u => {
            personalQueue.insert({
                username: u.username, // Store name directly for easier Viz
                userId: u._id,
                karma: u.karmaPoints,
                skills: u.skillsOffered
            });
        });

        // Sort the heap by karma in descending order and assign ranks
        const sortedHeap = personalQueue.heap
            .slice() // Create a copy to avoid mutating the original heap
            .sort((a, b) => b.karma - a.karma); // Sort by karma descending

        const heapView = sortedHeap.map((item, index) => ({
            rank: index + 1, // Rank 1 = highest karma
            username: item.username,
            karma: item.karma,
            skills: item.skills
        }));


        // 3. Personalized Sets (My Active Events)
        // Active events where ME or MY FRIENDS are participating
        const myFriends = new Set(globalGraph.adjacencyList.get(currentUserId) || []);
        const relevantSets = [];

        for (const [eventId, participantSet] of activeEvents.entries()) {
            const hasMe = participantSet.has(currentUserId);
            const friendCount = Array.from(participantSet).filter(id => myFriends.has(id)).length;

            if (hasMe || friendCount > 0 || participantSet.size > 0) { // For Demo show all non-empty? Or just relevant?
                // User asked "according to user".
                // Let's show All Active Events but tag them "My Event" or "Friends Here"
                const eventName = eventMap.get(eventId) || 'Unknown';
                const participants = Array.from(participantSet).map(id => userMap.get(id) || 'Unknown');

                relevantSets.push({
                    name: eventName,
                    items: participants,
                    labels: hasMe ? ['I am here'] : (friendCount > 0 ? [`${friendCount} Friends`] : ['Global'])
                });
            }
        }

        // 4. Trie - Filter skills? No, Trie is global dictionary.
        const buildTrieView = (node, char = 'root') => {
            const children = Object.keys(node.children).map(k => buildTrieView(node.children[k], k));
            return { name: char, children: children.length ? children : undefined, isWord: node.isEndOfWord };
        };
        const trieView = buildTrieView(globalTrie.root);

        res.json({
            graph: { nodes, links },
            trie: trieView,
            heap: heapView, // Personalized
            sets: relevantSets, // Personalized/Annotated
            hashTables // Global (as Profile lookup is generic)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getVisualizationData };

const Queue = require('./Queue');

// Directed Graph
class SocialGraph {
    constructor() {
        // Map<userId, Set<followedId>>
        this.adjacencyList = new Map();
    }

    addUser(userId) {
        if (!this.adjacencyList.has(userId.toString())) {
            this.adjacencyList.set(userId.toString(), new Set());
        }
    }

    follow(followerId, followeeId) {
        const follower = followerId.toString();
        const followee = followeeId.toString();

        this.addUser(follower);
        this.addUser(followee);

        this.adjacencyList.get(follower).add(followee);
    }

    unfollow(followerId, followeeId) {
        const follower = followerId.toString();
        const followee = followeeId.toString();

        if (this.adjacencyList.has(follower)) {
            this.adjacencyList.get(follower).delete(followee);
        }
    }

    // Check if A follows B
    isFollowing(userA, userB) {
        const a = userA.toString();
        const b = userB.toString();
        if (!this.adjacencyList.has(a)) return false;
        return this.adjacencyList.get(a).has(b);
    }

    // BFS to find friend recommendations (shortest path)
    // Recommends users closest to the startUser that represent "friends of friends"
    getRecommendations(startId, limit = 5) {
        const start = startId.toString();
        if (!this.adjacencyList.has(start)) return [];

        const visited = new Set();
        const queue = new Queue();
        const recommendations = [];

        visited.add(start);
        // Queue stores { id, distance }
        queue.enqueue({ id: start, dist: 0 });


        const directFollows = this.adjacencyList.get(start);

        while (!queue.isEmpty()) {
            const { id, dist } = queue.dequeue();

            if (id !== start && !directFollows.has(id)) {

                recommendations.push({ userId: id, distance: dist });
            }

            if (recommendations.length >= limit) break;

            const neighbors = this.adjacencyList.get(id);
            if (neighbors) {
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.enqueue({ id: neighbor, dist: dist + 1 });
                    }
                }
            }
        }

        return recommendations;
    }
}

module.exports = SocialGraph;

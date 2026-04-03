const SocialGraph = require('../ds/SocialGraph');
const Trie = require('../ds/Trie');
const PriorityQueue = require('../ds/PriorityQueue');
const HashTable = require('../ds/HashTable');

// Singleton Global State for In-Memory Data Structures
class GlobalState {
    constructor() {
        if (!GlobalState.instance) {
            this.socialGraph = new SocialGraph();
            this.skillTrie = new Trie();
            this.providerQueue = new PriorityQueue();

            // Explicit Hash Tables for Profiles and Events
            this.userHashTable = new HashTable(17); // Small size to show collisions for demo
            this.eventHashTable = new HashTable(7);

            // Map<eventId, Set<participantId>>
            this.activeEvents = new Map();

            // Blocked requests cache
            this.blockedRequests = new Map();

            GlobalState.instance = this;
        }
        return GlobalState.instance;
    }

    getGraph() { return this.socialGraph; }
    getTrie() { return this.skillTrie; }
    getQueue() { return this.providerQueue; }
    getUserHashTable() { return this.userHashTable; }
    getEventHashTable() { return this.eventHashTable; }
    getActiveEvents() { return this.activeEvents; }
    getBlockedRequests() { return this.blockedRequests; }
}

const instance = new GlobalState();
Object.freeze(instance);

module.exports = instance;

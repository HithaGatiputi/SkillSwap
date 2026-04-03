// Max Heap Implementation for Provider Ranking based on Karma
class PriorityQueue {
    constructor() {
        // Array of { userId, karma, skills: [] }
        this.heap = [];
        // Map for quick updates: userId -> heapIndex
        this.indexMap = new Map();
    }

    getParentIndex(i) { return Math.floor((i - 1) / 2); }
    getLeftChildIndex(i) { return 2 * i + 1; }
    getRightChildIndex(i) { return 2 * i + 2; }

    swap(i, j) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;

        // Update index map
        this.indexMap.set(this.heap[i].userId.toString(), i);
        this.indexMap.set(this.heap[j].userId.toString(), j);
    }

    insert(userObj) {
        // userObj: { userId, karma, skills }
        // If user already exists, update instead
        if (this.indexMap.has(userObj.userId.toString())) {
            this.update(userObj.userId, userObj.karma, userObj.skills);
            return;
        }

        this.heap.push(userObj);
        this.indexMap.set(userObj.userId.toString(), this.heap.length - 1);
        this.heapifyUp(this.heap.length - 1);
    }

    update(userId, newKarma, newSkills) {
        const idx = this.indexMap.get(userId.toString());
        if (idx === undefined) return;

        const oldKarma = this.heap[idx].karma;
        this.heap[idx].karma = newKarma;
        if (newSkills) this.heap[idx].skills = newSkills;

        if (newKarma > oldKarma) {
            this.heapifyUp(idx);
        } else {
            this.heapifyDown(idx);
        }
    }

    heapifyUp(index) {
        let currentIndex = index;
        while (
            currentIndex > 0 &&
            this.heap[currentIndex].karma > this.heap[this.getParentIndex(currentIndex)].karma
        ) {
            this.swap(currentIndex, this.getParentIndex(currentIndex));
            currentIndex = this.getParentIndex(currentIndex);
        }
    }

    heapifyDown(index) {
        let currentIndex = index;
        while (this.getLeftChildIndex(currentIndex) < this.heap.length) {
            let largestChildIndex = this.getLeftChildIndex(currentIndex);
            if (
                this.getRightChildIndex(currentIndex) < this.heap.length &&
                this.heap[this.getRightChildIndex(currentIndex)].karma > this.heap[largestChildIndex].karma
            ) {
                largestChildIndex = this.getRightChildIndex(currentIndex);
            }

            if (this.heap[currentIndex].karma < this.heap[largestChildIndex].karma) {
                this.swap(currentIndex, largestChildIndex);
                currentIndex = largestChildIndex;
            } else {
                break;
            }
        }
    }

    getAllSorted() {
        // Returns copy sorted by karma desc
        return [...this.heap].sort((a, b) => b.karma - a.karma);
    }
}

module.exports = PriorityQueue;

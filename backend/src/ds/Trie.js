class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    // Insert a word into the Trie
    insert(word) {
        if (!word) return;
        let current = this.root;
        const lowerWord = word.toLowerCase();

        for (let i = 0; i < lowerWord.length; i++) {
            const char = lowerWord[i];
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }
        this.isEndOfWord = true;
        current.isEndOfWord = true;
        current.originalWord = word;
    }

    // Search for words with the given prefix
    search(prefix) {
        if (!prefix) return [];
        let current = this.root;
        const lowerPrefix = prefix.toLowerCase();

        for (let i = 0; i < lowerPrefix.length; i++) {
            const char = lowerPrefix[i];
            if (!current.children[char]) {
                return [];
            }
            current = current.children[char];
        }
        return this._findAllWords(current, lowerPrefix);
    }

    _findAllWords(node, prefix) {
        let words = [];
        if (node.isEndOfWord) {
            words.push(node.originalWord || prefix);
        }

        for (let char in node.children) {
            words = words.concat(this._findAllWords(node.children[char], prefix + char));
        }
        return words;
    }
}

module.exports = Trie;

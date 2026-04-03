const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');
const SkillRequest = require('../models/SkillRequest');
const connectDB = require('../config/db');

dotenv.config();

const usersList = [
    'Alice', 'Bob', 'Charlie', 'Dave', 'Eve',
    'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy',
    'Kevin', 'Linda', 'Mike', 'Nancy', 'Oscar'
];

const skillsPool = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Django',
    'Java', 'Spring', 'Go', 'Rust', 'C++',
    'SQL', 'MongoDB', 'Design', 'Figma', 'AWS',
    'Docker', 'Kubernetes', 'Cybersecurity', 'Swift', 'Flutter'
];

const getRandomSubarray = (arr, size) => {
    const shuffled = arr.slice(0);
    let i = arr.length;
    let temp, index;
    while (i--) {
        index = Math.floor(Math.random() * (i + 1));
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
};

const seedData = async () => {
    await connectDB();

    console.log('Clearing old data...');
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        // Drop collections to ensure clean slate including indexes
        // await collection.drop(); // optional, but deleteMany is safer for keeping index definitions if defined in code
        // But for unique indexes sometimes drop is better. Let's stick to deleteMany.
    }
    await User.deleteMany({});
    await Event.deleteMany({});
    await SkillRequest.deleteMany({});

    console.log('Creating users...');
    const userDocs = [];
    const createdUsers = [];

    // Create users individually to ensure hashing middleware runs 100%
    for (const name of usersList) {
        const skillsOffered = getRandomSubarray(skillsPool, Math.floor(Math.random() * 3) + 2);
        const skillsWanted = getRandomSubarray(skillsPool, Math.floor(Math.random() * 3) + 1);

        const user = new User({
            username: name,
            email: `${name.toLowerCase()}@example.com`,
            password: 'password123', // Will be hashed
            skillsOffered,
            skillsWanted,
            karmaPoints: Math.floor(Math.random() * 200)
        });

        const savedUser = await user.save();
        createdUsers.push(savedUser);
    }

    const userMap = new Map();
    createdUsers.forEach(u => userMap.set(u.username, u));

    console.log('Building social graph...');
    for (const user of createdUsers) {
        // Each user follows 3-6 random other users
        const others = createdUsers.filter(u => u._id.toString() !== user._id.toString());
        const follows = getRandomSubarray(others, Math.floor(Math.random() * 4) + 3);

        // We must push strings or ObjectIds. 
        // Using string for consistency if needed, but ObjectId is standard.
        user.following.push(...follows.map(f => f._id));
        await user.save();

        // Update followers
        for (const followedUser of follows) {
            // Re-fetch to avoid version error or stale data? 
            // Better to just push to in-memory object if we haven't essentially modified it yet in this loop?
            // Actually, we are iterating `createdUsers`. 'followedUser' is a reference object from that array.
            // But we already called `user.save()`. 
            // To be safe against VersionError (parallel saves), let's just update `followers` on the object reference 
            // and save them all at the end? No, that's messy.
            // Let's just use updateOne to be safe.
            await User.updateOne({ _id: followedUser._id }, { $push: { followers: user._id } });
        }
    }

    // Mutuals Logic - Force some mutuals
    const shortcuts = [
        ['Alice', 'Bob'],
        ['Alice', 'Charlie'],
        ['Bob', 'Charlie']
    ];

    for (const [nameA, nameB] of shortcuts) {
        const uA = userMap.get(nameA);
        const uB = userMap.get(nameB);

        // Check DB state or assume from above? 
        // Force update via updateOne to avoid race/stale state
        await User.updateOne({ _id: uA._id }, { $addToSet: { following: uB._id, followers: uB._id } });
        await User.updateOne({ _id: uB._id }, { $addToSet: { following: uA._id, followers: uA._id } });
    }

    console.log('Creating events...');

    // Create events for Feb 9, 10, and 11, 2026
    // Active events for Feb 9 (today)
    const feb9 = new Date('2026-02-09T00:00:00+05:30');
    const feb10 = new Date('2026-02-10T00:00:00+05:30');
    const feb11 = new Date('2026-02-11T00:00:00+05:30');

    const now = new Date();
    const oneHour = 3600000;

    await Event.create([
        // Active Event 1 - Feb 9 (happening now)
        {
            title: 'Full Stack Summit',
            startTime: new Date(now.getTime() - oneHour / 2), // Started 30 min ago
            endTime: new Date(now.getTime() + oneHour * 2), // Ends in 2 hours
            location: 'Main Hall',
            participants: [
                userMap.get('Alice')._id,
                userMap.get('Bob')._id,
                userMap.get('Charlie')._id,
                userMap.get('Dave')._id,
                userMap.get('Eve')._id
            ],
            isActive: true
        },
        // Active Event 2 - Feb 9 (happening now)
        {
            title: 'AI & ML Workshop',
            startTime: new Date(now.getTime() - oneHour * 0.5), // Started 30 min ago
            endTime: new Date(now.getTime() + oneHour * 1.5), // Ends in 1.5 hours
            location: 'Room 404',
            participants: [
                userMap.get('Alice')._id,
                userMap.get('Frank')._id,
                userMap.get('Grace')._id,
                userMap.get('Bob')._id,
                userMap.get('Ivan')._id
            ],
            isActive: true
        },
        // Upcoming Event 1 - Feb 9 (later today)
        {
            title: 'React Advanced Patterns',
            startTime: new Date(now.getTime() + oneHour * 3), // Starts in 3 hours
            endTime: new Date(now.getTime() + oneHour * 5), // Ends in 5 hours
            location: 'Conference Room A',
            participants: [
                userMap.get('Alice')._id,
                userMap.get('Mike')._id,
                userMap.get('Nancy')._id,
                userMap.get('Charlie')._id
            ],
            isActive: false
        },
        // Upcoming Event 2 - Feb 10
        {
            title: 'Database Optimization Workshop',
            startTime: new Date(feb10.getTime() + 10 * oneHour), // Feb 10, 10 AM
            endTime: new Date(feb10.getTime() + 13 * oneHour), // Feb 10, 1 PM
            location: 'Tech Lab',
            participants: [
                userMap.get('Oscar')._id,
                userMap.get('Dave')._id,
                userMap.get('Alice')._id,
                userMap.get('Bob')._id
            ],
            isActive: false
        },
        // Upcoming Event 3 - Feb 10
        {
            title: 'DevOps Best Practices',
            startTime: new Date(feb10.getTime() + 15 * oneHour), // Feb 10, 3 PM
            endTime: new Date(feb10.getTime() + 17 * oneHour), // Feb 10, 5 PM
            location: 'Tech Hub',
            participants: [
                userMap.get('Bob')._id,
                userMap.get('Heidi')._id,
                userMap.get('Frank')._id,
                userMap.get('Charlie')._id
            ],
            isActive: false
        },
        // Upcoming Event 4 - Feb 11
        {
            title: 'Cloud Architecture Masterclass',
            startTime: new Date(feb11.getTime() + 9 * oneHour), // Feb 11, 9 AM
            endTime: new Date(feb11.getTime() + 12 * oneHour), // Feb 11, 12 PM
            location: 'Innovation Center',
            participants: [
                userMap.get('Alice')._id,
                userMap.get('Grace')._id,
                userMap.get('Kevin')._id,
                userMap.get('Linda')._id
            ],
            isActive: false
        },
        // Upcoming Event 5 - Feb 11
        {
            title: 'UI/UX Design Sprint',
            startTime: new Date(feb11.getTime() + 14 * oneHour), // Feb 11, 2 PM
            endTime: new Date(feb11.getTime() + 17 * oneHour), // Feb 11, 5 PM
            location: 'Design Studio',
            participants: [
                userMap.get('Judy')._id,
                userMap.get('Mike')._id,
                userMap.get('Nancy')._id,
                userMap.get('Oscar')._id
            ],
            isActive: false
        }
    ]);

    console.log('------------------------------------------------');
    console.log('SEEDING COMPLETE');
    console.log('------------------------------------------------');
    console.log('Log in with any of these users (Password: password123):');
    console.log('------------------------------------------------');
    createdUsers.forEach(u => {
        console.log(`Email: ${u.email.padEnd(25)} | Username: ${u.username}`);
    });
    console.log('------------------------------------------------');

    process.exit();
};

seedData();

const User = require('../models/user');
const sessions = new Map(); // In-memory session store

function setUser(sessionId, userId) {
    sessions.set(sessionId, userId);
}

async function getUser(sessionId) {
    const userId = sessions.get(sessionId);
    if (!userId) return null;
    return await User.findById(userId);
}

module.exports = { setUser, getUser };
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require('../service/Auth');

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    await User.create({
        name,
        email,
        password
    });
    return res.render('home');
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
        return res.render('login', {
            error: "Invalid username or password"
        });
    }
    const sessionId = uuidv4();
    setUser(sessionId, user._id); // Store the user's ObjectId in the session
    res.cookie("uid", sessionId);
    return res.redirect("/");
}

module.exports = { handleUserSignup, handleUserLogin };
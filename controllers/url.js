const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    // Dynamically import nanoid
    const { nanoid } = await import('nanoid');

    const body = req.body;
    if (!body.url) {
        return res.status(404).json({ Error: 'URL is required' });
    }

    // Check if the redirectURL already exists
    const existingURL = await URL.findOne({ redirectURL: body.url });
    if (existingURL) {
        return res.status(409).json({ Error: 'URL already exists', id: existingURL.shortID });
    }

    const shortID = nanoid(8);
    await URL.create({
        shortID: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id
    });

    console.log('Short URL created:', shortID); // Log the created short URL
    return res.render("home", { id: shortID });
}

async function handleAnalytics(req, res) {
    const shortId = req.params.shortID;
    const result = await URL.findOne({ shortId });
    return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory });
}

module.exports = { handleGenerateNewShortURL, handleAnalytics };
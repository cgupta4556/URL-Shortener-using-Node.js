const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    shortID: {
        type: String,
        required: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        required: true,
        unique: true
    },
    visitHistory: [{
        timestamp: {
            type: Number
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
}, { timestamps: true });

const URL = mongoose.model('URL', UrlSchema);

module.exports = URL;
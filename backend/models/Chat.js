const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prompt: String,
    response: String,
    createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);

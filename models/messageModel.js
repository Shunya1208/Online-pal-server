const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: String,
    name: String,
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model("messages", messageSchema);

module.exports = Message;
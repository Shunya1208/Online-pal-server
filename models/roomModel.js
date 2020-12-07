const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    participants:[ 
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
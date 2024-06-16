import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }],
    lastMessage: {
        type: String,
        default: null
    }
}, { timestamps: true });

const ChatModel = mongoose.model('Chat', chatSchema);

export default ChatModel;
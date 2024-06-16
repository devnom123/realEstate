import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    message: {
        type: String,
        default: null
    }
}, { timestamps: true });

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
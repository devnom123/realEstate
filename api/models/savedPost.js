import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, { timestamps: true });

const SavedPostModel = mongoose.model("SavedPost", savedPostSchema);

export default SavedPostModel;

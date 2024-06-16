import mongoose from "mongoose";

import constants from '../helpers/constants.js';

const { utilities, pet } = constants;

const postDetailSchema = new mongoose.Schema({
    description: {
        type: String,
        default: null
    },
    utilities: {
        type: Number,
        enum: Object.values(utilities),
        default: null
    },
    pet: {
        type: Number,
        enum: Object.values(pet),
        default: null
    },
    income: {
        type: Number,
        default: 0
    },
    size: {
        type: Number,
        default: 0
    },
    school: {
        type: Number,
        default: 0
    },
    bus: {
        type: Number,
        default: 0
    },
    restaurant: {
        type: Number,
        default: 0
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null
    }
}, { timestamps: true });

const PostModel = mongoose.model("PostDetail", postDetailSchema);

export default PostModel;

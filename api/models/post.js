import mongoose from "mongoose";

import constants from '../helpers/constants.js';

const { postType, property } = constants;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    images: [{
        type: String,
        default: null
    }],
    bathroom: {
        type: Number,
        default: 0
    },
    bedroom: {
        type: Number,
        default: 0
    },
    address: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0.0, 0.0]
        }
    },
    type: {
        type: Number,
        enum: Object.values(postType),
        default: null
    },
    property: {
        type: Number,
        enum: Object.values(property),
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, { timestamps: true });

postSchema.index({ location: "2dsphere" });

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;

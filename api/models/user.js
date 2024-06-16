import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: null
    },
    savedPost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SavedPost",
        default: null
    }],
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        default: null
    }]
}, { timestamps: true });

userSchema.methods.generateToken = function () {
    const user = this;
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: 24*60*60*30 });
    user.token = token;
    return user.save().then(() =>  {
        return user;
    });
}

userSchema.statics.refreshToken = function (user){
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 24*60*60*30});
    user.token = token;
    return user.save().then(() => user);
}

userSchema.statics.findByToken = function (token) {
    let user = this;
    const auth = jwt.verify(token, process.env.JWT_SECRET);
    return user.findOne({ _id: auth.id, token });
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
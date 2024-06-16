import user from '../models/user.js';
import { body, validationResult, param } from 'express-validator';
import bcrypt from 'bcrypt';
import PostModel from '../models/post.js';
import ChatModel from '../models/chat.js';

class ChatController {
    async getChats(req, res) {
        const tokenId = req.userId
        try {
            const chats = await ChatModel.find({
                $or: [{
                    users: {
                        $in: [tokenId]
                    }
                }]
            });
            let chatList = [];
            for (let chat of chats) {
                let receiverId = chat.users.find(user => user != tokenId);
                let receiver = await user.findById(receiverId).select('username avatar');
                chat = chat.toObject();
                chat.receiver = receiver;
                chatList.push(chat);
            }
            res.status(200).json(chatList);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    validateGetChat() {
        return [
            param('id')
                .notEmpty()
                .withMessage('Chat ID is required')
                .isMongoId()
                .withMessage('Chat ID is not valid')
        ]
    }

    async getChat(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            console.log("userId", req.userId)
            const chatDetail = await ChatModel.findById(req.params.id).populate('messages');
            if (!chatDetail) {
                return res.status(404).json({ message: 'Chat not found' });
            }
            await ChatModel.findByIdAndUpdate(req.params.id, { $addToSet: { seenBy: req.userId }});
            return res.status(200).json(chatDetail);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    async addChat(req, res) {
        const tokenId = req.userId
        const { receiverId, messages } = req.body;
        try {
            const chat = new ChatModel({ 
                users: [tokenId, receiverId],
             });
            await chat.save();
            res.status(201).json(chat);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async readChat(req, res) {
        try {
            const chat = await ChatModel.findById(req.params.id);
            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }
            chat.seenBy = [...chat.seenBy, req.userId];
            await chat.save();
            res.status(200).json(chat);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new ChatController();
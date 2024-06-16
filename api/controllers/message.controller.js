import user from '../models/user.js';
import { body, validationResult, param } from 'express-validator';
import ChatModel from '../models/chat.js';
import MessageModel from '../models/message.js';

class MessageController {

    async addMessage(req, res) {
        const tokenId = req.userId
        const chatId = req.params.chatId;
        let text = req.body.text;
        try {
            console.log(chatId, tokenId, text);
            const chat = await ChatModel.findById(chatId);
            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }
            if (!chat.users.includes(tokenId)) {
                return res.status(401).json({ message: 'You are not a part of this chat' });
            }
            const message = new MessageModel({ chat: chatId, user: tokenId, message: text });
            await message.save();
            await ChatModel.findByIdAndUpdate(chatId, { lastMessage: text, messages: [...chat.messages, message._id] });
            res.status(200).json(message);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

export default new MessageController();
import express from 'express';

import ChatController from '../controllers/chat.controller.js';
import {verifyToken} from '../middleware/verifyToken.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', ChatController.getChats);
router.get('/:id', ChatController.getChat);
router.post('/',  ChatController.addChat);
router.put('/read/:id', ChatController.readChat);

export default router;
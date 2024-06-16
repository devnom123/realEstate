import express from 'express';

import MessageController from '../controllers/message.controller.js';
import {verifyToken} from '../middleware/verifyToken.js';

const router = express.Router();

router.use(verifyToken);
router.post('/:chatId', MessageController.addMessage);

export default router;
import express from 'express';
import TestController from '../controllers/test.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', TestController.test)
router.get('/shouldBeLoggedIn',verifyToken, TestController.shouldBeLoggedIn)

export default router;
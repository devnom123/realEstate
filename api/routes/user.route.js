import express from 'express';

import UserController from '../controllers/user.controller.js';
import {verifyToken} from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', UserController.getUsers);
router.get("/posts", verifyToken, UserController.getPosts);
router.get('/:id', verifyToken, UserController.getUser);
router.put('/:id', verifyToken,  UserController.updateUser);
router.delete('/:id', verifyToken, UserController.deleteUser);
router.post("/savePost", verifyToken, UserController.savePost);

export default router;
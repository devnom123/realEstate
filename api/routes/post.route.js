import express from 'express';

import postController from '../controllers/post.controller.js';

import {verifyToken} from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', postController.validateGetPosts(), postController.getAllPosts);
router.get('/:id', postController.validateGetPost(), postController.getPost);

router.use(verifyToken);
router.post('/', postController.validateCreatePost(), postController.createPost);
router.put('/:id', postController.validateUpdatePost(), postController.updatePost);
router.delete('/:id', postController.validateDeletePost(), postController.deletePost);

export default router;
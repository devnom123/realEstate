import user from '../models/user.js';
import SavedPostModel from '../models/savedPost.js';
import { body, validationResult, param } from 'express-validator';
import bcrypt from 'bcrypt';
import PostModel from '../models/post.js';

class UserController {

    async getUsers(req, res) {
        try {
            const users = await user.find({});
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    validateGetUser() {
        return [
            param('id')
                .notEmpty()
                .withMessage('User ID is required')
                .isMongoId()
                .withMessage('User ID is not valid')
        ]
    }

    async getUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const userDetail = await user.findById(req.params.id);
            if (!userDetail) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(userDetail);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    validateUpdateUser() {
        return [
            body('username')
                .notEmpty()
                .withMessage('Username is required')
                .isString()
                .withMessage('Username must be a string'),
            body('email')
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Email is not valid'),
            param('id')
                .notEmpty()
                .withMessage('User ID is required')
                .isMongoId()
                .withMessage('User ID is not valid')
        ]
    }

    async updateUser(req, res) {
        const session = req.dbSession;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let tokenId = req.userId;
            let userId = req.params.id;
            if (tokenId.toString() !== userId.toString()) {
                return res.status(401).json({ message: 'You are not authorized to update this user' });
            }

            const userDetail = await user.findById(req.params.id);

            if (!userDetail) {
                return res.status(404).json({ message: 'User not found' });
            }
            const { username, email, avatar, password } = req.body;
            if (!username || !email) {
                return res.status(400).json({ message: 'Please enter all fields' });
            }
            let checkUser = await user.findOne({ email, _id: { $ne: req.params.id } });
            if (checkUser) {
                return res.status(400).json({ message: 'Email is already in use' });
            }

            let hashedPassword = userDetail.password;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }
            if (avatar) {
                userDetail.avatar = avatar;
            }
            userDetail.username = username;
            userDetail.email = email;
            userDetail.password = hashedPassword;
            await userDetail.save({ session: session });
            return res.status(200).json({ message: 'User updated successfully', user: userDetail });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    validateDeleteUser() {
        return [
            param('id')
                .notEmpty()
                .withMessage('User ID is required')
                .isMongoId()
                .withMessage('User ID is not valid')
        ]
    }

    async deleteUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let tokenId = req.userId;
            let userId = req.params.id;
            if (tokenId.toString() !== userId.toString()) {
                return res.status(401).json({ message: 'You are not authorized to update this user' });
            }
            const user = await user.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async savePost(req, res) {
        try {
            const { postId } = req.body;
            const userId = req.userId;
            const userDetail = await user.findById(userId);
            if (!userDetail) {
                return res.status(404).json({ message: 'User not found' });
            }
            let findSavedPost = await SavedPostModel.findOne({ post: postId, user: userId });
            if (findSavedPost) {
                await SavedPostModel.findByIdAndDelete(findSavedPost._id);
                return res.status(200).json({ message: 'Post unsaved successfully' });
            }
            else {
                const savedPost = new SavedPostModel({ post: postId, user: userId });
                await savedPost.save();
                userDetail.savedPost.push(savedPost._id);
                await userDetail.save();
                return res.status(200).json({ message: 'Post saved successfully' });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getPosts(req, res) {
        try {
            const userId = req.userId;
            console.log(userId);
            const userPosts = await PostModel.find({ user: userId });
            const saved = await SavedPostModel.find({ user: userId }).populate('post');
            const savedPost = saved.map((post) => post.post);
            return res.status(200).json({ userPosts, savedPost });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

}

export default new UserController();
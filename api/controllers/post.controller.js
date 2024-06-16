import PostModel from '../models/post.js';
import PostDetailModel from '../models/postDetails.js';
import SavedPostModel from '../models/savedPost.js';

import { body, param, validationResult } from 'express-validator';

import constants from '../helpers/constants.js';

const { postType, property } = constants;

import APIResponse from '../helpers/apiResponse.js';

class PostController {

    validateGetPosts() {
        return [
            body('city').optional().isString().withMessage('Invalid city'),
            body('type').optional().isNumeric().isIn(Object.values(postType)).withMessage('Invalid type'),
            body('property').optional().isNumeric().isIn(Object.values(property)).withMessage('Invalid property'),
            body('bedroom').optional().isNumeric().withMessage('Invalid bedroom'),
            body('bathroom').optional().isNumeric().withMessage('Invalid bathroom'),
            body('minPrice').optional().isNumeric().withMessage('Invalid minPrice'),
            body('maxPrice').optional().isNumeric().withMessage('Invalid maxPrice')
        ]
    }
    getAllPosts = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return APIResponse.sendValidationError(res, errors.array());
        }
        try {
            const {
                city, type, property, bedroom, bathroom, minPrice, maxPrice
            } = req.query;

            let find = {
                ...(city && { city }),
                ...(type && { type }),
                ...(property && { property }),
                ...(bedroom && { bedroom }),
                ...(bathroom && { bathroom }),
                ...(minPrice && { price: { $gte: minPrice } }),
                ...(maxPrice && { price: { $lte: maxPrice } })
            };
            console.log(JSON.stringify(find))
            const posts = await PostModel.find(find);
            return APIResponse.sendSuccess(res, posts);
        } catch (error) {
            return APIResponse.sendInternalServerError(res, error.message);
        }
    }

    validateGetPost() {
        return [
            param('id').exists().isMongoId().withMessage('Invalid ID')
        ]
    }

    getPost = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return APIResponse.sendValidationError(res, errors.array());
        }
        try {
            let post = await PostModel.findById(req.params.id).populate({
                path: 'user',
                select: 'username avatar'
            });
            if (!post) {
                return APIResponse.sendValidationError(res, 'Post not found');
            }
            post = post.toObject();
            let postDetail = await PostDetailModel.findOne({ postId: post._id });
            post.postData = postDetail;
            const savedPost = await SavedPostModel.findOne({ 
                user: req.userId,
                post: req.params.id
            });
            post.isSaved = savedPost ? true : false;
            return APIResponse.sendSuccess(res, post);
        } catch (error) {
            return APIResponse.sendInternalServerError(res, error.message);
        }
    }

    validateCreatePost() {
        return [
            body('title').exists().isString().withMessage('Invalid title'),
            body('price').exists().isNumeric().withMessage('Invalid price'),
            // body('img').exists().isString().withMessage('Invalid img'),
            body('bathroom').exists().isNumeric().withMessage('Invalid bathroom'),
            body('bedroom').exists().isNumeric().withMessage('Invalid bedroom'),
            body('address').exists().isString().withMessage('Invalid address'),
            body('city').exists().isString().withMessage('Invalid city'),
            body('latitude').exists().toFloat(),
            body('longitude').exists().toFloat(),
            // .isLength({ min: 2, max: 2 })
            // .withMessage('Invalid coordinates').custom(value => {
            // if (!value.every(v => typeof v === 'number')) {
            //     throw new Error('Invalid coordinates');
            // }
            // return true;
            // }),
            body('type').exists().isNumeric().isIn(Object.values(postType)).withMessage('Invalid type'),
            body('property').exists().isNumeric().isIn(Object.values(property)).withMessage('Invalid property')
        ]
    }

    createPost = async (req, res) => {
        const session = req.dbSession;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return APIResponse.sendValidationError(res, errors.array());
        }
        try {
            const { postData, ...body } = req.body;
            body.location = { type: 'Point', coordinates: [body.latitude, body.longitude] };
            body.user = req.userId;
            let post = new PostModel(body);
            await post.save({ session: session });
            if (postData) {
                postData.postId = post._id;
                const postDetail = new PostDetailModel(postData);
                await postDetail.save({ session: session });
                post = post.toObject();
                post.postData = postDetail;
            }
            else {
                post = post.toObject();
                post.postData = null;
            }
            return APIResponse.sendSuccess(res, post, 'Post created');
        } catch (error) {
            return APIResponse.sendInternalServerError(res, error.message);
        }
    }

    validateUpdatePost() {
        return [
            param('id').exists().isMongoId().withMessage('Invalid ID'),
            body('title').optional().isString().withMessage('Invalid title'),
            body('price').optional().isNumeric().withMessage('Invalid price'),
            body('img').optional().isString().withMessage('Invalid img'),
            body('bathroom').optional().isNumeric().withMessage('Invalid bathroom'),
            body('bedroom').optional().isNumeric().withMessage('Invalid bedroom'),
            body('address').optional().isString().withMessage('Invalid address'),
            body('city').optional().isString().withMessage('Invalid city'),
            body('latitude').optional().isLatLong().withMessage('Invalid latitude').toFloat(),
            body('longitude').optional().isLatLong().withMessage('Invalid longitude').toFloat(),
            body('type').optional().isNumeric().isIn(Object.values(postType)).withMessage('Invalid type'),
            body('property').optional().isNumeric().isIn(Object.values(property)).withMessage('Invalid property')
        ]
    }

    updatePost = async (req, res) => {
        const session = req.dbSession;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return APIResponse.sendValidationError(res, errors.array());
            }
            const { postData, ...body } = req.body;
            if (body.latitude && body.longitude) {
                body.location = { type: 'Point', coordinates: [body.latitude, body.longitude] };
            }
            let post = await PostModel.findByIdAndUpdate(req.params.id, body, { new: true }).session(session);
            if (!post) {
                return APIResponse.sendValidationError(res, 'Post not found');
            }
            post = post.toObject();
            let postDetail = await PostDetailModel.findOne({ postId: post._id });
            if (postData) {
                if (postDetail) {
                    postDetail = await PostDetailModel.findByIdAndUpdate(postDetail._id, postData, { new: true }).session(session);
                } else {
                    postData.postId = post._id;
                    postDetail = new PostDetailModel(postData);
                    await postDetail.save({ session: session });
                }
                post.postData = postDetail;
            }
            else {
                post.postData = postDetail;
            }
            return APIResponse.sendSuccess(res, post, 'Post updated');
        } catch (error) {
            return APIResponse.sendInternalServerError(res, error.message);
        }
    }

    validateDeletePost() {
        return [
            param('id').exists().isMongoId().withMessage('Invalid ID')
        ]
    }

    deletePost = async (req, res) => {
        const session = req.dbSession;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return APIResponse.sendValidationError(res, errors.array());
            }
            const post = await PostModel.findByIdAndDelete(req.params.id).session(session);
            if (!post) {
                return APIResponse.sendValidationError(res, 'Post not found');
            }
            await PostDetailModel.findOneAndDelete({ postId: post._id }).session(session);
            return APIResponse.sendSuccess(res, null, 'Post deleted');
        } catch (error) {
            return APIResponse.sendInternalServerError(res, error.message);
        }
    }


}

export default new PostController();
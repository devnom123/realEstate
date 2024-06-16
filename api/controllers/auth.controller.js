import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import UserModel from '../models/user.js';
import { body,validationResult } from "express-validator"
import jwt from 'jsonwebtoken';

class AuthController {

    validateRegister = () => {
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
                .withMessage('Email is not valid')
                .custom(async (email) => {
                    const user = await UserModel.findOne({ email });
                    if (user) {
                        throw new Error('Email is already in use');
                    }
                }),
            body('password')
                .notEmpty()
                .withMessage('Password is required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters long')
        ]
    }

    register = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const session = req.dbSession;
        try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await (await new UserModel({ username, email, password: hashedPassword }).save({
                session: session
            })).generateToken();
            return res.status(200).json({ message: 'User registered successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    validateLogin = () => {
        return [
            body('email')
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Email is not valid'),
            body('password')
                .notEmpty()
                .withMessage('Password is required')
        ]
    }

    login = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Please enter all fields' });
            }
            let user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            try {
                await UserModel.findByToken(user.token);
            } catch (error) {
                if(error.message === 'jwt expired'){
                    user = await UserModel.refreshToken(user);
                }
            }
            const { password: userPassword, ...userData } = user._doc;

            console.log(userData.token);

            return res.status(200).json({ message: 'User logged in successfully', user: userData });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

}

export default new AuthController();
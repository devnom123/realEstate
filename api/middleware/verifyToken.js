import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'You are not logged in' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: 'You are not logged in' });
        }
        req.userId = user.id;
        next();
    });
}
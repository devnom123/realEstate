import express from 'express';
import cookieParser from 'cookie-parser';
import AuthRoute from './routes/auth.route.js';
import TestRoute from './routes/test.route.js';
import UserRoute from './routes/user.route.js';
import PostRoute from './routes/post.route.js';
import ChatRoute from './routes/chat.route.js';
import MessageRoute from './routes/message.route.js';

import qs from 'qs';

import cors from 'cors';
import morgan from 'morgan';

// import db
import connectDB from './config/db.config.js';
connectDB();
import dbTransaction from './middleware/dbTransaction.js';

const app = express();

app.use(morgan('dev'));

app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(dbTransaction);


// Middleware to parse query strings using qs
app.use((req, res, next) => {
    try {
        req.query = qs.parse(req._parsedUrl.query, {
            decoder: function (str, defaultDecoder, charset, type) {
                if (str === 'null' || str === 'undefined') {
                    return null;
                }
                if (!isNaN(str) && str.trim() !== '') {
                    return Number(str);
                }
                return defaultDecoder(str, defaultDecoder, charset, type);
            }
        });
    } catch (error) {
        return res.status(400).json({ status:'error', error: 'Invalid query parameters' });
    }
    next();
});

app.use('/auth', AuthRoute);
app.use('/test', TestRoute)
app.use('/user', UserRoute);
app.use("/post", PostRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

app.listen(8080, () => {
    console.log('Server is running on 8080')
})
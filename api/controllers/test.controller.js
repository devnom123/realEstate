import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';


class TestController {
    async test(req, res) {
        res.json({ message: 'Hello World' });
    }

    async shouldBeLoggedIn(req, res) {
        console.log(req.userId);
        return res.status(200).json({ message: 'You are logged in' });
    }

    async shouldBeAdmin(req, res) {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ message: 'You are not logged in' });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'You are not logged in' });
            }
            if (!user.isAdmin) {
                return res.status(401).json({ message: 'You are not an admin' });
            }
            return res.status(200).json({ message: 'You are an admin' });
        });
    }


}

export default new TestController();
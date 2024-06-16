import mongoose from "mongoose";

const dbTransaction = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log('Transaction started');
    try {
        req.dbSession = session;
        res.on('finish', async () => {
            if (res.statusCode >= 400) {
                await session.abortTransaction();
                console.log('Transaction aborted');
            } else {
                await session.commitTransaction();
                console.log('Transaction committed');
            }
        });
        next();
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default dbTransaction;
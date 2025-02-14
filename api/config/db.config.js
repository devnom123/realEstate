import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed');
        process.exit(1);
    }
}

export default connectDB;
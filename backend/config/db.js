import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer = null;

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    // Try real MongoDB first if URI is set
    if (uri) {
        try {
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 3000, // fail fast if no local MongoDB
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (err) {
            console.warn(`Real MongoDB unavailable (${err.message}). Falling back to in-memory MongoDB...`);
        }
    }

    // Fallback: in-memory MongoDB (works without any installation)
    try {
        mongoServer = await MongoMemoryServer.create();
        const memUri = mongoServer.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`In-memory MongoDB started: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Failed to start in-memory MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;

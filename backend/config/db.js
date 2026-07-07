import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const buildMongoUri = () => {
    if (process.env.MONGO_URI) {
        return process.env.MONGO_URI;
    }

    const user = process.env.MONGO_USER;
    const password = process.env.MONGO_PASSWORD;
    const cluster = process.env.MONGO_CLUSTER;
    const db = process.env.MONGO_DB || 'trendy';

    if (!user || !password || !cluster) {
        return null;
    }

    const encodedUser = encodeURIComponent(user);
    const encodedPassword = encodeURIComponent(password);

    return `mongodb+srv://${encodedUser}:${encodedPassword}@${cluster}/${db}?retryWrites=true&w=majority`;
};

const connectInMemory = async () => {
    console.log('Starting in-memory MongoDB server...');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected (in-memory): ${conn.connection.host}`);
};

const connectDB = async () => {
    const uri = buildMongoUri();
    const allowFallback = process.env.MONGO_FALLBACK !== 'false'
        && process.env.NODE_ENV !== 'production';

    if (!uri) {
        await connectInMemory();
        return;
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);

        if (allowFallback && /auth|authentication/i.test(error.message)) {
            console.warn(
                'Atlas authentication failed. Check MONGO_USER / MONGO_PASSWORD in .env, ' +
                'or reset the database user password in MongoDB Atlas.'
            );
            console.warn('Falling back to in-memory MongoDB for local development.');
            await connectInMemory();
            return;
        }

        process.exit(1);
    }
};

export default connectDB;

import mongoose from 'mongoose';

const signalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    source: {
        type: String, // e.g., 'Reddit', 'GitHub', 'HackerNews'
        required: true,
    },
    url: String,
    engagement: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Signal = mongoose.model('Signal', signalSchema);
export default Signal;

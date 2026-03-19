import mongoose from 'mongoose';

const trendSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: 'Technology',
    },
    explanation: String,
    score: {
        type: Number,
        default: 0,
    },
    sources: [String],
    signals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Signal'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Trend = mongoose.model('Trend', trendSchema);
export default Trend;

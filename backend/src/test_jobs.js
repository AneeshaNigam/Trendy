import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { collectRedditSignals } from './services/redditCollector.js';
import { collectGithubSignals } from './services/githubCollector.js';
import { collectHNSignals } from './services/hnCollector.js';
import { analyzeAndClusterTrends } from './services/trendAnalyzer.js';
import mongoose from 'mongoose';
import Trend from './models/Trend.js';
import Signal from './models/Signal.js';

dotenv.config();

const run = async () => {
    try {
        await connectDB();
        console.log('--- DB Connected ---');
        await collectRedditSignals();
        console.log('--- Reddit Done ---');
        await collectGithubSignals();
        console.log('--- Github Done ---');
        await collectHNSignals();
        console.log('--- HN Done ---');
        
        const signals = await Signal.find();
        console.log('Total Signals:', signals.length);
        
        await analyzeAndClusterTrends();
        console.log('--- Analysis Done ---');
        
        const trends = await Trend.find();
        console.log('Trends count:', trends.length);
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (e) {
        console.error('Test error:', e);
        process.exit(1);
    }
};

run();

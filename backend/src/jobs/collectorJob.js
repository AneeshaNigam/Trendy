import cron from 'node-cron';
import { collectRedditSignals } from '../services/redditCollector.js';
import { collectGithubSignals } from '../services/githubCollector.js';
import { collectHNSignals } from '../services/hnCollector.js';
import { analyzeAndClusterTrends } from '../services/trendAnalyzer.js';

// Setup background jobs to run every 6 hours
// '0 */6 * * *'
export const startJobs = () => {
    console.log('Initializing background jobs...');
    
    const runCollectionAndAnalysis = async () => {
        console.log(`[${new Date().toISOString()}] Running data collection...`);
        try {
            await collectRedditSignals();
            await collectGithubSignals();
            await collectHNSignals();
            
            console.log(`[${new Date().toISOString()}] Data collection complete. Starting trend analysis...`);
            await analyzeAndClusterTrends();
            
            console.log(`[${new Date().toISOString()}] Trend analysis complete.`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in scheduled job:`, error.message);
        }
    };

    cron.schedule('0 */6 * * *', runCollectionAndAnalysis);

    console.log('Background jobs scheduled (every 6 hours). Running initial cycle now...');
    runCollectionAndAnalysis();
};

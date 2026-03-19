import cron from 'node-cron';
import { scrapeReddit, scrapeHackerNews } from '../services/dataCollection.js';
import { analyzeAndClusterTrends } from '../services/trendAnalysis.js';

// Run data collection every 2 hours
cron.schedule('0 */2 * * *', async () => {
    console.log('Running scheduled data collection...');
    await scrapeReddit();
    await scrapeHackerNews();
    
    console.log('Running scheduled trend analysis...');
    await analyzeAndClusterTrends();
    
    console.log('Scheduled data collection finished.');
});

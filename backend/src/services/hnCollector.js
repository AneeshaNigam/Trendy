import axios from 'axios';
import Signal from '../models/Signal.js';

export const collectHNSignals = async () => {
    try {
        console.log('Fetching Hacker News signals...');
        
        // Fetch top stories (just IDs)
        const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topStoryIds = topStoriesRes.data.slice(0, 5); // Take top 5

        const signals = [];

        for (const id of topStoryIds) {
            const storyRes = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            const story = storyRes.data;
            if (story) {
                signals.push({
                    title: story.title,
                    description: '', // HN usually doesn't have descriptions, just titles/urls
                    source: 'Hacker News',
                    url: story.url || `https://news.ycombinator.com/item?id=${id}`,
                    engagement: story.score || 0
                });
            }
        }

        await Signal.insertMany(signals);
        console.log(`Saved ${signals.length} Hacker News signals.`);
    } catch (error) {
        console.error('Error in collectHNSignals:', error.message);
    }
};

import axios from 'axios';
import Signal from '../models/Signal.js';

export const collectRedditSignals = async () => {
    try {
        console.log('Fetching Reddit signals...');
        // Mocking Reddit data since we don't have an API key right now.
        // In a real scenario, this would use the Reddit API.
        const mockRedditData = [
            { title: 'Why AI is taking over coding tasks', description: 'Discussion on recent LLM improvements.', url: 'https://reddit.com/r/technology/1', engagement: 1500 },
            { title: 'React 19 release features', description: 'What to expect in the new version.', url: 'https://reddit.com/r/reactjs/1', engagement: 890 },
            { title: 'MongoDB vs PostgreSQL', description: 'Which one to choose in 2026.', url: 'https://reddit.com/r/webdev/1', engagement: 1200 },
        ];

        const signals = mockRedditData.map(data => ({
            title: data.title,
            description: data.description,
            source: 'Reddit',
            url: data.url,
            engagement: data.engagement
        }));

        await Signal.insertMany(signals);
        console.log(`Saved ${signals.length} Reddit signals.`);
    } catch (error) {
        console.error('Error in collectRedditSignals:', error.message);
    }
};

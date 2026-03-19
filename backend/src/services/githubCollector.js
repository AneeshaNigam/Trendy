import axios from 'axios';
import Signal from '../models/Signal.js';

export const collectGithubSignals = async () => {
    try {
        console.log('Fetching GitHub Trending signals...');
        const response = await axios.get('https://api.github.com/search/repositories?q=created:>2026-02-01&sort=stars&order=desc');
        
        // Take top 5
        const topRepos = response.data.items.slice(0, 5);
        
        const signals = topRepos.map(repo => ({
            title: repo.name,
            description: repo.description || 'No description provided.',
            source: 'GitHub',
            url: repo.html_url,
            engagement: repo.stargazers_count
        }));

        await Signal.insertMany(signals);
        console.log(`Saved ${signals.length} GitHub signals.`);
    } catch (error) {
        console.error('Error in collectGithubSignals:', error.message);
    }
};

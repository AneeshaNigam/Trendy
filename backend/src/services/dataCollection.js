import axios from 'axios';
import { sequelize } from '../config/database.js';

// Simplified Reddit scraper for MVP
export const scrapeReddit = async () => {
    try {
        const { data } = await axios.get('https://www.reddit.com/r/technology/hot.json?limit=25');
        const posts = data.data.children.map(child => {
            const post = child.data;
            return {
                title: post.title,
                description: post.selftext ? post.selftext.substring(0, 500) : '',
                source: 'Reddit - r/technology',
                url: `https://reddit.com${post.permalink}`,
                engagement_score: post.ups + post.num_comments * 2,
                timestamp: new Date(post.created_utc * 1000)
            }
        });

        await savePosts(posts);
        console.log(`Saved ${posts.length} from Reddit.`);
    } catch(err) {
        console.error('Reddit scrape error:', err.message);
    }
};

// Simulated HN scraper
export const scrapeHackerNews = async () => {
    try {
        const { data: topStories } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const top10 = topStories.slice(0, 10);
        
        const posts = [];
        for (const id of top10) {
            const { data: story } = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            if (story) {
                posts.push({
                    title: story.title,
                    description: '',
                    source: 'Hacker News',
                    url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
                    engagement_score: story.score + (story.descendants || 0) * 2,
                    timestamp: new Date(story.time * 1000)
                });
            }
        }
        await savePosts(posts);
        console.log(`Saved ${posts.length} from Hacker News.`);
    } catch (err) {
        console.error('HN scrape error:', err.message);
    }
};

const savePosts = async (posts) => {
    if (!posts || posts.length === 0) return;
    const Post = sequelize.models.Post;
    
    for (const post of posts) {
        // Simple distinct logic using URL
        const existing = await Post.findOne({ where: { url: post.url }});
        if (!existing) {
            await Post.create(post);
        }
    }
}

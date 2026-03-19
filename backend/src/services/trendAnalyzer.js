import Signal from '../models/Signal.js';
import Trend from '../models/Trend.js';

export const analyzeAndClusterTrends = async () => {
    try {
        console.log('Starting trend analysis and clustering...');

        const recentSignals = await Signal.find().sort({ createdAt: -1 }).limit(100);

        if (recentSignals.length === 0) {
            console.log('No signals found to analyze.');
            return;
        }

        const themes = [
            { key: 'ai', name: 'AI Revolution', desc: 'Artificial Intelligence tools and applications are dominating the industry, showing rapid adoption across various sectors.', category: 'Technology' },
            { key: 'react', name: 'React Ecosystem', desc: 'Updates, libraries, and tooling evolving around the React framework remain highly discussed.', category: 'Software Development' },
            { key: 'database', name: 'Modern Databases', desc: 'Comparisons and advancements in NoSQL and SQL database technologies are trending.', category: 'Data Engineering' },
            { key: 'postgres', name: 'PostgreSQL Mastery', desc: 'Discussions around PostgreSQL performance tuning and extensions.', category: 'Data Engineering' },
            { key: 'mongo', name: 'MongoDB Scale', desc: 'Strategies for scaling MongoDB clusters and modern NoSQL features.', category: 'Data Engineering' },
            { key: 'saas', name: 'B2B SaaS Strategies', desc: 'Strategies and discussions around B2B SaaS growth and metrics.', category: 'Business' },
            { key: 'crypto', name: 'Crypto & Web3', desc: 'Emerging narratives in cryptocurrency, DeFi, and blockchain technologies.', category: 'Finance' },
            { key: 'healthcare', name: 'HealthTech Innovation', desc: 'Technological advancements disrupting the healthcare sector.', category: 'Healthcare' },
            { key: 'marketing', name: 'Digital Growth Hacks', desc: 'Trending strategies in digital marketing and user acquisition.', category: 'Marketing' },
            { key: 'design', name: 'UI/UX Trends', desc: 'Evolving patterns in user interface and user experience design.', category: 'Design' }
        ];

        let clusteredCount = 0;
        const trendMap = new Map();

        for (const signal of recentSignals) {
            const text = `${signal.title} ${signal.description}`.toLowerCase();
            
            let matchedTheme = null;
            for (const theme of themes) {
                if (text.includes(theme.key)) {
                    matchedTheme = theme;
                    break;
                }
            }

            // Fallback for generic signals
            if (!matchedTheme) {
                matchedTheme = { key: 'tech', name: 'General Tech News', desc: 'General technology developments and industry news.', category: 'Technology' };
            }

            if (!trendMap.has(matchedTheme.name)) {
                trendMap.set(matchedTheme.name, {
                    explanation: matchedTheme.desc,
                    category: matchedTheme.category,
                    signals: [],
                    sources: new Set(),
                    engagementSum: 0
                });
            }
            
            const trendData = trendMap.get(matchedTheme.name);
            trendData.signals.push(signal._id);
            trendData.sources.add(signal.source);
            trendData.engagementSum += signal.engagement;
            
            clusteredCount++;
        }

        for (const [name, data] of trendMap.entries()) {
            const numSignals = data.signals.length;
            const growthRate = 1.5; // Stub growth rate
            const score = Math.round((numSignals * 10) + (data.engagementSum * 0.1) * growthRate);
            
            let trend = await Trend.findOne({ name });

            if (trend) {
                // Ensure unique signals
                const existingSignalsStr = trend.signals.map(id => id.toString());
                const newSignals = data.signals.filter(id => !existingSignalsStr.includes(id.toString()));
                
                trend.signals.push(...newSignals);
                
                // Ensure unique sources
                data.sources.forEach(src => {
                    if (!trend.sources.includes(src)) {
                        trend.sources.push(src);
                    }
                });
                
                trend.score = score;
                trend.category = data.category; // Ensure category is updated
                await trend.save();
            } else {
                trend = new Trend({
                    name,
                    category: data.category,
                    explanation: data.explanation,
                    score,
                    sources: Array.from(data.sources),
                    signals: data.signals
                });
                await trend.save();
            }
        }

        console.log(`Clustered ${clusteredCount} signals into Trends successfully.`);
    } catch (error) {
        console.error('Error analyzing trends:', error.message);
    }
};

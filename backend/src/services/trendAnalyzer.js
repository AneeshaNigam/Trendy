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

        // Specific, cutting-edge AI-era themes — no vague "General Tech" buckets
        const themes = [
            // AI & LLM
            { key: 'agent',        name: 'AI Agents Ecosystem',              desc: 'Multi-agent AI frameworks enabling autonomous task execution are reshaping how developers build intelligent pipelines.',               category: 'AI & ML' },
            { key: 'llm',          name: 'LLM Infrastructure',               desc: 'Tooling for deploying, fine-tuning, and scaling large language models in production is maturing rapidly.',                             category: 'AI & ML' },
            { key: 'rag',          name: 'Retrieval-Augmented Generation',   desc: 'RAG pipelines combining vector search with LLMs are becoming the default architecture for knowledge-grounded AI applications.',       category: 'AI & ML' },
            { key: 'fine-tun',     name: 'LLM Fine-Tuning Tooling',          desc: 'Efficient fine-tuning techniques like LoRA and QLoRA are democratising custom model training for domain-specific use cases.',         category: 'AI & ML' },
            { key: 'synthetic',    name: 'Synthetic Data Pipelines',         desc: 'Programmatic generation of high-quality synthetic datasets is unlocking model training at scale without expensive labelling.',         category: 'AI & ML' },
            { key: 'inference',    name: 'Edge AI Inference',                desc: 'Running quantised LLMs locally on edge devices and consumer hardware is creating a new category of private, offline AI applications.', category: 'AI & ML' },
            { key: 'openai',       name: 'OpenAI Ecosystem',                 desc: 'Tools, wrappers, and workflows built around OpenAI APIs continue to see explosive developer adoption.',                              category: 'AI & ML' },
            // Data
            { key: 'vector',       name: 'Vector Database Scaling',          desc: 'Purpose-built vector databases powering semantic search and recommendation systems are a critical piece of the modern AI stack.',       category: 'Data Engineering' },
            { key: 'pipeline',     name: 'AI Data Pipelines',                desc: 'ETL and feature engineering pipelines optimised for machine learning workflows are gaining significant developer mindshare.',           category: 'Data Engineering' },
            { key: 'postgres',     name: 'PostgreSQL as AI Backend',         desc: 'PostgreSQL extensions like pgvector are positioning it as the default database layer for AI-native applications.',                     category: 'Data Engineering' },
            // Dev tooling
            { key: 'rust',         name: 'Rust for AI Infrastructure',       desc: 'Rust is increasingly chosen for performance-critical AI inference runtimes and data processing components.',                           category: 'Systems' },
            { key: 'wasm',         name: 'WebAssembly AI Runtime',           desc: 'WASM is enabling portable, sandboxed AI inference across browsers and edge environments.',                                             category: 'Systems' },
            { key: 'typescript',   name: 'TypeScript AI SDKs',               desc: 'TypeScript is becoming the dominant language for AI SDK development, driven by Next.js and Vercel ecosystem growth.',                  category: 'Web Dev' },
            // Business
            { key: 'saas',         name: 'AI-Native SaaS',                   desc: 'SaaS products built with AI as a core capability — not a bolt-on — are redefining pricing, distribution, and defensibility.',         category: 'Business' },
            { key: 'devops',       name: 'MLOps & AI DevOps',                desc: 'Operational tooling for ML model deployment, monitoring, and lifecycle management is becoming a high-value engineering discipline.',    category: 'DevOps & Cloud' },
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

            // Fallback: map unmatched signals to a niche emerging category
            if (!matchedTheme) {
                matchedTheme = { key: 'emerging', name: 'Emerging AI Signals', desc: 'Early-stage developer activity signalling new directions in the AI and software tooling ecosystem.', category: 'AI & ML' };
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
            // Normalize score to 1.0–10.0:
            // - Signal count contribution: more signals = higher score (capped at 5 pts)
            // - Engagement contribution: log-scaled so huge Reddit numbers don't blow up the score
            const signalScore   = Math.min(5.0, numSignals * 0.5);               // 0–5
            const engagementLog = data.engagementSum > 0
              ? Math.min(5.0, Math.log10(data.engagementSum + 1))               // 0–5 (log10 of 100k = 5)
              : 0;
            const rawScore = signalScore + engagementLog;                         // 0–10
            const score = parseFloat(Math.max(1.0, Math.min(10.0, rawScore)).toFixed(1));
            
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

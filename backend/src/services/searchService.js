/**
 * searchService.js — Trendy Intelligence Engine (Phase 8)
 *
 * PRIMARY:   NewsAPI      — global news signals
 * SECONDARY: Hacker News  — tech discussion momentum
 * OPTIONAL:  Reddit       — community buzz detection
 *
 * Sources used internally only. UI shows insights, trends, summaries — never source names.
 * Scoring is calibrated so real trending topics score 7.0–10.0.
 */

import axios from 'axios';

const NEWS_API   = 'https://newsapi.org/v2/everything';
const HN_API     = 'https://hn.algolia.com/api/v1/search';
const REDDIT_API = 'https://www.reddit.com/search.json';

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || '';

// ── Safe fetch ────────────────────────────────────────────────────────────────

async function safeFetch(url, options = {}) {
    try {
        const res = await axios.get(url, {
            timeout: 9000,
            headers: { 'Accept': 'application/json', 'User-Agent': 'Trendy/1.0', ...options.headers },
            params: options.params,
        });
        return res.data;
    } catch (err) {
        console.warn(`[searchService] ${url.split('?')[0]} failed: ${err.message}`);
        return null;
    }
}

// ── Data fetchers ─────────────────────────────────────────────────────────────

async function fetchNews(query) {
    if (!NEWSAPI_KEY) {
        console.warn('[searchService] NEWSAPI_KEY not configured');
        return [];
    }
    const data = await safeFetch(NEWS_API, {
        params: { q: query, sortBy: 'publishedAt', language: 'en', pageSize: 20, apiKey: NEWSAPI_KEY },
    });
    if (!data?.articles) return [];
    return data.articles
        .filter(a => a.title && a.title !== '[Removed]' && a.description)
        .map(a => ({
            _source: 'news',
            title: a.title,
            description: a.description || a.title,
            sourceName: a.source?.name || '',
            publishedAt: a.publishedAt,
            url: a.url,
            // Recency bonus: articles in last 24h get +2, last 7 days get +1
            recencyBonus: getRecencyBonus(a.publishedAt),
        }));
}

function getRecencyBonus(publishedAt) {
    if (!publishedAt) return 0;
    const diffMs = Date.now() - new Date(publishedAt).getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays < 1)  return 2;
    if (diffDays < 7)  return 1;
    if (diffDays < 30) return 0.5;
    return 0;
}

async function fetchHackerNews(query) {
    const data = await safeFetch(HN_API, { params: { query, tags: 'story', hitsPerPage: 20 } });
    if (!data?.hits) return [];
    return data.hits.map(h => ({
        _source: 'hn',
        title: h.title || '',
        description: h.title || '',
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        points: h.points || 0,
        comments: h.num_comments || 0,
        createdAt: h.created_at,
        recencyBonus: getRecencyBonus(h.created_at),
    }));
}

async function fetchReddit(query) {
    const data = await safeFetch(REDDIT_API, {
        params: { q: query, sort: 'top', limit: 15, t: 'month' },
        headers: { 'User-Agent': 'Trendy/1.0' },
    });
    if (!data?.data?.children) return [];
    return data.data.children
        .filter(c => c.kind === 't3')
        .map(c => {
            const p = c.data;
            return {
                _source: 'reddit',
                title: p.title || '',
                description: p.selftext?.slice(0, 200) || p.title || '',
                url: `https://reddit.com${p.permalink}`,
                ups: p.ups || 0,
                comments: p.num_comments || 0,
                createdAt: new Date(p.created_utc * 1000).toISOString(),
                recencyBonus: getRecencyBonus(new Date(p.created_utc * 1000).toISOString()),
            };
        });
}

// ── Scoring — calibrated to produce 7-10 for real trending topics ─────────────
//
// Formula:
//   baseScore = newsFreqScore (0-4) + newsRecency (0-2) + hnEngagement (0-3) + multiSource (0-1)
//   totalRaw  = baseScore (0-10) → normalize to 5.5-10 for things with any news coverage
//               so real topics never score < 5.5

function computeScore({ newsItems, hnItems, rdItems }) {
    const n = newsItems.length;
    const hnPoints = hnItems.reduce((s, h) => s + h.points, 0);
    const rdUps    = rdItems.reduce((s, r) => s + r.ups, 0);

    // News frequency: more recent articles = higher score
    // 1 article = 1.5, 5 = 3.5, 10+ = 4.5 (log-scaled with recency)
    const newsFreqRaw    = n > 0 ? Math.min(4.5, 1.5 + Math.log2(n) * 0.8) : 0;
    const newsRecencyAvg = n > 0
        ? newsItems.reduce((s, a) => s + (a.recencyBonus || 0), 0) / n
        : 0;
    const newsScore = newsFreqRaw + newsRecencyAvg; // 0–6.5

    // HN engagement: log-scaled, max 2.5
    const hnScore = hnPoints > 0
        ? Math.min(2.5, (Math.log10(hnPoints + 1) / Math.log10(10001)) * 2.5)
        : 0;

    // Reddit: log-scaled, max 1.5
    const rdScore = rdUps > 0
        ? Math.min(1.5, (Math.log10(rdUps + 1) / Math.log10(100001)) * 1.5)
        : 0;

    // Multi-source validation bonus (up to 1 pt)
    const sourceCount = (n > 0 ? 1 : 0) + (hnItems.length > 0 ? 1 : 0) + (rdItems.length > 0 ? 1 : 0);
    const multiSourceBonus = sourceCount >= 3 ? 1.0 : sourceCount === 2 ? 0.5 : 0;

    const raw = newsScore + hnScore + rdScore + multiSourceBonus;

    // Floor calibration: if any news exists, minimum score is 5.5
    // This ensures real trending topics never appear "Emerging (low)"
    const floored = n > 0 ? Math.max(5.5, raw) : Math.max(1.0, raw);
    return parseFloat(Math.min(10.0, floored).toFixed(1));
}

// ── Text utilities ────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
    'this','that','with','from','have','been','were','they','their','what','when','will',
    'your','more','about','into','than','some','also','other','just','like','most','over',
    'such','then','very','only','even','back','much','well','make','know','take','does',
    'here','come','made','could','after','first','would','through','should','being','every',
    'those','these','which','there','where','using','build','open','source','project','news',
    'report','says','said','latest','today','week','year','month','time','people','world',
    'global','company','market','according','update','share','find','show','high','large',
]);

function tokenize(text) {
    return (text || '').toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && !STOP_WORDS.has(w));
}

function cap(str) {
    if (!str) return '';
    return str.trim().replace(/\b\w/g, c => c.toUpperCase());
}

// ── Dynamic AI Insight generator ─────────────────────────────────────────────
// Generates a specific insight using actual headlines from real news / HN data

function generateAIInsight(newsItems, hnItems, query) {
    const q = cap(query);
    const topArticles = [...newsItems].sort((a, b) => (b.recencyBonus || 0) - (a.recencyBonus || 0));
    const topHN       = [...hnItems].sort((a, b) => b.points - a.points);

    // Pick a fresh headline from news as anchor
    const headline1 = topArticles[0];
    const headline2 = topArticles[1];
    const topHNStory = topHN[0];

    const fragments = [];

    if (headline1) {
        // Use the actual description to make insight feel real
        const desc = headline1.description?.slice(0, 120) || headline1.title.slice(0, 100);
        fragments.push(`Recent reporting reveals: ${desc}`);
    }

    if (headline2 && headline2.title !== headline1?.title) {
        fragments.push(`A separate development: "${headline2.title.slice(0, 90)}" is adding momentum to the conversation`);
    }

    if (topHNStory && topHNStory.points > 20) {
        fragments.push(`Tech community engagement is high — "${topHNStory.title.slice(0, 80)}" has attracted ${topHNStory.points} points of discussion`);
    }

    if (fragments.length === 0) {
        return `${q} is registering across global news and discussion channels, with multiple independent signals emerging simultaneously — a classic early-adoption pattern that precedes mainstream market movement.`;
    }

    return fragments.join('. ') + '.';
}

// ── Dynamic "Why It Matters" — varies by keyword patterns in news content ────

function generateWhyItMatters(query, newsItems, hnItems, score) {
    const q = cap(query);
    const combinedText = [
        ...newsItems.map(n => `${n.title} ${n.description}`),
        ...hnItems.map(h => h.title),
    ].join(' ').toLowerCase();

    // Detect economic/investment signals
    if (/billion|funding|valuation|invest|ipo|acqui|revenue|growth rate/.test(combinedText)) {
        return `${q} is attracting serious capital and commercial attention. The funding and investment signals in recent coverage suggest institutional validation — this is moving from "interesting idea" to "real market" at speed.`;
    }

    // Detect regulatory/policy signals
    if (/regulat|policy|government|congress|eu|compliance|law|legal|ban|mandate/.test(combinedText)) {
        return `Regulatory developments around ${q} are creating both risk and opportunity. Companies that build compliance-first products now will own the market as rules crystallize — this window is narrow.`;
    }

    // Detect enterprise adoption signals
    if (/enterprise|deploy|adopt|scale|partner|contract|customer|client|workforce/.test(combinedText)) {
        return `${q} is crossing the chasm from early adopters to enterprise deployment. When large organizations start adopting a technology at scale, the surrounding tooling, services, and platforms become the highest-value opportunities.`;
    }

    // Detect consumer/product signals
    if (/user|consumer|product|launch|release|feature|app|platform|service/.test(combinedText)) {
        return `${q} is hitting consumer inflection — product launches and feature releases are accelerating. The window to establish brand presence and user trust in this category is open now, before dominant players consolidate share.`;
    }

    // Score-based fallback
    if (score >= 8) {
        return `${q} has reached critical mass — the volume and diversity of coverage signals that this is no longer a niche discussion. Market infrastructure is forming around this movement, and the opportunity to build category-defining products is now.`;
    }
    if (score >= 6) {
        return `${q} is in a high-velocity growth phase. Adoption is accelerating faster than the ecosystem can accommodate — which means unmet needs, tooling gaps, and underserved audiences are abundant for builders who move quickly.`;
    }
    return `${q} is emerging as a meaningful signal before mainstream coverage catches up. The earliest builders in a new category define the norms, capture the trust, and set the trajectory. The asymmetry here strongly favors action.`;
}

// ── Dynamic Startup Ideas — tied to real keyword and article content ──────────

function generateStartupIdeas(query, keyword, newsItems, hnItems) {
    const q = cap(query);
    const combinedText = [
        ...newsItems.slice(0, 8).map(n => `${n.title} ${n.description}`),
        ...hnItems.slice(0, 5).map(h => h.title),
    ].join(' ').toLowerCase();

    const ideas = [];

    // Pattern-matched ideas based on actual fetched content
    if (/b2b|enterprise|sales|crm|revenue|pipeline/.test(combinedText)) {
        ideas.push(`B2B intelligence platform for ${q} — surface buying signals, automate outreach, and track competitive positioning for enterprise sales teams`);
    }
    if (/health|medical|clinical|patient|pharma|diagnostic/.test(combinedText)) {
        ideas.push(`Clinical-grade ${q} platform — workflow automation for healthcare providers with built-in compliance and EHR integration`);
    }
    if (/invest|fund|portfolio|asset|trading|financial/.test(combinedText)) {
        ideas.push(`Investment research assistant for ${q} — real-time signal monitoring, automated due diligence, and portfolio exposure analytics`);
    }
    if (/data|pipeline|analytics|database|infrastructure|api/.test(combinedText)) {
        ideas.push(`Managed ${q} data infrastructure — a plug-and-play layer that lets teams deploy and query without DevOps complexity`);
    }
    if (/ai|model|llm|gpt|agent|automation|workflow/.test(combinedText)) {
        ideas.push(`No-code ${q} workflow builder — drag-and-drop interface so non-technical teams can build and deploy AI-powered automations without engineering`);
    }
    if (/education|training|learn|skill|course|certification/.test(combinedText)) {
        ideas.push(`${q} professional certification platform — structured learning paths, peer community, and employer-recognized credentials for upskilling at scale`);
    }
    if (/regul|compliance|audit|legal|policy|governance/.test(combinedText)) {
        ideas.push(`${q} compliance automation tool — continuous monitoring, audit-ready reporting, and policy gap detection for regulated industries`);
    }
    if (/creator|content|media|influencer|monetize|audience/.test(combinedText)) {
        ideas.push(`Creator-first ${q} toolset — analytics, monetization infrastructure, and audience intelligence for independent creators and media brands`);
    }

    // Universal ideas that always apply regardless of content
    ideas.push(
        `Real-time ${q} intelligence dashboard — aggregate global signals, score momentum, and deliver daily briefings for strategy and product teams`,
        `Vertical SaaS for ${q} — deep workflow automation purpose-built for a specific industry vertical where generic tools fall short`
    );

    // Shuffle slightly based on keyword hash for variety
    const hash = keyword.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const offset = hash % 3;
    const rotated = [...ideas.slice(offset), ...ideas.slice(0, offset)];

    return [...new Set(rotated)].slice(0, 3);
}

// ── Who Should Care ────────────────────────────────────────────────────────────

function generateWhoShouldCare(query, score, newsItems, hnItems) {
    const q = cap(query).toLowerCase();
    const text = [
        ...newsItems.slice(0, 5).map(n => n.title),
        ...hnItems.slice(0, 3).map(h => h.title),
        q,
    ].join(' ').toLowerCase();

    const roles = [];

    if (/ai|llm|agent|neural|model|gpt|machine|deep learning/.test(text))   roles.push('AI product leaders', 'ML engineers');
    if (/startup|founder|venture|seed|raise|build/.test(text))              roles.push('Early-stage founders', 'Startup operators');
    if (/enterprise|corporate|b2b|saas|sales/.test(text))                   roles.push('Enterprise software buyers', 'Revenue operations leaders');
    if (/invest|fund|capital|portfolio|asset/.test(text))                   roles.push('Venture & angel investors');
    if (/health|medical|clinic|pharma|diagnostic/.test(text))               roles.push('HealthTech innovators', 'Healthcare CTOs');
    if (/finance|fintech|bank|payment|defi|crypto/.test(text))              roles.push('Fintech founders', 'Financial strategists');
    if (/climate|energy|sustainable|carbon|green/.test(text))               roles.push('Climate tech founders', 'ESG strategists');
    if (/market|growth|consumer|brand|advertis/.test(text))                 roles.push('Growth marketers', 'Brand strategists');
    if (/developer|engineer|software|code|api|platform/.test(text))         roles.push('Platform engineers', 'Developer tool builders');
    if (score >= 8)                                                          roles.push('Innovation analysts');

    const defaults = ['Strategy & market researchers', 'Product managers'];
    return [...new Set([...roles, ...defaults])].slice(0, 4);
}

// ── Category classifier ────────────────────────────────────────────────────────

function deriveCategory(query, keyword, newsItems) {
    const text = `${query} ${keyword} ${newsItems.slice(0, 3).map(n => n.title).join(' ')}`.toLowerCase();

    if (/\b(ai|ml|llm|gpt|agent|openai|anthropic|gemini|machine learning|deep learning|neural)\b/.test(text)) return 'AI & ML';
    if (/\b(fintech|finance|crypto|blockchain|banking|defi|trading|payment|lending)\b/.test(text)) return 'Fintech';
    if (/\b(health|medical|biotech|pharma|wellness|clinical|hospital|diagnostic)\b/.test(text)) return 'HealthTech';
    if (/\b(climate|energy|sustainability|green|carbon|renewable|environment|esg)\b/.test(text)) return 'Climate';
    if (/\b(data|sql|database|analytics|pipeline|spark|kafka|warehouse|lakehouse)\b/.test(text)) return 'Data';
    if (/\b(devops|docker|kubernetes|cloud|aws|gcp|azure|infrastructure|serverless)\b/.test(text)) return 'Cloud & Infra';
    if (/\b(security|privacy|cyber|auth|compliance|zero.trust)\b/.test(text)) return 'Cybersecurity';
    if (/\b(mobile|ios|android|swift|flutter|react native)\b/.test(text)) return 'Mobile';
    if (/\b(education|edtech|learning|university|course|certification|skill)\b/.test(text)) return 'EdTech';
    if (/\b(saas|startup|b2b|revenue|growth|ecommerce|retail|marketplace)\b/.test(text)) return 'Business';
    if (/\b(react|vue|nextjs|frontend|javascript|typescript|css|web dev)\b/.test(text)) return 'Web Dev';
    return 'Technology';
}

function buildTrendName(keyword, query) {
    const qWords = query.toLowerCase().split(/\s+/);
    if (qWords.includes(keyword)) return cap(query);
    // Make the name sound like a trend topic, not a keyword mashup
    return `${cap(keyword)} in ${cap(query)}`;
}

// ── Main export ────────────────────────────────────────────────────────────────

export async function searchAndGenerateTrends(query) {
    if (!query || query.trim().length < 2) return [];

    console.log(`[searchService] Searching: "${query}"`);

    const [newsResults, hnResults, rdResults] = await Promise.all([
        fetchNews(query),
        fetchHackerNews(query),
        fetchReddit(query),
    ]);

    console.log(`[searchService] Fetched: ${newsResults.length} news, ${hnResults.length} HN, ${rdResults.length} Reddit`);

    const allResults = [...newsResults, ...hnResults, ...rdResults];
    if (allResults.length === 0) return [];

    // ── NLP keyword extraction ────────────────────────────────────────────────
    const freq = {};
    for (const item of allResults) {
        for (const tok of tokenize(`${item.title} ${item.description || ''}`)) {
            freq[tok] = (freq[tok] || 0) + 1;
        }
    }
    const topKeywords = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([w]) => w);

    // ── Signal clustering ──────────────────────────────────────────────────────
    const clusters = new Map();

    for (const item of allResults) {
        const tokens = new Set(tokenize(`${item.title} ${item.description || ''}`));
        let bestKey = null, bestOverlap = 0;
        for (const kw of topKeywords) {
            if (tokens.has(kw)) {
                const overlap = [...tokens].filter(t => topKeywords.includes(t)).length;
                if (overlap > bestOverlap) { bestOverlap = overlap; bestKey = kw; }
            }
        }
        const key = bestKey || topKeywords[0] || query;
        if (!clusters.has(key)) clusters.set(key, { keyword: key, news: [], hn: [], rd: [] });
        const c = clusters.get(key);
        if (item._source === 'news')   c.news.push(item);
        else if (item._source === 'hn') c.hn.push(item);
        else                            c.rd.push(item);
    }

    // ── Build enriched trends ──────────────────────────────────────────────────
    const trends = [];

    for (const [, { keyword, news, hn, rd }] of clusters) {
        if (news.length === 0 && hn.length === 0) continue; // skip clusters with no meaningful data

        const score    = computeScore({ newsItems: news, hnItems: hn, rdItems: rd });
        const category = deriveCategory(query, keyword, news);
        const name     = buildTrendName(keyword, query);

        // Explanation from best matching news article
        const bestArticle   = [...news].sort((a, b) => (b.recencyBonus || 0) - (a.recencyBonus || 0))[0];
        const explanation   = bestArticle?.description
            ? bestArticle.description.slice(0, 200)
            : `${cap(query)} is gaining traction across ${news.length + hn.length + rd.length} real-world signals.`;

        const aiInsight     = generateAIInsight(news, hn, query);
        const whyItMatters  = generateWhyItMatters(query, news, hn, score);
        const startupIdeas  = generateStartupIdeas(query, keyword, news, hn);
        const whoShouldCare = generateWhoShouldCare(query, score, news, hn);

        trends.push({
            _id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name,
            explanation,
            score,
            category,
            sources: [],            // never expose source platform names in UI
            aiInsight,
            whyItMatters,
            startupIdeas,
            whoShouldCare,
            metrics: {              // internal only — not rendered in cards
                newsArticles:  news.length,
                hnPoints:      hn.reduce((s, h) => s + h.points, 0),
                rdUpvotes:     rd.reduce((s, r) => s + r.ups, 0),
                totalSignals:  news.length + hn.length + rd.length,
            },
            createdAt: new Date().toISOString(),
            query,
        });
    }

    // De-duplicate and sort by score descending
    const seen = new Set();
    return trends
        .filter(t => { if (seen.has(t.name)) return false; seen.add(t.name); return true; })
        .sort((a, b) => b.score - a.score);
}

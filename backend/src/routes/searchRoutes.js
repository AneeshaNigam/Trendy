import express from 'express';
import { searchAndGenerateTrends } from '../services/searchService.js';

const router = express.Router();

// Simple in-memory cache: query -> { data, ts }
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * GET /api/search?q=<query>&page=<page>&limit=<limit>
 * 
 * Fetches live results from GitHub, HN, Reddit and returns clustered trends.
 */
router.get('/', async (req, res) => {
    const query = (req.query.q || '').trim();
    const page  = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 10));

    if (!query || query.length < 2) {
        return res.status(400).json({ error: 'Query must be at least 2 characters.' });
    }

    // Cache lookup
    const cacheKey = query.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.ts) < CACHE_TTL_MS) {
        const allTrends = cached.data;
        const start = (page - 1) * limit;
        const pageData = allTrends.slice(start, start + limit);
        return res.json({
            query,
            total: allTrends.length,
            page,
            limit,
            totalPages: Math.ceil(allTrends.length / limit),
            trends: pageData,
            cached: true,
        });
    }

    try {
        const allTrends = await searchAndGenerateTrends(query);

        // Store in cache
        cache.set(cacheKey, { data: allTrends, ts: Date.now() });

        // Evict old cache entries
        if (cache.size > 100) {
            const oldest = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts)[0];
            cache.delete(oldest[0]);
        }

        const start = (page - 1) * limit;
        const pageData = allTrends.slice(start, start + limit);

        res.json({
            query,
            total: allTrends.length,
            page,
            limit,
            totalPages: Math.ceil(allTrends.length / limit),
            trends: pageData,
            cached: false,
        });
    } catch (err) {
        console.error('[/api/search] Error:', err.message);
        res.status(500).json({ error: 'Search failed. Please try again.' });
    }
});

export default router;

import express from 'express';
import Trend from '../models/Trend.js';
import { ensurePremium } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get top trends
// @route   GET /api/trends
router.get('/', async (req, res) => {
    try {
        const isPremium = req.isAuthenticated && req.isAuthenticated() && req.user && req.user.plan === 'premium';
        const limit = isPremium ? 100 : 5; // Free tier gets top 5
        
        const trends = await Trend.find()
            .sort({ score: -1 })
            .limit(limit)
            // .populate('signals'); // Can populate if needed
        
        res.json({ trends, isPremiumLimit: !isPremium });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching trends' });
    }
});

// @desc    Get detailed trend info (Premium only)
// @route   GET /api/trends/:id
router.get('/:id', ensurePremium, async (req, res) => {
    try {
        const trend = await Trend.findById(req.params.id).populate('signals');
        if (!trend) {
            return res.status(404).json({ error: 'Trend not found' });
        }
        res.json({ trend });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching trend details' });
    }
});

export default router;

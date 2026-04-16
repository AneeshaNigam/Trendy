import express from 'express';
import Trend from '../models/Trend.js';

const router = express.Router();

// @desc    Get top trends (public — no auth required)
// @route   GET /api/trends
router.get('/', async (req, res) => {
    try {
        const trends = await Trend.find()
            .sort({ score: -1 })
            .limit(100);
        
        res.json({ trends });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching trends' });
    }
});

// @desc    Get detailed trend info (public)
// @route   GET /api/trends/:id
router.get('/:id', async (req, res) => {
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

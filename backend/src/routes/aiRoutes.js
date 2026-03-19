import express from 'express';

const router = express.Router();

// Manual trigger for testing
router.post('/trigger-analysis', async (req, res) => {
  res.json({ status: 'Success! Analysis triggered (Hardcoded mode - no op).' });
});

export default router;

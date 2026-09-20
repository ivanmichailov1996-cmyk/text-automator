import express from 'express';
import { getOrCreateUser, getHistory, deleteHistoryItem } from '../services/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Get or create user
    const user = await getOrCreateUser(
      req.user.telegramId,
      req.user.username,
      req.user.firstName
    );

    // Get history
    const history = await getHistory(user.id, parseInt(limit));

    res.json({
      success: true,
      count: history.length,
      history: history,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete history item
    await deleteHistoryItem(parseInt(id));

    res.json({
      success: true,
      message: 'History item deleted',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting history:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

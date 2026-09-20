import express from 'express';
import { rewriteText } from '../services/huggingface.js';
import { getOrCreateUser, saveToHistory } from '../services/db.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { text, level = 'medium', language = 'ru' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Get or create user
    const user = await getOrCreateUser(
      req.user.telegramId,
      req.user.username,
      req.user.firstName
    );

    // Rewrite text
    const rewrittenText = await rewriteText(text, level);

    // Save to history
    const input = `${text}\n(Level: ${level})`;
    await saveToHistory(user.id, 'rewrite', input, rewrittenText, language);

    res.json({
      success: true,
      original: text,
      rewritten: rewrittenText,
      level: level,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error rewriting text:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

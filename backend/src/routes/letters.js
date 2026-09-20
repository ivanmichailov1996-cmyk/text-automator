import express from 'express';
import { generateLetter } from '../services/huggingface.js';
import { getOrCreateUser, saveToHistory } from '../services/db.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { topic, points, tone = 'formal', language = 'ru' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Get or create user
    const user = await getOrCreateUser(
      req.user.telegramId,
      req.user.username,
      req.user.firstName
    );

    // Generate letter
    const generatedLetter = await generateLetter(topic, points, tone);

    // Save to history
    const input = `Topic: ${topic}\nPoints: ${points}\nTone: ${tone}`;
    await saveToHistory(user.id, 'letter', input, generatedLetter, language);

    res.json({
      success: true,
      letter: generatedLetter,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating letter:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

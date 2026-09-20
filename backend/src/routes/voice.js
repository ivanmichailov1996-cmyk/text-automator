import express from 'express';
import { getOrCreateUser } from '../services/db.js';

const router = express.Router();

router.post('/recognize', async (req, res) => {
  try {
    const { audioData, language = 'ru' } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    // Get or create user
    const user = await getOrCreateUser(
      req.user.telegramId,
      req.user.username,
      req.user.firstName
    );

    // In production, use a speech-to-text API
    // For now, return placeholder
    const recognizedText = 'Voice recognition placeholder - connect to speech-to-text API in production';

    res.json({
      success: true,
      text: recognizedText,
      language: language,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error recognizing voice:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

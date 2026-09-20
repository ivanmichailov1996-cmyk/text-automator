import express from 'express';
import { generatePost } from '../services/huggingface.js';
import { getOrCreateUser, saveToHistory } from '../services/db.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { topic, platform = 'telegram', language = 'ru' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Get or create user
    const user = await getOrCreateUser(
      req.user.telegramId,
      req.user.username,
      req.user.firstName
    );

    // Generate post
    const generatedPost = await generatePost(topic, platform);

    // Save to history
    const input = `Topic: ${topic}\nPlatform: ${platform}`;
    await saveToHistory(user.id, 'post', input, generatedPost, language);

    res.json({
      success: true,
      post: generatedPost,
      platform: platform,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating post:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

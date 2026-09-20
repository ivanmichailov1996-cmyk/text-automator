import express from 'express';
import { generateTask } from '../services/huggingface.js';
import { getOrCreateUser, saveToHistory } from '../services/db.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { description, language = 'ru' } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Get or create user
    const user = await getOrCreateUser(
      req.user.telegramId,
      req.user.username,
      req.user.firstName
    );

    // Generate task
    const generatedTask = await generateTask(description);

    // Save to history
    await saveToHistory(user.id, 'task', description, generatedTask, language);

    res.json({
      success: true,
      task: generatedTask,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating task:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

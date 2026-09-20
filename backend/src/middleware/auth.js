export const authMiddleware = (req, res, next) => {
  const telegramId = req.headers['x-telegram-id'];
  const username = req.headers['x-telegram-username'];
  const firstName = req.headers['x-telegram-first-name'];

  if (!telegramId) {
    return res.status(401).json({ error: 'Missing Telegram ID' });
  }

  // Attach user info to request
  req.user = {
    telegramId: parseInt(telegramId),
    username: username || 'unknown',
    firstName: firstName || 'User'
  };

  next();
};

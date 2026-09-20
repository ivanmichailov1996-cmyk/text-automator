// Auth middleware to extract user info from Telegram Mini App headers
export const authMiddleware = (req, res, next) => {
  try {
    // Get user info from headers (sent by Telegram Mini App)
    const telegramId = req.headers['x-telegram-id'];
    const username = req.headers['x-telegram-username'] || 'anonymous';
    const firstName = req.headers['x-telegram-first-name'] || 'User';

    // Attach user info to request object
    req.user = {
      telegramId: telegramId || '0',
      username,
      firstName
    };

    console.log('User info attached:', req.user);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Don't block the request, just log the error
    req.user = {
      telegramId: '0',
      username: 'anonymous',
      firstName: 'User'
    };
    next();
  }
};

export default authMiddleware;

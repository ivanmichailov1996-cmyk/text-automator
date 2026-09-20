import axios from 'axios';

let telegramUser = null;

export const initTelegram = () => {
  const app = window.Telegram?.WebApp;
  if (app) {
    app.ready();
    telegramUser = {
      id: app.initDataUnsafe?.user?.id || 0,
      username: app.initDataUnsafe?.user?.username || 'unknown',
      firstName: app.initDataUnsafe?.user?.first_name || 'User'
    };
  }
  return telegramUser;
};

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add Telegram user info to headers
apiClient.interceptors.request.use((config) => {
  if (telegramUser) {
    config.headers['x-telegram-id'] = telegramUser.id;
    config.headers['x-telegram-username'] = telegramUser.username;
    config.headers['x-telegram-first-name'] = telegramUser.firstName;
  }
  return config;
});

export const generateTask = async (description, language = 'ru') => {
  try {
    const response = await apiClient.post('/tasks/generate', {
      description,
      language
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const generateLetter = async (topic, points, tone = 'formal', language = 'ru') => {
  try {
    const response = await apiClient.post('/letters/generate', {
      topic,
      points,
      tone,
      language
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const rewriteText = async (text, level = 'medium', language = 'ru') => {
  try {
    const response = await apiClient.post('/rewrite/generate', {
      text,
      level,
      language
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const generatePost = async (topic, platform = 'telegram', language = 'ru') => {
  try {
    const response = await apiClient.post('/posts/generate', {
      topic,
      platform,
      language
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const recognizeVoice = async (audioData, language = 'ru') => {
  try {
    const response = await apiClient.post('/voice/recognize', {
      audioData,
      language
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getHistory = async (limit = 50) => {
  try {
    const response = await apiClient.get(`/history?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteHistoryItem = async (id) => {
  try {
    const response = await apiClient.delete(`/history/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default apiClient;

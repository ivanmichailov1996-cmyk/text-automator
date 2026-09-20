import { useState } from 'react';
import { generatePost } from '../services/api';
import ResultDisplay from './ResultDisplay';

export default function PostGenerator({ language }) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('telegram');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = language === 'ru' ? {
    title: 'Генератор постов',
    topicLabel: 'Тема поста',
    topicPlaceholder: 'О чём пост?',
    platformLabel: 'Платформа',
    button: 'Сгенерировать пост',
    generating: 'Генерирую...',
    clear: 'Очистить'
  } : {
    title: 'Post Generator',
    topicLabel: 'Post Topic',
    topicPlaceholder: 'What is the post about?',
    platformLabel: 'Platform',
    button: 'Generate Post',
    generating: 'Generating...',
    clear: 'Clear'
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError(language === 'ru' ? 'Введите тему' : 'Enter topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await generatePost(topic, platform, language);
      setResult(response.post);
    } catch (err) {
      setError(err.error || (language === 'ru' ? 'Ошибка генерации' : 'Generation error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{t.title}</h2>

      <div className="form-group">
        <label>{t.topicLabel}</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t.topicPlaceholder}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>{t.platformLabel}</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} disabled={loading}>
          <option value="telegram">Telegram</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button
          className="button"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? t.generating : t.button}
        </button>
        <button
          className="button"
          onClick={() => { setTopic(''); setResult(null); }}
          style={{ background: '#6b7280' }}
        >
          {t.clear}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner"></div></div>}

      {result && <ResultDisplay title="Generated Post" content={result} />}
    </div>
  );
}

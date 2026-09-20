import { useState } from 'react';
import { generateLetter } from '../services/api';
import ResultDisplay from './ResultDisplay';

export default function LetterGenerator({ language }) {
  const [topic, setTopic] = useState('');
  const [points, setPoints] = useState('');
  const [tone, setTone] = useState('formal');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = language === 'ru' ? {
    title: 'Генератор писем',
    topicLabel: 'Тема письма',
    topicPlaceholder: 'О чём письмо?',
    pointsLabel: 'Ключевые моменты',
    pointsPlaceholder: 'Что включить в письмо?',
    toneLabel: 'Тон письма',
    button: 'Сгенерировать письмо',
    generating: 'Генерирую...',
    clear: 'Очистить'
  } : {
    title: 'Letter Generator',
    topicLabel: 'Letter Topic',
    topicPlaceholder: 'What is the letter about?',
    pointsLabel: 'Key Points',
    pointsPlaceholder: 'What to include in the letter?',
    toneLabel: 'Letter Tone',
    button: 'Generate Letter',
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
      const response = await generateLetter(topic, points, tone, language);
      setResult(response.letter);
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
        <label>{t.pointsLabel}</label>
        <textarea
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder={t.pointsPlaceholder}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>{t.toneLabel}</label>
        <select value={tone} onChange={(e) => setTone(e.target.value)} disabled={loading}>
          <option value="formal">Formal</option>
          <option value="friendly">Friendly</option>
          <option value="firm">Firm</option>
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
          onClick={() => { setTopic(''); setPoints(''); setResult(null); }}
          style={{ background: '#6b7280' }}
        >
          {t.clear}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner"></div></div>}

      {result && <ResultDisplay title="Generated Letter" content={result} />}
    </div>
  );
}

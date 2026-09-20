import { useState } from 'react';
import { rewriteText } from '../services/api';
import VoiceInput from './VoiceInput';
import ResultDisplay from './ResultDisplay';

export default function RewriteText({ language }) {
  const [text, setText] = useState('');
  const [level, setLevel] = useState('medium');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = language === 'ru' ? {
    title: 'Переписать текст',
    label: 'Ваш текст',
    placeholder: 'Введите текст для переписывания...',
    levelLabel: 'Уровень изменения',
    button: 'Переписать',
    generating: 'Переписываю...',
    voiceInput: 'Голос',
    clear: 'Очистить'
  } : {
    title: 'Rewrite Text',
    label: 'Your Text',
    placeholder: 'Enter text to rewrite...',
    levelLabel: 'Level of Change',
    button: 'Rewrite',
    generating: 'Rewriting...',
    voiceInput: 'Voice',
    clear: 'Clear'
  };

  const handleRewrite = async () => {
    if (!text.trim()) {
      setError(language === 'ru' ? 'Введите текст' : 'Enter text');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await rewriteText(text, level, language);
      setResult(response.rewritten);
    } catch (err) {
      setError(err.error || (language === 'ru' ? 'Ошибка переписи' : 'Rewrite error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceResult = (voiceText) => {
    setText(voiceText);
  };

  return (
    <div>
      <h2>{t.title}</h2>

      <div className="form-group">
        <label>{t.label}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>{t.levelLabel}</label>
        <select value={level} onChange={(e) => setLevel(e.target.value)} disabled={loading}>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="heavy">Heavy</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button
          className="button"
          onClick={handleRewrite}
          disabled={loading}
        >
          {loading ? t.generating : t.button}
        </button>
        <VoiceInput onResult={handleVoiceResult} label={t.voiceInput} />
        <button
          className="button"
          onClick={() => { setText(''); setResult(null); }}
          style={{ background: '#6b7280' }}
        >
          {t.clear}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner"></div></div>}

      {result && <ResultDisplay title="Rewritten Text" content={result} />}
    </div>
  );
}

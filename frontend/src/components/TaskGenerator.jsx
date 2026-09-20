import { useState } from 'react';
import { generateTask } from '../services/api';
import VoiceInput from './VoiceInput';
import ResultDisplay from './ResultDisplay';

export default function TaskGenerator({ language }) {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = language === 'ru' ? {
    title: 'Генератор задач',
    label: 'Описание задачи',
    placeholder: 'Опиши, что нужно сделать...',
    button: 'Сгенерировать задачу',
    generating: 'Генерирую...',
    voiceInput: 'Голос',
    clear: 'Очистить'
  } : {
    title: 'Task Generator',
    label: 'Task Description',
    placeholder: 'Describe what needs to be done...',
    button: 'Generate Task',
    generating: 'Generating...',
    voiceInput: 'Voice',
    clear: 'Clear'
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError(language === 'ru' ? 'Введите описание' : 'Enter description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await generateTask(description, language);
      setResult(response.task);
    } catch (err) {
      setError(err.error || (language === 'ru' ? 'Ошибка генерации' : 'Generation error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceResult = (text) => {
    setDescription(text);
  };

  return (
    <div>
      <h2>{t.title}</h2>

      <div className="form-group">
        <label>{t.label}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.placeholder}
          disabled={loading}
        />
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
        <VoiceInput onResult={handleVoiceResult} label={t.voiceInput} />
        <button
          className="button"
          onClick={() => { setDescription(''); setResult(null); }}
          style={{ background: '#6b7280' }}
        >
          {t.clear}
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner"></div></div>}

      {result && <ResultDisplay title="Generated Task" content={result} />}
    </div>
  );
}

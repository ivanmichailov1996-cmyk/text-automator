import { useState, useEffect } from 'react';
import { getHistory, deleteHistoryItem } from '../services/api';

export default function History({ language }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const t = language === 'ru' ? {
    title: 'История команд',
    empty: 'История пуста',
    loading: 'Загрузка...',
    error: 'Ошибка загрузки истории',
    delete: 'Удалить'
  } : {
    title: 'Command History',
    empty: 'History is empty',
    loading: 'Loading...',
    error: 'Error loading history',
    delete: 'Delete'
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getHistory(50);
      setHistoryItems(response.history || []);
    } catch (err) {
      setError(err.error || t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      setHistoryItems(historyItems.filter(item => item.id !== id));
    } catch (err) {
      setError(err.error || t.error);
    }
  };

  return (
    <div>
      <h2>{t.title}</h2>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading"><div className="spinner"></div></div>}

      {!loading && historyItems.length === 0 && (
        <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '2rem' }}>
          {t.empty}
        </p>
      )}

      <div className="history-list">
        {historyItems.map((item) => (
          <div key={item.id} className="history-item">
            <span className="history-item-type">{item.type.toUpperCase()}</span>
            <div className="history-item-text">{item.input_text}</div>
            <div className="history-item-date">
              {new Date(item.created_at).toLocaleString()}
            </div>
            <button
              className="button"
              onClick={() => handleDelete(item.id)}
              style={{ background: '#ef4444', marginTop: '0.5rem', width: '100%' }}
            >
              {t.delete}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

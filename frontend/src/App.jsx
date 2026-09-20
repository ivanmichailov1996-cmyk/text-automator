import { useState, useEffect } from 'react';
import { initTelegram } from './services/api';
import TaskGenerator from './components/TaskGenerator';
import LetterGenerator from './components/LetterGenerator';
import RewriteText from './components/RewriteText';
import PostGenerator from './components/PostGenerator';
import History from './pages/History';

export default function App() {
  const [activeTab, setActiveTab] = useState('task');
  const [language, setLanguage] = useState('ru');

  useEffect(() => {
    initTelegram();
  }, []);

  const translations = {
    ru: {
      title: '🤖 Text Automator',
      task: '📋 Задачи',
      letter: '✉️ Письма',
      rewrite: '✨ Переписать',
      post: '📱 Посты',
      history: '🕐 История'
    },
    en: {
      title: '🤖 Text Automator',
      task: '📋 Tasks',
      letter: '✉️ Letters',
      rewrite: '✨ Rewrite',
      post: '📱 Posts',
      history: '🕐 History'
    }
  };

  const t = translations[language];

  return (
    <div className="app">
      <header className="header">
        <h1>{t.title}</h1>
        <button
          className="lang-toggle"
          onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
        >
          {language === 'ru' ? 'EN' : 'РУ'}
        </button>
      </header>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'task' ? 'active' : ''}`}
          onClick={() => setActiveTab('task')}
        >
          {t.task}
        </button>
        <button
          className={`nav-tab ${activeTab === 'letter' ? 'active' : ''}`}
          onClick={() => setActiveTab('letter')}
        >
          {t.letter}
        </button>
        <button
          className={`nav-tab ${activeTab === 'rewrite' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewrite')}
        >
          {t.rewrite}
        </button>
        <button
          className={`nav-tab ${activeTab === 'post' ? 'active' : ''}`}
          onClick={() => setActiveTab('post')}
        >
          {t.post}
        </button>
        <button
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          {t.history}
        </button>
      </nav>

      <div className="main-content">
        <div className={`component ${activeTab === 'task' ? 'active' : ''}`}>
          <TaskGenerator language={language} />
        </div>
        <div className={`component ${activeTab === 'letter' ? 'active' : ''}`}>
          <LetterGenerator language={language} />
        </div>
        <div className={`component ${activeTab === 'rewrite' ? 'active' : ''}`}>
          <RewriteText language={language} />
        </div>
        <div className={`component ${activeTab === 'post' ? 'active' : ''}`}>
          <PostGenerator language={language} />
        </div>
        <div className={`component ${activeTab === 'history' ? 'active' : ''}`}>
          <History language={language} />
        </div>
      </div>
    </div>
  );
}

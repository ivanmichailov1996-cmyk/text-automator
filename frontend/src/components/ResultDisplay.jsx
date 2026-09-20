import { useState } from 'react';

export default function ResultDisplay({ title, content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-card">
      <h3>{title}</h3>
      <div className="result-text">{content}</div>
      <button className="button copy-button" onClick={handleCopy}>
        {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
      </button>
    </div>
  );
}

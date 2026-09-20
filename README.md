# Text Automator - Telegram Mini App

A production-ready Telegram Mini App for automatic text generation and transformation. Generate tasks, letters, rewritten text, and social media posts with voice input support.

## Features

- **Task Generator**: Create structured tasks for employees with objectives, requirements, and success criteria
- **Letter Generator**: Generate professional letters with different tones (formal, friendly, firm)
- **Text Rewriter**: Rewrite text at different intensity levels (light, medium, heavy)
- **Post Generator**: Create platform-specific content for Telegram, Instagram, and LinkedIn
- **Voice Input**: Voice-to-text input for hands-free operation
- **Command History**: Track and manage all generated content
- **Bilingual Support**: Full Russian and English interface

## Tech Stack

### Frontend
- **React 18** with Vite bundler
- **Telegram Web App API** for Mini App integration
- **Axios** for API communication
- **CSS3** with modern design patterns

### Backend
- **Node.js** with Express.js
- **Supabase** (PostgreSQL) for data persistence
- **Hugging Face Transformers.js** for AI-powered text generation
- **CORS** configured for secure cross-origin requests

### Deployment
- **Frontend**: Vercel (SPA hosting)
- **Backend**: Railway (Node.js hosting)
- **Database**: Supabase (managed PostgreSQL)

## Project Structure

```
text-automator/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Express server
│   │   ├── middleware/
│   │   │   └── auth.js              # Telegram auth middleware
│   │   ├── services/
│   │   │   ├── db.js                # Supabase client & queries
│   │   │   └── huggingface.js       # AI text generation
│   │   └── routes/
│   │       ├── tasks.js
│   │       ├── letters.js
│   │       ├── rewrite.js
│   │       ├── posts.js
│   │       ├── voice.js
│   │       └── history.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── TaskGenerator.jsx
│   │   │   ├── LetterGenerator.jsx
│   │   │   ├── RewriteText.jsx
│   │   │   ├── PostGenerator.jsx
│   │   │   ├── VoiceInput.jsx
│   │   │   └── ResultDisplay.jsx
│   │   └── pages/
│   │       └── History.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── Procfile                         # Railway deployment config
├── .gitignore
└── README.md
```

## Setup & Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Telegram Bot (get from @BotFather)
- Supabase account (free tier available)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

Environment variables needed:
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Development or production
- `TELEGRAM_BOT_TOKEN`: From BotFather
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Supabase anonymous key
- `ALLOWED_ORIGINS`: Comma-separated list of allowed domains

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api` to the backend.

### Database Setup

Create these tables in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- History table
CREATE TABLE history (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  input_text TEXT,
  output_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_history_user_id ON history(user_id);
```

## Deployment

### Deploy Backend to Railway

1. Push code to GitHub
2. Create Railway account and connect to GitHub
3. Set environment variables in Railway dashboard
4. Deploy - Railway detects `Procfile` automatically

### Deploy Frontend to Vercel

1. Connect GitHub repository to Vercel
2. Set environment variable: `REACT_APP_API_URL=https://your-railway-domain.com/api`
3. Deploy - Vercel automatically builds and deploys

### Configure Telegram Mini App

After deployment, configure the mini app menu button using:

```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setChatMenuButton \
  -H "Content-Type: application/json" \
  -d '{
    "menu_button": {
      "type": "web_app",
      "text": "Open Text Automator",
      "web_app": {
        "url": "https://your-vercel-domain.vercel.app"
      }
    }
  }'
```

## API Endpoints

### Task Generation
- `POST /api/tasks/generate` - Generate structured task
  - Body: `{ description, language }`

### Letter Generation
- `POST /api/letters/generate` - Generate professional letter
  - Body: `{ topic, points, tone, language }`

### Text Rewriting
- `POST /api/rewrite/generate` - Rewrite text
  - Body: `{ text, level, language }`

### Post Generation
- `POST /api/posts/generate` - Generate social media post
  - Body: `{ topic, platform, language }`

### History
- `GET /api/history?limit=50` - Get user's history
- `DELETE /api/history/:id` - Delete history item

## Authentication

All requests are authenticated via Telegram headers:
- `x-telegram-id`: User's Telegram ID
- `x-telegram-username`: User's Telegram username
- `x-telegram-first-name`: User's first name

These headers are automatically added by the frontend and verified by backend middleware.

## License

MIT

## Author

Created for portfolio - Text Automator Telegram Mini App

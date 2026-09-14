import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initTelegram } from '@/telegram/sdk';
import { applyTelegramTheme } from '@/telegram/theme';

// The SDK must be initialised before anything reads init data or theme params.
initTelegram();
// Light/dark comes from Telegram's own themeParams, not prefers-color-scheme:
// the client can run a dark app theme on a light OS and vice versa.
applyTelegramTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

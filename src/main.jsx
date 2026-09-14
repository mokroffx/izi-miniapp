import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initTelegram } from '@/telegram/sdk';
import { applyInitialTheme } from '@/telegram/theme';

// The SDK must be initialised before anything reads init data.
initTelegram();
// Applies a stored manual theme choice, or dark by default if the student has
// never touched the header toggle (see theme.js).
applyInitialTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

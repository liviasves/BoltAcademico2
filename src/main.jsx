import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </NotificationProvider>
  </StrictMode>
);

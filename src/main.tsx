import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Carrega o Tailwind
import './i18n';      // Carrega as traduções

// Procura a div "root" no HTML e inicia o App
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
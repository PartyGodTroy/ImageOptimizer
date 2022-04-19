import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.css';
import './magick.js?worker';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

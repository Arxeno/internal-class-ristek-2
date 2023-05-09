import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { GlobalStateProvider } from './GlobalStateContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GlobalStateProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GlobalStateProvider>
);

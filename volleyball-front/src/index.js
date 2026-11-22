import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './state/AuthContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  // </React.StrictMode>
);

/**
 * Production ビルドで Service Worker を登録し、ホーム画面追加・キャッシュを有効化する。
 */
serviceWorkerRegistration.register();

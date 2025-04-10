import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // 👈 This line connects to your App
import './index.css' // 👈 Tailwind styles

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}

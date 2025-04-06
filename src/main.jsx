
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';  // Ensure we're importing App.jsx, not App.tsx
import './index.css';

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

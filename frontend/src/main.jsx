
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Create root once and render the app
const rootElement = document.getElementById("root");

// Handle potential race conditions and prevent duplicate rendering
if (rootElement) {
  // Check if the root already has a React root attached
  if (!rootElement._reactRootContainer) {
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.warn("Root element already has a React root attached. Skipping render.");
  }
} else {
  console.error("Root element not found. Cannot mount React application.");
}

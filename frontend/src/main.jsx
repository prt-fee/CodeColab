
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Function to initialize the application
const initializeApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Root element not found. Cannot mount React application.");
    return;
  }
  
  // Check if the root already has a React root attached to prevent duplicate rendering
  if (!rootElement._reactRootContainer) {
    try {
      const root = createRoot(rootElement);
      
      // Remove the initial loader when the app is rendering
      const initialLoader = document.querySelector('.initial-loader');
      if (initialLoader) {
        initialLoader.classList.add('loaded');
        setTimeout(() => {
          initialLoader.style.display = 'none';
        }, 500);
      }
      
      // Render the app with strict mode
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      
      console.log("Application mounted successfully");
    } catch (error) {
      console.error("Failed to initialize React application:", error);
    }
  } else {
    console.warn("Root element already has a React root attached. Skipping render.");
  }
};

// Initialize the app when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

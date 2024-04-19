import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

// Get the root DOM element
const rootElement = document.getElementById('root');

// Create a root using createRoot
const root = createRoot(rootElement);

// Use the root to render your app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

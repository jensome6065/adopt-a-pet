import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Adjust the path as necessary
import './index.css'; // Ensure your CSS file is correctly located

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

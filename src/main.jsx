import React from 'react';
import { createRoot } from 'react-dom/client';
import { BRAND } from './constants/brand';
import './index.css';
import App from './App';
import './components/training/NavigationResponsiveFix.css';

document.title = `${BRAND.fullName} - ${BRAND.subtitle}`;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
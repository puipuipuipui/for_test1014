import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import GraphManagementPage from './pages/GraphManagement/GraphManagementPage.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/graph-management" element={<GraphManagementPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import ManageKeywords from './pages/ManageKeywords';
import PrivacyControls from './pages/PrivacyControls';
import AccuracyCheck from './pages/AccuracyCheck';
import Login from './pages/Login'; // 👈 ADD LOGIN IMPORT
import './App.css';

function AppContent() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false); // 👈 DARK MODE STATE

  // 👈 HANDLE UNAUTHENTICATED - SHOW LOGIN
  if (!user) {
    return (
      <div className={`App ${darkMode ? 'dark' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  const toggleDarkMode = () => setDarkMode(prev => !prev); // 👈 DARK MODE TOGGLE

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className={`nav ${darkMode ? 'dark-nav' : ''}`}>
        <div className="nav-brand">
          <span>🛡️ VoxGuard</span>
        </div>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/keywords">Keywords</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/accuracy">Accuracy</Link>
        </div>
        <div className="nav-actions">
          <button 
            className={`dark-mode-toggle ${darkMode ? 'active' : ''}`}
            onClick={toggleDarkMode}
            title={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Protected Routes */}
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode} 
              />
            } 
          />
          <Route 
            path="/keywords" 
            element={
              <ManageKeywords 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode} 
              />
            } 
          />
          <Route 
            path="/privacy" 
            element={
              <PrivacyControls 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode} 
              />
            } 
          />
          <Route 
            path="/accuracy" 
            element={
              <AccuracyCheck 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode} 
              />
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ManageKeywords from './pages/ManageKeywords';
import PrivacyControls from './pages/PrivacyControls';
import AccuracyCheck from './pages/AccuracyCheck';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/manage-keywords" element={<ManageKeywords darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/privacy-controls" element={<PrivacyControls darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/accuracy-check" element={<AccuracyCheck darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
      </Routes>
    </Router>
  );
}

export default App;
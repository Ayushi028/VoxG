import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  
  // State for metrics
  const [callsDetected, setCallsDetected] = useState(12);
  const [spamBlocked, setSpamBlocked] = useState(8);
  const [sessionTime, setSessionTime] = useState(2121);
  
  // State for sensitivity slider
  const [sensitivity, setSensitivity] = useState(50);

  // Session timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle slider change
  const handleSliderChange = (e) => {
    setSensitivity(e.target.value);
  };

  // Function to add more detected calls (demo)
  const addCall = () => {
    setCallsDetected(prev => prev + 1);
    if (Math.random() > 0.3) {
      setSpamBlocked(prev => prev + 1);
    }
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-container' : ''}`}>
      {/* Header Section */}
      <header className={`header ${darkMode ? 'dark-header' : ''}`}>
        <div className="header-top">
          <div className="header-icon">🛡️</div>
          <button 
            className={`dark-mode-toggle ${darkMode ? 'active' : ''}`}
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <h1>VoxGuard</h1>
        
        <div className="status-badge">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">Protection Active</span>
          </div>
          <p className="status-subtitle">Listening for Spam Calls</p>
        </div>
      </header>

      {/* Metrics Section */}
      <section className="metrics-section">
        <div className={`metric-card ${darkMode ? 'dark-card' : ''}`} onClick={addCall} style={{cursor: 'pointer'}}>
          <div className="metric-icon">📞</div>
          <p className="metric-label">Calls Detected</p>
          <p className="metric-value">{callsDetected}</p>
          <p className="metric-hint">(Tap to simulate incoming call)</p>
        </div>
        
        <div className={`metric-card ${darkMode ? 'dark-card' : ''}`}>
          <div className="metric-icon">🚫</div>
          <p className="metric-label">Spam Blocked</p>
          <p className="metric-value">{spamBlocked}</p>
          <p className="metric-hint">(Protected from threats)</p>
        </div>
        
        <div className={`metric-card ${darkMode ? 'dark-card' : ''}`}>
          <div className="metric-icon">⏰</div>
          <p className="metric-label">Session Length</p>
          <p className="metric-value">{formatTime(sessionTime)}</p>
          <p className="metric-hint">(Time active)</p>
        </div>
      </section>

      {/* Slider Section */}
      <section className={`slider-section ${darkMode ? 'dark-section' : ''}`}>
        <div className="slider-label">
          <h3>🎛️ Detection Sensitivity</h3>
          <span className="slider-value">{sensitivity}%</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          value={sensitivity}
          onChange={handleSliderChange}
          className="sensitivity-slider"
        />
        
        <div className="slider-labels">
          <span>🔓 Allow More</span>
          <span>🔒 Block More</span>
        </div>
        
        <div className="sensitivity-info">
          <p>
            {sensitivity < 30 && "🔒 Low: Only blocks obvious spam (fewer false positives)"}
            {sensitivity >= 30 && sensitivity < 70 && "⚖️ Medium: Balanced protection"}
            {sensitivity >= 70 && "🔥 High: Aggressive blocking (may block some real calls)"}
          </p>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="buttons-section">
        <button 
          className={`action-button ${darkMode ? 'dark-button' : ''}`}
          onClick={() => navigate('/manage-keywords')}
        >
          <span className="button-icon">📝</span>
          <div className="button-text">
            <span className="button-title">Manage Spam Keywords</span>
            <span className="button-desc">Add/remove trigger words</span>
          </div>
        </button>
        
        <button 
          className={`action-button ${darkMode ? 'dark-button' : ''}`}
          onClick={() => navigate('/privacy-controls')}
        >
          <span className="button-icon">🔐</span>
          <div className="button-text">
            <span className="button-title">Privacy Controls</span>
            <span className="button-desc">Manage your data settings</span>
          </div>
        </button>
        
        <button 
          className={`action-button ${darkMode ? 'dark-button' : ''}`}
          onClick={() => navigate('/accuracy-check')}
        >
          <span className="button-icon">📊</span>
          <div className="button-text">
            <span className="button-title">Check Accuracy</span>
            <span className="button-desc">View detection performance</span>
          </div>
        </button>
      </section>

      {/* Privacy Section */}
      <section className={`privacy-section ${darkMode ? 'dark-privacy' : ''}`}>
        <h3>🔐 How Your Data Is Protected</h3>
        <p>
          Your data is processed locally on your device using advanced machine learning algorithms. 
          We do not store or transmit your call data to external servers. All analysis happens in 
          real-time, ensuring your privacy is maintained while providing accurate spam detection. 
          Your personal information remains completely confidential and is never shared with third parties.
        </p>
      </section>
    </div>
  );
}

export default Dashboard;
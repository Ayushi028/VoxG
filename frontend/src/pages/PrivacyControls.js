import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PrivacyControls({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    dataCollection: true,
    callRecording: false,
    cloudBackup: false,
    locationTracking: false,
    anonymousAnalytics: true
  });

  const toggleSetting = (key) => {
    setSettings({...settings, [key]: !settings[key]});
  };

  return (
    <div className={`page-container ${darkMode ? 'dark-container' : ''}`}>
      <button 
        className={`back-button ${darkMode ? 'dark-back' : ''}`} 
        onClick={() => navigate('/')}
      >
        ← Back to Dashboard
      </button>

      {/* Dark Mode Toggle */}
      <button 
        className={`dark-mode-toggle ${darkMode ? 'active' : ''}`}
        onClick={toggleDarkMode}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      
      <div className={`page-content ${darkMode ? 'dark-page-content' : ''}`}>
        <div className="page-header">
          <span className="page-icon">🔒</span>
          <h1>Privacy Controls</h1>
        </div>
        
        <p className="page-description">
          Manage how your data is collected and used. Your privacy is our priority.
        </p>

        {/* Privacy Settings List */}
        <div className="settings-list">
          <div className={`setting-item ${darkMode ? 'dark-setting-item' : ''}`}>
            <div className="setting-info">
              <span className="setting-icon">📊</span>
              <div>
                <h4>Data Collection</h4>
                <p>Allow anonymous usage data to improve detection</p>
              </div>
            </div>
            <button 
              className={`toggle-button ${settings.dataCollection ? 'active' : ''}`}
              onClick={() => toggleSetting('dataCollection')}
            >
              {settings.dataCollection ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className={`setting-item ${darkMode ? 'dark-setting-item' : ''}`}>
            <div className="setting-info">
              <span className="setting-icon">🎙️</span>
              <div>
                <h4>Call Recording</h4>
                <p>Record calls for spam analysis</p>
              </div>
            </div>
            <button 
              className={`toggle-button ${settings.callRecording ? 'active' : ''}`}
              onClick={() => toggleSetting('callRecording')}
            >
              {settings.callRecording ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className={`setting-item ${darkMode ? 'dark-setting-item' : ''}`}>
            <div className="setting-info">
              <span className="setting-icon">☁️</span>
              <div>
                <h4>Cloud Backup</h4>
                <p>Backup settings to cloud</p>
              </div>
            </div>
            <button 
              className={`toggle-button ${settings.cloudBackup ? 'active' : ''}`}
              onClick={() => toggleSetting('cloudBackup')}
            >
              {settings.cloudBackup ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className={`setting-item ${darkMode ? 'dark-setting-item' : ''}`}>
            <div className="setting-info">
              <span className="setting-icon">📍</span>
              <div>
                <h4>Location Tracking</h4>
                <p>Use location for regional spam patterns</p>
              </div>
            </div>
            <button 
              className={`toggle-button ${settings.locationTracking ? 'active' : ''}`}
              onClick={() => toggleSetting('locationTracking')}
            >
              {settings.locationTracking ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className={`setting-item ${darkMode ? 'dark-setting-item' : ''}`}>
            <div className="setting-info">
              <span className="setting-icon">📈</span>
              <div>
                <h4>Anonymous Analytics</h4>
                <p>Help improve spam detection globally</p>
              </div>
            </div>
            <button 
              className={`toggle-button ${settings.anonymousAnalytics ? 'active' : ''}`}
              onClick={() => toggleSetting('anonymousAnalytics')}
            >
              {settings.anonymousAnalytics ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyControls;
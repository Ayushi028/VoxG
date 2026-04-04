import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../App.css';

function Dashboard({ darkMode = false, toggleDarkMode = () => {} }) {
  const navigate = useNavigate();
  
  // 🔥 State Management - DEPLOYMENT READY
  const [stats, setStats] = useState({ callsDetected: 0, spamBlocked: 0 });
  const [totalHistory, setTotalHistory] = useState({ callsDetected: 0, spamBlocked: 0 });
  const [sessionTime, setSessionTime] = useState(0);
  const [sensitivity, setSensitivity] = useState(50);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('connecting...');
  const [lastCallResult, setLastCallResult] = useState(null);

  // 🔥 Load Stats + Session Timer
  useEffect(() => {
    loadStats();
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔥 Load current backend stats (history stays separate) - FIXED DEPLOYMENT LOGIC
  const loadStats = async () => {
    try {
      setLoading(true);
      const logsRes = await api.logs.getAll();
      const logs = logsRes.data?.data || logsRes.data || [];
      
      // 🔥 DEPLOYMENT FRESH START: Handle empty logs
      if (logs.length === 0) {
        console.log('🚀 DEPLOYMENT FRESH: Starting at 0!');
        setStats({ callsDetected: 0, spamBlocked: 0 });
        setBackendStatus('🚀 Fresh Deploy - Ready!');
        setLoading(false);
        return;
      }
      
      // 🔥 Show current backend count
      const totalCalls = logs.length;
      const spamCalls = logs.filter(log => 
        log.analysis?.isSpam || log.isSpam
      ).length;
      
      setStats({
        callsDetected: totalCalls,
        spamBlocked: spamCalls
      });
      setBackendStatus(`✅ LIVE (${totalCalls} active)`);
      
    } catch (error) {
      console.log('Demo mode activated:', error.message);
      setBackendStatus('🔄 Demo Ready');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 addCall - Backend saves + HISTORY NEVER RESETS!
  const addCall = async () => {
    const callerId = `+1-555-${Math.floor(Math.random() * 10000)}`;
    const transcript = Math.random() > 0.3 
      ? 'You won $1M lottery! Claim free loan now!' 
      : 'Bank calling about your account balance.';
    
    console.log('🔥 CALLING:', { callerId, transcript: transcript.slice(0, 30) + '...' });
    
    try {
      const response = await api.logs.report(callerId, transcript);
      const analysis = response.data?.data?.analysis || response.data?.analysis || {};
      const isSpam = analysis.isSpam ?? false;
      const confidence = analysis.confidence ?? 50;
      
      console.log('📞=== BACKEND CALL LOG ===');
      console.log('Phone:', callerId);
      console.log('Status:', isSpam ? '🚫 SPAM DETECTED' : '✅ SAFE CALL');
      console.log('Confidence:', confidence);
      
      // 🔥 INCREMENT HISTORY - NEVER RESETS!
      setTotalHistory(prev => ({
        callsDetected: prev.callsDetected + 1,
        spamBlocked: prev.spamBlocked + (isSpam ? 1 : 0)
      }));
      
      setLastCallResult({
        type: isSpam ? 'spam' : 'safe',
        message: transcript.substring(0, 40) + '...',
        confidence,
        time: new Date().toLocaleTimeString()
      });
      
    } catch (error) {
      const isDemoSpam = transcript.includes('lottery') || Math.random() > 0.4;
      const demoConfidence = Math.floor(Math.random() * 40) + (isDemoSpam ? 60 : 10);
      
      console.log('📞=== DEMO CALL LOG ===');
      console.log('Phone:', callerId);
      console.log('Status:', isDemoSpam ? '🚫 SPAM (Demo)' : '✅ SAFE (Demo)');
      
      // 🔥 Demo also adds to HISTORY!
      setTotalHistory(prev => ({
        callsDetected: prev.callsDetected + 1,
        spamBlocked: prev.spamBlocked + (isDemoSpam ? 1 : 0)
      }));
      
      setLastCallResult({
        type: isDemoSpam ? 'spam' : 'safe',
        message: transcript.substring(0, 40) + '...',
        confidence: demoConfidence,
        time: new Date().toLocaleTimeString(),
        demo: true
      });
    }
    
    loadStats(); // Refresh current stats
    
    // 🔥 Optional: Backend cleanup every 50 calls (UI history preserved)
    if (totalHistory.callsDetected % 50 === 0) {
      try {
        await api.logs.purge();
        console.log('🧹 Backend purged - History preserved!');
        loadStats(); // Refresh current count to 0
      } catch(e) {
        console.log('Purge skipped');
      }
    }
  };

  // 🔥 Format Time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (e) => {
    setSensitivity(e.target.value);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div>🔄 Loading Dashboard...</div>
        <div>🚀 Preparing fresh deploy...</div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-container' : ''}`}>
      {/* Header */}
      <header className={`header ${darkMode ? 'dark-header' : ''}`}>
        <div className="header-top">
          <div className="header-logo">
            <img src="/VoxGuard_logo.png" alt="VoxGuard Logo" className="logo-img" />
          </div>
          <button 
            className={`dark-mode-toggle ${darkMode ? 'active' : ''}`}
            onClick={toggleDarkMode}
            title={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="status-badge">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">Protection Active</span>
          </div>
          <p className="status-subtitle">{backendStatus}</p>
        </div>
      </header>

      {/* Metrics */}
      <section className="metrics-section">
        <div className={`metric-card ${darkMode ? 'dark-card' : ''}`} 
             onClick={addCall} style={{cursor: 'pointer'}}>
          <div className="metric-icon">📞</div>
          <p className="metric-label">Calls Detected</p>
          <p className="metric-value">
            {stats.callsDetected} <small style={{fontSize: '0.7em', opacity: 0.7}}>(of {totalHistory.callsDetected})</small>
          </p>
          <div className="metric-hint">
            {lastCallResult ? (
              <div className={`last-result ${lastCallResult.type} ${darkMode ? 'dark-result' : ''}`}>
                <span className="result-icon">
                  {lastCallResult.type === 'spam' ? '🚫' : '✅'}
                </span>
                <span className="result-text">
                  {lastCallResult.demo ? '(Demo) ' : ''}
                  {lastCallResult.type === 'spam' ? 'Spam!' : 'Safe!'}
                  <small>{Math.round(lastCallResult.confidence)}%</small>
                </span>
                <small className="result-time">{lastCallResult.time}</small>
              </div>
            ) : (
              <span>👆 Tap for test!</span>
            )}
          </div>
        </div>
        
        <div className={`metric-card ${darkMode ? 'dark-card' : ''}`}>
          <div className="metric-icon">🚫</div>
          <p className="metric-label">Spam Blocked</p>
          <p className="metric-value">
            {stats.spamBlocked} <small style={{fontSize: '0.7em', opacity: 0.7}}>(of {totalHistory.spamBlocked})</small>
          </p>
          <p className="metric-hint">{backendStatus === '✅ LIVE' || backendStatus.includes('LIVE') ? 'Live' : 'Demo'}</p>
        </div>
        
        <div className={`metric-card ${darkMode ? 'dark-card' : ''}`}>
          <div className="metric-icon">⏰</div>
          <p className="metric-label">Session</p>
          <p className="metric-value">{formatTime(sessionTime)}</p>
          <p className="metric-hint">Active</p>
        </div>
      </section>

      {/* Sensitivity Slider */}
      <section className={`slider-section ${darkMode ? 'dark-section' : ''}`}>
        <div className="slider-label">
          <h3>🎛️ Detection Sensitivity</h3>
          <span className="slider-value">{sensitivity}%</span>
        </div>
        <input
          type="range" min="0" max="100" value={sensitivity}
          onChange={handleSliderChange}
          className="sensitivity-slider"
        />
        <div className="slider-labels">
          <span>🔓 Allow More</span>
          <span>🔒 Block More</span>
        </div>
        <div className="sensitivity-info">
          <p>
            {sensitivity < 30 && "🔒 Low"} 
            {sensitivity >= 30 && sensitivity < 70 && "⚖️ Medium"} 
            {sensitivity >= 70 && "🔥 High"}
          </p>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="buttons-section">
        <button className={`action-button ${darkMode ? 'dark-button' : ''}`} 
                onClick={() => navigate('/manage-keywords')}>
          <span className="button-icon">📝</span>
          <div className="button-text">
            <span>Manage Keywords</span>
            <span>Add/remove triggers</span>
          </div>
        </button>
        <button className={`action-button ${darkMode ? 'dark-button' : ''}`} 
                onClick={() => navigate('/privacy-controls')}>
          <span className="button-icon">🔐</span>
          <div className="button-text">
            <span>Privacy Controls</span>
            <span>Data settings</span>
          </div>
        </button>
        <button className={`action-button ${darkMode ? 'dark-button' : ''}`} 
                onClick={() => navigate('/accuracy-check')}>
          <span className="button-icon">📊</span>
          <div className="button-text">
            <span>Accuracy Check</span>
            <span>Performance stats</span>
          </div>
        </button>
      </section>

      {/* Debug */}
      <section className={`console-instructions ${darkMode ? 'dark-section' : ''}`}>
        <h4>🔧 Debug:</h4>
        <p>F12 → Console → Tap card → See logs!</p>
      </section>

      {/* Privacy */}
      <section className={`privacy-section ${darkMode ? 'dark-privacy' : ''}`}>
        <h3>🔐 Privacy Guaranteed</h3>
        <p>Server-side encryption. Instant purge. No sharing.</p>
      </section>
    </div>
  );
}

export default Dashboard;
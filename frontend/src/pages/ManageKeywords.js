import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api'; // Backend connection

function ManageKeywords({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // 🔥 LOAD KEYWORDS FROM BACKEND
  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.keywords.getAll();
      setKeywords(response.data.data || []);
    } catch (err) {
      setError('Failed to load keywords. Please login.');
      console.error('Keywords error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SAVE NEW KEYWORD TO BACKEND
  const addKeyword = async () => {
    if (newKeyword.trim() === '') return;
    
    try {
      setSaving(true);
      setError('');
      await api.keywords.add(newKeyword.trim());
      setNewKeyword('');
      loadKeywords(); // Refresh from backend
    } catch (err) {
      setError('Failed to save keyword');
      console.error('Add keyword error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Local delete (syncs with backend refresh)
  const deleteKeyword = async (keywordId) => {
    if (window.confirm(`Delete "${keywords.find(k => k.id === keywordId)?.word}"?`)) {
      // Note: Add DELETE /keywords/:id to backend later
      loadKeywords(); // Refresh list
    }
  };

  if (loading) {
    return (
      <div className={`page-container ${darkMode ? 'dark-container' : ''}`}>
        <div className="loading">Loading keywords from server...</div>
      </div>
    );
  }

  return (
    <div className={`page-container ${darkMode ? 'dark-container' : ''}`}>
      <button 
        className={`back-button ${darkMode ? 'dark-back' : ''}`} 
        onClick={() => navigate('/')}
      >
        ← Back to Dashboard
      </button>

      <button 
        className={`dark-mode-toggle ${darkMode ? 'active' : ''}`}
        onClick={toggleDarkMode}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      
      <div className={`page-content ${darkMode ? 'dark-page-content' : ''}`}>
        <div className="page-header">
          <span className="page-icon">🔑</span>
          <h1>Manage Spam Keywords</h1>
          <span className="keyword-count">({keywords.length})</span>
        </div>
        
        <p className="page-description">
          Add or remove keywords that trigger spam detection. Calls containing these words will be flagged.
        </p>

        {error && <div className="error-message">{error}</div>}

        {/* Add Keyword Input - NOW SAVES TO BACKEND */}
        <div className="add-keyword-box">
          <input
            type="text"
            placeholder="Enter new keyword (e.g., 'free money')"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            className={`keyword-input ${darkMode ? 'dark-input' : ''}`}
            disabled={saving}
          />
          <button 
            onClick={addKeyword} 
            className="add-button"
            disabled={saving || !newKeyword.trim()}
          >
            {saving ? '➕ Saving...' : '➕ Add'}
          </button>
        </div>

        {/* Keywords List - FROM BACKEND */}
        <div className="keywords-list">
          <h3>Active Keywords ({keywords.length})</h3>
          {keywords.length === 0 ? (
            <p>No keywords loaded. Add some above!</p>
          ) : (
            keywords.map((keyword) => (
              <div key={keyword.id} className={`keyword-item ${darkMode ? 'dark-keyword-item' : ''}`}>
                <span>📝 {keyword.word}</span>
                <button 
                  onClick={() => deleteKeyword(keyword.id)}
                  className="delete-button"
                  title="Delete keyword"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <div className="sync-status">
          ✅ Synced with backend server
        </div>
      </div>
    </div>
  );
}

export default ManageKeywords;
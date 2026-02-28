import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageKeywords({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState([
    'Win free',
    'Prize claim',
    'Bank urgent',
    'Verify account',
    'Click here',
    'Limited offer'
  ]);
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = () => {
    if (newKeyword.trim() !== '') {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const deleteKeyword = (index) => {
    const updated = keywords.filter((_, i) => i !== index);
    setKeywords(updated);
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
          <span className="page-icon">🔑</span>
          <h1>Manage Spam Keywords</h1>
        </div>
        
        <p className="page-description">
          Add or remove keywords that trigger spam detection. Calls containing these words will be flagged.
        </p>

        {/* Add Keyword Input */}
        <div className="add-keyword-box">
          <input
            type="text"
            placeholder="Enter new keyword..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className={`keyword-input ${darkMode ? 'dark-input' : ''}`}
          />
          <button onClick={addKeyword} className="add-button">
            ➕ Add
          </button>
        </div>

        {/* Keywords List */}
        <div className="keywords-list">
          <h3>Active Keywords ({keywords.length})</h3>
          {keywords.map((keyword, index) => (
            <div key={index} className={`keyword-item ${darkMode ? 'dark-keyword-item' : ''}`}>
              <span>📝 {keyword}</span>
              <button 
                onClick={() => deleteKeyword(index)}
                className="delete-button"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageKeywords;
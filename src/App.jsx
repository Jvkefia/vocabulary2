import React, { useState } from 'react';
import { BookOpen, Camera, GraduationCap, List, LogOut, User } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import WordList from './components/WordList';
import StudyMode from './components/StudyMode';
import AuthPage from './components/AuthPage';
import { useAuth } from './contexts/AuthContext';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'list', 'study'
  const [words, setWords] = useState([]);
  const { currentUser, logout } = useAuth();

  const handleWordsExtracted = (extractedWords) => {
    setWords(extractedWords);
    setActiveTab('list');
  };

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Failed to log out", err);
    }
  }

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <div className="app-layout">
      <header className="header">
        <div className="container header-content">
          <a href="#" className="logo" onClick={() => setActiveTab('upload')}>
            <BookOpen size={28} />
            Etoos Vocab AI
          </a>
          <nav className="nav-links">
            <button 
              className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <Camera size={18} className="inline mr-2" /> Add Words
            </button>
            <button 
              className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
              disabled={words.length === 0}
            >
              <List size={18} className="inline mr-2" /> My Words {words.length > 0 && `(${words.length})`}
            </button>
            <button 
              className={`nav-link ${activeTab === 'study' ? 'active' : ''}`}
              onClick={() => setActiveTab('study')}
              disabled={words.length === 0}
            >
              <GraduationCap size={18} className="inline mr-2" /> Study
            </button>
            <div className="user-info">
              <span title={currentUser.email}>
                <User size={18} className="inline mr-1" />
                <span className="user-email-text">{currentUser.email.split('@')[0]}</span>
              </span>
              <button onClick={handleLogout} className="logout-button" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="main container">
        {activeTab === 'upload' && (
          <ImageUpload onWordsExtracted={handleWordsExtracted} />
        )}
        
        {activeTab === 'list' && (
          <WordList 
            words={words} 
            onStartStudy={() => setActiveTab('study')} 
          />
        )}
        
        {activeTab === 'study' && (
          <StudyMode 
            words={words} 
            onExit={() => setActiveTab('list')} 
          />
        )}
      </main>

      <style>{`
        .inline { display: inline-block; vertical-align: text-bottom; }
        .mr-1 { margin-right: 0.25rem; }
        .mr-2 { margin-right: 0.5rem; }
        
        .nav-link:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: none;
          color: var(--text-muted);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-left: 1rem;
          padding-left: 1rem;
          border-left: 1px solid #eee;
          color: var(--text-color);
          font-size: 0.9rem;
        }

        .user-email-text {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          vertical-align: middle;
        }

        .logout-button {
          background: none;
          border: none;
          color: #ff4757;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .logout-button:hover {
          background-color: #fff1f2;
        }
      `}</style>
    </div>
  );
}

export default App;

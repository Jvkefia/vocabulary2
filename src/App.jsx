import React, { useState } from 'react';
import { BookOpen, Camera, GraduationCap, List } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import WordList from './components/WordList';
import StudyMode from './components/StudyMode';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'list', 'study'
  const [words, setWords] = useState([]);

  const handleWordsExtracted = (extractedWords) => {
    setWords(extractedWords);
    setActiveTab('list');
  };

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
        .mr-2 { margin-right: 0.5rem; }
        
        .nav-link:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: none;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}

export default App;

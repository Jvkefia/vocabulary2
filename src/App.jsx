import React, { useState, useEffect } from 'react';
import { BookOpen, Camera, GraduationCap, List, LogOut, User } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import WordList from './components/WordList';
import StudyMode from './components/StudyMode';
import AuthPage from './components/AuthPage';
import { useAuth } from './contexts/AuthContext';
import { mockWords } from './data';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'list', 'study'
  const [words, setWords] = useState([]);
  const [vocabularies, setVocabularies] = useState([]);
  const [currentVocabId, setCurrentVocabId] = useState(null);
  const { currentUser, logout, isGuest } = useAuth();

  useEffect(() => {
    if (currentUser) {
      if (isGuest) {
        setVocabularies([{
          id: 'guest-mock',
          name: '샘플 단어장 (게스트)',
          words: mockWords,
          createdAt: new Date().toISOString()
        }]);
      } else {
        loadVocabularies();
      }
    } else {
      setWords([]);
      setVocabularies([]);
    }
  }, [currentUser]);

  const loadVocabularies = async () => {
    if (!currentUser || isGuest) return;
    try {
      const q = query(
        collection(db, 'users', currentUser.uid, 'vocabularies'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const loadedVocabularies = [];
      querySnapshot.forEach((doc) => {
        loadedVocabularies.push({ id: doc.id, ...doc.data() });
      });
      setVocabularies(loadedVocabularies);
    } catch (error) {
      console.error("단어장 불러오기 실패:", error);
    }
  };

  const handleWordsExtracted = (extractedWords) => {
    // Just show the extracted words first without saving to Firestore
    setWords(extractedWords);
    setCurrentVocabId(null); // Mark as unsaved/new
    setActiveTab('list');
  };

  const handleSaveVocabulary = async (name) => {
    if (!currentUser || words.length === 0) return;

    if (isGuest) {
      const newVoc = {
        id: `guest-${Date.now()}`,
        name: name,
        words: words,
        createdAt: new Date().toISOString()
      };
      setVocabularies(prev => [newVoc, ...prev]);
      setCurrentVocabId(newVoc.id);
      return;
    }

    try {
      const vocData = {
        name: name,
        words: words,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'vocabularies'), vocData);
      const savedVoc = { id: docRef.id, ...vocData };
      
      setVocabularies(prev => [savedVoc, ...prev]);
      setCurrentVocabId(docRef.id);
      alert("단어장이 저장되었습니다.");
    } catch (error) {
      console.error("단어장 저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleDeleteVocabulary = async (id) => {
    if (!confirm("정말 이 단어장을 삭제하시겠습니까?")) return;

    if (isGuest) {
      setVocabularies(prev => prev.filter(v => v.id !== id));
      if (currentVocabId === id) {
        setWords([]);
        setCurrentVocabId(null);
      }
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'vocabularies', id));
      setVocabularies(prev => prev.filter(v => v.id !== id));
      if (currentVocabId === id) {
        setWords([]);
        setCurrentVocabId(null);
      }
    } catch (error) {
      console.error("단어장 삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleSelectVocabulary = (voc) => {
    setWords(voc.words);
    setCurrentVocabId(voc.id);
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
            에듀 보카 AI
          </a>
          <nav className="nav-links">
            <button 
              className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <Camera size={18} className="inline mr-2" /> 단어 추가
            </button>
            <button 
              className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              <List size={18} className="inline mr-2" /> 내 단어장
            </button>
            <button 
              className={`nav-link ${activeTab === 'study' ? 'active' : ''}`}
              onClick={() => setActiveTab('study')}
              disabled={words.length === 0}
            >
              <GraduationCap size={18} className="inline mr-2" /> 학습하기
            </button>
            <div className="user-info">
              <span title={isGuest ? "게스트 모드" : currentUser.email}>
                <User size={18} className="inline mr-1" />
                <span className="user-email-text">{isGuest ? "게스트" : currentUser.email?.split('@')[0]}</span>
              </span>
              <button onClick={handleLogout} className="logout-button" title="로그아웃">
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
            vocabularies={vocabularies}
            currentVocabId={currentVocabId}
            onSave={handleSaveVocabulary}
            onDelete={handleDeleteVocabulary}
            onSelect={handleSelectVocabulary}
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

import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, Play, Volume2, Save, Trash2, ArrowLeft, Book } from 'lucide-react';

export default function WordList({ 
  words, 
  vocabularies, 
  currentVocabId, 
  onSave, 
  onDelete, 
  onSelect, 
  onStartStudy 
}) {
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [listName, setListName] = useState('');
  const [isManaging, setIsManaging] = useState(false);

  // If no words are loaded and we have vocabularies, or if user was browsing vocabularies
  const showVocabularies = isManaging || (!words || words.length === 0);

  useEffect(() => {
    if (!words || words.length === 0) {
      setIsManaging(true);
    }
  }, [words]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!listName.trim()) return;
    onSave(listName);
    setListName('');
  };

  const currentVocab = vocabularies.find(v => v.id === currentVocabId);

  if (showVocabularies) {
    return (
      <div className="wordlist-container animate-fade-in">
        <div className="wordlist-header">
          <div className="header-left">
            <h2>My Vocabularies</h2>
            <span className="badge">{vocabularies.length} lists</span>
          </div>
          {words && words.length > 0 && (
            <button className="btn btn-outline" onClick={() => setIsManaging(false)}>
              <ArrowLeft size={18} /> Back to Current
            </button>
          )}
        </div>

        {vocabularies.length === 0 ? (
          <div className="empty-state">
            <Book size={48} className="text-muted" />
            <h3>No vocabularies yet</h3>
            <p>Upload an image to extract words and create your first list!</p>
          </div>
        ) : (
          <div className="vocab-grid">
            {vocabularies.map((voc) => (
              <div key={voc.id} className="vocab-card">
                <div className="vocab-card-content" onClick={() => {
                  onSelect(voc);
                  setIsManaging(false);
                }}>
                  <div className="vocab-icon">
                    <Book size={24} />
                  </div>
                  <div className="vocab-info">
                    <h3>{voc.name}</h3>
                    <p>{voc.words.length} words • {new Date(voc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  className="vocab-delete-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(voc.id);
                  }}
                  title="Delete Vocabulary"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        <style>{`
          .vocab-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
          }
          .vocab-card {
            background: white;
            border-radius: var(--radius-lg);
            border: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.25rem;
            transition: all 0.2s;
            cursor: pointer;
            position: relative;
            box-shadow: var(--shadow-sm);
          }
          .vocab-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            border-color: var(--primary-color);
          }
          .vocab-card-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex: 1;
          }
          .vocab-icon {
            width: 48px;
            height: 48px;
            background: #eff6ff;
            color: var(--primary-color);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .vocab-info h3 {
            margin: 0;
            font-size: 1.1rem;
            color: var(--dark-color);
          }
          .vocab-info p {
            margin: 0.25rem 0 0;
            font-size: 0.85rem;
            color: var(--text-muted);
          }
          .vocab-delete-btn {
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 6px;
            transition: all 0.2s;
          }
          .vocab-delete-btn:hover {
            background: #fff1f2;
            color: #ef4444;
          }
          .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            background: #f8fafc;
            border-radius: var(--radius-xl);
            margin-top: 2rem;
          }
          .empty-state h3 { margin-top: 1.5rem; color: var(--dark-color); }
          .empty-state p { color: var(--text-muted); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wordlist-container animate-fade-in">
      {!currentVocabId && (
        <div className="save-form-container">
          <form onSubmit={handleSave} className="save-form">
            <input 
              type="text" 
              placeholder="단어장 이름을 입력하세요 (예: 1단어장, 토익 등)" 
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="save-input"
              required
            />
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> 가입하여 저장하기
            </button>
          </form>
          <p className="save-hint">현재 추출된 단어들을 새 단어장으로 저장할 수 있습니다.</p>
        </div>
      )}

      <div className="wordlist-header">
        <div className="header-left">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ margin: 0 }}>{currentVocabId ? currentVocab?.name : "New Vocabulary"}</h2>
            <span className="badge-inline">{words.length} words</span>
          </div>
        </div>
        <div className="header-right">
          <button className="btn btn-outline" onClick={() => setIsManaging(true)}>
            <List size={18} /> All Lists
          </button>
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={20} />
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => setViewMode('card')}
              title="Card View"
            >
              <LayoutGrid size={20} />
            </button>
          </div>
          <button className="btn btn-primary" onClick={onStartStudy}>
            <Play size={18} /> Start Study
          </button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="card-grid">
          {words.map((item, index) => (
            <div className="word-card" key={index}>
              <div className="word-card-inner">
                <div className="word-card-front">
                  <div className="word-header">
                    <h3>{item.word}</h3>
                    <button className="icon-btn" title="Listen">
                      <Volume2 size={18} />
                    </button>
                  </div>
                  <span className="pos-badge">{item.pos}</span>
                  <div className="meaning-preview">
                    {item.meaning}
                  </div>
                  <div className="card-hint">Hover to see details</div>
                </div>
                
                <div className="word-card-back">
                  <h3>{item.word}</h3>
                  <div className="back-content">
                    <div className="detail-row">
                      <strong>Meaning</strong>
                      <p>{item.meaning}</p>
                    </div>
                    <div className="detail-row">
                      <strong>Example</strong>
                      <p className="example-text">"{item.example}"</p>
                    </div>
                    <div className="detail-row">
                      <strong>Synonyms</strong>
                      <div className="tags">
                        {item.synonyms?.map((syn, i) => (
                          <span key={i} className="tag">{syn}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-container">
          <table className="word-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>POS</th>
                <th>Meaning</th>
                <th>Example</th>
                <th>Synonyms</th>
              </tr>
            </thead>
            <tbody>
              {words.map((item, index) => (
                <tr key={index}>
                  <td className="font-bold text-primary">{item.word}</td>
                  <td><span className="pos-badge small">{item.pos}</span></td>
                  <td className="font-medium">{item.meaning}</td>
                  <td className="text-muted text-sm">{item.example}</td>
                  <td>{item.synonyms?.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .save-form-container {
          background: #f0f7ff;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid #bfdbfe;
        }
        .save-form {
          display: flex;
          gap: 1rem;
        }
        .save-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-md);
          font-size: 1rem;
        }
        .save-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .save-hint {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0.5rem 0 0;
        }
        .badge-inline {
          font-size: 0.85rem;
          color: var(--primary-color);
          font-weight: 600;
          background: #eff6ff;
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
          margin-top: 0.25rem;
        }
        .wordlist-container {
          max-width: 1200px;
          margin: 2rem auto;
        }
        
        .wordlist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .badge {
          background-color: #dbeafe;
          color: var(--primary-color);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .view-toggle {
          display: flex;
          background-color: var(--card-bg);
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        
        .toggle-btn {
          background: none;
          border: none;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          color: var(--text-muted);
          transition: var(--transition);
        }
        
        .toggle-btn:hover {
          background-color: var(--secondary-color);
        }
        
        .toggle-btn.active {
          background-color: var(--primary-color);
          color: white;
        }
        
        /* Grid */
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        /* Flip Card logic */
        .word-card {
          background-color: transparent;
          height: 260px;
          perspective: 1000px;
        }
        
        .word-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: left;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          box-shadow: var(--shadow-md);
          border-radius: var(--radius-lg);
        }
        
        .word-card:hover .word-card-inner {
          transform: rotateY(180deg);
          box-shadow: var(--shadow-lg);
        }
        
        .word-card-front, .word-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          background-color: var(--card-bg);
          display: flex;
          flex-direction: column;
        }
        
        .word-card-front {
          border-top: 4px solid var(--primary-color);
        }
        
        .word-card-back {
          transform: rotateY(180deg);
          background-color: var(--dark-color);
          color: white;
          overflow-y: auto;
        }
        
        .word-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .word-header h3 {
          font-size: 1.5rem;
          margin: 0;
          color: var(--dark-color);
        }
        
        .word-card-back h3 {
          color: white;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 0.5rem;
        }
        
        .icon-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 50%;
          padding: 0.25rem;
          transition: var(--transition);
        }
        .icon-btn:hover { background-color: var(--secondary-color); color: var(--primary-color); }
        
        .pos-badge {
          display: inline-block;
          background-color: #f1f5f9;
          color: #64748b;
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          align-self: flex-start;
          font-weight: 500;
        }
        
        .pos-badge.small { margin-bottom: 0; }
        
        .meaning-preview {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-main);
          margin-bottom: auto;
        }
        
        .card-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
          margin-top: 1rem;
          opacity: 0.6;
        }
        
        .back-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .detail-row strong {
          display: block;
          font-size: 0.75rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        
        .detail-row p { margin: 0; font-size: 0.9rem; }
        
        .example-text {
          font-style: italic;
          color: #cbd5e1;
        }
        
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        
        .tag {
          background-color: rgba(255,255,255,0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }
        
        /* Table */
        .table-container {
          background-color: var(--card-bg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          overflow-x: auto;
        }
        
        .word-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        
        .word-table th {
          background-color: var(--secondary-color);
          padding: 1rem 1.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .word-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .word-table tr:last-child td { border-bottom: none; }
        .word-table tr:hover td { background-color: #f8fafc; }
        
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .text-sm { font-size: 0.875rem; }
      `}</style>
    </div>
  );
}


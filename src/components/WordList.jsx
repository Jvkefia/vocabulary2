import React, { useState } from 'react';
import { LayoutGrid, List, Play, Volume2 } from 'lucide-react';

export default function WordList({ words, onStartStudy }) {
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

  if (!words || words.length === 0) return null;

  return (
    <div className="wordlist-container animate-fade-in">
      <div className="wordlist-header">
        <div className="header-left">
          <h2>Vocabulary List</h2>
          <span className="badge">{words.length} words found</span>
        </div>
        <div className="header-right">
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
                        {item.synonyms.map((syn, i) => (
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
                  <td>{item.synonyms.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
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
          gap: 1.5rem;
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

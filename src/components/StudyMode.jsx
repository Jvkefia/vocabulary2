import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

// modes: 1: EN->KO(MC), 2: EN->KO(Type), 3: KO->EN(MC), 4: KO->EN(Type)

export default function StudyMode({ words, onExit }) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [shuffledWords, setShuffledWords] = useState([]);
  
  // For MC
  const [options, setOptions] = useState([]);
  // For Typing
  const [inputText, setInputText] = useState('');
  
  const [feedback, setFeedback] = useState(null); // 'correct' or 'incorrect'

  useEffect(() => {
    // Shuffle words for the quiz session
    if (words && words.length > 0) {
      const shuffled = [...words].sort(() => 0.5 - Math.random());
      setShuffledWords(shuffled);
    }
  }, [words]);

  useEffect(() => {
    if (selectedMode && shuffledWords.length > 0 && !isFinished && !feedback) {
      if (selectedMode === 1 || selectedMode === 3) {
        generateOptions(shuffledWords[currentIndex]);
      }
    }
  }, [currentIndex, selectedMode, shuffledWords, isFinished, feedback]);

  const generateOptions = (currentWord) => {
    const isEnToKo = selectedMode === 1;
    const allOptions = words.map(w => isEnToKo ? w.meaning : w.word);
    const correctAns = isEnToKo ? currentWord.meaning : currentWord.word;
    
    // Get 3 random distinct incorrect options
    let wrongOptions = allOptions.filter(opt => opt !== correctAns);
    wrongOptions = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Combine and shuffle
    const finalOptions = [correctAns, ...wrongOptions].sort(() => 0.5 - Math.random());
    setOptions(finalOptions);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setFeedback(null);
    setInputText('');
  };

  const handleAnswer = (answer) => {
    if (feedback) return; // prevent multiple clicks
    
    const currentWord = shuffledWords[currentIndex];
    let isCorrect = false;

    if (selectedMode === 1) {
      isCorrect = answer === currentWord.meaning;
    } else if (selectedMode === 2) {
      // Typing EN -> KO requires broad matching or exact 
      // Simplified: check if typed text is included in meaning or exactly matches
      isCorrect = currentWord.meaning.includes(answer.trim());
    } else if (selectedMode === 3) {
      isCorrect = answer === currentWord.word;
    } else if (selectedMode === 4) {
      isCorrect = currentWord.word.toLowerCase() === answer.trim().toLowerCase();
    }

    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      setFeedback(null);
      setInputText('');
      if (currentIndex + 1 < shuffledWords.length) {
        setCurrentIndex(c => c + 1);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  const currentWord = shuffledWords[currentIndex];

  if (!selectedMode) {
    return (
      <div className="study-container animate-fade-in">
        <div className="study-header-main">
          <button className="btn-icon" onClick={onExit}><ArrowLeft size={24} /></button>
          <h2>Select Study Mode</h2>
        </div>
        
        <div className="mode-grid">
          <button className="mode-card" onClick={() => handleModeSelect(1)}>
            <div className="mode-icon">🇺🇸 ➔ 🇰🇷</div>
            <h3>English to Korean</h3>
            <p>Multiple Choice</p>
          </button>
          <button className="mode-card" onClick={() => handleModeSelect(2)}>
            <div className="mode-icon">⌨️</div>
            <h3>English to Korean</h3>
            <p>Type the Meaning</p>
          </button>
          <button className="mode-card" onClick={() => handleModeSelect(3)}>
            <div className="mode-icon">🇰🇷 ➔ 🇺🇸</div>
            <h3>Korean to English</h3>
            <p>Multiple Choice</p>
          </button>
          <button className="mode-card" onClick={() => handleModeSelect(4)}>
            <div className="mode-icon">✍️</div>
            <h3>Korean to English</h3>
            <p>Type the Word</p>
          </button>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="study-container result-container animate-fade-in">
        <div className="result-card shadow-lg">
          <h2>Study Complete!</h2>
          <div className="score-circle">
            <span className="score-text">{score}</span>
            <span className="score-total">/ {shuffledWords.length}</span>
          </div>
          <p className="result-message">
            {score === shuffledWords.length ? 'Perfect score! Outstanding!' : 'Great effort! Keep practicing.'}
          </p>
          <div className="result-actions">
            <button className="btn btn-outline" onClick={() => handleModeSelect(selectedMode)}>
              <RotateCcw size={18} /> Retry
            </button>
            <button className="btn btn-primary" onClick={() => setSelectedMode(null)}>
              Choose Another Mode
            </button>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  const isEnToKo = selectedMode === 1 || selectedMode === 2;
  const promptText = isEnToKo ? currentWord.word : currentWord.meaning;
  const isTyping = selectedMode === 2 || selectedMode === 4;

  return (
    <div className="study-container animate-fade-in">
      <div className="quiz-header">
        <button className="btn-icon" onClick={() => setSelectedMode(null)}>
          <ArrowLeft size={20} /> Exit Mode
        </button>
        <div className="progress">
          <span className="progress-text">Word {currentIndex + 1} of {shuffledWords.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentIndex) / shuffledWords.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="score-badge">Score: {score}</div>
      </div>

      <div className="quiz-card shadow-md">
        <h2 className="prompt-text">{promptText}</h2>
        {isEnToKo && <span className="pos-badge">{currentWord.pos}</span>}

        <div className="answer-section">
          {isTyping ? (
            <form onSubmit={e => { e.preventDefault(); handleAnswer(inputText); }} className="typing-form">
              <input 
                type="text" 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={isEnToKo ? "Type Korean meaning..." : "Type English word..."}
                autoFocus
                disabled={feedback !== null}
                className={`text-input ${feedback ? (feedback === 'correct' ? 'input-correct' : 'input-incorrect') : ''}`}
              />
              <button type="submit" className="btn btn-primary" disabled={!inputText || feedback !== null}>
                Submit
              </button>
            </form>
          ) : (
            <div className="options-grid">
              {options.map((opt, i) => {
                let btnClass = "option-btn";
                // feedback styling
                if (feedback) {
                  const isCorrectAnswer = isEnToKo ? opt === currentWord.meaning : opt === currentWord.word;
                  if (isCorrectAnswer) btnClass += " correct-ans";
                  else btnClass += " disabled-ans";
                }
                
                return (
                  <button 
                    key={i} 
                    className={btnClass}
                    onClick={() => handleAnswer(opt)}
                    disabled={feedback !== null}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {feedback && (
          <div className={`feedback-overlay animate-fade-in ${feedback}`}>
           {feedback === 'correct' ? <CheckCircle2 size={64} /> : <XCircle size={64} />}
           <h3 className="mt-4">{feedback === 'correct' ? 'Correct!' : 'Incorrect'}</h3>
           {feedback === 'incorrect' && (
             <p>The right answer is <strong>{isEnToKo ? currentWord.meaning : currentWord.word}</strong></p>
           )}
          </div>
        )}
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .study-container {
    max-width: 800px;
    margin: 2rem auto;
  }
  
  .study-header-main {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    font-weight: 500;
  }
  
  .btn-icon:hover {
    color: var(--primary-color);
  }
  
  .mode-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .mode-card {
    background-color: var(--card-bg);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
  }
  
  .mode-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-color);
  }
  
  .mode-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .mode-card h3 {
    margin-bottom: 0.5rem;
    color: var(--dark-color);
  }
  
  .mode-card p {
    color: var(--text-muted);
    font-size: 0.875rem;
  }
  
  /* Quiz UI */
  .quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .progress {
    flex: 1;
    margin: 0 2rem;
  }
  
  .progress-text {
    display: block;
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
    text-align: center;
  }
  
  .progress-bar {
    height: 8px;
    background-color: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
  }
  
  .score-badge {
    background-color: #fce7f3;
    color: #db2777;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
  }
  
  .quiz-card {
    background-color: var(--card-bg);
    border-radius: var(--radius-xl);
    padding: 4rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .prompt-text {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    color: var(--dark-color);
  }
  
  .pos-badge {
    display: inline-block;
    background-color: var(--secondary-color);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
  }
  
  .answer-section {
    margin-top: 3rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .option-btn {
    background-color: #f8fafc;
    border: 2px solid #e2e8f0;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    color: var(--text-main);
  }
  
  .option-btn:hover:not(:disabled) {
    border-color: var(--primary-color);
    background-color: #eff6ff;
  }
  
  .option-btn.correct-ans {
    background-color: #dcfce7 !important;
    border-color: var(--success) !important;
    color: #166534 !important;
  }
  
  .option-btn.disabled-ans {
    opacity: 0.5;
  }
  
  .typing-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .text-input {
    padding: 1rem 1.5rem;
    font-size: 1.25rem;
    border: 2px solid #e2e8f0;
    border-radius: var(--radius-md);
    outline: none;
    transition: var(--transition);
    text-align: center;
  }
  
  .text-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .text-input.input-correct {
    border-color: var(--success);
    background-color: #dcfce7;
  }
  
  .text-input.input-incorrect {
    border-color: var(--danger);
    background-color: #fee2e2;
  }
  
  .feedback-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(255,255,255,0.95);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }
  
  .feedback-overlay.correct { color: var(--success); }
  .feedback-overlay.incorrect { color: var(--danger); }
  
  /* Result UI */
  .result-container {
    display: flex;
    justify-content: center;
  }
  
  .result-card {
    background-color: var(--card-bg);
    border-radius: var(--radius-xl);
    padding: 4rem;
    text-align: center;
    width: 100%;
    max-width: 500px;
  }
  
  .score-circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: conic-gradient(var(--primary-color) 100%, #e2e8f0 0);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2rem auto;
    border: 8px solid #eff6ff;
  }
  
  .score-text {
    font-size: 3rem;
    font-weight: 800;
    color: var(--dark-color);
    line-height: 1;
  }
  
  .score-total {
    color: var(--text-muted);
    font-weight: 500;
  }
  
  .result-message {
    font-size: 1.25rem;
    color: var(--text-main);
    margin-bottom: 2rem;
  }
  
  .result-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
`;

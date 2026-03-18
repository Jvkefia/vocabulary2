import React, { useState } from 'react';
import { UploadCloud, CheckCircle, Loader, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
  const savedKey = localStorage.getItem('GEMINI_API_KEY');
  return savedKey || import.meta.env.VITE_GEMINI_API_KEY;
};

export default function ImageUpload({ onWordsExtracted }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');

  // Helper function to convert file to generative part
  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const processImage = async (file) => {
    const activeKey = getApiKey();
    if (!activeKey || activeKey === 'your_gemini_api_key_here') {
      setError("Gemini API 키가 필요합니다. 설정에서 API 키를 입력해주세요.");
      setShowSettings(true);
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      const genAI = new GoogleGenerativeAI(activeKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { response_mime_type: "application/json" }
      });
      const imagePart = await fileToGenerativePart(file);

      const prompt = `
        You are an expert English teacher. Analyze this image of English vocabulary.
        DO NOT evaluate or complain about the image quality, blurriness, or lighting under any circumstances.
        Even if you can barely read the text, just guess and extract whatever you can see.
        You MUST return a JSON array. DO NOT return any text saying the image is unclear or you cannot read it.
        
        Extract the following information for EACH word found:
        - word: the English word
        - pos: part of speech (in Korean, e.g., 동사, 명사, 형용사, 부사)
        - meaning: Korean meaning
        - example: an example sentence (either from the image or create a simple, clear one if not visible)
        - synonyms: an array of 2-3 common synonyms
        
        CRITICAL: 
        1. Ignore image quality entirely. DO NOT reject the image.
        2. Guess the words if they are blurry.
        3. If NO words can be identified at all, generate a few placeholder words like [{"word": "example", "pos": "명사", "meaning": "예시", "example": "This is an example.", "synonyms": ["instance"]}] instead of failing.
        4. Do NOT include any explanations or apologies in your response. 
        5. Return ONLY valid JSON array.
      `;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      const extractedWords = JSON.parse(text);
      
      if (extractedWords.length === 0) {
        throw new Error("이미지에서 추출할 수 있는 단어가 발견되지 않았습니다. 다른 이미지를 사용해주세요.");
      }
      
      setIsUploading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        onWordsExtracted(extractedWords);
      }, 1000);
      
    } catch (err) {
      console.error("Extraction error:", err);
      console.error("Error details:", {
        message: err.message,
        name: err.name,
        stack: err.stack,
        status: err.status
      });
      
      let errorMsg = "AI 단어 추출에 실패했습니다. 다른 이미지를 시도하거나 잠시 후 다시 시도해주세요.";
      if (err.message) {
         errorMsg += `\n상세 에러: ${err.message}`;
      }
      
      // Simplify error message so users just try again without AI scolding them about quality
      setError(errorMsg);
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container animate-fade-in">
      <div className="upload-header">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Upload Vocabulary Image</h2>
          <button 
            className="btn btn-icon" 
            onClick={() => setShowSettings(true)}
            title="API Settings"
          >
            ⚙️
          </button>
        </div>
        <p>AI가 이미지에서 단어를 추출하여 단어장을 만들어줍니다.</p>
      </div>

      {showSettings && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <h3>API 키 설정</h3>
            <p>Gemini API 키를 입력해주세요. 이 키는 브라우저에만 안전하게 저장됩니다.</p>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="settings-input" 
                placeholder="AI-..." 
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
              />
              {tempKey && (
                <button 
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  onClick={() => setTempKey('')}
                >
                  ✕
                </button>
              )}
            </div>
            <div className="settings-actions">
              <button className="btn btn-outline" onClick={() => setShowSettings(false)}>취소</button>
              <button className="btn btn-primary" onClick={() => {
                localStorage.setItem('GEMINI_API_KEY', tempKey);
                setShowSettings(false);
                setError(null);
              }}>저장</button>
            </div>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="api-help-link"
            >
              API 키가 없으신가요? 여기서 무료로 받기
            </a>
          </div>
        </div>
      )}

      <div 
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''} ${error ? 'error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="upload-status">
            <Loader className="icon-spin text-primary" size={48} />
            <h3>Processing Image...</h3>
            <p>AI is reading and translating the vocabulary.</p>
          </div>
        ) : isSuccess ? (
          <div className="upload-status success">
            <CheckCircle className="text-success" size={48} />
            <h3>Extraction Complete!</h3>
            <p>Your flashcards are ready.</p>
          </div>
        ) : error ? (
          <div className="upload-status error">
            <AlertTriangle className="text-danger" size={48} />
            <h3>Extraction Failed</h3>
            <p>{error}</p>
            <label className="btn btn-outline mt-4">
              Try Another Image
              <input 
                type="file" 
                className="hidden-input" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <div className="upload-prompt">
            <UploadCloud size={48} className="text-muted mb-4" />
            <h3>Drag & Drop your image here</h3>
            <p className="text-muted">or</p>
            <label className="btn btn-outline mt-4">
              Browse Files
              <input 
                type="file" 
                className="hidden-input" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            <p className="upload-hint">Supports JPG, PNG form book pages or screenshots</p>
          </div>
        )}
      </div>

      <style>{`
        .upload-container {
          max-width: 600px;
          margin: 4rem auto;
          text-align: center;
        }
        .upload-header h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--dark-color);
        }
        .upload-header p {
          color: var(--text-muted);
          margin-bottom: 2rem;
        }
        .upload-zone {
          background-color: var(--card-bg);
          border: 2px dashed #cbd5e1;
          border-radius: var(--radius-xl);
          padding: 4rem 2rem;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        .upload-zone.dragging {
          border-color: var(--primary-color);
          background-color: #eff6ff;
          transform: scale(1.02);
        }
        .upload-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .upload-status p {
          white-space: pre-wrap;
          word-break: break-word;
        }
        .upload-status h3 {
          margin-top: 1rem;
        }
        .icon-spin {
          animation: spin 2s linear infinite;
        }
        .text-primary { color: var(--primary-color); }
        .text-success { color: var(--success); }
        .text-danger { color: #ef4444; }
        .text-muted { color: var(--text-muted); }
        .mb-4 { margin-bottom: 2rem; }
        .mt-4 { margin-top: 1rem; }
        
        .btn-icon {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .btn-icon:hover {
          background: #f1f5f9;
        }

        .settings-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .settings-modal {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
        .settings-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          margin: 1rem 0;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .settings-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .settings-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .api-help-link {
          display: block;
          font-size: 0.875rem;
          color: var(--primary-color);
          text-align: center;
          text-decoration: underline;
        }
        
        .hidden-input {
          display: none;
        }
        .upload-hint {
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

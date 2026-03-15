import React, { useState } from 'react';
import { UploadCloud, CheckCircle, Loader } from 'lucide-react';
import { mockWords } from '../data';

export default function ImageUpload({ onWordsExtracted }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const processImage = (file) => {
    // Simulate AI parsing
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      
      // Simulate passing extracted words to parent after short delay
      setTimeout(() => {
        onWordsExtracted(mockWords);
      }, 1000);
      
    }, 2500);
  };

  return (
    <div className="upload-container animate-fade-in">
      <div className="upload-header">
        <h2>Upload Vocabulary Image</h2>
        <p>Our AI will automatically extract english words and build your flashcards.</p>
      </div>

      <div 
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
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
        .upload-status h3 {
          margin-top: 1rem;
        }
        .icon-spin {
          animation: spin 2s linear infinite;
        }
        .text-primary { color: var(--primary-color); }
        .text-success { color: var(--success); }
        .text-muted { color: var(--text-muted); }
        .mb-4 { margin-bottom: 1rem; }
        .mt-4 { margin-top: 1rem; }
        
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

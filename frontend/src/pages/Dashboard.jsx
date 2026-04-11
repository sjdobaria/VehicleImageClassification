import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, Loader2, ImageIcon, CheckCircle, BarChart3, Clock, Sparkles } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState([]);

  const fileInputRef = useRef(null);

  // Check auth & fetch history
  useEffect(() => {
    const user = localStorage.getItem('vc_user');
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('vc_token');
        const response = await fetch('http://localhost:8000/api/predict/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      }
    };

    fetchHistory();
  }, [navigate]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const userName = (() => {
    try {
      const u = JSON.parse(localStorage.getItem('vc_user'));
      return u?.name || 'User';
    } catch { return 'User'; }
  })();

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) handleFileChange(e.dataTransfer.files[0]);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePredict = async () => {
    if (!selectedFile) return;
    setIsPredicting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const token = localStorage.getItem('vc_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }

      const response = await fetch('http://localhost:8000/api/predict/', {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction API error');
      }

      const data = await response.json();

      const newResult = {
        className: data.class,
        confidence: data.confidence,
        fileName: data.filename,
        timestamp: new Date().toLocaleTimeString(),
      };

      setResult(newResult);
      setHistory(prev => [newResult, ...prev].slice(0, 5));
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Error connecting to backend API.');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Greeting */}
      <div className="dash-greeting">
        <div>
          <h1 className="dash-title">
            Welcome, <span className="gradient-text">{userName}</span>
          </h1>
          <p className="dash-subtitle">Upload a vehicle image to get an instant AI classification.</p>
        </div>
        <div className="dash-stats">
          <div className="stat-chip">
            <BarChart3 size={16} />
            <span>{history.length} classified</span>
          </div>
          <div className="stat-chip">
            <Sparkles size={16} />
            <span>98.90% model accuracy</span>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        {/* Upload Section */}
        <div className="dash-card upload-section">
          <h2 className="card-title">
            <UploadCloud size={22} />
            Upload Image
          </h2>

          {!previewUrl ? (
            <div
              className={`dropzone ${isDragging ? 'active' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <div className="dropzone-icon-ring">
                <UploadCloud size={40} />
              </div>
              <p className="dropzone-title">Drag & drop your image here</p>
              <p className="dropzone-hint">or click to browse — JPG, PNG supported</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e.target.files[0])}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="preview-area">
              <div className="preview-image-wrapper">
                <img src={previewUrl} alt="Vehicle preview" className="preview-image" />
                <button className="preview-remove" onClick={clearSelection} aria-label="Remove">
                  <X size={18} />
                </button>
                <div className="preview-filename">{selectedFile?.name}</div>
              </div>

              <button
                className="classify-btn"
                onClick={handlePredict}
                disabled={isPredicting}
              >
                {isPredicting ? (
                  <>
                    <Loader2 size={22} className="spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Classify Vehicle
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Result + History */}
        <div className="dash-right">
          {/* Result Card */}
          <div className={`dash-card result-section ${result ? 'has-result' : ''}`}>
            <h2 className="card-title">
              <CheckCircle size={22} />
              Classification Result
            </h2>

            {result ? (
              <div className="result-body">
                <div className="result-vehicle-name">{result.className}</div>
                <div className="result-confidence-row">
                  <span className="result-conf-label">Confidence</span>
                  <span className="result-conf-value">{result.confidence}%</span>
                </div>
                <div className="result-bar-track">
                  <div
                    className="result-bar-fill"
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
                <p className="result-meta">{result.fileName} — {result.timestamp}</p>
              </div>
            ) : (
              <div className="result-empty">
                <ImageIcon size={48} strokeWidth={1} />
                <p>Upload and classify an image to see results here.</p>
              </div>
            )}
          </div>

          {/* History Card */}
          {history.length > 0 && (
            <div className="dash-card history-section">
              <h2 className="card-title">
                <Clock size={22} />
                Recent Activity
              </h2>
              <ul className="history-list">
                {history.map((item, i) => (
                  <li key={i} className="history-item">
                    <div className="history-dot"></div>
                    <div className="history-info">
                      <span className="history-class">{item.className}</span>
                      <span className="history-file">{item.fileName}</span>
                    </div>
                    <span className="history-conf">{item.confidence}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

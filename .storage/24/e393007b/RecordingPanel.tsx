import React, { useState } from "react";
import "../styles/glassmorphism.css";

interface RecordingPanelProps {
  darkMode: boolean;
}

export const RecordingPanel: React.FC<RecordingPanelProps> = ({ darkMode }) => {
  const [recordingType, setRecordingType] = useState<"full" | "window" | "area">("full");
  const [audioSources, setAudioSources] = useState({
    microphone: true,
    system: true,
    internal: false,
  });
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [videoQuality, setVideoQuality] = useState<"720p" | "1080p" | "2K" | "4K">("1080p");
  const [fps, setFps] = useState<30 | 60 | 120>(60);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState("00:00:00");
  const [currentFps] = useState(60);
  const [cpuUsage] = useState(12);
  const [gpuUsage] = useState(25);
  
  const handleStartRecording = () => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }
    
    if (!isRecording) {
      setIsRecording(true);
      // In a real app, this would start the actual recording
    }
  };
  
  const handlePauseRecording = () => {
    if (isRecording && !isPaused) {
      setIsPaused(true);
      // In a real app, this would pause the recording
    }
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime("00:00:00");
    // In a real app, this would stop and save the recording
  };
  
  const handleAudioSourceChange = (source: keyof typeof audioSources) => {
    setAudioSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };
  
  const handleCameraPIP = () => {
    setCameraEnabled(!cameraEnabled);
  };
  
  return (
    <div className={`glass-card p-6 ${darkMode ? '' : 'light-mode'}`}>
      <h2 className="text-2xl font-bold mb-6">Screen Recording</h2>
      
      {/* Recording Type Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Recording Area</h3>
        <div className="flex gap-3">
          <button 
            className={`neon-button ${recordingType === 'full' ? 'active' : ''}`}
            onClick={() => setRecordingType('full')}
          >
            Full Screen
          </button>
          <button 
            className={`neon-button ${recordingType === 'window' ? 'active' : ''}`}
            onClick={() => setRecordingType('window')}
          >
            Window
          </button>
          <button 
            className={`neon-button ${recordingType === 'area' ? 'active' : ''}`}
            onClick={() => setRecordingType('area')}
          >
            Custom Area
          </button>
        </div>
      </div>
      
      {/* Audio Sources */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Audio Sources</h3>
        <div className="flex gap-3 flex-wrap">
          <button 
            className={`neon-button ${audioSources.microphone ? 'active' : ''}`}
            onClick={() => handleAudioSourceChange('microphone')}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
              Microphone
            </span>
          </button>
          <button 
            className={`neon-button ${audioSources.system ? 'active' : ''}`}
            onClick={() => handleAudioSourceChange('system')}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              System Audio
            </span>
          </button>
          <button 
            className={`neon-button ${audioSources.internal ? 'active' : ''}`}
            onClick={() => handleAudioSourceChange('internal')}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
              App Audio Only
            </span>
          </button>
        </div>
      </div>
      
      {/* Camera PIP */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Camera Picture-in-Picture</h3>
        <button 
          className={`neon-button ${cameraEnabled ? 'active' : ''}`}
          onClick={handleCameraPIP}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            {cameraEnabled ? 'Disable Camera' : 'Enable Camera'}
          </span>
        </button>
        
        {cameraEnabled && (
          <div className="mt-3 flex items-center">
            <span className="mr-2">Size:</span>
            <select className="neon-button">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <span className="mx-3">Position:</span>
            <select className="neon-button">
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>
        )}
      </div>
      
      {/* Video Quality */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Video Quality</h3>
        <div className="flex gap-3">
          <button 
            className={`neon-button ${videoQuality === '720p' ? 'active' : ''}`}
            onClick={() => setVideoQuality('720p')}
          >
            720p
          </button>
          <button 
            className={`neon-button ${videoQuality === '1080p' ? 'active' : ''}`}
            onClick={() => setVideoQuality('1080p')}
          >
            1080p
          </button>
          <button 
            className={`neon-button ${videoQuality === '2K' ? 'active' : ''}`}
            onClick={() => setVideoQuality('2K')}
          >
            2K
          </button>
          <button 
            className={`neon-button ${videoQuality === '4K' ? 'active' : ''}`}
            onClick={() => setVideoQuality('4K')}
          >
            4K
          </button>
        </div>
      </div>
      
      {/* FPS Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Frame Rate</h3>
        <div className="flex gap-3">
          <button 
            className={`neon-button ${fps === 30 ? 'active' : ''}`}
            onClick={() => setFps(30)}
          >
            30 FPS
          </button>
          <button 
            className={`neon-button ${fps === 60 ? 'active' : ''}`}
            onClick={() => setFps(60)}
          >
            60 FPS
          </button>
          <button 
            className={`neon-button ${fps === 120 ? 'active' : ''}`}
            onClick={() => setFps(120)}
          >
            120 FPS
          </button>
        </div>
      </div>
      
      {/* Recording Controls */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="timer-display">
            {recordingTime}
          </div>
          
          <div className="performance-metrics flex gap-4">
            <div>FPS: {currentFps}</div>
            <div>CPU: {cpuUsage}%</div>
            <div>GPU: {gpuUsage}%</div>
          </div>
        </div>
        
        <div className="flex justify-center gap-6 items-center">
          <button 
            className={`stop-button ${isRecording ? '' : 'opacity-60'}`}
            onClick={handleStopRecording}
            disabled={!isRecording}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="6" width="12" height="12"></rect>
            </svg>
          </button>
          
          <button 
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={handleStartRecording}
          >
            {isRecording && isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <circle cx="12" cy="12" r="8"></circle>
              </svg>
            )}
          </button>
          
          <button 
            className={`pause-button ${isRecording && !isPaused ? '' : 'opacity-60'}`}
            onClick={handlePauseRecording}
            disabled={!isRecording || isPaused}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
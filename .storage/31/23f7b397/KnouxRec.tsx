import React, { useState, useCallback } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KnouxNavbar } from './components/KnouxNavbar';
import { RecordingPanel } from './components/RecordingPanel';
import { FeatureGrid } from './components/FeatureGrid';
import { TemplatesToolbox } from './components/TemplatesToolbox';
import { SettingsModal } from './components/SettingsModal';
import { VideoGallery } from './components/VideoGallery';
import { useScreenRecording } from './hooks/useScreenRecording';
import "./styles/glassmorphism.css";

// Generate feature icons
const getFeatureIcon = (id: string) => {
  switch(id) {
    case 'screen-recording':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="14" x="3" y="5" rx="2" ry="2"></rect>
          <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
        </svg>
      );
    case 'dual-audio':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      );
    case 'pip-camera':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4"></path>
          <rect x="14" y="14" width="7" height="5" rx="1"></rect>
        </svg>
      );
    case 'auto-start':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="10 8 16 12 10 16 10 8"></polygon>
        </svg>
      );
    case 'highlight-clicks':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6l-6 6"></path>
        </svg>
      );
    case 'stealth-mode':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
          <path d="M12 7v5l3 3"></path>
        </svg>
      );
    case 'instant-edit':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
      );
  }
};

export const KnouxRec: React.FC = () => {
  const frame = useCurrentFrame();
  
  // State
  const [darkMode, setDarkMode] = useState(true);
  const [notificationCount] = useState(3);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'record' | 'gallery' | 'edit'>('record');
  
  // Use our custom recording hook
  const {
    isRecording,
    isPaused,
    recordingTime,
    recordings,
    currentFps,
    cpuUsage,
    gpuUsage,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    deleteRecording,
    renameRecording
  } = useScreenRecording();
  
  const [features, setFeatures] = useState([
    { id: 'screen-recording', title: 'Screen Recording', description: 'Record your full screen, window, or a selected area', icon: getFeatureIcon('screen-recording'), enabled: true },
    { id: 'dual-audio', title: 'Dual Audio', description: 'Record both microphone and system audio simultaneously', icon: getFeatureIcon('dual-audio'), enabled: true },
    { id: 'pip-camera', title: 'Camera PIP', description: 'Add your webcam as picture-in-picture', icon: getFeatureIcon('pip-camera'), enabled: false },
    { id: 'auto-start', title: 'Smart Auto-Start', description: 'Automatically start recording based on triggers', icon: getFeatureIcon('auto-start'), enabled: false },
    { id: 'highlight-clicks', title: 'Click Highlighting', description: 'Visually highlight mouse clicks and keystrokes', icon: getFeatureIcon('highlight-clicks'), enabled: true },
    { id: 'stealth-mode', title: 'Stealth Mode', description: 'Hide recording indicators for distraction-free recording', icon: getFeatureIcon('stealth-mode'), enabled: false },
    { id: 'instant-edit', title: 'Instant Editing', description: 'Quick trim and edit tools for your recordings', icon: getFeatureIcon('instant-edit'), enabled: false },
    { id: 'scheduled-recording', title: 'Scheduled Recording', description: 'Set up automated recording sessions', icon: getFeatureIcon('auto-start'), enabled: false },
  ]);
  
  // Recording options
  const [recordingOptions, setRecordingOptions] = useState({
    recordingType: 'full' as const,
    videoQuality: '1080p' as const,
    fps: 60 as const,
    audioSources: {
      microphone: true,
      system: true,
      internal: false,
    },
    cameraEnabled: false,
    highlightClicks: true,
  });
  
  // Handlers
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);
  
  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);
  
  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);
  
  const handleToggleFeature = useCallback((featureId: string) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled } 
        : feature
    ));
    
    // Also update recording options based on feature toggles
    if (featureId === 'highlight-clicks') {
      setRecordingOptions(prev => ({
        ...prev,
        highlightClicks: !prev.highlightClicks,
      }));
    } else if (featureId === 'pip-camera') {
      setRecordingOptions(prev => ({
        ...prev,
        cameraEnabled: !prev.cameraEnabled,
      }));
    }
  }, []);
  
  const handleSelectTemplate = useCallback((templateId: string) => {
    // Apply the template (just a notification for demo)
    alert(`Template "${templateId}" applied successfully!`);
  }, []);
  
  const handleToggleAITool = useCallback((toolId: string) => {
    // In a real app, this would toggle/configure the AI tool
    alert(`AI tool "${toolId}" toggled. Local model is being initialized...`);
  }, []);
  
  const handleRecordingAction = useCallback(() => {
    if (isRecording) {
      if (isPaused) {
        resumeRecording();
      } else {
        pauseRecording();
      }
    } else {
      startRecording(recordingOptions);
    }
  }, [isRecording, isPaused, recordingOptions, startRecording, pauseRecording, resumeRecording]);
  
  const handleStopRecording = useCallback(() => {
    stopRecording();
    setActiveTab('gallery'); // Switch to gallery after recording
  }, [stopRecording]);
  
  const handleRecordingTypeChange = useCallback((type: 'full' | 'window' | 'area') => {
    setRecordingOptions(prev => ({
      ...prev,
      recordingType: type,
    }));
  }, []);
  
  const handleAudioSourceChange = useCallback((source: 'microphone' | 'system' | 'internal', enabled: boolean) => {
    setRecordingOptions(prev => ({
      ...prev,
      audioSources: {
        ...prev.audioSources,
        [source]: enabled,
      }
    }));
  }, []);
  
  const handleCameraToggle = useCallback((enabled: boolean) => {
    setRecordingOptions(prev => ({
      ...prev,
      cameraEnabled: enabled,
    }));
    
    // Also update the feature toggle
    setFeatures(prev => prev.map(feature => 
      feature.id === 'pip-camera' 
        ? { ...feature, enabled: enabled } 
        : feature
    ));
  }, []);
  
  const handleVideoQualityChange = useCallback((quality: '720p' | '1080p' | '2K' | '4K') => {
    setRecordingOptions(prev => ({
      ...prev,
      videoQuality: quality,
    }));
  }, []);
  
  const handleFpsChange = useCallback((fps: 30 | 60 | 120) => {
    setRecordingOptions(prev => ({
      ...prev,
      fps,
    }));
  }, []);

  // Animation
  const opacity = Math.min(1, frame / 30);
  
  return (
    <AbsoluteFill className={`app-container ${darkMode ? '' : 'light-mode'}`} style={{ opacity }}>
      {/* Navbar */}
      <KnouxNavbar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        notificationCount={notificationCount}
        openSettings={openSettings}
      />
      
      {/* Tab Navigation */}
      <div className="container mx-auto px-4 pt-4">
        <div className="flex justify-center space-x-4 mb-6">
          <button 
            className={`neon-button px-8 ${activeTab === 'record' ? 'active' : ''}`}
            onClick={() => setActiveTab('record')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
            Record
          </button>
          <button 
            className={`neon-button px-8 ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
              <line x1="7" x2="7" y1="2" y2="5" />
              <line x1="17" x2="17" y1="2" y2="5" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            Gallery
          </button>
          <button 
            className={`neon-button px-8 ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            Edit
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        {activeTab === 'record' && (
          <div className="space-y-8">
            {/* Recording Panel */}
            <RecordingPanel 
              darkMode={darkMode} 
              isRecording={isRecording}
              isPaused={isPaused}
              recordingTime={recordingTime}
              currentFps={currentFps}
              cpuUsage={cpuUsage}
              gpuUsage={gpuUsage}
              recordingType={recordingOptions.recordingType}
              audioSources={recordingOptions.audioSources}
              cameraEnabled={recordingOptions.cameraEnabled}
              videoQuality={recordingOptions.videoQuality}
              fps={recordingOptions.fps}
              onRecordingTypeChange={handleRecordingTypeChange}
              onAudioSourceChange={handleAudioSourceChange}
              onCameraToggle={handleCameraToggle}
              onVideoQualityChange={handleVideoQualityChange}
              onFpsChange={handleFpsChange}
              onStartRecording={handleRecordingAction}
              onStopRecording={handleStopRecording}
            />
            
            {/* Feature Grid */}
            <FeatureGrid 
              darkMode={darkMode}
              features={features}
              onToggleFeature={handleToggleFeature}
            />
            
            {/* Templates & AI Tools */}
            <TemplatesToolbox
              darkMode={darkMode}
              onSelectTemplate={handleSelectTemplate}
              onToggleAITool={handleToggleAITool}
            />
          </div>
        )}
        
        {activeTab === 'gallery' && (
          <VideoGallery 
            darkMode={darkMode}
            recordings={recordings}
            onDelete={deleteRecording}
            onRename={renameRecording}
          />
        )}
        
        {activeTab === 'edit' && (
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6">Video Editor</h2>
            
            {recordings.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-black rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    <p className="text-lg">Select a recording from the gallery to edit</p>
                    <button 
                      className="neon-button active mt-4"
                      onClick={() => setActiveTab('gallery')}
                    >
                      Go to Gallery
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-4">
                    <h3 className="font-bold mb-3">Trim</h3>
                    <p className="text-sm mb-4">Cut unwanted sections from your video</p>
                    <div className="flex gap-2">
                      <input type="text" value="00:00:00" className="bg-opacity-20 bg-gray-700 rounded px-2 py-1 w-24" />
                      <span className="self-center">to</span>
                      <input type="text" value="00:10:00" className="bg-opacity-20 bg-gray-700 rounded px-2 py-1 w-24" />
                      <button className="neon-button">Set</button>
                    </div>
                  </div>
                  
                  <div className="glass-card p-4">
                    <h3 className="font-bold mb-3">Effects</h3>
                    <p className="text-sm mb-4">Apply visual effects to your video</p>
                    <select className="neon-button w-full">
                      <option>None</option>
                      <option>Blur Background</option>
                      <option>Enhance Colors</option>
                      <option>Black & White</option>
                      <option>Neon Glow</option>
                    </select>
                  </div>
                  
                  <div className="glass-card p-4">
                    <h3 className="font-bold mb-3">Audio</h3>
                    <p className="text-sm mb-4">Adjust audio settings</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Volume</span>
                        <span>100%</span>
                      </div>
                      <input type="range" min="0" max="100" value="100" className="w-full" />
                      <div className="flex justify-between mt-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Noise Reduction
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4"></path>
                  <path d="M12 16h.01"></path>
                </svg>
                <h3 className="text-xl font-bold mb-2">No Recordings Found</h3>
                <p className="mb-6">Record your first video to start editing</p>
                <button 
                  className="neon-button active"
                  onClick={() => setActiveTab('record')}
                >
                  Start Recording
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isOpen={isSettingsOpen}
          onClose={closeSettings}
        />
      )}
    </AbsoluteFill>
  );
};
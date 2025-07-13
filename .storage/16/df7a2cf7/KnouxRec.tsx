import React, { useState, useCallback } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KnouxNavbar } from './components/KnouxNavbar';
import { RecordingPanel } from './components/RecordingPanel';
import { FeatureGrid } from './components/FeatureGrid';
import { TemplatesToolbox } from './components/TemplatesToolbox';
import { SettingsModal } from './components/SettingsModal';
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
  const [notificationCount, setNotificationCount] = useState(3);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
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
  }, []);
  
  const handleSelectTemplate = useCallback((templateId: string) => {
    // In a real app, this would apply the template
    console.log(`Template selected: ${templateId}`);
  }, []);
  
  const handleToggleAITool = useCallback((toolId: string) => {
    // In a real app, this would toggle/configure the AI tool
    console.log(`AI tool toggled: ${toolId}`);
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
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Recording Panel */}
          <RecordingPanel darkMode={darkMode} />
          
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
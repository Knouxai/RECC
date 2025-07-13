import React from 'react';
import "../styles/glassmorphism.css";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  darkMode: boolean;
  enabled?: boolean;
  onToggle?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  darkMode,
  enabled = false,
  onToggle
}) => {
  return (
    <div 
      className={`feature-card ${darkMode ? '' : 'light-mode'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="icon">
          {icon}
        </div>
        {onToggle && (
          <div className="toggle-switch">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={enabled} 
                onChange={onToggle} 
                className="sr-only peer"
              />
              <div className={`
                w-11 h-6 rounded-full 
                ${darkMode 
                  ? 'bg-gray-700 peer-checked:bg-purple-700' 
                  : 'bg-gray-300 peer-checked:bg-blue-400'
                } 
                peer-focus:ring-2 peer-focus:ring-purple-300
                after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                after:bg-white after:rounded-full after:h-5 after:w-5 
                after:transition-all peer-checked:after:translate-x-full
              `}></div>
            </label>
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-80 mb-3">{description}</p>
      
      {onToggle && (
        <button 
          className={`neon-button mt-auto w-full ${enabled ? 'active' : ''}`}
          onClick={onToggle}
        >
          {enabled ? 'Configure' : 'Enable'}
        </button>
      )}
    </div>
  );
};
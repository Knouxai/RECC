import React from 'react';
import { FeatureCard } from './FeatureCard';
import "../styles/glassmorphism.css";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface FeatureGridProps {
  darkMode: boolean;
  features: Feature[];
  onToggleFeature: (id: string) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  darkMode,
  features,
  onToggleFeature
}) => {
  return (
    <div className={`glass-card p-6 ${darkMode ? '' : 'light-mode'}`}>
      <h2 className="text-2xl font-bold mb-6">Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            darkMode={darkMode}
            enabled={feature.enabled}
            onToggle={() => onToggleFeature(feature.id)}
          />
        ))}
      </div>
    </div>
  );
};
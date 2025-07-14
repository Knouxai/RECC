import React, { useState } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Sequence } from "remotion";
import { TemplateGallery } from "./TemplateGallery";
import { VideoTemplate } from "../templates/TemplateData";
import { ArtisticPortrait } from "../templates/ArtisticPortrait";
import { BusinessIntro } from "../templates/BusinessIntro";
import { SocialStory } from "../templates/SocialStory";
import { MarketingPromo } from "../templates/MarketingPromo";
import { EducationalTemplate } from "../templates/EducationalTemplate";
import { CelebrationTemplate } from "../templates/CelebrationTemplate";

// مكونات القوالب
const templateComponents = {
  "artistic-portrait": ArtisticPortrait,
  "business-intro": BusinessIntro,
  "social-story": SocialStory,
  "marketing-promo": MarketingPromo,
  "educational-template": EducationalTemplate,
  "celebration-template": CelebrationTemplate,
};

type ViewMode = "gallery" | "customization" | "preview";

export const TemplateSelector: React.FC = () => {
  const frame = useCurrentFrame();
  const [selectedTemplate, setSelectedTemplate] =
    useState<VideoTemplate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [customSettings, setCustomSettings] = useState<any>({});

  // Animations
  const fadeIn = interpolate(frame, [0, 30], [0, 1]);
  const slideTransition = interpolate(frame, [0, 60], [-1920, 0]);

  const handleTemplateSelect = (template: VideoTemplate) => {
    setSelectedTemplate(template);
    setCustomSettings(template.customizableProps);
    setViewMode("customization");
  };

  const handleStartPreview = () => {
    setViewMode("preview");
  };

  const handleBackToGallery = () => {
    setViewMode("gallery");
  };

  const handleBackToCustomization = () => {
    setViewMode("customization");
  };

  const updateCustomSetting = (path: string, value: any) => {
    const pathParts = path.split(".");
    const newSettings = { ...customSettings };

    let current = newSettings;
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = value;

    setCustomSettings(newSettings);
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case "gallery":
        return (
          <TemplateGallery
            onTemplateSelect={handleTemplateSelect}
            selectedTemplate={selectedTemplate}
          />
        );

      case "customization":
        return (
          <CustomizationPanel
            template={selectedTemplate!}
            settings={customSettings}
            onSettingChange={updateCustomSetting}
            onStartPreview={handleStartPreview}
            onBackToGallery={handleBackToGallery}
          />
        );

      case "preview":
        return (
          <PreviewPanel
            template={selectedTemplate!}
            settings={customSettings}
            onBackToCustomization={handleBackToCustomization}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn,
        transform: `translateX(${slideTransition}px)`,
      }}
    >
      {renderCurrentView()}
    </AbsoluteFill>
  );
};

// مكون panel التخصيص
const CustomizationPanel: React.FC<{
  template: VideoTemplate;
  settings: any;
  onSettingChange: (path: string, value: any) => void;
  onStartPreview: () => void;
  onBackToGallery: () => void;
}> = ({
  template,
  settings,
  onSettingChange,
  onStartPreview,
  onBackToGallery,
}) => {
  const frame = useCurrentFrame();
  const panelSlide = interpolate(frame, [0, 60], [1920, 0]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        fontFamily: "Cairo, Arial, sans-serif",
        direction: "rtl",
        transform: `translateX(${panelSlide}px)`,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(20px)",
          padding: "30px",
          borderBottom: "2px solid #334155",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={onBackToGallery}
          style={{
            background: "rgba(51, 65, 85, 0.8)",
            border: "2px solid #475569",
            borderRadius: "15px",
            padding: "12px 24px",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ← العودة للمعرض
        </button>

        <h1
          style={{
            fontSize: 40,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ⚙️ تخصيص القالب: {template.name}
        </h1>

        <button
          onClick={onStartPreview}
          style={{
            background: "linear-gradient(45deg, #10b981, #22c55e)",
            border: "none",
            borderRadius: "15px",
            padding: "12px 30px",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🎬 معاينة النتيجة
        </button>
      </div>

      {/* Customization Content */}
      <div
        style={{
          padding: "40px",
          height: "calc(100vh - 140px)",
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
        }}
      >
        {/* Text Settings */}
        {settings.text && (
          <div
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              borderRadius: "20px",
              padding: "30px",
              border: "2px solid #334155",
            }}
          >
            <h2
              style={{
                fontSize: 28,
                color: "white",
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              📝 النصوص
            </h2>

            {Object.entries(settings.text).map(([key, value]) => (
              <div key={key} style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    color: "#94a3b8",
                    fontSize: "16px",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  {key === "title"
                    ? "العنوان الرئيسي"
                    : key === "subtitle"
                      ? "العنوان الفرعي"
                      : "الوصف"}
                </label>
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) =>
                    onSettingChange(`text.${key}`, e.target.value)
                  }
                  style={{
                    width: "100%",
                    background: "rgba(51, 65, 85, 0.8)",
                    border: "2px solid #475569",
                    borderRadius: "10px",
                    padding: "15px",
                    color: "white",
                    fontSize: "16px",
                    direction: "rtl",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Color Settings */}
        {settings.colors && (
          <div
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              borderRadius: "20px",
              padding: "30px",
              border: "2px solid #334155",
            }}
          >
            <h2
              style={{
                fontSize: 28,
                color: "white",
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              🎨 الألوان
            </h2>

            {Object.entries(settings.colors).map(([key, value]) => (
              <div key={key} style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    color: "#94a3b8",
                    fontSize: "16px",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  {key === "primary"
                    ? "اللون الأساسي"
                    : key === "secondary"
                      ? "اللون الثانوي"
                      : "لون الخلفية"}
                </label>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <input
                    type="color"
                    value={value as string}
                    onChange={(e) =>
                      onSettingChange(`colors.${key}`, e.target.value)
                    }
                    style={{
                      width: "60px",
                      height: "50px",
                      border: "2px solid #475569",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  />
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) =>
                      onSettingChange(`colors.${key}`, e.target.value)
                    }
                    style={{
                      flex: 1,
                      background: "rgba(51, 65, 85, 0.8)",
                      border: "2px solid #475569",
                      borderRadius: "10px",
                      padding: "12px",
                      color: "white",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Animation Settings */}
        {settings.animations && (
          <div
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              borderRadius: "20px",
              padding: "30px",
              border: "2px solid #334155",
            }}
          >
            <h2
              style={{
                fontSize: 28,
                color: "white",
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              🎭 الحركة والتأثيرات
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#94a3b8",
                  fontSize: "16px",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                سرعة الحركة: {settings.animations.speed}x
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={settings.animations.speed}
                onChange={(e) =>
                  onSettingChange(
                    "animations.speed",
                    parseFloat(e.target.value),
                  )
                }
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  background: "#475569",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        )}

        {/* Extra Settings */}
        {settings.extras && (
          <div
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              borderRadius: "20px",
              padding: "30px",
              border: "2px solid #334155",
            }}
          >
            <h2
              style={{
                fontSize: 28,
                color: "white",
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              ⚡ إعدادات إضافية
            </h2>

            {Object.entries(settings.extras).map(([key, value]) => (
              <div key={key} style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    color: "#94a3b8",
                    fontSize: "16px",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  {key}
                </label>
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) =>
                    onSettingChange(`extras.${key}`, e.target.value)
                  }
                  style={{
                    width: "100%",
                    background: "rgba(51, 65, 85, 0.8)",
                    border: "2px solid #475569",
                    borderRadius: "10px",
                    padding: "15px",
                    color: "white",
                    fontSize: "16px",
                    direction: "rtl",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// مكون panel المعاينة
const PreviewPanel: React.FC<{
  template: VideoTemplate;
  settings: any;
  onBackToCustomization: () => void;
}> = ({ template, settings, onBackToCustomization }) => {
  const frame = useCurrentFrame();
  const TemplateComponent =
    templateComponents[template.id as keyof typeof templateComponents];

  if (!TemplateComponent) {
    return (
      <AbsoluteFill
        style={{
          background: "#1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "24px",
        }}
      >
        القالب غير متوفر
      </AbsoluteFill>
    );
  }

  const previewProps = {
    ...settings.text,
    ...settings.colors,
    ...settings.animations,
    ...settings.extras,
  };

  return (
    <AbsoluteFill>
      {/* Preview Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(20px)",
          padding: "20px",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={onBackToCustomization}
          style={{
            background: "rgba(51, 65, 85, 0.8)",
            border: "2px solid #475569",
            borderRadius: "15px",
            padding: "10px 20px",
            color: "white",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ← العودة للتخصيص
        </button>

        <span
          style={{
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          🎬 معاينة: {template.name}
        </span>

        <div
          style={{
            background: "linear-gradient(45deg, #10b981, #22c55e)",
            borderRadius: "15px",
            padding: "10px 20px",
            color: "white",
            fontSize: "14px",
          }}
        >
          الإطار: {frame}
        </div>
      </div>

      {/* Template Preview */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: "50px",
          right: "50px",
          bottom: "50px",
          border: "3px solid #3b82f6",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(59, 130, 246, 0.3)",
        }}
      >
        <TemplateComponent {...previewProps} />
      </div>
    </AbsoluteFill>
  );
};

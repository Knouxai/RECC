import React, { useState, useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  videoTemplates,
  templateCategories,
  difficultyLevels,
  VideoTemplate,
} from "../templates/TemplateData";

interface TemplateGalleryProps {
  onTemplateSelect: (template: VideoTemplate) => void;
  selectedTemplate?: VideoTemplate | null;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onTemplateSelect,
  selectedTemplate,
}) => {
  const frame = useCurrentFrame();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Animation pour l'apparition
  const galleryOpacity = interpolate(frame, [0, 30], [0, 1]);
  const slideIn = interpolate(frame, [0, 60], [-100, 0]);

  // Filtrer les templates
  const filteredTemplates = useMemo(() => {
    return videoTemplates.filter((template) => {
      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        template.difficulty === selectedDifficulty;
      const matchesSearch =
        searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        opacity: galleryOpacity,
        fontFamily: "Cairo, Arial, sans-serif",
        direction: "rtl",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(20px)",
          padding: "30px",
          borderBottom: "2px solid #334155",
          transform: `translateY(${slideIn}px)`,
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            margin: "0 0 20px 0",
            background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🎬 معرض القوالب التفاعلي
        </h1>

        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(51, 65, 85, 0.8)",
              borderRadius: "25px",
              padding: "15px 30px",
              border: "2px solid #475569",
              minWidth: "400px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <span style={{ fontSize: "20px" }}>🔍</span>
            <input
              type="text"
              placeholder="ابحث عن قالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "18px",
                outline: "none",
                flex: 1,
                direction: "rtl",
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Category Filter */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ color: "#94a3b8", fontSize: "16px" }}>الفئة:</span>
            {templateCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  background:
                    selectedCategory === category.id
                      ? "linear-gradient(45deg, #3b82f6, #8b5cf6)"
                      : "rgba(51, 65, 85, 0.6)",
                  border:
                    selectedCategory === category.id
                      ? "2px solid #60a5fa"
                      : "2px solid #475569",
                  borderRadius: "20px",
                  padding: "10px 20px",
                  color: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ color: "#94a3b8", fontSize: "16px" }}>المستوى:</span>
            <button
              onClick={() => setSelectedDifficulty("all")}
              style={{
                background:
                  selectedDifficulty === "all"
                    ? "linear-gradient(45deg, #3b82f6, #8b5cf6)"
                    : "rgba(51, 65, 85, 0.6)",
                border:
                  selectedDifficulty === "all"
                    ? "2px solid #60a5fa"
                    : "2px solid #475569",
                borderRadius: "15px",
                padding: "8px 16px",
                color: "white",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              الكل
            </button>
            {difficultyLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedDifficulty(level.id)}
                style={{
                  background:
                    selectedDifficulty === level.id
                      ? level.color
                      : "rgba(51, 65, 85, 0.6)",
                  border:
                    selectedDifficulty === level.id
                      ? `2px solid ${level.color}`
                      : "2px solid #475569",
                  borderRadius: "15px",
                  padding: "8px 16px",
                  color: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div
        style={{
          position: "absolute",
          top: "220px",
          left: "30px",
          right: "30px",
          bottom: "30px",
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "25px",
          padding: "20px",
        }}
      >
        {filteredTemplates.map((template, index) => {
          const isSelected = selectedTemplate?.id === template.id;
          const cardDelay = index * 5;
          const cardOpacity = interpolate(frame - cardDelay, [0, 30], [0, 1]);
          const cardScale = isSelected ? 1.05 : 1;

          return (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template)}
              style={{
                background: isSelected
                  ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))"
                  : "rgba(30, 41, 59, 0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                border: isSelected ? "3px solid #60a5fa" : "2px solid #334155",
                padding: "25px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: `scale(${cardScale})`,
                opacity: cardOpacity,
                boxShadow: isSelected
                  ? "0 20px 40px rgba(59, 130, 246, 0.3)"
                  : "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Template Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "white",
                      margin: "0 0 5px 0",
                    }}
                  >
                    {template.name}
                  </h3>
                  <div
                    style={{
                      background:
                        difficultyLevels.find(
                          (l) => l.id === template.difficulty,
                        )?.color || "#6b7280",
                      borderRadius: "10px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      color: "white",
                      display: "inline-block",
                    }}
                  >
                    {
                      difficultyLevels.find((l) => l.id === template.difficulty)
                        ?.name
                    }
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "40px",
                    opacity: 0.8,
                  }}
                >
                  {
                    templateCategories.find((c) => c.id === template.category)
                      ?.icon
                  }
                </div>
              </div>

              {/* Template Description */}
              <p
                style={{
                  fontSize: "16px",
                  color: "#94a3b8",
                  margin: "0 0 15px 0",
                  lineHeight: 1.5,
                }}
              >
                {template.description}
              </p>

              {/* Template Tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "15px",
                }}
              >
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "rgba(59, 130, 246, 0.2)",
                      borderRadius: "10px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      color: "#93c5fd",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Template Info */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                  color: "#64748b",
                }}
              >
                <span>⏱️ {Math.floor(template.duration / template.fps)}s</span>
                <span>
                  📐 {template.width}×{template.height}
                </span>
                <span>🎬 {template.fps}fps</span>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "#22c55e",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    color: "white",
                  }}
                >
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🔍</div>
          <h3 style={{ fontSize: "24px", margin: "0 0 10px 0" }}>
            لم يتم العثور على قوالب
          </h3>
          <p style={{ fontSize: "16px", margin: 0 }}>
            جرب تغيير معايير البحث أو الفلترة
          </p>
        </div>
      )}

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => {
        const particleX = (i % 5) * 400 + Math.sin(frame * 0.02 + i) * 100;
        const particleY =
          Math.floor(i / 5) * 300 + Math.cos(frame * 0.015 + i) * 50;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: particleX,
              top: particleY + 300,
              width: 4,
              height: 4,
              backgroundColor: "#3b82f6",
              borderRadius: "50%",
              opacity: 0.3,
              boxShadow: "0 0 10px #3b82f6",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

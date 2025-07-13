import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";

interface EducationalTemplateProps {
  title: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  animationSpeed: number;
  lessonNumber?: string;
  subject?: string;
}

export const EducationalTemplate: React.FC<EducationalTemplateProps> = ({
  title = "الدرس الأول",
  subtitle = "أساسيات المادة",
  description = "في هذا الدرس سنتعلم المفاهيم الأساسية",
  primaryColor = "#3b82f6",
  secondaryColor = "#93c5fd",
  backgroundColor = "#1e3a8a",
  animationSpeed = 1,
  lessonNumber = "01",
  subject = "الرياضيات",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animation pour le numéro de leçon
  const lessonNumberSpring = spring({
    frame: frame - 20,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  // Animation pour le titre
  const titleSlide = interpolate(frame, [40, 80], [-1920, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animation pour les éléments éducatifs
  const boardOpacity = interpolate(frame, [100, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${backgroundColor}, ${primaryColor}40)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Cairo, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Grille éducative d'arrière-plan */}
      <AbsoluteFill>
        <svg width="100%" height="100%" style={{ opacity: 0.1 }}>
          <defs>
            <pattern
              id="eduGrid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={secondaryColor}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#eduGrid)" />
        </svg>
      </AbsoluteFill>

      {/* En-tête avec matière */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: "50%",
          transform: "translateX(-50%)",
          background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
          borderRadius: "25px",
          padding: "15px 50px",
          fontSize: 28,
          fontWeight: "bold",
          color: "white",
          direction: "rtl",
        }}
      >
        📚 {subject}
      </div>

      {/* Numéro de leçon grand format */}
      <Sequence from={20}>
        <div
          style={{
            position: "absolute",
            left: 100,
            top: "50%",
            transform: `translateY(-50%) scale(${lessonNumberSpring})`,
            fontSize: 300,
            fontWeight: "bold",
            color: `${secondaryColor}20`,
            zIndex: 1,
          }}
        >
          {lessonNumber}
        </div>
      </Sequence>

      {/* Tableau noir virtuel */}
      <Sequence from={100}>
        <div
          style={{
            background: "#2d3748",
            borderRadius: "20px",
            padding: "60px",
            border: `8px solid ${primaryColor}`,
            boxShadow: `0 20px 60px ${primaryColor}40`,
            opacity: boardOpacity,
            maxWidth: 1000,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Titre principal sur le tableau */}
          <div
            style={{
              transform: `translateX(${titleSlide}px)`,
              marginBottom: 40,
            }}
          >
            <h1
              style={{
                fontSize: 96,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                margin: 0,
                direction: "rtl",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              {title}
            </h1>
          </div>

          {/* Ligne de craie */}
          <div
            style={{
              width: "100%",
              height: 4,
              background: secondaryColor,
              marginBottom: 30,
              borderRadius: "2px",
            }}
          />

          {/* Sous-titre */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            <h2
              style={{
                fontSize: 48,
                fontWeight: 400,
                color: secondaryColor,
                margin: 0,
                direction: "rtl",
              }}
            >
              {subtitle}
            </h2>
          </div>

          {/* Description avec puces */}
          <div
            style={{
              textAlign: "right",
              direction: "rtl",
            }}
          >
            <p
              style={{
                fontSize: 36,
                fontWeight: 400,
                color: "rgba(255, 255, 255, 0.9)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              • {description}
            </p>
          </div>
        </div>
      </Sequence>

      {/* Icônes éducatives flottantes */}
      {["📖", "✏️", "🔬", "📐", "🧮", "💡"].map((icon, i) => {
        const iconFloat = interpolate(
          frame + i * 30,
          [0, durationInFrames],
          [0, -50],
        );
        const iconX = 200 + i * 200 + Math.sin((frame + i * 50) * 0.02) * 30;
        const iconY = 150 + Math.cos((frame + i * 40) * 0.015) * 40 + iconFloat;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: iconX,
              top: iconY,
              fontSize: 60,
              opacity: 0.7,
              transform: `rotate(${Math.sin(frame * 0.01 + i) * 15}deg)`,
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            }}
          >
            {icon}
          </div>
        );
      })}

      {/* Barre de progression de leçon */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 12,
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(frame / durationInFrames) * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
            borderRadius: "6px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Indicateur de temps */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 50,
          background: "rgba(0, 0, 0, 0.7)",
          borderRadius: "15px",
          padding: "10px 20px",
          fontSize: 24,
          color: secondaryColor,
          fontWeight: "bold",
        }}
      >
        ⏱️ {Math.floor(frame / fps)}s / {Math.floor(durationInFrames / fps)}s
      </div>

      {/* Formules mathématiques décoratives */}
      <div
        style={{
          position: "absolute",
          top: 200,
          right: 100,
          fontSize: 24,
          color: `${secondaryColor}60`,
          transform: `rotate(${frame * 0.5}deg)`,
        }}
      >
        E = mc²
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 150,
          fontSize: 32,
          color: `${secondaryColor}40`,
          transform: `rotate(${-frame * 0.3}deg)`,
        }}
      >
        π = 3.14159...
      </div>
    </AbsoluteFill>
  );
};

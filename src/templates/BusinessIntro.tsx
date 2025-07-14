import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";

interface BusinessIntroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  animationSpeed: number;
}

export const BusinessIntro: React.FC<BusinessIntroProps> = ({
  title = "شركة متميزة",
  subtitle = "نحو النجاح والتطور",
  description = "نقدم أفضل الحلول والخدمات المبتكرة",
  primaryColor = "#059669",
  secondaryColor = "#34d399",
  backgroundColor = "#064e3b",
  animationSpeed = 1.2,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animation progressive des éléments
  const logoScale = spring({
    frame: frame - 20,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  const titleSlide = interpolate(frame, [40, 80], [-1920, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleSlide = interpolate(frame, [80, 120], [1920, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const descriptionFade = interpolate(frame, [120, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Effet de grille technologique
  const gridOpacity = interpolate(
    frame,
    [0, 60, durationInFrames - 60, durationInFrames],
    [0, 0.3, 0.3, 0],
  );

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
      {/* Grille technologique d'arrière-plan */}
      <AbsoluteFill>
        <svg width="100%" height="100%" style={{ opacity: gridOpacity }}>
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke={secondaryColor}
                strokeWidth="1"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </AbsoluteFill>

      {/* Logo/Icon animé */}
      <Sequence from={20}>
        <div
          style={{
            transform: `scale(${logoScale})`,
            marginBottom: 60,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 20px 40px ${primaryColor}40`,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: "white",
                borderRadius: "10px",
                transform: `rotate(${frame * 2}deg)`,
              }}
            />
          </div>
        </div>
      </Sequence>

      {/* Titre principal */}
      <Sequence from={40}>
        <div
          style={{
            transform: `translateX(${titleSlide}px)`,
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              fontSize: 96,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              margin: 0,
              textShadow: `0 4px 20px ${primaryColor}`,
              direction: "rtl",
            }}
          >
            {title}
          </h1>
        </div>
      </Sequence>

      {/* Sous-titre */}
      <Sequence from={80}>
        <div
          style={{
            transform: `translateX(${subtitleSlide}px)`,
            marginBottom: 40,
          }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: 300,
              color: secondaryColor,
              textAlign: "center",
              margin: 0,
              direction: "rtl",
            }}
          >
            {subtitle}
          </h2>
        </div>
      </Sequence>

      {/* Description */}
      <Sequence from={120}>
        <div
          style={{
            opacity: descriptionFade,
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.9)",
              margin: 0,
              lineHeight: 1.6,
              direction: "rtl",
            }}
          >
            {description}
          </p>
        </div>
      </Sequence>

      {/* Barres animées en bas */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
          transform: `scaleX(${interpolate(frame, [180, 220], [0, 1])})`,
          transformOrigin: "left",
        }}
      />

      {/* Éléments décoratifs latéraux */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            right: 50 + i * 30,
            top: "50%",
            width: 4,
            height: interpolate(
              frame,
              [200 + i * 20, 240 + i * 20],
              [0, 200 + i * 50],
            ),
            backgroundColor: secondaryColor,
            transform: "translateY(-50%)",
            opacity: 0.7,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

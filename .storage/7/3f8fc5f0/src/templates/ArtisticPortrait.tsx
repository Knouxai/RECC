import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";

interface ArtisticPortraitProps {
  title: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  animationSpeed: number;
}

export const ArtisticPortrait: React.FC<ArtisticPortraitProps> = ({
  title = "Portrait Artistique",
  subtitle = "Création Professionnelle",
  description = "Une œuvre d'art numérique unique",
  primaryColor = "#4338ca",
  secondaryColor = "#818cf8",
  backgroundColor = "#1e1b4b",
  animationSpeed = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animations avec spring pour des mouvements naturels
  const titleSpring = spring({
    frame: frame - 30,
    fps,
    config: {
      damping: 200,
      stiffness: 50,
    },
  });

  const subtitleSpring = spring({
    frame: frame - 60,
    fps,
    config: {
      damping: 200,
      stiffness: 40,
    },
  });

  const descriptionSpring = spring({
    frame: frame - 90,
    fps,
    config: {
      damping: 200,
      stiffness: 30,
    },
  });

  // Effet de particules flottantes
  const particleOpacity = interpolate(
    frame,
    [0, 60, durationInFrames - 60, durationInFrames],
    [0, 1, 1, 0],
  );

  const backgroundGradient = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [0, 360, 720],
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${backgroundGradient}deg, ${backgroundColor}, ${primaryColor}20)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Cairo, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Particules d'arrière-plan */}
      <AbsoluteFill>
        {[...Array(20)].map((_, i) => {
          const particleDelay = i * 10;
          const particleX = interpolate(
            (frame - particleDelay) * animationSpeed,
            [0, durationInFrames],
            [Math.random() * -100, 1920 + 100],
          );
          const particleY = 200 + Math.sin(frame * 0.02 + i) * 100;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: particleX,
                top: particleY,
                width: 4 + Math.random() * 8,
                height: 4 + Math.random() * 8,
                backgroundColor: secondaryColor,
                borderRadius: "50%",
                opacity: particleOpacity * (0.3 + Math.random() * 0.7),
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Contenu principal */}
      <Sequence from={30}>
        <div
          style={{
            textAlign: "center",
            zIndex: 10,
            transform: `translateY(${interpolate(titleSpring, [0, 1], [100, 0])}px)`,
            opacity: titleSpring,
          }}
        >
          <h1
            style={{
              fontSize: 120,
              fontWeight: "bold",
              color: "white",
              textShadow: `0 0 30px ${primaryColor}`,
              margin: 0,
              marginBottom: 20,
              background: `linear-gradient(45deg, white, ${secondaryColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </h1>
        </div>
      </Sequence>

      <Sequence from={60}>
        <div
          style={{
            textAlign: "center",
            zIndex: 10,
            transform: `translateY(${interpolate(subtitleSpring, [0, 1], [50, 0])}px)`,
            opacity: subtitleSpring,
          }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: 300,
              color: secondaryColor,
              margin: 0,
              marginBottom: 30,
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            {subtitle}
          </h2>
        </div>
      </Sequence>

      <Sequence from={90}>
        <div
          style={{
            textAlign: "center",
            zIndex: 10,
            maxWidth: 800,
            transform: `translateY(${interpolate(descriptionSpring, [0, 1], [30, 0])}px)`,
            opacity: descriptionSpring,
          }}
        >
          <p
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.9)",
              margin: 0,
              lineHeight: 1.4,
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {description}
          </p>
        </div>
      </Sequence>

      {/* Élément décoratif en bas */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          width: interpolate(frame, [120, 180], [0, 400]),
          height: 4,
          background: `linear-gradient(90deg, transparent, ${secondaryColor}, transparent)`,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};

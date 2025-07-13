import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";

interface SocialStoryProps {
  title: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  animationSpeed: number;
}

export const SocialStory: React.FC<SocialStoryProps> = ({
  title = "قصة ملهمة",
  subtitle = "اكتشف المزيد",
  description = "محتوى رائع لوسائل التواصل",
  primaryColor = "#dc2626",
  secondaryColor = "#fca5a5",
  backgroundColor = "#7f1d1d",
  animationSpeed = 0.8,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animation bounce pour le titre
  const titleBounce = spring({
    frame: frame - 15,
    fps,
    config: {
      damping: 300,
      stiffness: 400,
    },
  });

  // Animation de rotation pour les emojis
  const emojiRotation = interpolate(frame, [0, durationInFrames], [0, 720]);

  // Animation de pulsation
  const pulseScale = 1 + Math.sin(frame * 0.2) * 0.1;

  // Animation de vague pour le background
  const waveOffset = interpolate(frame, [0, durationInFrames], [0, 400]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${backgroundColor}, ${primaryColor}60)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Cairo, Arial, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Vagues d'arrière-plan */}
      <AbsoluteFill>
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.3" />
              <stop offset="50%" stopColor={primaryColor} stopOpacity="0.5" />
              <stop
                offset="100%"
                stopColor={secondaryColor}
                stopOpacity="0.3"
              />
            </linearGradient>
          </defs>

          {[...Array(3)].map((_, i) => (
            <path
              key={i}
              d={`M 0,${300 + i * 150} Q ${270 + waveOffset},${200 + i * 150} ${540},${300 + i * 150} T ${1080},${300 + i * 150} V ${1920} H 0 Z`}
              fill="url(#waveGrad)"
              opacity={0.6 - i * 0.1}
              style={{
                transform: `translateX(${-waveOffset * (1 + i * 0.3)}px)`,
              }}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Emojis flottants */}
      <AbsoluteFill>
        {["✨", "🔥", "💫", "⭐", "🌟"].map((emoji, i) => {
          const floatY = interpolate(
            frame + i * 20,
            [0, durationInFrames],
            [1920, -100],
          );
          const floatX =
            200 + i * 150 + Math.sin((frame + i * 30) * 0.02) * 100;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: floatX,
                top: floatY,
                fontSize: 60,
                transform: `rotate(${emojiRotation + i * 45}deg)`,
                opacity: 0.8,
              }}
            >
              {emoji}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Badge décoratif en haut */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: "50%",
          transform: `translateX(-50%) scale(${pulseScale})`,
          background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
          borderRadius: "50px",
          padding: "15px 40px",
          fontSize: 24,
          fontWeight: "bold",
          color: "white",
          boxShadow: `0 10px 30px ${primaryColor}40`,
        }}
      >
        🎬 STORY
      </div>

      {/* Titre principal */}
      <Sequence from={15}>
        <div
          style={{
            transform: `scale(${titleBounce}) translateY(-50px)`,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          <h1
            style={{
              fontSize: 120,
              fontWeight: "bold",
              color: "white",
              margin: 0,
              textShadow: `0 8px 30px ${primaryColor}`,
              background: `linear-gradient(45deg, white, ${secondaryColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              direction: "rtl",
            }}
          >
            {title}
          </h1>
        </div>
      </Sequence>

      {/* Sous-titre avec animation de typing */}
      <Sequence from={45}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 50,
          }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: 400,
              color: secondaryColor,
              margin: 0,
              direction: "rtl",
              overflow: "hidden",
              whiteSpace: "nowrap",
              width:
                interpolate(frame - 45, [0, 60], [0, subtitle.length * 1.2]) +
                "ch",
              borderRight: "3px solid " + secondaryColor,
              animation: "blink 1s infinite",
            }}
          >
            {subtitle}
          </h2>
        </div>
      </Sequence>

      {/* Description avec effet de révélation */}
      <Sequence from={75}>
        <div
          style={{
            maxWidth: 700,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "30px",
            padding: "40px",
            border: `2px solid ${secondaryColor}40`,
            transform: `translateY(${interpolate(frame - 75, [0, 30], [100, 0])}px)`,
            opacity: interpolate(frame - 75, [0, 30], [0, 1]),
          }}
        >
          <p
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "white",
              margin: 0,
              lineHeight: 1.5,
              direction: "rtl",
            }}
          >
            {description}
          </p>
        </div>
      </Sequence>

      {/* Call-to-action en bas */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: "50%",
          transform: `translateX(-50%) scale(${interpolate(frame, [120, 150], [0, 1])})`,
          background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
          borderRadius: "50px",
          padding: "20px 60px",
          fontSize: 28,
          fontWeight: "bold",
          color: "white",
          boxShadow: `0 15px 40px ${primaryColor}60`,
          cursor: "pointer",
        }}
      >
        👆 اضغط للمتابعة
      </div>

      {/* Particules scintillantes */}
      {[...Array(15)].map((_, i) => {
        const sparkleDelay = i * 12;
        const sparkleOpacity =
          Math.sin((frame - sparkleDelay) * 0.3) * 0.5 + 0.5;
        const sparkleX = (i % 5) * 200 + 100;
        const sparkleY = Math.floor(i / 5) * 300 + 200;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sparkleX,
              top: sparkleY,
              width: 8,
              height: 8,
              backgroundColor: secondaryColor,
              borderRadius: "50%",
              opacity: sparkleOpacity,
              transform: `scale(${1 + sparkleOpacity})`,
              boxShadow: `0 0 20px ${secondaryColor}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";

interface PodcastTemplateProps {
  title: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  animationSpeed: number;
  podcastName?: string;
  episodeNumber?: string;
  hostName?: string;
  duration?: string;
}

export const PodcastTemplate: React.FC<PodcastTemplateProps> = ({
  title = "حلقة جديدة",
  subtitle = "بودكاست مميز",
  description = "استمع لأفضل المحتوى الصوتي",
  primaryColor = "#9333ea",
  secondaryColor = "#c084fc",
  backgroundColor = "#581c87",
  animationSpeed = 1,
  podcastName = "بودكاست الإبداع",
  episodeNumber = "الحلقة 15",
  hostName = "المذيع المميز",
  duration = "45 دقيقة",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // موجات صوتية متحركة
  const audioWaves = spring({
    frame: frame - 40,
    fps,
    config: {
      damping: 200,
      stiffness: 150,
    },
  });

  // أيقونة الميكروفون المتحركة
  const microphoneScale = 1 + Math.sin(frame * 0.1) * 0.1;
  const microphoneGlow = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 30% 40%, ${primaryColor}30, ${backgroundColor})`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Cairo, Arial, sans-serif",
        overflow: "hidden",
        direction: "rtl",
      }}
    >
      {/* خلفية موجات صوتية */}
      <AbsoluteFill>
        <svg width="100%" height="100%" style={{ opacity: 0.2 }}>
          {[...Array(20)].map((_, i) => {
            const waveHeight = Math.sin(frame * 0.05 + i * 0.5) * 30 + 40;
            const waveOpacity = Math.sin(frame * 0.03 + i * 0.3) * 0.3 + 0.7;

            return (
              <rect
                key={i}
                x={i * 100}
                y={`${50 - waveHeight / 2}%`}
                width="8"
                height={waveHeight}
                fill={secondaryColor}
                opacity={waveOpacity}
                rx="4"
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* شعار البودكاست */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
          borderRadius: "20px",
          padding: "15px 40px",
          fontSize: 18,
          fontWeight: "bold",
          color: "white",
          boxShadow: `0 10px 30px ${primaryColor}40`,
        }}
      >
        🎙️ {podcastName}
      </div>

      {/* رقم الحلقة */}
      <div
        style={{
          position: "absolute",
          top: 150,
          right: 80,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          padding: "10px 25px",
          fontSize: 16,
          color: secondaryColor,
          border: `2px solid ${secondaryColor}40`,
        }}
      >
        {episodeNumber}
      </div>

      {/* أيقونة الميكروفون المركزية */}
      <Sequence from={40}>
        <div
          style={{
            position: "absolute",
            left: "15%",
            top: "50%",
            transform: `translateY(-50%) scale(${microphoneScale})`,
            fontSize: 200,
            opacity: microphoneGlow,
            filter: `drop-shadow(0 0 30px ${primaryColor})`,
          }}
        >
          🎙️
        </div>
      </Sequence>

      {/* العنوان الرئيسي */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 30,
          maxWidth: 900,
          transform: `scale(${audioWaves})`,
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            textShadow: `0 0 40px ${primaryColor}`,
            background: `linear-gradient(45deg, white, ${secondaryColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
      </div>

      {/* العنوان الفرعي */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <h2
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: secondaryColor,
            margin: 0,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {subtitle}
        </h2>
      </div>

      {/* الوصف */}
      <div
        style={{
          maxWidth: 800,
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(15px)",
          borderRadius: "25px",
          padding: "30px",
          border: `2px solid ${secondaryColor}30`,
        }}
      >
        <p
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "white",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      {/* معلومات إضافية */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "40px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "white",
          }}
        >
          <div style={{ fontSize: 16, opacity: 0.7, marginBottom: "5px" }}>
            المذيع
          </div>
          <div style={{ fontSize: 20, fontWeight: "bold" }}>{hostName}</div>
        </div>

        <div
          style={{
            width: 4,
            height: 40,
            background: secondaryColor,
            borderRadius: "2px",
          }}
        />

        <div
          style={{
            textAlign: "center",
            color: "white",
          }}
        >
          <div style={{ fontSize: 16, opacity: 0.7, marginBottom: "5px" }}>
            المدة
          </div>
          <div style={{ fontSize: 20, fontWeight: "bold" }}>{duration}</div>
        </div>
      </div>

      {/* مؤشر التشغيل */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          background: "rgba(0, 0, 0, 0.7)",
          borderRadius: "25px",
          padding: "15px 30px",
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: "white",
            cursor: "pointer",
          }}
        >
          ▶️
        </div>

        <div
          style={{
            width: 300,
            height: 6,
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(frame / durationInFrames) * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: "3px",
            }}
          />
        </div>

        <div
          style={{
            color: "white",
            fontSize: 14,
            minWidth: "60px",
          }}
        >
          {Math.floor(frame / fps)}:
          {Math.floor((frame / fps) % 60)
            .toString()
            .padStart(2, "0")}
        </div>
      </div>

      {/* تأثيرات الصوت المحيطية */}
      {[...Array(8)].map((_, i) => {
        const rippleSize = ((frame + i * 15) % 120) * 3;
        const rippleOpacity = Math.max(0, 1 - ((frame + i * 15) % 120) / 120);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "15%",
              top: "50%",
              width: rippleSize,
              height: rippleSize,
              border: `2px solid ${secondaryColor}`,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              opacity: rippleOpacity * 0.5,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

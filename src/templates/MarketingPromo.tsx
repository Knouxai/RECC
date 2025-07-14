import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";

interface MarketingPromoProps {
  title: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  animationSpeed: number;
  discount?: string;
  ctaText?: string;
}

export const MarketingPromo: React.FC<MarketingPromoProps> = ({
  title = "عرض خاص",
  subtitle = "لفترة محدودة",
  description = "اكتشف منتجاتنا المميزة",
  primaryColor = "#f59e0b",
  secondaryColor = "#fbbf24",
  backgroundColor = "#78350f",
  animationSpeed = 1.5,
  discount = "50%",
  ctaText = "اطلب الآ��",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animation explosive pour le titre
  const titleExplosion = spring({
    frame: frame - 30,
    fps,
    config: {
      damping: 200,
      stiffness: 300,
    },
  });

  // Animation de zoom pour le discount
  const discountZoom = spring({
    frame: frame - 60,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  });

  // Animation de pulsation pour le CTA
  const ctaPulse = 1 + Math.sin(frame * 0.3) * 0.2;

  // Effet de flash
  const flashOpacity = interpolate(
    frame % 60,
    [0, 5, 10, 55, 60],
    [0, 1, 0, 0, 0],
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, ${primaryColor}20, ${backgroundColor})`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Cairo, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Flash d'arrière-plan */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
          opacity: flashOpacity,
        }}
      />

      {/* Rayons animés */}
      <AbsoluteFill>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 4,
              height: 600,
              background: `linear-gradient(to bottom, ${secondaryColor}, transparent)`,
              transformOrigin: "top center",
              transform: `rotate(${i * 30 + frame * 2}deg) translateX(-50%)`,
              opacity: 0.4,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Badge de discount */}
      <Sequence from={60}>
        <div
          style={{
            position: "absolute",
            top: 100,
            right: 100,
            background: `linear-gradient(45deg, #dc2626, #ef4444)`,
            borderRadius: "50%",
            width: 200,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${discountZoom}) rotate(${frame * 3}deg)`,
            boxShadow: "0 20px 40px rgba(220, 38, 38, 0.5)",
          }}
        >
          <div style={{ textAlign: "center", color: "white" }}>
            <div style={{ fontSize: 48, fontWeight: "bold" }}>{discount}</div>
            <div style={{ fontSize: 24 }}>خصم</div>
          </div>
        </div>
      </Sequence>

      {/* Titre principal */}
      <Sequence from={30}>
        <div
          style={{
            transform: `scale(${titleExplosion})`,
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              fontSize: 140,
              fontWeight: "bold",
              color: "white",
              margin: 0,
              textShadow: `0 0 50px ${primaryColor}`,
              background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              direction: "rtl",
            }}
          >
            {title}
          </h1>
        </div>
      </Sequence>

      {/* Sous-titre urgent */}
      <Sequence from={90}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            background: "rgba(220, 38, 38, 0.8)",
            borderRadius: "15px",
            padding: "20px 40px",
            transform: `scale(${interpolate(frame - 90, [0, 30], [0, 1])})`,
          }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "white",
              margin: 0,
              direction: "rtl",
              animation: "blink 1s infinite",
            }}
          >
            ⏰ {subtitle}
          </h2>
        </div>
      </Sequence>

      {/* Description */}
      <Sequence from={120}>
        <div
          style={{
            maxWidth: 800,
            textAlign: "center",
            opacity: interpolate(frame - 120, [0, 30], [0, 1]),
          }}
        >
          <p
            style={{
              fontSize: 40,
              fontWeight: 400,
              color: "white",
              margin: 0,
              lineHeight: 1.4,
              direction: "rtl",
              textShadow: "0 2px 10px rgba(0,0,0,0.7)",
            }}
          >
            {description}
          </p>
        </div>
      </Sequence>

      {/* Call-to-action pulsant */}
      <Sequence from={150}>
        <div
          style={{
            marginTop: 60,
            transform: `scale(${ctaPulse}) translateY(${interpolate(frame - 150, [0, 30], [100, 0])}px)`,
          }}
        >
          <div
            style={{
              background: `linear-gradient(45deg, #dc2626, #ef4444)`,
              borderRadius: "50px",
              padding: "25px 80px",
              fontSize: 36,
              fontWeight: "bold",
              color: "white",
              boxShadow: `0 20px 50px rgba(220, 38, 38, 0.6)`,
              cursor: "pointer",
              border: "4px solid white",
              direction: "rtl",
            }}
          >
            🛒 {ctaText}
          </div>
        </div>
      </Sequence>

      {/* Countdown timer effet */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.8)",
          borderRadius: "20px",
          padding: "20px 40px",
          fontSize: 32,
          color: secondaryColor,
          fontWeight: "bold",
        }}
      >
        ⏳ {Math.max(0, Math.floor((durationInFrames - frame) / fps))}s
      </div>

      {/* Particules d'explosion */}
      {[...Array(20)].map((_, i) => {
        const particleLife = (frame - i * 5) % 120;
        const particleX = 960 + Math.cos(i * 0.5) * particleLife * 8;
        const particleY = 540 + Math.sin(i * 0.5) * particleLife * 8;
        const particleOpacity = Math.max(0, 1 - particleLife / 120);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: particleX,
              top: particleY,
              width: 8,
              height: 8,
              backgroundColor: secondaryColor,
              borderRadius: "50%",
              opacity: particleOpacity,
              boxShadow: `0 0 20px ${secondaryColor}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

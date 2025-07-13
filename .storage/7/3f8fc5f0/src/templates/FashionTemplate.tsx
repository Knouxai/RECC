import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";

interface FashionTemplateProps {
  title: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  animationSpeed: number;
  brandName?: string;
  season?: string;
  collection?: string;
  designer?: string;
}

export const FashionTemplate: React.FC<FashionTemplateProps> = ({
  title = "مجموعة أنيقة",
  subtitle = "أزياء عصرية",
  description = "اكتشف أحدث صيحات الموضة",
  primaryColor = "#d946ef",
  secondaryColor = "#f0abfc",
  backgroundColor = "#86198f",
  animationSpeed = 0.8,
  brandName = "دار الأناقة",
  season = "ربيع 2024",
  collection = "المجموعة الجديدة",
  designer = "المصمم المبدع",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // تأثيرات أنيقة وناعمة
  const elegantFloat = spring({
    frame: frame - 40,
    fps,
    config: {
      damping: 300,
      stiffness: 50,
    },
  });

  // تأثير التلألؤ
  const sparkleOpacity = Math.sin(frame * 0.15) * 0.3 + 0.7;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${primaryColor}20, ${backgroundColor})`,
        fontFamily: "Cairo, Arial, sans-serif",
        overflow: "hidden",
        direction: "rtl",
      }}
    >
      {/* خلفية أنماط هندسية أنيقة */}
      <AbsoluteFill>
        <svg width="100%" height="100%" style={{ opacity: 0.15 }}>
          <defs>
            <pattern
              id="diamonds"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="50,10 90,50 50,90 10,50"
                fill="none"
                stroke={secondaryColor}
                strokeWidth="2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diamonds)" />
        </svg>
      </AbsoluteFill>

      {/* العلامة التجارية */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
            borderRadius: "30px",
            padding: "20px 60px",
            fontSize: "28px",
            fontWeight: "bold",
            color: "white",
            boxShadow: `0 15px 40px ${primaryColor}40`,
            border: "3px solid white",
            marginBottom: "15px",
          }}
        >
          ✨ {brandName}
        </div>

        <div
          style={{
            color: secondaryColor,
            fontSize: "18px",
            fontWeight: "300",
            background: "rgba(0, 0, 0, 0.7)",
            borderRadius: "15px",
            padding: "8px 20px",
            display: "inline-block",
          }}
        >
          {season} • {collection}
        </div>
      </div>

      {/* العنوان الرئيسي مع تأثير أنيق */}
      <Sequence from={40}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${elegantFloat})`,
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          <h1
            style={{
              fontSize: 96,
              fontWeight: "300",
              color: "white",
              margin: "0 0 30px 0",
              textShadow: `0 0 50px ${primaryColor}`,
              background: `linear-gradient(45deg, white, ${secondaryColor}, ${primaryColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "2px",
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>

          <div
            style={{
              width: "200px",
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${secondaryColor}, transparent)`,
              margin: "0 auto 30px",
              opacity: sparkleOpacity,
            }}
          />

          <h2
            style={{
              fontSize: 36,
              fontWeight: "200",
              color: secondaryColor,
              margin: "0 0 40px 0",
              letterSpacing: "1px",
            }}
          >
            {subtitle}
          </h2>
        </div>
      </Sequence>

      {/* الوصف الأنيق */}
      <Sequence from={90}>
        <div
          style={{
            position: "absolute",
            bottom: "200px",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "700px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: "25px",
            padding: "40px",
            border: `1px solid ${secondaryColor}40`,
          }}
        >
          <p
            style={{
              fontSize: 28,
              color: "white",
              margin: "0 0 25px 0",
              lineHeight: 1.6,
              fontWeight: "300",
            }}
          >
            {description}
          </p>

          <div
            style={{
              fontSize: "18px",
              color: "#e5e7eb",
              fontStyle: "italic",
            }}
          >
            تصميم: {designer}
          </div>
        </div>
      </Sequence>

      {/* عناصر تصميم أنيقة */}
      {[...Array(8)].map((_, i) => {
        const angle = i * 45 + frame * 0.2;
        const radius = 300 + Math.sin(frame * 0.02 + i) * 50;
        const x = 960 + Math.cos((angle * Math.PI) / 180) * radius;
        const y = 540 + Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: "20px",
              height: "20px",
              background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: "50%",
              opacity: 0.6,
              transform: `scale(${0.5 + Math.sin(frame * 0.1 + i) * 0.3})`,
              boxShadow: `0 0 20px ${primaryColor}`,
            }}
          />
        );
      })}

      {/* تأثيرات التلألؤ */}
      {[...Array(15)].map((_, i) => {
        const sparkleX = (i % 5) * 400 + 100;
        const sparkleY = Math.floor(i / 5) * 300 + 150;
        const sparkleDelay = i * 8;
        const sparkleScale =
          Math.max(0, Math.sin((frame - sparkleDelay) * 0.2)) * 2;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sparkleX,
              top: sparkleY,
              fontSize: "24px",
              opacity: sparkleScale * 0.7,
              transform: `scale(${sparkleScale}) rotate(${frame * 3}deg)`,
              color: secondaryColor,
              filter: `drop-shadow(0 0 10px ${secondaryColor})`,
            }}
          >
            ✨
          </div>
        );
      })}

      {/* خطوط تصميم أنيقة */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "80%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${secondaryColor}80, transparent)`,
          opacity: 0.8,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          width: "80%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${secondaryColor}80, transparent)`,
          opacity: 0.8,
        }}
      />

      {/* إطار زخرفي */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          right: "40px",
          bottom: "40px",
          border: `2px solid ${secondaryColor}40`,
          borderRadius: "20px",
          pointerEvents: "none",
        }}
      />

      {/* زوايا زخرفية */}
      {["top-left", "top-right", "bottom-left", "bottom-right"].map(
        (corner, i) => (
          <div
            key={corner}
            style={{
              position: "absolute",
              [corner.includes("top") ? "top" : "bottom"]: "60px",
              [corner.includes("left") ? "left" : "right"]: "60px",
              width: "40px",
              height: "40px",
              border: `3px solid ${secondaryColor}`,
              [corner.includes("top") ? "borderBottom" : "borderTop"]: "none",
              [corner.includes("left") ? "borderRight" : "borderLeft"]: "none",
              opacity: 0.8,
            }}
          />
        ),
      )}

      {/* تأثير الضوء المتحرك */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${interpolate(frame, [0, durationInFrames], [-200, 1920])}px`,
          width: "200px",
          height: "100%",
          background: `linear-gradient(90deg, transparent, ${secondaryColor}20, transparent)`,
          transform: "skewX(-20deg)",
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};

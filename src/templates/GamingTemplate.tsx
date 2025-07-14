import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";

interface GamingTemplateProps {
  title: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  animationSpeed: number;
  gameName?: string;
  playerName?: string;
  achievement?: string;
  level?: string;
}

export const GamingTemplate: React.FC<GamingTemplateProps> = ({
  title = "مستوى جديد!",
  subtitle = "إنجاز ملحمي",
  description = "تجربة ألعاب لا تُنسى",
  primaryColor = "#10b981",
  secondaryColor = "#34d399",
  backgroundColor = "#064e3b",
  animationSpeed = 1.5,
  gameName = "لعبة المغامرات",
  playerName = "اللاعب البطل",
  achievement = "إنجاز نادر",
  level = "المستوى 50",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // تأثيرات الليزر والوميض
  const laserFlash = interpolate(
    frame % 60,
    [0, 5, 10, 55, 60],
    [0, 1, 0, 0, 0],
  );

  // تأثيرات الجسيمات
  const particleIntensity = spring({
    frame: frame - 30,
    fps,
    config: {
      damping: 300,
      stiffness: 400,
    },
  });

  // تأثير المصفوفة الرقمية
  const matrixEffect = interpolate(frame, [0, durationInFrames], [0, 100]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(45deg, ${backgroundColor}, #000000)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Cairo, Arial, sans-serif",
        overflow: "hidden",
        direction: "rtl",
      }}
    >
      {/* خلفية المصفوفة الرقمية */}
      <AbsoluteFill>
        <div
          style={{
            background: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 98px,
              ${primaryColor}20 100px
            ), repeating-linear-gradient(
              0deg,
              transparent,
              transparent 98px,
              ${primaryColor}20 100px
            )`,
            width: "100%",
            height: "100%",
            opacity: 0.3,
            transform: `translateX(${matrixEffect}px)`,
          }}
        />
      </AbsoluteFill>

      {/* تأثير الفلاش */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle, ${secondaryColor}40, transparent 70%)`,
          opacity: laserFlash,
        }}
      />

      {/* شعار اللعبة */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
          borderRadius: "15px",
          padding: "15px 40px",
          fontSize: 20,
          fontWeight: "bold",
          color: "white",
          boxShadow: `0 0 30px ${primaryColor}`,
          border: "2px solid white",
        }}
      >
        🎮 {gameName}
      </div>

      {/* إحصائيات اللاعب */}
      <div
        style={{
          position: "absolute",
          top: 140,
          right: 60,
          background: "rgba(0, 0, 0, 0.8)",
          borderRadius: "10px",
          padding: "20px",
          border: `2px solid ${primaryColor}`,
          minWidth: 200,
        }}
      >
        <div
          style={{
            color: secondaryColor,
            fontSize: 14,
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          اللاعب
        </div>
        <div
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          {playerName}
        </div>
        <div
          style={{
            color: secondaryColor,
            fontSize: 14,
            marginBottom: "5px",
          }}
        >
          {level}
        </div>
        <div
          style={{
            background: "rgba(16, 185, 129, 0.3)",
            height: 8,
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
              height: "100%",
              width: `${85}%`,
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      {/* العنوان الرئيسي مع تأثير هولوجرا�� */}
      <Sequence from={30}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
            transform: `scale(${particleIntensity})`,
            position: "relative",
          }}
        >
          <h1
            style={{
              fontSize: 100,
              fontWeight: "bold",
              color: "white",
              margin: 0,
              textShadow: `
                0 0 10px ${primaryColor},
                0 0 20px ${primaryColor},
                0 0 40px ${primaryColor},
                0 0 80px ${primaryColor}
              `,
              background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor}, white)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              position: "relative",
            }}
          >
            {title}

            {/* تأثير الهولوجرام */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0, 255, 0, 0.1) 2px,
                  rgba(0, 255, 0, 0.1) 4px
                )`,
                pointerEvents: "none",
                animation: "flicker 0.15s infinite",
              }}
            />
          </h1>
        </div>
      </Sequence>

      {/* رمز الإنجاز */}
      <Sequence from={60}>
        <div
          style={{
            background: `radial-gradient(circle, ${primaryColor}, ${secondaryColor})`,
            borderRadius: "50%",
            width: 150,
            height: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 60,
            marginBottom: 30,
            boxShadow: `0 0 50px ${primaryColor}`,
            border: "4px solid white",
            position: "relative",
          }}
        >
          🏆
          {/* تأثير النبضات */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                border: `3px solid ${secondaryColor}`,
                borderRadius: "50%",
                opacity: Math.max(0, 1 - ((frame - 60 + i * 20) % 80) / 80),
                transform: `scale(${1 + ((frame - 60 + i * 20) % 80) / 40})`,
              }}
            />
          ))}
        </div>
      </Sequence>

      {/* وصف الإنجاز */}
      <Sequence from={90}>
        <div
          style={{
            textAlign: "center",
            maxWidth: 800,
            background: "rgba(0, 0, 0, 0.8)",
            borderRadius: "20px",
            padding: "30px",
            border: `2px solid ${primaryColor}`,
            backdropFilter: "blur(10px)",
          }}
        >
          <h2
            style={{
              fontSize: 32,
              color: secondaryColor,
              margin: "0 0 15px 0",
              fontWeight: "bold",
            }}
          >
            {achievement}
          </h2>
          <p
            style={{
              fontSize: 24,
              color: "white",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </div>
      </Sequence>

      {/* جسيمات الطاقة */}
      {[...Array(30)].map((_, i) => {
        const particleLife = (frame - i * 4) % 150;
        const particleX = (i % 6) * 320 + Math.sin(particleLife * 0.1) * 100;
        const particleY =
          Math.floor(i / 6) * 180 + Math.cos(particleLife * 0.08) * 80;
        const particleSize = Math.sin(particleLife * 0.2) * 6 + 4;
        const particleOpacity = Math.max(0, 1 - particleLife / 150);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: particleX,
              top: particleY,
              width: particleSize,
              height: particleSize,
              backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor,
              borderRadius: "50%",
              opacity: particleOpacity,
              boxShadow: `0 0 ${particleSize * 2}px ${i % 2 === 0 ? primaryColor : secondaryColor}`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}

      {/* شريط الصحة/الطاقة */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          ENERGY
        </div>
        <div
          style={{
            width: 300,
            height: 20,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            overflow: "hidden",
            border: `2px solid ${primaryColor}`,
          }}
        >
          <div
            style={{
              width: `${95}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: "8px",
              boxShadow: `inset 0 0 10px ${primaryColor}`,
            }}
          />
        </div>
        <div
          style={{
            color: secondaryColor,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          95%
        </div>
      </div>

      {/* أزرار التحكم */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "15px",
        }}
      >
        {["◀", "⏸", "▶", "⏹"].map((symbol, i) => (
          <div
            key={i}
            style={{
              width: 50,
              height: 50,
              background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "white",
              cursor: "pointer",
              border: "2px solid white",
              boxShadow: `0 4px 15px ${primaryColor}40`,
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* تأثير الكود المتساقط */}
      {[...Array(10)].map((_, i) => {
        const codeY = ((frame * 2 + i * 50) % (1080 + 100)) - 100;
        const codeText = ["01", "10", "11", "00"][i % 4];

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * 200 + 50,
              top: codeY,
              color: primaryColor,
              fontSize: 16,
              fontFamily: "monospace",
              opacity: 0.6,
              fontWeight: "bold",
            }}
          >
            {codeText}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

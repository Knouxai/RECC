import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";

interface CelebrationTemplateProps {
  title: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  animationSpeed: number;
  occasion?: string;
  celebrationType?: "birthday" | "wedding" | "graduation" | "achievement";
}

export const CelebrationTemplate: React.FC<CelebrationTemplateProps> = ({
  title = "مبروك!",
  subtitle = "يوم مميز",
  description = "تهانينا في هذه المناسبة السعيدة",
  primaryColor = "#ec4899",
  secondaryColor = "#f9a8d4",
  backgroundColor = "#831843",
  animationSpeed = 1,
  occasion = "عيد ميلاد",
  celebrationType = "birthday",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animations de célébration
  const celebrationBounce = spring({
    frame: frame - 30,
    fps,
    config: {
      damping: 300,
      stiffness: 400,
    },
  });

  // Confettis animés
  const confettiOpacity = interpolate(
    frame,
    [0, 60, durationInFrames - 60, durationInFrames],
    [0, 1, 1, 0],
  );

  // Émojis selon le type de célébration
  const getEmojis = () => {
    switch (celebrationType) {
      case "birthday":
        return ["🎂", "🎈", "🎁", "🎉", "🎊", "🕯️"];
      case "wedding":
        return ["💒", "👰", "🤵", "💍", "💐", "❤️"];
      case "graduation":
        return ["🎓", "📜", "🏆", "📚", "✨", "🎊"];
      case "achievement":
        return ["🏆", "🥇", "⭐", "👏", "🎊", "💫"];
      default:
        return ["🎉", "🎊", "✨", "🎈", "🎁", "💖"];
    }
  };

  const emojis = getEmojis();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, ${primaryColor}30, ${backgroundColor})`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Cairo, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Confettis d'arrière-plan */}
      <AbsoluteFill>
        {[...Array(50)].map((_, i) => {
          const confettiLife = (frame - i * 3) % 180;
          const confettiX = (i % 10) * 200 + Math.sin(confettiLife * 0.1) * 100;
          const confettiY = Math.floor(i / 10) * 200 + confettiLife * 8;
          const confettiRotation = confettiLife * 10;
          const confettiColor = i % 2 === 0 ? primaryColor : secondaryColor;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: confettiX,
                top: confettiY - 200,
                width: 12,
                height: 12,
                backgroundColor: confettiColor,
                opacity: confettiOpacity * Math.max(0, 1 - confettiLife / 180),
                transform: `rotate(${confettiRotation}deg)`,
                borderRadius: i % 3 === 0 ? "50%" : "2px",
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Badge de l'occasion */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
          borderRadius: "30px",
          padding: "20px 60px",
          fontSize: 32,
          fontWeight: "bold",
          color: "white",
          boxShadow: `0 15px 35px ${primaryColor}40`,
          direction: "rtl",
        }}
      >
        {emojis[0]} {occasion}
      </div>

      {/* Titre principal avec effet de célébration */}
      <Sequence from={30}>
        <div
          style={{
            transform: `scale(${celebrationBounce})`,
            textAlign: "center",
            marginBottom: 50,
            position: "relative",
          }}
        >
          <h1
            style={{
              fontSize: 160,
              fontWeight: "bold",
              color: "white",
              margin: 0,
              textShadow: `0 0 60px ${primaryColor}`,
              background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor}, white)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              direction: "rtl",
              position: "relative",
            }}
          >
            {title}

            {/* Étoiles scintillantes autour du titre */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${20 + i * 15}%`,
                  top: `${20 + (i % 2) * 60}%`,
                  fontSize: 40,
                  color: secondaryColor,
                  opacity: Math.sin(frame * 0.2 + i) * 0.5 + 0.5,
                  transform: `rotate(${frame * 3 + i * 60}deg)`,
                }}
              >
                ⭐
              </div>
            ))}
          </h1>
        </div>
      </Sequence>

      {/* Sous-titre décoratif */}
      <Sequence from={60}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 60,
            transform: `translateY(${interpolate(frame - 60, [0, 30], [100, 0])}px)`,
            opacity: interpolate(frame - 60, [0, 30], [0, 1]),
          }}
        >
          <h2
            style={{
              fontSize: 56,
              fontWeight: 400,
              color: secondaryColor,
              margin: 0,
              direction: "rtl",
              textShadow: "0 4px 15px rgba(0,0,0,0.4)",
            }}
          >
            🌟 {subtitle} 🌟
          </h2>
        </div>
      </Sequence>

      {/* Message de félicitation */}
      <Sequence from={90}>
        <div
          style={{
            maxWidth: 900,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(15px)",
            borderRadius: "30px",
            padding: "50px",
            border: `3px solid ${secondaryColor}40`,
            opacity: interpolate(frame - 90, [0, 40], [0, 1]),
            transform: `scale(${interpolate(frame - 90, [0, 40], [0.8, 1])})`,
          }}
        >
          <p
            style={{
              fontSize: 40,
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

      {/* Émojis flottants */}
      {emojis.map((emoji, i) => {
        const floatDelay = i * 20;
        const floatY = interpolate(
          frame - floatDelay,
          [0, 180],
          [1080 + 100, -100],
        );
        const floatX = 200 + i * 250 + Math.sin((frame + i * 50) * 0.02) * 150;
        const scale = 1 + Math.sin((frame + i * 30) * 0.1) * 0.3;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: floatX,
              top: floatY,
              fontSize: 80,
              transform: `scale(${scale}) rotate(${frame * 2 + i * 45}deg)`,
              opacity: 0.9,
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
            }}
          >
            {emoji}
          </div>
        );
      })}

      {/* Feux d'artifice */}
      {[...Array(8)].map((_, i) => {
        const fireworkTrigger = (frame - i * 40) % 120;
        const fireworkScale = interpolate(
          fireworkTrigger,
          [0, 30, 60],
          [0, 2, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        const fireworkOpacity = interpolate(
          fireworkTrigger,
          [0, 15, 60],
          [0, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 200 + (i % 4) * 400,
              top: 150 + Math.floor(i / 4) * 300,
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `4px solid ${i % 2 === 0 ? primaryColor : secondaryColor}`,
              transform: `scale(${fireworkScale})`,
              opacity: fireworkOpacity,
            }}
          />
        );
      })}

      {/* Message final animé */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: "50%",
          transform: `translateX(-50%) scale(${1 + Math.sin(frame * 0.15) * 0.1})`,
          background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
          borderRadius: "25px",
          padding: "20px 50px",
          fontSize: 32,
          fontWeight: "bold",
          color: "white",
          boxShadow: `0 10px 30px ${primaryColor}50`,
          direction: "rtl",
        }}
      >
        💖 أجمل التهاني 💖
      </div>
    </AbsoluteFill>
  );
};

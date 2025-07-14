import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  AbsoluteFill,
  Sequence,
} from "remotion";

interface NewsTemplateProps {
  title: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  animationSpeed: number;
  newsChannel?: string;
  breaking?: boolean;
  location?: string;
  time?: string;
}

export const NewsTemplate: React.FC<NewsTemplateProps> = ({
  title = "عاجل: خبر مهم",
  subtitle = "تطورات جديدة",
  description = "تفاصيل الخبر والمعلومات الإضافية",
  primaryColor = "#dc2626",
  secondaryColor = "#fca5a5",
  backgroundColor = "#7f1d1d",
  animationSpeed = 1.2,
  newsChannel = "قناة الأخبار",
  breaking = true,
  location = "العاصمة",
  time = new Date().toLocaleTimeString("ar-SA"),
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // تأثير النبض للأخبار العاجلة
  const breakingPulse = breaking ? 1 + Math.sin(frame * 0.3) * 0.2 : 1;

  // حركة شريط الأخبار
  const tickerPosition = interpolate(
    frame,
    [0, durationInFrames],
    [1920, -2000],
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${backgroundColor}, #000000)`,
        fontFamily: "Cairo, Arial, sans-serif",
        overflow: "hidden",
        direction: "rtl",
      }}
    >
      {/* خلفية شبكة إخبارية */}
      <AbsoluteFill>
        <div
          style={{
            background: `
              linear-gradient(0deg, transparent 24%, ${primaryColor}10 25%, ${primaryColor}10 26%, transparent 27%, transparent 74%, ${primaryColor}10 75%, ${primaryColor}10 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, ${primaryColor}10 25%, ${primaryColor}10 26%, transparent 27%, transparent 74%, ${primaryColor}10 75%, ${primaryColor}10 76%, transparent 77%, transparent)
            `,
            backgroundSize: "50px 50px",
            width: "100%",
            height: "100%",
            opacity: 0.4,
          }}
        />
      </AbsoluteFill>

      {/* Header شريط الأخبار العلوي */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          <div style={{ fontSize: "24px" }}>📺</div>
          <div style={{ fontSize: "20px" }}>{newsChannel}</div>
        </div>

        <div
          style={{
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          🕐 {time}
        </div>
      </div>

      {/* شارة العاجل */}
      {breaking && (
        <div
          style={{
            position: "absolute",
            top: "100px",
            right: "50px",
            background: "#dc2626",
            color: "white",
            padding: "15px 30px",
            borderRadius: "10px",
            fontSize: "24px",
            fontWeight: "bold",
            transform: `scale(${breakingPulse})`,
            boxShadow: "0 0 30px #dc2626",
            border: "3px solid white",
          }}
        >
          ⚡ عــــــاجــــــل
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <div
        style={{
          position: "absolute",
          top: "200px",
          left: "50px",
          right: "50px",
          bottom: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* العنوان الرئيسي */}
        <Sequence from={30}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: "20px",
              padding: "40px",
              marginBottom: "30px",
              border: `3px solid ${primaryColor}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: "bold",
                color: "white",
                margin: "0 0 20px 0",
                textShadow: `0 0 20px ${primaryColor}`,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>

            <h2
              style={{
                fontSize: 36,
                color: secondaryColor,
                margin: 0,
                fontWeight: 400,
              }}
            >
              {subtitle}
            </h2>
          </div>
        </Sequence>

        {/* التفاصيل */}
        <Sequence from={90}>
          <div
            style={{
              background: "rgba(30, 41, 59, 0.9)",
              borderRadius: "15px",
              padding: "30px",
              border: `2px solid ${secondaryColor}`,
            }}
          >
            <p
              style={{
                fontSize: 28,
                color: "white",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {description}
            </p>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "30px",
                alignItems: "center",
                fontSize: "18px",
                color: "#94a3b8",
              }}
            >
              <span>📍 {location}</span>
              <span>•</span>
              <span>📅 {new Date().toLocaleDateString("ar-SA")}</span>
            </div>
          </div>
        </Sequence>
      </div>

      {/* شريط الأخبار السفلي */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
          height: "60px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: tickerPosition,
            whiteSpace: "nowrap",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "100px",
          }}
        >
          <span>📈 البورصة: ارتفاع في الأسهم</span>
          <span>⚽ كرة القدم: نتائج المباريات</span>
          <span>🌡️ الطقس: أجواء معتدلة</span>
          <span>💰 الاقتصاد: نمو متوقع</span>
          <span>🏛️ السياسة: اجتماع مهم</span>
        </div>
      </div>

      {/* تأثيرات الإضاءة */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10%",
          width: "80%",
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${secondaryColor}, transparent)`,
          opacity: 0.6,
          filter: "blur(1px)",
        }}
      />

      {/* نقاط الإضاءة */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${15 + i * 15}%`,
            top: `${30 + Math.sin(frame * 0.05 + i) * 20}%`,
            width: "8px",
            height: "8px",
            background: secondaryColor,
            borderRadius: "50%",
            opacity: Math.sin(frame * 0.1 + i) * 0.5 + 0.5,
            boxShadow: `0 0 15px ${secondaryColor}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

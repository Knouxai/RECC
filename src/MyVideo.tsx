import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const scale = interpolate(frame, [0, 60], [0.8, 1.2]);

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#4338ca",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 60,
        color: "white",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      Hello Remotion!
    </div>
  );
};

import React from "react";
import { Composition } from "remotion";
import { videoTemplates } from "./templates/TemplateData";
import { ArtisticPortrait } from "./templates/ArtisticPortrait";
import { BusinessIntro } from "./templates/BusinessIntro";
import { SocialStory } from "./templates/SocialStory";

// مكونات القوالب
const templateComponents = {
  "artistic-portrait": ArtisticPortrait,
  "business-intro": BusinessIntro,
  "social-story": SocialStory,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {videoTemplates.map((template) => {
        const TemplateComponent =
          templateComponents[template.id as keyof typeof templateComponents];

        return (
          <Composition
            key={template.id}
            id={template.id}
            component={TemplateComponent}
            durationInFrames={template.duration}
            fps={template.fps}
            width={template.width}
            height={template.height}
            defaultProps={{
              title: template.customizableProps.text?.title || "عنوان افتراضي",
              subtitle:
                template.customizableProps.text?.subtitle || "عنوان فرعي",
              description:
                template.customizableProps.text?.description || "وصف افتراضي",
              primaryColor:
                template.customizableProps.colors?.primary || "#4338ca",
              secondaryColor:
                template.customizableProps.colors?.secondary || "#818cf8",
              backgroundColor:
                template.customizableProps.colors?.background || "#1e1b4b",
              animationSpeed: template.customizableProps.animations?.speed || 1,
            }}
            schema={{
              title: {
                type: "string",
                description: "العنوان الرئيسي",
                defaultValue:
                  template.customizableProps.text?.title || "عنوان افتراضي",
              },
              subtitle: {
                type: "string",
                description: "العنوان الفرعي",
                defaultValue:
                  template.customizableProps.text?.subtitle || "عنوان فرعي",
              },
              description: {
                type: "string",
                description: "الوصف",
                defaultValue:
                  template.customizableProps.text?.description || "وصف افتراضي",
              },
              primaryColor: {
                type: "string",
                description: "اللون الأساسي",
                defaultValue:
                  template.customizableProps.colors?.primary || "#4338ca",
              },
              secondaryColor: {
                type: "string",
                description: "اللون الثانوي",
                defaultValue:
                  template.customizableProps.colors?.secondary || "#818cf8",
              },
              backgroundColor: {
                type: "string",
                description: "لون الخلفية",
                defaultValue:
                  template.customizableProps.colors?.background || "#1e1b4b",
              },
              animationSpeed: {
                type: "number",
                description: "سرعة الحركة",
                defaultValue: template.customizableProps.animations?.speed || 1,
                min: 0.1,
                max: 3,
                step: 0.1,
              },
            }}
          />
        );
      })}
    </>
  );
};

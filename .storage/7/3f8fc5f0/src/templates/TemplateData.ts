export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "business" | "social" | "artistic" | "marketing";
  duration: number;
  fps: number;
  width: number;
  height: number;
  customizableProps: {
    text?: {
      title: string;
      subtitle: string;
      description: string;
    };
    colors?: {
      primary: string;
      secondary: string;
      background: string;
    };
    animations?: {
      style: "smooth" | "dynamic" | "elegant";
      speed: number;
    };
  };
}

export const videoTemplates: VideoTemplate[] = [
  {
    id: "artistic-portrait",
    name: "Portrait Artistique",
    description: "قالب فني لعرض الصور الشخصية بطريقة احترافية",
    thumbnail: "/thumbnails/artistic-portrait.jpg",
    category: "artistic",
    duration: 300,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "اسم الشخص",
        subtitle: "المهنة أو الوصف",
        description: "نبذة مختصرة",
      },
      colors: {
        primary: "#4338ca",
        secondary: "#818cf8",
        background: "#1e1b4b",
      },
      animations: {
        style: "elegant",
        speed: 1,
      },
    },
  },
  {
    id: "business-intro",
    name: "تقديم الأعمال",
    description: "قالب مهني لتقديم الشركات والخدمات",
    thumbnail: "/thumbnails/business-intro.jpg",
    category: "business",
    duration: 450,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "اسم الشركة",
        subtitle: "الشعار",
        description: "وصف الخدمات",
      },
      colors: {
        primary: "#059669",
        secondary: "#34d399",
        background: "#064e3b",
      },
      animations: {
        style: "dynamic",
        speed: 1.2,
      },
    },
  },
  {
    id: "social-story",
    name: "قصة اجتماعية",
    description: "قالب مثالي لوسائل التواصل الاجتماعي",
    thumbnail: "/thumbnails/social-story.jpg",
    category: "social",
    duration: 180,
    fps: 30,
    width: 1080,
    height: 1920,
    customizableProps: {
      text: {
        title: "العنوان الرئيسي",
        subtitle: "العنوان الفرعي",
        description: "المحتوى",
      },
      colors: {
        primary: "#dc2626",
        secondary: "#fca5a5",
        background: "#7f1d1d",
      },
      animations: {
        style: "smooth",
        speed: 0.8,
      },
    },
  },
];

export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category:
    | "business"
    | "social"
    | "artistic"
    | "marketing"
    | "educational"
    | "celebration";
  duration: number;
  fps: number;
  width: number;
  height: number;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
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
      style: "smooth" | "dynamic" | "elegant" | "explosive" | "educational";
      speed: number;
    };
    extras?: {
      [key: string]: any;
    };
  };
}

export const videoTemplates: VideoTemplate[] = [
  {
    id: "artistic-portrait",
    name: "البورتريه الفني",
    description:
      "قالب فني لعرض الصور الشخصية بطريقة احترافية مع تأثيرات بصرية رائعة",
    thumbnail: "/thumbnails/artistic-portrait.jpg",
    category: "artistic",
    tags: ["فني", "صور شخصية", "احترافي", "إبداعي"],
    difficulty: "intermediate",
    duration: 300,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "Portrait Artistique",
        subtitle: "Création Professionnelle",
        description: "Une œuvre d'art numérique unique",
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
    description: "قالب مهني لتقديم الشركات والخدمات بأسلوب احترافي وجذاب",
    thumbnail: "/thumbnails/business-intro.jpg",
    category: "business",
    tags: ["شركات", "أعمال", "مهني", "تقديم"],
    difficulty: "beginner",
    duration: 450,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "شركة متميزة",
        subtitle: "نحو النجاح والتطور",
        description: "نقدم أفضل الحلول والخدمات المبتكرة",
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
    description: "قالب مثالي لوسائل التواصل الاجتماعي مع تأثيرات جذابة",
    thumbnail: "/thumbnails/social-story.jpg",
    category: "social",
    tags: ["سوشيال ميديا", "قصص", "تفاعلي", "شبابي"],
    difficulty: "beginner",
    duration: 180,
    fps: 30,
    width: 1080,
    height: 1920,
    customizableProps: {
      text: {
        title: "قصة ملهمة",
        subtitle: "اكتشف المزيد",
        description: "محتوى رائع لوسائل التواصل",
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
  {
    id: "marketing-promo",
    name: "الإعلان التسويقي",
    description: "قالب تسويقي قوي للعروض والخصومات مع تأثيرات انفجارية",
    thumbnail: "/thumbnails/marketing-promo.jpg",
    category: "marketing",
    tags: ["تسويق", "إعلانات", "عروض", "خصومات"],
    difficulty: "advanced",
    duration: 240,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "عرض خاص",
        subtitle: "لفترة محدودة",
        description: "اكتشف منتجاتنا المميزة",
      },
      colors: {
        primary: "#f59e0b",
        secondary: "#fbbf24",
        background: "#78350f",
      },
      animations: {
        style: "explosive",
        speed: 1.5,
      },
      extras: {
        discount: "50%",
        ctaText: "اطلب الآن",
      },
    },
  },
  {
    id: "educational-template",
    name: "القالب التعليمي",
    description: "قالب احترافي للدروس والمحتوى التعليمي مع بيئة تفاعلية",
    thumbnail: "/thumbnails/educational.jpg",
    category: "educational",
    tags: ["تعليم", "دروس", "أكاديمي", "تربوي"],
    difficulty: "intermediate",
    duration: 360,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "الدرس الأول",
        subtitle: "أساسيات المادة",
        description: "في هذا الدرس سنتعلم المفاهيم الأساسية",
      },
      colors: {
        primary: "#3b82f6",
        secondary: "#93c5fd",
        background: "#1e3a8a",
      },
      animations: {
        style: "educational",
        speed: 1,
      },
      extras: {
        lessonNumber: "01",
        subject: "الرياضيات",
      },
    },
  },
  {
    id: "celebration-template",
    name: "قالب الاحتفال",
    description: "قالب مليء بالفرح للمناسبات السعيدة والاحتفالات",
    thumbnail: "/thumbnails/celebration.jpg",
    category: "celebration",
    tags: ["احتفال", "مناسبات", "أفراح", "تهاني"],
    difficulty: "beginner",
    duration: 300,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "مبروك!",
        subtitle: "يوم مميز",
        description: "تهانينا في هذه المناسبة السعيدة",
      },
      colors: {
        primary: "#ec4899",
        secondary: "#f9a8d4",
        background: "#831843",
      },
      animations: {
        style: "dynamic",
        speed: 1,
      },
      extras: {
        occasion: "عيد ميلاد",
        celebrationType: "birthday",
      },
    },
  },
  {
    id: "podcast-template",
    name: "قالب البودكاست",
    description: "قالب احترافي للبودكاست مع موجات صوتية تفاعلية ومؤثرات بصرية",
    thumbnail: "/thumbnails/podcast.jpg",
    category: "social",
    tags: ["بودكاست", "صوت", "راديو", "مقابلات"],
    difficulty: "intermediate",
    duration: 480,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "حلقة جديدة",
        subtitle: "بودكاست مميز",
        description: "استمع لأفضل المحتوى الصوتي",
      },
      colors: {
        primary: "#9333ea",
        secondary: "#c084fc",
        background: "#581c87",
      },
      animations: {
        style: "smooth",
        speed: 1,
      },
      extras: {
        podcastName: "بودكاست الإبداع",
        episodeNumber: "الحلقة 15",
        hostName: "المذيع المميز",
        duration: "45 دقيقة",
      },
    },
  },
  {
    id: "gaming-template",
    name: "قالب الألعاب",
    description: "قالب متطور للألعاب مع تأثيرات هولوجرام وجسيمات طاقة",
    thumbnail: "/thumbnails/gaming.jpg",
    category: "social",
    tags: ["ألعاب", "إنجازات", "تقنية", "مستقبلي"],
    difficulty: "advanced",
    duration: 360,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "مستوى جديد!",
        subtitle: "إنجاز ملحمي",
        description: "تجربة ألعاب لا تُنسى",
      },
      colors: {
        primary: "#10b981",
        secondary: "#34d399",
        background: "#064e3b",
      },
      animations: {
        style: "explosive",
        speed: 1.5,
      },
      extras: {
        gameName: "لعبة المغامرات",
        playerName: "اللاعب البطل",
        achievement: "إنجاز نادر",
        level: "المستوى 50",
      },
    },
  },
];

export const templateCategories = [
  { id: "all", name: "جميع القوالب", icon: "🎬" },
  { id: "business", name: "الأعمال", icon: "💼" },
  { id: "social", name: "اجتماعي", icon: "📱" },
  { id: "artistic", name: "فني", icon: "🎨" },
  { id: "marketing", name: "تسويقي", icon: "📢" },
  { id: "educational", name: "تعليمي", icon: "📚" },
  { id: "celebration", name: "احتفالي", icon: "🎉" },
];

export const difficultyLevels = [
  { id: "beginner", name: "مبتدئ", color: "#10b981" },
  { id: "intermediate", name: "متوسط", color: "#f59e0b" },
  { id: "advanced", name: "متقدم", color: "#ef4444" },
];

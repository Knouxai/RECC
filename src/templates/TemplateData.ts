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
    description: "قالب مثالي ��وسائل التواصل الاجتماعي مع تأثيرات جذابة",
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
  {
    id: "medical-presentation",
    name: "العرض الطبي",
    description:
      "قالب احترافي للعروض الطبية والعلمية مع رسوميات ثلاثية الأبعاد",
    thumbnail: "/thumbnails/medical.jpg",
    category: "educational",
    tags: ["طب", "علوم", "صحة", "مؤتمرات", "أبحاث"],
    difficulty: "advanced",
    duration: 420,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "الاختراق الطبي الجديد",
        subtitle: "تقنيات جراحية متطورة",
        description: "دراسة حديثة في عل��ج السرطان باستخدام العلاج المناعي",
      },
      colors: {
        primary: "#0ea5e9",
        secondary: "#38bdf8",
        background: "#0c4a6e",
      },
      animations: {
        style: "educational",
        speed: 0.8,
      },
      extras: {
        hospitalName: "مستشفى الملك فيصل التخصصي",
        doctorName: "د. أحمد محمد الخبير",
        specialty: "جراحة القلب والأوعية الدموية",
        researchTitle: "تطوير تقنيات القسطرة القلبية",
      },
    },
  },
  {
    id: "tech-startup",
    name: "الشركة التقنية الناشئة",
    description: "قالب عصري لعرض الشركات التقنية الناشئة والابتكارات الرقمية",
    thumbnail: "/thumbnails/tech-startup.jpg",
    category: "business",
    tags: ["تقنية", "ذكاء اصطناعي", "ابتكار", "شركات ناشئة", "برمجة"],
    difficulty: "intermediate",
    duration: 380,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "مستقبل التقنية",
        subtitle: "حلول ذكية للمشاكل المعقدة",
        description: "نط��ر تطبيقات الذكاء الاصطناعي لتحسين حياة المجتمع",
      },
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        background: "#1e1b4b",
      },
      animations: {
        style: "dynamic",
        speed: 1.3,
      },
      extras: {
        companyName: "شركة نيوم للتقنيات المتقدمة",
        founderName: "م. سارة العبدالله",
        productName: "منصة الذكاء الطبي",
        fundingRound: "الجولة الثانية - 15 مليون ريال",
        teamSize: "35 مهندس ومطور",
      },
    },
  },
  {
    id: "sports-championship",
    name: "البطولة الرياضية",
    description: "قالب ديناميكي للأحداث الرياضية والبطولات مع تأثيرات الطاقة",
    thumbnail: "/thumbnails/sports.jpg",
    category: "celebration",
    tags: ["رياضة", "كرة قدم", "بطولة", "انتصار", "فرق"],
    difficulty: "intermediate",
    duration: 320,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "نهائي دوري المحترفين",
        subtitle: "معركة الأساطير",
        description: "الهلال يواجه النصر في نهائي تاريخي",
      },
      colors: {
        primary: "#059669",
        secondary: "#fbbf24",
        background: "#064e3b",
      },
      animations: {
        style: "explosive",
        speed: 1.4,
      },
      extras: {
        tournamentName: "دوري روشن السعودي للمحترفين",
        stadium: "استاد الملك فهد الدولي",
        matchDate: "الجمعة 25 ديسمبر 2024",
        team1: "نادي الهلال",
        team2: "نادي النصر",
        referee: "محمد المزيد",
        attendance: "62,000 متفرج",
      },
    },
  },
  {
    id: "real-estate-luxury",
    name: "العقارات الفاخرة",
    description: "قالب أنيق لعرض العقارات الفاخرة والمشاريع العمرانية المتميزة",
    thumbnail: "/thumbnails/real-estate.jpg",
    category: "business",
    tags: ["عقارات", "فلل", "استثمار", "نيوم", "القدية"],
    difficulty: "advanced",
    duration: 450,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "قصر الأحلام",
        subtitle: "الفخامة تلتقي بالح��اثة",
        description: "فيلا استثنائية في قلب الرياض الجديدة مع إطلالة خلابة",
      },
      colors: {
        primary: "#d97706",
        secondary: "#fbbf24",
        background: "#78350f",
      },
      animations: {
        style: "elegant",
        speed: 0.9,
      },
      extras: {
        projectName: "مجمع قصور الملوك",
        location: "حي الياسمين، شمال الرياض",
        area: "1,200 متر مربع",
        rooms: "7 غرف نوم + مجلس + صالة كبيرة",
        price: "4.5 مليون ريال",
        developer: "شركة دار الأركان",
        amenities: "مسبح خاص + حديقة + جيم + مواقف 4 سيارات",
      },
    },
  },
  {
    id: "cooking-recipe",
    name: "وصفة الطبخ",
    description: "قالب شهي لعرض وصفات الطبخ التراثية والحديثة بطريقة جذابة",
    thumbnail: "/thumbnails/cooking.jpg",
    category: "social",
    tags: ["طبخ", "وصفات", "مطبخ عربي", "حلويات", "أكل صحي"],
    difficulty: "beginner",
    duration: 280,
    fps: 30,
    width: 1080,
    height: 1920,
    customizableProps: {
      text: {
        title: "كبسة الدجاج الأصيلة",
        subtitle: "وصفة جدتي السرية",
        description: "تعلم طريقة تحضير أشهى كبسة دجاج بالطريقة النجدية الأصيلة",
      },
      colors: {
        primary: "#dc2626",
        secondary: "#fbbf24",
        background: "#7f1d1d",
      },
      animations: {
        style: "smooth",
        speed: 1.1,
      },
      extras: {
        chefName: "الشيف نورا السليم",
        cuisine: "المطبخ النجدي التراثي",
        prepTime: "45 دقيقة",
        servings: "6-8 أشخاص",
        difficulty: "متوسط",
        mainIngredients: "دجاج + أرز بسمتي + بهارات الكبسة",
        specialTip: "سر النكهة في النقع بالزبادي واللبن",
      },
    },
  },
  {
    id: "travel-saudi",
    name: "سياحة المملكة",
    description: "قالب سياحي ساحر لاستكشاف جمال المملكة العربية السعودية",
    thumbnail: "/thumbnails/travel-saudi.jpg",
    category: "social",
    tags: ["سياحة", "السعودية", "رؤية 2030", "تراث", "طبيعة"],
    difficulty: "intermediate",
    duration: 400,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "اكتشف جمال العلا",
        subtitle: "عجائب الطبيعة والتاريخ",
        description: "رحلة استثنائية عبر الزمن في أرض الحضارات القديمة",
      },
      colors: {
        primary: "#0891b2",
        secondary: "#fbbf24",
        background: "#164e63",
      },
      animations: {
        style: "elegant",
        speed: 1,
      },
      extras: {
        destination: "محافظة العلا التاريخية",
        attraction: "مدائن صالح - دادان الأثرية",
        season: "موسم شتاء العلا 2024",
        duration: "5 أيام / 4 ليالي",
        activities: "جولات أثرية + سفاري صحراوي + مراقبة النجوم",
        hotel: "منتجع شاردان الفاخر",
        guide: "دليل سياحي معتمد من هيئة السياحة",
      },
    },
  },
  {
    id: "wedding-arabic",
    name: "العرس العربي",
    description: "قالب فخم للأعراس العربية التراثية مع لمسات عصرية راقية",
    thumbnail: "/thumbnails/wedding.jpg",
    category: "celebration",
    tags: ["زواج", "عرس", "تراث", "احتفال", "عائلة"],
    difficulty: "advanced",
    duration: 360,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "عرس أحمد ونورا",
        subtitle: "يوم لا يُنسى",
        description: "بحضور كريم من العائلة والأصدقاء نحتفل بهذا اليوم المبارك",
      },
      colors: {
        primary: "#be185d",
        secondary: "#fbbf24",
        background: "#831843",
      },
      animations: {
        style: "elegant",
        speed: 0.9,
      },
      extras: {
        groomName: "أحمد بن عبدالله المحمد",
        brideName: "نورا بنت سليمان العلي",
        weddingDate: "15 ربيع الأول 1446هـ",
        venue: "قصر الأفراح الملكي",
        city: "الرياض",
        weddingTheme: "التراث النجدي الأصيل",
        guestCount: "500 مدعو",
        blessing: "بارك الله لهما وبارك عليهما وجمع بينهما في خير",
      },
    },
  },
  {
    id: "graduation-ceremony",
    name: "حفل التخرج",
    description: "قالب تكريمي مهيب لحفلات التخرج والإنجازات الأكاديمية",
    thumbnail: "/thumbnails/graduation.jpg",
    category: "celebration",
    tags: ["تخرج", "جامعة", "نجاح", "تعليم", "إنجاز"],
    difficulty: "intermediate",
    duration: 340,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "حفل تخرج دفعة 2024",
        subtitle: "جيل المستقبل",
        description: "تكريم خريجي كلية الطب في جامعة الملك سعود",
      },
      colors: {
        primary: "#0891b2",
        secondary: "#fbbf24",
        background: "#164e63",
      },
      animations: {
        style: "educational",
        speed: 1,
      },
      extras: {
        university: "جامعة الملك سعود",
        college: "كلية الطب",
        batch: "دفعة الأمل 2024",
        graduateCount: "320 خريج وخريجة",
        valedictorian: "الطالبة زهراء أحمد الناصر",
        ceremony: "مسرح الملك فيصل للمؤتمرات",
        date: "الثلاثاء 20 يونيو 2024",
        motto: "العلم نور والجهل ظلام",
      },
    },
  },
  {
    id: "ramadan-greeting",
    name: "تهنئة رمضانية",
    description: "قالب روحاني مبارك للتهاني الرمضانية والمناسبات الدينية",
    thumbnail: "/thumbnails/ramadan.jpg",
    category: "celebration",
    tags: ["رمضان", "إسلامي", "تهنئة", "مبارك", "روحاني"],
    difficulty: "beginner",
    duration: 250,
    fps: 30,
    width: 1080,
    height: 1920,
    customizableProps: {
      text: {
        title: "رمضان مبارك",
        subtitle: "أهلاً شهر الخير",
        description: "بارك الله لكم في الشهر الكريم وتقبل صيامكم وقيامكم",
      },
      colors: {
        primary: "#059669",
        secondary: "#fbbf24",
        background: "#064e3b",
      },
      animations: {
        style: "smooth",
        speed: 0.8,
      },
      extras: {
        islamicYear: "1446 هجرية",
        greeting: "كل عام وأنتم بخير",
        dua: "اللهم بلغنا رمضان وأعنا على صيامه وقيامه",
        sender: "عائلة آل سعود",
        verse: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ",
        tradition: "صوموا تصحوا",
      },
    },
  },
  {
    id: "corporate-report",
    name: "التقرير السنوي",
    description: "قالب مؤسسي محترف لعرض التقارير السنوية والإنج��زات المؤسسية",
    thumbnail: "/thumbnails/corporate.jpg",
    category: "business",
    tags: ["تقرير", "شركة", "إحصائيات", "أرباح", "نمو"],
    difficulty: "advanced",
    duration: 480,
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      text: {
        title: "التقرير السنوي 2024",
        subtitle: "عام من النمو والازدهار",
        description: "إنجازات مؤسسة أرامكو السعودية في عام النمو الاستثنائي",
      },
      colors: {
        primary: "#0891b2",
        secondary: "#10b981",
        background: "#0c4a6e",
      },
      animations: {
        style: "dynamic",
        speed: 1.1,
      },
      extras: {
        companyName: "أرامكو السعودية",
        revenue: "750 مليار ريال",
        profit: "380 مليار ريال",
        growth: "نمو 15% مقارنة بالعام السابق",
        employees: "68,500 موظف حول العالم",
        projects: "15 مشروع استراتيجي جديد",
        sustainability: "تقليل الانبعاثات بنسبة 30%",
        expansion: "دخول 8 أسواق جديدة عالمياً",
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
  { id: "medical", name: "طبي", icon: "🏥" },
  { id: "technology", name: "تقني", icon: "💻" },
  { id: "sports", name: "رياضي", icon: "⚽" },
  { id: "travel", name: "سياحي", icon: "✈️" },
  { id: "food", name: "طعام", icon: "🍽️" },
  { id: "real-estate", name: "عقاري", icon: "🏡" },
  { id: "religious", name: "ديني", icon: "🕌" },
];

export const difficultyLevels = [
  { id: "beginner", name: "مبتدئ", color: "#10b981" },
  { id: "intermediate", name: "متوسط", color: "#f59e0b" },
  { id: "advanced", name: "متقدم", color: "#ef4444" },
];

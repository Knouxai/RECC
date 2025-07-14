import React, { useState, useMemo } from "react";

// Mock data for demonstration purposes
// In a real application, this data would likely come from a separate file or API
interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string; // Placeholder for image URL
  category: string;
  difficulty: string;
  tags: string[];
  duration: number; // in frames
  fps: number;
  width: number;
  height: number;
  customizableProps: any; // Example property
}

const templateCategories = [
  { id: "all", name: "الكل", icon: "✨" },
  { id: "social", name: "وسائل التواصل", icon: "📱" },
  { id: "business", name: "أعمال", icon: "💼" },
  { id: "artistic", name: "فني", icon: "🎨" },
  { id: "educational", name: "تعليمي", icon: "📚" },
  { id: "entertainment", name: "ترفيهي", icon: "🎉" },
];

const difficultyLevels = [
  {
    id: "easy",
    name: "سهل",
    color: "linear-gradient(45deg, #10b981, #34d399)",
  }, // green
  {
    id: "medium",
    name: "متوسط",
    color: "linear-gradient(45deg, #f59e0b, #fbbf24)",
  }, // yellow
  {
    id: "hard",
    name: "صعب",
    color: "linear-gradient(45deg, #ef4444, #f87171)",
  }, // red
];

const videoTemplates: VideoTemplate[] = [
  // Social Media Category (وسائل التواصل) - 10 Templates
  {
    id: "social-1",
    name: "مقدمة ديناميكية لليوتيوب", // Dynamic YouTube Intro
    description:
      "قالب مقدمة احترافي وجذاب لقنوات اليوتيوب ومدونات الفيديو. يتميز بحركات نصية سلسة وانتقالات بصرية حديثة تجذب المشاهدين من اللحظة الأولى.", // Professional and attractive intro template for YouTube channels and vlogs. Features smooth text animations and modern visual transitions that grab viewers from the first moment.
    thumbnail: "images/youtube-intro.jpg",
    category: "social",
    difficulty: "easy",
    tags: ["مقدمة", "يوتيوب", "مدونة فيديو", "سريع", "حديث", "قناة"], // Intro, YouTube, Vlog, Fast, Modern, Channel
    duration: 150, // 5 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      titleText: "عنوان قناتك",
      subText: "اشترك الآن",
      logo: "",
    }, // Your Channel Title, Subscribe Now, Logo
  },
  {
    id: "social-2",
    name: "خلاصة الأخبار اليومية", // Daily News Summary
    description:
      "قالب سريع ومحدث لتقديم موجز لأهم الأخبار اليومية في شكل فيديو. مثالي للقنوات الإخبارية أو المدونات التي تتطلب تحديثات سريعة.", // Fast and updated template for presenting a daily news summary in video format. Ideal for news channels or blogs that require quick updates.
    thumbnail: "images/news-digest.jpg",
    category: "social",
    difficulty: "easy",
    tags: ["أخبار", "يومي", "موجز", "معلومات", "تحديثات"], // News, Daily, Summary, Information, Updates
    duration: 180, // 6 seconds at 30 fps
    fps: 30,
    width: 1280,
    height: 720,
    customizableProps: { newsHeadlines: ["خبر 1", "خبر 2"], date: "اليوم" }, // News Headlines, Date
  },
  {
    id: "social-3",
    name: "إعلان قصة إنستغرام", // Instagram Story Ad
    description:
      "قالب عمودي جذاب مصمم خصيصًا لإعلانات قصص إنستغرام. يركز على جذب الانتباه السريع والتحويلات الفعالة.", // Engaging vertical template specifically designed for Instagram Story ads. Focuses on quick attention grabbing and effective conversions.
    thumbnail: "images/instagram-story.jpg",
    category: "social",
    difficulty: "medium",
    tags: ["إنستغرام", "قصة", "إعلان", "عمودي", "مبيعات"], // Instagram, Story, Ad, Vertical, Sales
    duration: 90, // 3 seconds at 30 fps
    fps: 30,
    width: 1080,
    height: 1920,
    customizableProps: { productName: "منتج جديد", callToAction: "تسوق الآن" }, // New Product, Shop Now
  },
  {
    id: "social-4",
    name: "تحدي تيك توك الفيروسي", // Viral TikTok Challenge
    description:
      "قالب ممتع وسريع الإيقاع مصمم لتحديات تيك توك الفيروسية. مثالي للمحتوى الترفيهي القصير والجذاب.", // Fun and fast-paced template designed for viral TikTok challenges. Ideal for short, engaging entertainment content.
    thumbnail: "images/tiktok-challenge.jpg",
    category: "social",
    difficulty: "easy",
    tags: ["تيك توك", "تحدي", "فيروسي", "ترفيه", "موسيقى"], // TikTok, Challenge, Viral, Entertainment, Music
    duration: 60, // 2 seconds at 30 fps
    fps: 30,
    width: 1080,
    height: 1920,
    customizableProps: { challengeName: "اسم التحدي", musicSnippet: "" }, // Challenge Name, Music Snippet
  },
  {
    id: "social-5",
    name: "تراكب بث مباشر على فيسبوك", // Facebook Live Stream Overlay
    description:
      "تراكب احترافي لبثوث فيسبوك المباشرة، يضيف لمسة مصقولة إلى فيديوهاتك مع شعار واسم المضيف.", // Professional overlay for Facebook Live streams, adding a polished touch to your videos with logo and host name.
    thumbnail: "images/facebook-live.jpg",
    category: "social",
    difficulty: "medium",
    tags: ["فيسبوك", "بث مباشر", "تراكب", "مضيف", "احترافي"], // Facebook, Live Stream, Overlay, Host, Professional
    duration: 300, // 10 seconds (example, usually continuous)
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: { hostName: "اسم المضيف", eventTitle: "عنوان البث" }, // Host Name, Stream Title
  },
  {
    id: "social-6",
    name: "إعلان فيديو تويتر", // Twitter Video Announcement
    description:
      "قالب فيديو قصير ومؤثر للإعلانات أو التحديثات السريعة على تويتر. مثالي للوصول إلى جمهور واسع بفعالية.", // Short and impactful video template for quick announcements or updates on Twitter. Ideal for effectively reaching a wide audience.
    thumbnail: "images/twitter-video.jpg",
    category: "social",
    difficulty: "easy",
    tags: ["تويتر", "إعلان", "قصير", "تحديث", "موجز"], // Twitter, Announcement, Short, Update, Brief
    duration: 45, // 1.5 seconds at 30 fps
    fps: 30,
    width: 1280,
    height: 720,
    customizableProps: { announcementText: "نص الإعلان", hashtag: "#هاشتاغ" }, // Announcement Text, Hashtag
  },
  {
    id: "social-7",
    name: "ترويج فلتر سناب شات", // Snapchat Filter Promo
    description:
      "قالب مرح ومبتكر للترويج لفلتر سناب شات جديد. يتميز برسوم متحركة جذابة وتصميم ملون.", // Fun and creative template for promoting a new Snapchat filter. Features engaging animations and colorful design.
    thumbnail: "images/snapchat-filter.jpg",
    category: "social",
    difficulty: "medium",
    tags: ["سناب شات", "فلتر", "ترويج", "مرح", "مبتكر"], // Snapchat, Filter, Promotion, Fun, Innovative
    duration: 75, // 2.5 seconds at 30 fps
    fps: 30,
    width: 1080,
    height: 1920,
    customizableProps: {
      filterName: "اسم الفلتر",
      instructions: "جرب الفلتر الآن!",
    }, // Filter Name, Try the Filter Now!
  },
  {
    id: "social-8",
    name: "تحديث لينكد إن الاحترافي", // LinkedIn Professional Update
    description:
      "قالب فيديو احترافي وموثوق لتحديثات لينكد إن. مثالي لمشاركة أخبار الشركة أو الإنجازات المهنية.", // Professional and reliable video template for LinkedIn updates. Ideal for sharing company news or professional achievements.
    thumbnail: "images/linkedin-update.jpg",
    category: "social",
    difficulty: "easy",
    tags: ["لينكد إن", "احترافي", "أعمال", "تحديث", "إنجازات"], // LinkedIn, Professional, Business, Update, Achievements
    duration: 120, // 4 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: { updateText: "��ص التحديث", companyLogo: "" }, // Update Text, Company Logo
  },
  {
    id: "social-9",
    name: "فيديو فكرة بينترست", // Pinterest Idea Pin Video
    description:
      "قالب فيديو إبداعي وملهم لمشاركات فكرة بينترست. مثالي لعرض المشاريع اليدوية، الوصفات، أو نصائح التصميم.", // Creative and inspiring video template for Pinterest Idea Pins. Ideal for showcasing DIY projects, recipes, or design tips.
    thumbnail: "images/pinterest-idea.jpg",
    category: "social",
    difficulty: "medium",
    tags: ["بينترست", "فكرة", "إبداع", "إلهام", "تعليمي"], // Pinterest, Idea, Creativity, Inspiration, Educational
    duration: 180, // 6 seconds at 30 fps
    fps: 30,
    width: 1080,
    height: 1920,
    customizableProps: { projectTitle: "عنوان المشروع", steps: [] }, // Project Title, Steps
  },
  {
    id: "social-10",
    name: "شاشة نهاية يوتيوب", // YouTube Outro Screen
    description:
      "قالب شاشة نهاية تفاعلية لليوتيوب، تشجع المشاهدين على الاشتراك ومشاهدة المزيد من الفيديوهات.", // Interactive YouTube outro screen template, encouraging viewers to subscribe and watch more videos.
    thumbnail: "images/youtube-outro.jpg",
    category: "social",
    difficulty: "easy",
    tags: ["يوتيوب", "شاشة نهاية", "اشتراك", "تفاعل", "قناة"], // YouTube, Outro Screen, Subscribe, Interaction, Channel
    duration: 150, // 5 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      subscribeText: "اشترك الآن",
      videoLinks: ["فيديو 1", "فيديو 2"],
    }, // Subscribe Now, Video Links
  },

  // Business Category (أعمال) - 10 Templates
  {
    id: "business-1",
    name: "عرض تقديمي لشركة ناشئة", // Startup Pitch Deck
    description:
      "قالب عرض تقديمي أنيق وموجز للشركات الناشئة، مثالي لعرض الأفكار للمستثمرين أو العملاء المحتملين. يتضمن رسومًا بيانية نظيفة وتصميمًا احترافيًا.", // Elegant and concise presentation template for startups, ideal for pitching ideas to investors or potential clients. Includes clean graphics and professional design.
    thumbnail: "images/startup-pitch.jpg",
    category: "business",
    difficulty: "medium",
    tags: ["أعمال", "شركة ناشئة", "عرض تقديمي", "استثمار", "احترافي"], // Business, Startup, Presentation, Investment, Professional
    duration: 300, // 10 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      companyName: "اسم شركتك",
      keyPoints: ["الابتكار", "النمو", "التأثير"],
    }, // Your Company Name, Innovation, Growth, Impact
  },
  {
    id: "business-2",
    name: "إعلان ترويجي لمنتج جديد", // New Product Promotional Ad
    description:
      "قالب إعلاني عالي الجودة ومقنع لعرض المنتجات الجديدة. يركز على الميزات الرئيسية والفوائد مع دعوة واضحة للعمل لزيادة المبيعات.", // High-quality and compelling advertising template for showcasing new products. Focuses on key features and benefits with a clear call to action to boost sales.
    thumbnail: "images/product-ad.jpg",
    category: "business",
    difficulty: "hard",
    tags: ["إعلان", "منتج", "تسويق", "ترويج", "مبيعات", "جديد"], // Ad, Product, Marketing, Promotion, Sales, New
    duration: 240, // 8 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      productName: "اسم المنتج",
      featuresList: ["ميزة 1", "ميزة 2"],
      callToActionText: "اشترِ الآن",
    }, // Product Name, Features List, Buy Now
  },
  {
    id: "business-3",
    name: "تقرير سنوي للشركة", // Company Annual Report
    description:
      "قالب احترافي لعرض التقرير السنوي للشركة، مع التركيز على البيانات المالية والإنجازات الرئيسية في عام كامل.", // Professional template for presenting the company's annual report, focusing on key financial data and achievements over a full year.
    thumbnail: "images/annual-report.jpg",
    category: "business",
    difficulty: "hard",
    tags: ["تقرير", "سنوي", "شركة", "بيانات", "إنجازات", "مالية"], // Report, Annual, Company, Data, Achievements, Financial
    duration: 900, // 30 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      financialData: { revenue: "X", profit: "Y" },
      achievements: ["إنجاز 1", "إنجاز 2"],
    }, // Financial Data, Achievements
  },
  {
    id: "business-4",
    name: "جولة عقارية افتراضية", // Real Estate Property Tour
    description:
      "قالب فيديو جذاب لعرض العقارات للبيع أو الإيجار. يتضمن انتقالات سلسة ومساحات لعرض مميزات العقار.", // Engaging video template for showcasing properties for sale or rent. Includes smooth transitions and spaces to highlight property features.
    thumbnail: "images/real-estate-tour.jpg",
    category: "business",
    difficulty: "medium",
    tags: ["عقارات", "جولة", "بيع", "تأجير", "منزل"], // Real Estate, Tour, Sale, Rent, House
    duration: 450, // 15 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      propertyAddress: "عنوان العقار",
      features: ["غرف نوم", "حمامات"],
      price: "السعر",
    }, // Property Address, Bedrooms, Bathrooms, Price
  },
  {
    id: "business-5",
    name: "عرض منتجات التجارة الإلكترونية", // E-commerce Product Showcase
    description:
      "قالب مصمم خصيصًا لعرض منتجات التجارة الإلكترونية بأسلوب أنيق ومقنع، مع التركيز على التفاصيل الدقيقة للمنتج.", // Template specifically designed to showcase e-commerce products in a stylish and compelling manner, focusing on precise product details.
    thumbnail: "images/ecommerce-showcase.jpg",
    category: "business",
    difficulty: "easy",
    tags: ["تجارة إلكترونية", "منتجات", "عرض", "مبيعات", "تسوق"], // E-commerce, Products, Showcase, Sales, Shopping
    duration: 180, // 6 seconds at 30 fps
    fps: 30,
    width: 1280,
    height: 720,
    customizableProps: {
      productImages: [],
      productDescription: "وصف المنتج",
      buyLink: "",
    }, // Product Images, Product Description, Buy Link
  },
  {
    id: "business-6",
    name: "فيديو شرح الخدمة", // Service Explainer Video
    description:
      "قالب متحرك ومبسط لشرح الخدمات المعقدة بطريقة سهلة الفهم. مثالي للشركات التي تقدم خدمات تقنية أو استشارية.", // Animated and simplified template for explaining complex services in an easy-to-understand way. Ideal for companies offering technical or consulting services.
    thumbnail: "images/service-explainer.jpg",
    category: "business",
    difficulty: "medium",
    tags: ["خدمة", "شرح", "متحرك", "تقنية", "استشارة"], // Service, Explainer, Animated, Technology, Consulting
    duration: 360, // 12 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      serviceName: "اسم الخدمة",
      benefits: [],
      howItWorks: [],
    }, // Service Name, Benefits, How It Works
  },
  {
    id: "business-7",
    name: "وحدة تدريب الشركات", // Corporate Training Module
    description:
      "قالب تدريبي احترافي مصمم لوحدات التدريب الداخلية للشركات. يتضمن مساحات للمحتوى التعليمي والاختبارات التفاعلية.", // Professional training template designed for internal corporate training modules. Includes spaces for educational content and interactive quizzes.
    thumbnail: "images/training-module.jpg",
    category: "business",
    difficulty: "hard",
    tags: ["تدريب", "شركة", "تعليم", "موظفين", "تطوير"], // Training, Corporate, Education, Employees, Development
    duration: 1200, // 40 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      moduleTitle: "عنوان الوحدة",
      learningObjectives: [],
      quizQuestions: [],
    }, // Module Title, Learning Objectives, Quiz Questions
  },
  {
    id: "business-8",
    name: "نظرة عامة على فرصة استثمارية", // Investment Opportunity Overview
    description:
      "قالب فيديو مقنع لعرض فرص الاستثمار المحتملة. يركز على البيانات المالية والمؤشرات الرئيسية لجذب المستثمرين.", // Compelling video template for showcasing potential investment opportunities. Focuses on financial data and key indicators to attract investors.
    thumbnail: "images/investment-overview.jpg",
    category: "business",
    difficulty: "hard",
    tags: ["استثمار", "مالية", "فرصة", "نمو", "أعمال"], // Investment, Financial, Opportunity, Growth, Business
    duration: 540, // 18 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      projectROI: "العائد على الاستثمار",
      marketAnalysis: "",
      teamInfo: [],
    }, // Project ROI, Market Analysis, Team Info
  },
  {
    id: "business-9",
    name: "ملخص حدث الشركة", // Business Event Recap
    description:
      "قالب ديناميكي لتلخيص أبرز لحظات حدث أو مؤتمر للشركة. مثالي للمشاركة على وسائل التواصل الاجتماعي أو التقارير الداخلية.", // Dynamic template for summarizing the highlights of a company event or conference. Ideal for sharing on social media or internal reports.
    thumbnail: "images/event-recap.jpg",
    category: "business",
    difficulty: "medium",
    tags: ["حدث", "شركة", "مؤتمر", "ملخص", "احتفال"], // Event, Company, Conference, Summary, Celebration
    duration: 270, // 9 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      eventName: "اسم الحدث",
      keySpeakers: [],
      highlights: [],
    }, // Event Name, Key Speakers, Highlights
  },
  {
    id: "business-10",
    name: "فيديو شهادة عميل", // Client Testimonial Video
    description:
      "قالب بسيط ومقنع لعرض شهادات العملاء. يساع�� في بناء الثقة والمصداقية لخدماتك أو منتجاتك.", // Simple and compelling template for showcasing client testimonials. Helps build trust and credibility for your services or products.
    thumbnail: "images/client-testimonial.jpg",
    category: "business",
    difficulty: "easy",
    tags: ["عملاء", "شهادة", "ثقة", "مصداقية", "مبيعات"], // Clients, Testimonial, Trust, Credibility, Sales
    duration: 180, // 6 seconds at 30 fps
    fps: 30,
    width: 1280,
    height: 720,
    customizableProps: {
      clientName: "اسم العميل",
      testimonialText: "نص الشهادة",
      clientPhoto: "",
    }, // Client Name, Testimonial Text, Client Photo
  },

  // Artistic Category (فني) - 10 Templates
  {
    id: "artistic-1",
    name: "قالب فني تجريدي", // Abstract Art Template
    description:
      "قالب بصري فريد يعرض الفن التجريدي مع تأثيرات بصرية مذهلة وموسيقى هادئة. مثالي للمعارض الفنية الرقمية أو الخلفيات الإبداعية.", // Unique visual template showcasing abstract art with stunning visual effects and calm music. Ideal for digital art exhibitions or creative backgrounds.
    thumbnail: "images/abstract-art.jpg",
    category: "artistic",
    difficulty: "medium",
    tags: ["فن", "تجريدي", "إبداعي", "موسيقى", "خلفية", "معرض"], // Art, Abstract, Creative, Music, Background, Exhibition
    duration: 500, // 16.6 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      colorPalette: ["#FF00FF", "#00FFFF"],
      musicTrack: "مسار صوتي",
    }, // Color Palette, Audio Track
  },
  {
    id: "artistic-2",
    name: "عرض تقديمي لمحفظة التصوير الفوتوغرافي", // Photography Portfolio Showcase
    description:
      "قالب أنيق لعرض أعمالك الفوتوغرافية بأسلوب احترافي. يتميز بانتقالات سلسة ومساحات كبيرة للصور.", // Elegant template for showcasing your photography work in a professional style. Features smooth transitions and large image display areas.
    thumbnail: "images/photo-portfolio.jpg",
    category: "artistic",
    difficulty: "medium",
    tags: ["تصوير", "محفظة", "فني", "صور", "عرض"], // Photography, Portfolio, Artistic, Photos, Showcase
    duration: 600, // 20 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      images: [],
      photographerName: "اسم المصور",
      music: "",
    }, // Images, Photographer Name, Music
  },
  {
    id: "artistic-3",
    name: "مرئي موسيقي", // Music Visualizer
    description:
      "قالب ديناميكي يتفاعل مع الموسيقى لإنشاء تأثيرات بصرية مذهلة. مثالي للموسيقيين ومنتجي الصوت.", // Dynamic template that reacts to music to create stunning visual effects. Ideal for musicians and audio producers.
    thumbnail: "images/music-visualizer.jpg",
    category: "artistic",
    difficulty: "hard",
    tags: ["موسيقى", "مرئي", "صوت", "تأثيرات", "فني"], // Music, Visualizer, Audio, Effects, Artistic
    duration: 900, // 30 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: { audioSpectrum: true, visualStyle: "نمط بصري" }, // Audio Spectrum, Visual Style
  },
  {
    id: "artistic-4",
    name: "تسلسل عنوان فيلم قصير", // Short Film Title Sequence
    description:
      "قالب سينمائي لإنشاء تسلسل عنوان احترافي لفيلم قصير. يضيف لمسة فنية ودرامية لمشروعك.", // Cinematic template for creating a professional title sequence for a short film. Adds an beautiful and dramatic touch to your project.
    thumbnail: "images/film-titles.jpg",
    category: "artistic",
    difficulty: "hard",
    tags: ["فيلم", "عنوان", "سينما", "دراما", "فني"], // Film, Title, Cinema, Drama, Artistic
    duration: 300, // 10 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      filmTitle: "عنوان الفيلم",
      directorName: "اسم المخرج",
      castNames: [],
    }, // Film Title, Director Name, Cast Names
  },
  {
    id: "artistic-5",
    name: "عملية الرسم الرقمي", // Digital Painting Process
    description:
      "قالب مسرّع يعرض عملية إنشاء لوحة رقمية من البداية إلى النهاية. مثالي للفنانين الرقميين.", // Time-lapse template showcasing the process of creating a digital painting from start to finish. Ideal for digital artists.
    thumbnail: "images/digital-painting.jpg",
    category: "artistic",
    difficulty: "medium",
    tags: ["رسم", "رقمي", "فنان", "عملية", "فني"], // Painting, Digital, Artist, Process, Artistic
    duration: 450, // 15 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      artistName: "اسم الفنان",
      artworkTitle: "عنوان العمل الفني",
      softwareUsed: "البرنامج المستخدم",
    }, // Artist Name, Artwork Title, Software Used
  },
  {
    id: "artistic-6",
    name: "ترويج معرض النحت", // Sculpture Exhibition Promo
    description:
      "قالب فيديو أنيق للترويج لمعرض نحت أو فني. يعرض الأعمال الفنية بتفاصيل جميلة.", // Elegant video template for promoting a sculpture or art exhibition. Showcases artworks in beautiful detail.
    thumbnail: "images/sculpture-promo.jpg",
    category: "artistic",
    difficulty: "medium",
    tags: ["نحت", "معرض", "فني", "ترويج", "فنون جميلة"], // Sculpture, Exhibition, Artistic, Promotion, Fine Arts
    duration: 270, // 9 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      exhibitionName: "اسم المعرض",
      artistFeatured: "الفنان المميز",
      dates: "التواريخ",
    }, // Exhibition Name, Featured Artist, Dates
  },
  {
    id: "artistic-7",
    name: "مرئيات قراءة الشعر", // Poetry Reading Visuals
    description:
      "قالب هادئ وجميل لمرافقة قراءات الشعر. يتميز بخلفيات متحركة ناعمة وتأثيرات نصية أنيقة.", // Calm and beautiful template to accompany poetry readings. Features soft animated backgrounds and elegant text effects.
    thumbnail: "images/poetry-visuals.jpg",
    category: "artistic",
    difficulty: "easy",
    tags: ["شعر", "أدب", "هادئ", "فني", "خلفية"], // Poetry, Literature, Calm, Artistic, Background
    duration: 600, // 20 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      poemText: "نص القصيدة",
      poetName: "اسم الشاعر",
      backgroundStyle: "نمط الخلفية",
    }, // Poem Text, Poet Name, Background Style
  },
  {
    id: "artistic-8",
    name: "مقطع دعائي لأداء رقص", // Dance Performance Trailer
    description:
      "قالب ديناميكي ومثير لإنشاء مقطع دعائي لأداء رقص. يبرز الحركات والطاقة في الأداء.", // Dynamic and exciting template for creating a dance performance trailer. Highlights the movements and energy of the performance.
    thumbnail: "images/dance-trailer.jpg",
    category: "artistic",
    difficulty: "medium",
    tags: ["رقص", "أداء", "مقطع دعائي", "فني", "طاقة"], // Dance, Performance, Trailer, Artistic, Energy
    duration: 210, // 7 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      performanceTitle: "عنوان الأداء",
      danceStyle: "نوع الرقص",
      music: "",
    }, // Performance Title, Dance Style, Music
  },
  {
    id: "artistic-9",
    name: "تسليط الضوء على عرض الأزياء", // Fashion Show Highlight
    description:
      "قالب أنيق وعصري لتسليط الضوء على أبرز لحظات عرض الأزياء. مثالي للمصممين والعلامات التجارية.", // Stylish and modern template for highlighting the best moments of a fashion show. Ideal for designers and brands.
    thumbnail: "images/fashion-show.jpg",
    category: "artistic",
    difficulty: "hard",
    tags: ["أزياء", "عرض", "مصمم", "علامة تجارية", "أناقة"], // Fashion, Show, Designer, Brand, Elegance
    duration: 360, // 12 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      collectionName: "اسم المجموعة",
      designerName: "اسم المصمم",
      models: [],
    }, // Collection Name, Designer Name, Models
  },
  {
    id: "artistic-10",
    name: "تصور معماري", // Architectural Visualization
    description:
      "قالب احترافي لعرض التصميمات المعمارية ثلاثية الأبعاد. يضيف لمسة واقعية وجذابة لمشاريعك.", // Professional template for showcasing 3D architectural designs. Adds a realistic and appealing touch to your projects.
    thumbnail: "images/architectural-viz.jpg",
    category: "artistic",
    difficulty: "hard",
    tags: ["هندسة معمارية", "تصميم", "ثلاثي الأبعاد", "مشاريع", "واقعي"], // Architecture, Design, 3D, Projects, Realistic
    duration: 750, // 25 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      buildingName: "اسم المبنى",
      architect: "اسم المهندس المعماري",
      views: [],
    }, // Building Name, Architect Name, Views
  },

  // Educational Category (تعليمي) - 10 Templates
  {
    id: "educational-1",
    name: "شرح مفصل لمفهوم علمي", // Detailed Scientific Concept Explanation
    description:
      "قالب تعليمي واضح ومبسط لشرح المفاهيم العلمية المعقدة. يتضمن رسومًا متحركة توضيحية ونصوصًا سهلة القراءة لجعل التعلم ممتعًا.", // Clear and simplified educational template for explaining complex scientific concepts. Includes illustrative animations and easy-to-read texts to make learning enjoyable.
    thumbnail: "images/science-explainer.jpg",
    category: "educational",
    difficulty: "medium",
    tags: ["تعليم", "علم", "شرح", "رسوم متحركة", "معقد", "تبسيط"], // Education, Science, Explanation, Animations, Complex, Simplification
    duration: 600, // 20 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      conceptName: "اسم المفهوم",
      keyDefinitions: ["تعريف 1", "تعريف 2"],
      visualExamples: [],
    }, // Concept Name, Key Definitions, Visual Examples
  },
  {
    id: "educational-2",
    name: "وصفة طعام سريعة", // Quick Recipe Tutorial
    description:
      "قالب سريع وممتع لعرض وصفات الطعام خطوة بخطوة. مثالي لمدونات الفيديو أو قنوات الطبخ التي تركز على السرعة والبساطة.", // Fast and fun template for showcasing recipes step-by-step. Ideal for vlogs or cooking channels that focus on speed and simplicity.
    thumbnail: "images/recipe-video.jpg",
    category: "educational",
    difficulty: "easy",
    tags: ["طبخ", "وصفة", "سريع", "طعام", "تعليمات"], // Cooking, Recipe, Fast, Food, Instructions
    duration: 210, // 7 seconds at 30 fps
    fps: 30,
    width: 1080,
    height: 1920, // Vertical video for social media
    customizableProps: {
      recipeName: "اسم الوصفة",
      ingredients: ["مكون 1", "مكون 2"],
      steps: ["خطوة 1", "خطوة 2"],
    }, // Recipe Name, Ingredients, Steps
  },
  {
    id: "educational-3",
    name: "درس تعلم اللغة", // Language Learning Lesson
    description:
      "قالب تعليمي تفاعلي لدروس تعلم اللغة. يتضمن مساحات للمفردات والقواعد والأمثلة.", // Interactive educational template for language learning lessons. Includes spaces for vocabulary, grammar, and examples.
    thumbnail: "images/language-lesson.jpg",
    category: "educational",
    difficulty: "medium",
    tags: ["لغة", "تعلم", "درس", "مفردات", "قواعد"], // Language, Learning, Lesson, Vocabulary, Grammar
    duration: 750, // 25 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      language: "اللغة",
      topic: "الموضوع",
      newWords: [],
      grammarRules: [],
    }, // Language, Topic, New Words, Grammar Rules
  },
  {
    id: "educational-4",
    name: "تعليمات حرف يدوية (DIY)", // DIY Craft Tutorial
    description:
      "قالب فيديو خطوة بخطوة لتعليم الحرف اليدوية والمشاريع اليدوية. يتميز بلقطات واضحة وتوجيهات سهلة المتابعة.", // Step-by-step video template for teaching DIY crafts and handmade projects. Features clear shots and easy-to-follow instructions.
    thumbnail: "images/diy-craft.jpg",
    category: "educational",
    difficulty: "easy",
    tags: ["حرف يدوية", "DIY", "تعليمات", "مشروع", "إبداعي"], // Crafts, DIY, Instructions, Project, Creative
    duration: 450, // 15 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      craftName: "اسم الحرفة",
      materials: [],
      stepByStep: [],
    }, // Craft Name, Materials, Step-by-Step
  },
  {
    id: "educational-5",
    name: "شرح برنامج حاسوبي", // Software Tutorial
    description:
      "قالب تعليمي لشرح كيفية استخدام البرامج الحاسوبية. يتضمن لقطات شاشة واضحة وتوجيهات صوتية.", // Educational template for explaining how to use computer software. Includes clear screen recordings and voice instructions.
    thumbnail: "images/software-tutorial.jpg",
    category: "educational",
    difficulty: "medium",
    tags: ["برنامج", "حاسوب", "شرح", "تقنية", "تعليم"], // Software, Computer, Explanation, Technology, Education
    duration: 720, // 24 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      softwareName: "اسم البرنامج",
      featuresCovered: [],
      tipsAndTricks: [],
    }, // Software Name, Features Covered, Tips and Tricks
  },
  {
    id: "educational-6",
    name: "مقطع وثائقي تاريخي", // Historical Documentary Segment
    description:
      "قالب لإنشاء مقاطع وثائقية تاريخية جذابة. يتضمن مساحات للصور الأرشيفية والخرائط والنصوص التوضيحية.", // Template for creating engaging historical documentary segments. Includes spaces for archival footage, maps, and explanatory texts.
    thumbnail: "images/history-doc.jpg",
    category: "educational",
    difficulty: "hard",
    tags: ["تاريخ", "وثائقي", "معلومات", "أحداث", "ثقافة"], // History, Documentary, Information, Events, Culture
    duration: 900, // 30 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      historicalEvent: "الحدث التاريخي",
      keyFigures: [],
      timeline: [],
    }, // Historical Event, Key Figures, Timeline
  },
  {
    id: "educational-7",
    name: "دليل تمرين اللياقة البدنية", // Fitness Workout Guide
    description:
      "قالب فيديو حيوي لتقديم دليل تمرين اللياقة البدنية. يعرض التمارين بوضوح مع تعليمات صوتية.", // Dynamic video template for presenting a fitness workout guide. Clearly demonstrates exercises with voice instructions.
    thumbnail: "images/fitness-guide.jpg",
    category: "educational",
    difficulty: "easy",
    tags: ["لياقة", "تمرين", "صحة", "رياضة", "دليل"], // Fitness, Workout, Health, Sport, Guide
    duration: 360, // 12 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      workoutType: "نوع التمرين",
      exercises: [],
      trainerName: "اسم المدرب",
    }, // Workout Type, Exercises, Trainer Name
  },
  {
    id: "educational-8",
    name: "شرح محو الأمية المالية", // Financial Literacy Explainer
    description:
      "قالب رسوم متحركة بسيطة لشرح مفاهيم محو الأمية المالية. مثالي للمؤسسات المالية أو المستشارين.", // Simple animated template for explaining financial literacy concepts. Ideal for financial institutions or advisors.
    thumbnail: "images/financial-literacy.jpg",
    category: "educational",
    difficulty: "medium",
    tags: ["مالية", "اقتصاد", "تعليم", "استثمار", "نصائح"], // Financial, Economy, Education, Investment, Tips
    duration: 480, // 16 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: { concept: "المفهوم", examples: [], keyTakeaways: [] }, // Concept, Examples, Key Takeaways
  },
  {
    id: "educational-9",
    name: "حملة توعية بيئية", // Environmental Awareness Campaign
    description:
      "قالب فيديو مؤثر لحملات التوعية البيئية. يركز على الحقائق والتأثيرات ��ع دعوة للعمل.", // Impactful video template for environmental awareness campaigns. Focuses on facts and impacts with a call to action.
    thumbnail: "images/eco-awareness.jpg",
    category: "educational",
    difficulty: "hard",
    tags: ["بيئة", "توعية", "استدامة", "تغيير مناخي", "عمل"], // Environment, Awareness, Sustainability, Climate Change, Action
    duration: 600, // 20 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      issue: "القضية",
      statistics: [],
      solutions: [],
      callToAction: "تصرف الآن",
    }, // Issue, Statistics, Solutions, Act Now
  },
  {
    id: "educational-10",
    name: "ترويج معسكر تدريب برمجي", // Coding Bootcamp Promo
    description:
      "قالب ديناميكي وجذاب للترويج لمعسكرات التدريب البرمجية أو الدورات التعليمية في مجال التكنولوجيا.", // Dynamic and engaging template for promoting coding bootcamps or tech educational courses.
    thumbnail: "images/coding-bootcamp.jpg",
    category: "educational",
    difficulty: "medium",
    tags: ["برمجة", "تكنولوجيا", "تدريب", "دورة", "وظائف"], // Coding, Technology, Training, Course, Jobs
    duration: 240, // 8 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      bootcampName: "اسم المعسكر",
      skillsTaught: [],
      successStories: [],
    }, // Bootcamp Name, Skills Taught, Success Stories
  },

  // Entertainment Category (ترفيهي) - 10 Templates
  {
    id: "entertainment-1",
    name: "مدونة فيديو للسفر والمغامرات", // Travel & Adventure Vlog
    description:
      "قالب ديناميكي ومليء بالحيوية لمدونات الفيديو التي توثق رحلات السفر والمغامرات. يتميز بانتقالات سريعة وموسيقى تصويرية ملهمة تأسر المشاهد.", // Dynamic and lively template for vlogs documenting travel and adventures. Features fast transitions and inspiring soundtrack that captivates the viewer.
    thumbnail: "images/travel-vlog.jpg",
    category: "entertainment",
    difficulty: "easy",
    tags: ["سفر", "مغامرة", "مدونة فيديو", "حيوية", "موسيقى", "استكشاف"], // Travel, Adventure, Vlog, Lively, Music, Exploration
    duration: 450, // 15 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      destination: "اسم الوجهة",
      highlights: ["مناظر طبيعية خلابة", "أنشطة مثيرة"],
    }, // Destination Name, Breathtaking Scenery, Exciting Activities
  },
  {
    id: "entertainment-2",
    name: "مقدمة بودكاست متحركة", // Animated Podcast Intro
    description:
      "مقدمة رسوم متحركة جذابة للبودكاست الخاص بك، مع مساحة لاسم البودكاست والمضيفين وشعار مميز.", // Engaging animated intro for your podcast, with space for podcast name, hosts, and a distinctive logo.
    thumbnail: "images/podcast-intro.jpg",
    category: "entertainment",
    difficulty: "easy",
    tags: ["بودكاست", "مقدمة", "صوت", "رسوم متحركة", "ترفيه"], // Podcast, Intro, Audio, Animation, Entertainment
    duration: 120, // 4 seconds at 30 fps
    fps: 30,
    width: 1280,
    height: 720,
    customizableProps: {
      podcastTitle: "عنوان البودكاست",
      hostNames: ["المضيف 1", "المضيف 2"],
    }, // Podcast Title, Host 1, Host 2
  },
  {
    id: "entertainment-3",
    name: "ملخص أبرز لحظات الألعاب", // Gaming Highlights Reel
    description:
      "قالب سريع ومثير لعرض أبرز لحظات اللعب. مثالي للاعبين ومصنعي المحتوى.", // Fast-paced and exciting template for showcasing gaming highlights. Ideal for gamers and content creators.
    thumbnail: "images/gaming-highlights.jpg",
    category: "entertainment",
    difficulty: "medium",
    tags: ["ألعاب", "ملخص", "ترفيه", "لاعبين", "محتوى"], // Gaming, Highlights, Entertainment, Gamers, Content
    duration: 240, // 8 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      gameTitle: "اسم اللعبة",
      bestMoments: [],
      playerTag: "",
    }, // Game Title, Best Moments, Player Tag
  },
  {
    id: "entertainment-4",
    name: "افتتاحية رسم كوميدي", // Comedy Sketch Opener
    description:
      "قالب مضحك وجذاب لافتتاحية رسوم كوميدية أو عروض ستاند أب. يضيف لمسة فكاهية لمحتواك.", // Funny and engaging template for opening comedy sketches or stand-up shows. Adds a humorous touch to your content.
    thumbnail: "images/comedy-opener.jpg",
    category: "entertainment",
    difficulty: "easy",
    tags: ["كوميديا", "مضحك", "ترفيه", "ستاند أب", "فكاهة"], // Comedy, Funny, Entertainment, Stand-up, Humor
    duration: 90, // 3 seconds at 30 fps
    fps: 30,
    width: 1280,
    height: 720,
    customizableProps: {
      showTitle: "عنوان العرض",
      comedianName: "اسم الكوميدي",
    }, // Show Title, Comedian Name
  },
  {
    id: "entertainment-5",
    name: "نمط مقطع دعائي لفيلم", // Movie Trailer Style
    description:
      "قالب سينمائي لإنشاء مقاطع دعائية لفيلم أو مسلسل. يتميز بتأثيرات بصرية درامية وموسيقى تصويرية قوية.", // Cinematic template for creating movie or series trailers. Features dramatic visual effects and powerful soundtrack.
    thumbnail: "images/movie-trailer.jpg",
    category: "entertainment",
    difficulty: "hard",
    tags: ["فيلم", "مقطع دعائي", "سينما", "دراما", "تشويق"], // Film, Trailer, Cinema, Drama, Suspense
    duration: 600, // 20 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      movieTitle: "عنوان الفيلم",
      releaseDate: "تاريخ الإصدار",
      taglines: [],
    }, // Movie Title, Release Date, Taglines
  },
  {
    id: "entertainment-6",
    name: "فيديو ترويجي لحفل موسيقي", // Concert Promo Video
    description:
      "قالب فيديو حيوي ومثير للترويج للحفلات الموسيقية أو المهرجانات. يعرض الفنانين والتواريخ الرئيسية.", // Lively and exciting video template for promoting concerts or festivals. Showcases artists and key dates.
    thumbnail: "images/concert-promo.jpg",
    category: "entertainment",
    difficulty: "medium",
    tags: ["حفل موسيقي", "مهرجان", "موسيقى", "ترويج", "ترفيه"], // Concert, Festival, Music, Promotion, Entertainment
    duration: 270, // 9 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      bandName: "اسم الفرقة",
      concertDate: "تاريخ الحفل",
      venue: "المكان",
    }, // Band Name, Concert Date, Venue
  },
  {
    id: "entertainment-7",
    name: "كشف خدعة سحرية", // Magic Trick Reveal
    description:
      "قالب جذاب ومثير لكشف أسرار الخدع السحرية. مثالي لمدونات الفيديو التعليمية أو الترفيهية.", // Engaging and exciting template for revealing magic trick secrets. Ideal for educational or entertainment vlogs.
    thumbnail: "images/magic-reveal.jpg",
    category: "entertainment",
    difficulty: "easy",
    tags: ["سحر", "خدعة", "كشف", "ترفيه", "تعليمي"], // Magic, Trick, Reveal, Entertainment, Educational
    duration: 180, // 6 seconds at 30 fps
    fps: 30,
    width: 1280,
    height: 720,
    customizableProps: { trickName: "اسم الخدعة", explanationSteps: [] }, // Trick Name, Explanation Steps
  },
  {
    id: "entertainment-8",
    name: "مقطع برنامج طبخ", // Cooking Show Segment
    description:
      "قالب احترافي لبرامج الطبخ، يعرض الوصفات بأسلوب أنيق ومشهي. يتضمن مساحات للمكونات والخطوات.", // Professional template for cooking shows, showcasing recipes in a stylish and appetizing manner. Includes spaces for ingredients and steps.
    thumbnail: "images/cooking-show.jpg",
    category: "entertainment",
    difficulty: "medium",
    tags: ["طبخ", "وصفة", "برنامج", "طعام", "مشهي"], // Cooking, Recipe, Show, Food, Appetizing
    duration: 540, // 18 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      dishName: "اسم الطبق",
      chefName: "اسم الطاهي",
      fullRecipe: "",
    }, // Dish Name, Chef Name, Full Recipe
  },
  {
    id: "entertainment-9",
    name: "رسوم متحركة لمراجعة كتاب", // Book Review Animation
    description:
      "قالب رسوم متحركة إبداعي لمراجعات الكتب. يضيف لمسة بصرية فريدة لمناقشاتك الأدبية.", // Creative animation template for book reviews. Adds a unique visual touch to your literary discussions.
    thumbnail: "images/book-review.jpg",
    category: "entertainment",
    difficulty: "medium",
    tags: ["كتاب", "مراجعة", "أدب", "رسوم متحركة", "ترفيه"], // Book, Review, Literature, Animation, Entertainment
    duration: 360, // 12 seconds at 30 fps
    fps: 30,
    width: 1280,
    height: 720,
    customizableProps: {
      bookTitle: "عنوان الكتاب",
      author: "المؤلف",
      rating: "التقييم",
      keyPoints: [],
    }, // Book Title, Author, Rating, Key Points
  },
  {
    id: "entertainment-10",
    name: "مقدمة برنامج مسابقات", // Quiz Show Intro
    description:
      "مقدمة ديناميكية ومليئة بالطاقة لبرنامج مسابقات. مثالية لجذب انتباه الجمهور.", // Dynamic and energetic intro for a quiz show. Ideal for grabbing audience attention.
    thumbnail: "images/quiz-show-intro.jpg",
    category: "entertainment",
    difficulty: "hard",
    tags: ["مسابقات", "ترفيه", "مقدمة", "تحدي", "طاقة"], // Quiz, Entertainment, Intro, Challenge, Energy
    duration: 180, // 6 seconds at 30 fps
    fps: 30,
    width: 1920,
    height: 1080,
    customizableProps: {
      showName: "اسم البرنامج",
      host: "المضيف",
      soundEffects: true,
    }, // Show Name, Host, Sound Effects
  },
];

interface TemplateGalleryProps {
  onTemplateSelect: (template: VideoTemplate) => void;
  selectedTemplate?: VideoTemplate | null;
}

// Changed to default export to resolve "Element type is invalid" error
export default function EnhancedTemplateGallery({
  onTemplateSelect,
  selectedTemplate,
}: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [suggestionPrompt, setSuggestionPrompt] = useState("");
  const [suggestedTemplates, setSuggestedTemplates] = useState<VideoTemplate[]>(
    [],
  );
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [customizationIdeas, setCustomizationIdeas] = useState<string[]>([]);
  const [customizationLoading, setCustomizationLoading] = useState(false);

  // Filter templates based on selected category, difficulty, and search query
  const filteredTemplates = useMemo(() => {
    return videoTemplates.filter((template) => {
      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        template.difficulty === selectedDifficulty;
      const matchesSearch =
        searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  // Function to call Gemini API for smart template suggestions
  const getSmartTemplateSuggestions = async () => {
    setSuggestionLoading(true);
    setSuggestedTemplates([]);
    try {
      const categoriesList = templateCategories
        .map((c) => `${c.name} (${c.icon})`)
        .join(", ");
      const difficultiesList = difficultyLevels.map((d) => d.name).join(", ");

      const prompt = `Given the following video template categories and difficulties:
Categories: ${categoriesList}
Difficulties: ${difficultiesList}

The user is looking for video templates with the following description: '${suggestionPrompt}'.
Based on this, suggest 3-5 template IDs from the provided list that best fit the user's description. For each suggested template, also provide a brief reason (1-2 sentences) why it's a good fit. If no templates are suitable, state that.
The response should be a JSON array of objects, where each object has 'id' (string) and 'reason' (string).`;

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                reason: { type: "STRING" },
              },
              propertyOrdering: ["id", "reason"],
            },
          },
        },
      };
      const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const jsonResponse = result.candidates[0].content.parts[0].text;
        const parsedSuggestions = JSON.parse(jsonResponse);

        const suggestedTemplateObjects = parsedSuggestions
          .map((s: { id: string; reason: string }) => {
            const template = videoTemplates.find((t) => t.id === s.id);
            return template ? { ...template, reason: s.reason } : null;
          })
          .filter(Boolean) as VideoTemplate[]; // Filter out nulls and assert type
        setSuggestedTemplates(suggestedTemplateObjects);
      } else {
        console.error(
          "Gemini API returned an unexpected response structure for suggestions:",
          result,
        );
        setSuggestedTemplates([]);
      }
    } catch (error) {
      console.error("Error fetching smart template suggestions:", error);
      setSuggestedTemplates([]);
    } finally {
      setSuggestionLoading(false);
    }
  };

  // Function to call Gemini API for customization ideas
  const getCustomizationIdeas = async () => {
    if (!selectedTemplate) return;

    setCustomizationLoading(true);
    setCustomizationIdeas([]);
    try {
      const prompt = `Given the following video template details:
Name: ${selectedTemplate.name}
Description: ${selectedTemplate.description}
Category: ${selectedTemplate.category}
Difficulty: ${selectedTemplate.difficulty}
Tags: ${selectedTemplate.tags.join(", ")}
Customizable Properties: ${JSON.stringify(selectedTemplate.customizableProps)}

The user wants creative customization ideas for this template. Provide 3-5 distinct and actionable ideas that leverage the customizable properties. Focus on how the user can make the template unique and fit different scenarios.
The response should be a JSON array of strings, where each string is a customization idea.`;

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
        },
      };
      const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const jsonResponse = result.candidates[0].content.parts[0].text;
        const parsedIdeas = JSON.parse(jsonResponse);
        setCustomizationIdeas(parsedIdeas);
      } else {
        console.error(
          "Gemini API returned an unexpected response structure for customization ideas:",
          result,
        );
        setCustomizationIdeas([]);
      }
    } catch (error) {
      console.error("Error fetching customization ideas:", error);
      setCustomizationIdeas([]);
    } finally {
      setCustomizationLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white font-sans flex flex-col items-center py-8 px-4"
      style={{ direction: "rtl" }}
    >
      {/* Header */}
      <div className="w-full max-w-6xl bg-slate-900 bg-opacity-90 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-slate-700 mb-8">
        <h1 className="text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          🎬 معرض القوالب التفاعلي
        </h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-700 bg-opacity-80 rounded-full p-4 border-2 border-slate-600 min-w-[400px] flex items-center gap-4 shadow-inner">
            <span className="text-2xl text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="ابحث عن قالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-white text-lg outline-none flex-1 text-right placeholder-slate-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-lg">الفئة:</span>
            {templateCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full text-base font-medium transition-all duration-300 ease-in-out
                  ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-md border-blue-400"
                      : "bg-slate-700 hover:bg-slate-600 border-slate-600"
                  } border-2`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-lg">المستوى:</span>
            <button
              onClick={() => setSelectedDifficulty("all")}
              className={`px-5 py-2 rounded-full text-base font-medium transition-all duration-300 ease-in-out
                ${
                  selectedDifficulty === "all"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-md border-blue-400"
                    : "bg-slate-700 hover:bg-slate-600 border-slate-600"
                } border-2`}
            >
              الكل
            </button>
            {difficultyLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedDifficulty(level.id)}
                className={`px-5 py-2 rounded-full text-base font-medium transition-all duration-300 ease-in-out
                  ${
                    selectedDifficulty === level.id
                      ? `bg-[${level.color}] shadow-md border-2` // Tailwind doesn't parse dynamic colors directly, using inline style for gradient
                      : "bg-slate-700 hover:bg-slate-600 border-slate-600"
                  } border-2`}
                style={
                  selectedDifficulty === level.id
                    ? {
                        background: level.color,
                        borderColor: level.color
                          .split(",")[1]
                          .trim()
                          .replace(")", ""),
                      }
                    : {}
                } // Apply gradient for selected
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        {/* Smart Template Suggestion Feature */}
        <div className="mt-8 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-3xl font-bold text-blue-300 mb-4 text-center">
            ✨ اقتراح قوالب ذكية
          </h2>
          <p className="text-slate-300 mb-4 text-center">
            صف احتياجات الفيديو الخاصة بك وسأقترح عليك قوالب مناسبة.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="مثال: فيديو تسويقي لمنتج جديد، مدونة فيديو عن السفر..."
              value={suggestionPrompt}
              onChange={(e) => setSuggestionPrompt(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white text-lg rounded-full px-5 py-3 flex-1 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-right"
            />
            <button
              onClick={getSmartTemplateSuggestions}
              disabled={suggestionLoading || !suggestionPrompt.trim()}
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestionLoading ? "جاري الاقتراح..." : "✨ اقتراح قوالب"}
            </button>
          </div>
          {suggestedTemplates.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-3">
                القوالب المقترحة لك:
              </h3>
              <ul className="list-disc list-inside text-slate-300">
                {suggestedTemplates.map((template, index) => (
                  <li key={template.id} className="mb-2">
                    <span className="font-bold text-blue-300">
                      {template.name}:
                    </span>{" "}
                    {template.reason}
                    <button
                      onClick={() => onTemplateSelect(template)}
                      className="mr-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full transition-colors duration-200"
                    >
                      عرض القالب
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {suggestionLoading && (
            <p className="text-center text-blue-400 mt-4">
              جاري تحميل الاقتراحات...
            </p>
          )}
          {!suggestionLoading &&
            suggestedTemplates.length === 0 &&
            suggestionPrompt.trim() && (
              <p className="text-center text-slate-400 mt-4">
                لا توجد اقتراحات حاليًا بناءً على وصفك.
              </p>
            )}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 overflow-y-auto custom-scrollbar">
        {filteredTemplates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id;

          return (
            <div
              key={template.id}
              onClick={() => {
                // Defensive check to ensure onTemplateSelect is a function before calling it
                if (typeof onTemplateSelect === "function") {
                  onTemplateSelect(template);
                  setCustomizationIdeas([]); // Clear previous customization ideas
                } else {
                  console.error(
                    "onTemplateSelect prop is not a function or is missing.",
                    onTemplateSelect,
                  );
                }
              }}
              className={`relative bg-slate-800 bg-opacity-80 backdrop-blur-md rounded-2xl p-6 cursor-pointer transition-all duration-300 ease-in-out
                ${
                  isSelected
                    ? "border-4 border-blue-400 shadow-2xl shadow-blue-500/30 transform scale-105"
                    : "border-2 border-slate-700 hover:border-blue-500 hover:shadow-xl hover:shadow-slate-700/20"
                }`}
            >
              {/* Template Thumbnail */}
              <div
                className="w-full h-40 bg-gray-700 rounded-lg mb-4 bg-center bg-cover"
                style={{ backgroundImage: `url('${template.thumbnail}')` }}
              ></div>

              {/* Template Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {template.name}
                  </h3>
                  <div
                    className="rounded-xl px-3 py-1 text-xs font-semibold text-white inline-block"
                    style={{
                      background:
                        difficultyLevels.find(
                          (l) => l.id === template.difficulty,
                        )?.color || "#6b7280",
                    }}
                  >
                    {
                      difficultyLevels.find((l) => l.id === template.difficulty)
                        ?.name
                    }
                  </div>
                </div>
                <div className="text-4xl opacity-80 text-blue-300">
                  {
                    templateCategories.find((c) => c.id === template.category)
                      ?.icon
                  }
                </div>
              </div>

              {/* Template Description */}
              <p className="text-base text-slate-300 mb-4 leading-relaxed">
                {template.description}
              </p>

              {/* Template Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-900/30 text-blue-300 rounded-lg px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Template Info */}
              <div className="flex justify-between items-center text-sm text-slate-400">
                <span>⏱️ {Math.floor(template.duration / template.fps)}s</span>
                <span>
                  📐 {template.width}×{template.height}
                </span>
                <span>🎬 {template.fps}fps</span>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Customization Ideas Feature (appears when a template is selected) */}
      {selectedTemplate && (
        <div className="w-full max-w-6xl mt-8 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-3xl font-bold text-purple-300 mb-4 text-center">
            ✨ أفكار تخصيص القالب
          </h2>
          <p className="text-slate-300 mb-4 text-center">
            احصل على أفكار إبداعية لتخصيص قالب "{selectedTemplate.name}".
          </p>
          <div className="flex justify-center mb-4">
            <button
              onClick={getCustomizationIdeas}
              disabled={customizationLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {customizationLoading
                ? "جاري التوليد..."
                : "✨ توليد أفكار تخصيص"}
            </button>
          </div>
          {customizationIdeas.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-3">
                أفكار التخصيص لـ "{selectedTemplate.name}":
              </h3>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                {customizationIdeas.map((idea, index) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            </div>
          )}
          {customizationLoading && (
            <p className="text-center text-purple-400 mt-4">
              جاري تحميل أفكار التخصيص...
            </p>
          )}
          {!customizationLoading &&
            customizationIdeas.length === 0 &&
            selectedTemplate && (
              <p className="text-center text-slate-400 mt-4">
                لا توجد أفكار تخصيص حاليًا لهذا القالب.
              </p>
            )}
        </div>
      )}

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center text-slate-500 mt-12">
          <div className="text-8xl mb-4">🔍</div>
          <h3 className="text-3xl font-bold mb-2">لم يتم العثور على قوالب</h3>
          <p className="text-lg">جرب تغيير معايير البحث أو الفلترة</p>
        </div>
      )}

      {/* Floating particles (simplified for Tailwind compatibility) */}
      {/* Note: Complex animations like these are often better handled with dedicated animation libraries or more advanced CSS. */}
      {/* For simplicity, these particles are static in this Tailwind conversion. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-500 rounded-full opacity-30 shadow-blue-500/50 animate-pulse"
            style={{
              width: "8px",
              height: "8px",
              left: `${(i % 5) * 20}%`,
              top: `${Math.floor(i / 5) * 20 + 20}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `translateY(${i % 2 === 0 ? "20px" : "-20px"}) translateX(${i % 3 === 0 ? "15px" : "-15px"})`,
            }}
          />
        ))}
      </div>

      {/* Global Styles for custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}

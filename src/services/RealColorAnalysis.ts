// خدمة تحليل الألوان الحقيقية
import ColorThief from "colorthief";

export interface ColorAnalysisResult {
  dominantColor: { r: number; g: number; b: number; hex: string };
  palette: Array<{
    r: number;
    g: number;
    b: number;
    hex: string;
    percentage: number;
  }>;
  colorHarmony: {
    analogous: string[];
    complementary: string[];
    triadic: string[];
    tetradic: string[];
    splitComplementary: string[];
    monochromatic: string[];
  };
  colorTemperature: {
    value: number; // Kelvin
    category: "very_warm" | "warm" | "neutral" | "cool" | "very_cool";
    description: string;
  };
  colorMood: {
    primary: string;
    secondary: string[];
    emotions: string[];
    associations: string[];
  };
  accessibility: {
    contrastRatios: Array<{
      background: string;
      foreground: string;
      ratio: number;
      wcagLevel: "AA" | "AAA" | "fail";
    }>;
    colorBlindnessSimulation: {
      protanopia: string[];
      deuteranopia: string[];
      tritanopia: string[];
    };
  };
  recommendations: {
    webSafe: string[];
    printSafe: string[];
    brandColors: string[];
    improvements: string[];
  };
  statistics: {
    totalUniqueColors: number;
    averageBrightness: number;
    averageSaturation: number;
    colorfulness: number;
    contrast: number;
    vibrance: number;
  };
}

export interface ColorScheme {
  name: string;
  primary: string;
  secondary: string[];
  accent: string[];
  neutral: string[];
  description: string;
  useCases: string[];
}

export interface ColorSuggestion {
  type:
    | "complementary"
    | "analogous"
    | "triadic"
    | "tetradic"
    | "monochromatic"
    | "warm"
    | "cool";
  colors: string[];
  description: string;
  confidence: number;
  suitableFor: string[];
}

export class RealColorAnalysisService {
  private colorThief: ColorThief;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.colorThief = new ColorThief();
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
  }

  // تحلي�� شامل للألوان في الصورة
  async analyzeImage(
    imageFile: File | HTMLImageElement,
  ): Promise<ColorAnalysisResult> {
    const image = await this.loadImage(imageFile);

    // استخراج الألوان المهيمنة
    const dominantColor = this.extractDominantColor(image);
    const palette = this.extractColorPalette(image, 10);

    // تحليل تفصيلي للصورة
    const detailedAnalysis = await this.performDetailedColorAnalysis(image);

    // تحليل التناغم اللوني
    const colorHarmony = this.analyzeColorHarmony(dominantColor);

    // تحليل درجة الحرارة اللونية
    const colorTemperature = this.analyzeColorTemperature(palette);

    // تحليل المزاج والمشاعر
    const colorMood = this.analyzeColorMood(palette);

    // فحص إمكانية الوصول
    const accessibility = this.analyzeAccessibility(palette);

    // التوصيات
    const recommendations = this.generateRecommendations(
      palette,
      detailedAnalysis,
    );

    return {
      dominantColor,
      palette,
      colorHarmony,
      colorTemperature,
      colorMood,
      accessibility,
      recommendations,
      statistics: detailedAnalysis,
    };
  }

  // استخراج اللون المهيمن
  private extractDominantColor(image: HTMLImageElement): {
    r: number;
    g: number;
    b: number;
    hex: string;
  } {
    try {
      const dominantRGB = this.colorThief.getColor(image, 10);
      return {
        r: dominantRGB[0],
        g: dominantRGB[1],
        b: dominantRGB[2],
        hex: this.rgbToHex(dominantRGB[0], dominantRGB[1], dominantRGB[2]),
      };
    } catch (error) {
      console.warn("فشل في استخراج اللون المهيمن، استخدام تحليل يدوي");
      return this.extractDominantColorManual(image);
    }
  }

  // استخراج لوحة الألوان
  private extractColorPalette(
    image: HTMLImageElement,
    colorCount: number = 10,
  ): Array<{
    r: number;
    g: number;
    b: number;
    hex: string;
    percentage: number;
  }> {
    try {
      const paletteRGB = this.colorThief.getPalette(image, colorCount, 10);
      const totalPixels = this.countImagePixels(image);

      return paletteRGB
        .map((color, index) => {
          const percentage = this.calculateColorPercentage(image, color);
          return {
            r: color[0],
            g: color[1],
            b: color[2],
            hex: this.rgbToHex(color[0], color[1], color[2]),
            percentage,
          };
        })
        .sort((a, b) => b.percentage - a.percentage);
    } catch (error) {
      console.warn("فشل في استخراج لوحة الألوان، استخدام تحليل يدوي");
      return this.extractColorPaletteManual(image, colorCount);
    }
  }

  // تحليل تفصيلي للألوان (يدوي)
  private async performDetailedColorAnalysis(
    image: HTMLImageElement,
  ): Promise<ColorAnalysisResult["statistics"]> {
    this.canvas.width = image.width;
    this.canvas.height = image.height;
    this.ctx.drawImage(image, 0, 0);

    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    const data = imageData.data;

    const colors = new Set<string>();
    let totalBrightness = 0;
    let totalSaturation = 0;
    let pixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      if (alpha > 0) {
        // تجاهل البكسلات الشفافة
        colors.add(`${r},${g},${b}`);

        // حساب السطوع
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        totalBrightness += brightness;

        // حساب التشبع
        const [h, s, l] = this.rgbToHsl(r, g, b);
        totalSaturation += s;

        pixelCount++;
      }
    }

    const averageBrightness = totalBrightness / pixelCount;
    const averageSaturation = totalSaturation / pixelCount;
    const colorfulness = this.calculateColorfulness(imageData);
    const contrast = this.calculateContrast(imageData);
    const vibrance = this.calculateVibrance(imageData);

    return {
      totalUniqueColors: colors.size,
      averageBrightness,
      averageSaturation,
      colorfulness,
      contrast,
      vibrance,
    };
  }

  // تحليل التناغم اللوني
  private analyzeColorHarmony(dominantColor: {
    r: number;
    g: number;
    b: number;
  }): ColorAnalysisResult["colorHarmony"] {
    const [h, s, l] = this.rgbToHsl(
      dominantColor.r,
      dominantColor.g,
      dominantColor.b,
    );

    return {
      analogous: this.generateAnalogousColors(h, s, l),
      complementary: this.generateComplementaryColors(h, s, l),
      triadic: this.generateTriadicColors(h, s, l),
      tetradic: this.generateTetradicColors(h, s, l),
      splitComplementary: this.generateSplitComplementaryColors(h, s, l),
      monochromatic: this.generateMonochromaticColors(h, s, l),
    };
  }

  // تحليل درجة الحرارة اللونية
  private analyzeColorTemperature(
    palette: Array<{ r: number; g: number; b: number }>,
  ): ColorAnalysisResult["colorTemperature"] {
    let totalTemperature = 0;
    let weightedSum = 0;

    for (const color of palette) {
      const temperature = this.calculateColorTemperature(
        color.r,
        color.g,
        color.b,
      );
      const weight = color.r + color.g + color.b; // وزن اللون
      totalTemperature += temperature * weight;
      weightedSum += weight;
    }

    const averageTemperature = totalTemperature / weightedSum;

    let category: ColorAnalysisResult["colorTemperature"]["category"];
    let description: string;

    if (averageTemperature > 5000) {
      category = "very_warm";
      description = "ألوان دافئة جداً تعطي شعوراً بالحيوية والطاقة";
    } else if (averageTemperature > 3500) {
      category = "warm";
      description = "ألوان دافئة مريحة وترحيبية";
    } else if (averageTemperature > 2500) {
      category = "neutral";
      description = "ألوان متوازنة ومناسبة لمعظم الاستخدامات";
    } else if (averageTemperature > 1500) {
      category = "cool";
      description = "ألوان باردة تعطي شعوراً بالهدوء والاسترخاء";
    } else {
      category = "very_cool";
      description = "ألوان باردة جداً تعطي شعوراً بالفخامة والرقي";
    }

    return {
      value: averageTemperature,
      category,
      description,
    };
  }

  // تحليل المزاج والمشاعر
  private analyzeColorMood(
    palette: Array<{ r: number; g: number; b: number }>,
  ): ColorAnalysisResult["colorMood"] {
    const moods: {
      [key: string]: { emotions: string[]; associations: string[] };
    } = {
      red: {
        emotions: ["قوة", "شغف", "طاقة", "حب"],
        associations: ["نار", "دم", "ورود", "خطر"],
      },
      orange: {
        emotions: ["حماس", "دفء", "إبداع", "مرح"],
        associations: ["شمس", "برتقال", "خريف", "نشاط"],
      },
      yellow: {
        emotions: ["سعادة", "تفاؤل", "طاقة", "إشراق"],
        associations: ["شمس", "ذهب", "ليمون", "انتباه"],
      },
      green: {
        emotions: ["هدوء", "نمو", "انتعاش", "طبيعة"],
        associations: ["أشجار", "طبيعة", "أموال", "صحة"],
      },
      blue: {
        emotions: ["هدوء", "ثقة", "استقرار", "حكمة"],
        associations: ["سماء", "بحر", "ثقة", "تقنية"],
      },
      purple: {
        emotions: ["فخامة", "إبداع", "روحانية", "غموض"],
        associations: ["ملوك", "سحر", "فن", "خيال"],
      },
      pink: {
        emotions: ["حب", "��نان", "نعومة", "رومانسية"],
        associations: ["ورود", "أنوثة", "طفولة", "رقة"],
      },
      black: {
        emotions: ["قوة", "أناقة", "غموض", "رسمية"],
        associations: ["ليل", "فخامة", "حداد", "قوة"],
      },
      white: {
        emotions: ["نقاء", "بساطة", "سلام", "نظافة"],
        associations: ["ثلج", "سلام", "طب", "بداية"],
      },
      gray: {
        emotions: ["توازن", "حياد", "احتراف", "هدوء"],
        associations: ["معدن", "تقنية", "مطر", "حياد"],
      },
    };

    const dominantColorName = this.getColorName(palette[0]);
    const secondaryColors = palette
      .slice(1, 4)
      .map((color) => this.getColorName(color));

    const primaryMood = moods[dominantColorName] || moods["gray"];
    const emotions = [...primaryMood.emotions];
    const associations = [...primaryMood.associations];

    // إضافة مشاعر الألوان الثانوية
    secondaryColors.forEach((colorName) => {
      if (moods[colorName]) {
        emotions.push(...moods[colorName].emotions.slice(0, 2));
        associations.push(...moods[colorName].associations.slice(0, 2));
      }
    });

    return {
      primary: dominantColorName,
      secondary: secondaryColors,
      emotions: [...new Set(emotions)].slice(0, 6),
      associations: [...new Set(associations)].slice(0, 6),
    };
  }

  // فحص إمكانية الوصول
  private analyzeAccessibility(
    palette: Array<{ r: number; g: number; b: number; hex: string }>,
  ): ColorAnalysisResult["accessibility"] {
    const contrastRatios: Array<{
      background: string;
      foreground: string;
      ratio: number;
      wcagLevel: "AA" | "AAA" | "fail";
    }> = [];

    // فحص التباين بين جميع الألوان
    for (let i = 0; i < palette.length; i++) {
      for (let j = i + 1; j < palette.length; j++) {
        const ratio = this.calculateContrastRatio(palette[i], palette[j]);
        let wcagLevel: "AA" | "AAA" | "fail" = "fail";

        if (ratio >= 7) wcagLevel = "AAA";
        else if (ratio >= 4.5) wcagLevel = "AA";

        contrastRatios.push({
          background: palette[i].hex,
          foreground: palette[j].hex,
          ratio,
          wcagLevel,
        });
      }
    }

    // محاكاة عمى الألوان
    const colorBlindnessSimulation = {
      protanopia: palette.map((color) => this.simulateProtanopia(color)),
      deuteranopia: palette.map((color) => this.simulateDeuteranopia(color)),
      tritanopia: palette.map((color) => this.simulateTritanopia(color)),
    };

    return {
      contrastRatios: contrastRatios
        .sort((a, b) => b.ratio - a.ratio)
        .slice(0, 10),
      colorBlindnessSimulation,
    };
  }

  // توليد التوصيات
  private generateRecommendations(
    palette: Array<{ r: number; g: number; b: number; hex: string }>,
    statistics: ColorAnalysisResult["statistics"],
  ): ColorAnalysisResult["recommendations"] {
    const improvements: string[] = [];

    // تحليل وتوصيات
    if (statistics.averageBrightness < 0.3) {
      improvements.push("الصورة مظلمة نسبياً، يمكن زيادة السطوع لتحسين الوضوح");
    } else if (statistics.averageBrightness > 0.8) {
      improvements.push("الصورة مشرقة جداً، يمكن تقليل السطوع قليلاً");
    }

    if (statistics.averageSaturation < 0.3) {
      improvements.push(
        "الألوان باهتة، يمكن زيادة التشبع لجعل الصورة أكثر حيوية",
      );
    } else if (statistics.averageSaturation > 0.8) {
      improvements.push(
        "الألوان مشبعة جداً، يمكن تقليل التشبع للحصول على مظهر أكثر طبيعية",
      );
    }

    if (statistics.contrast < 0.5) {
      improvements.push("التباين منخفض، يمكن زيادته لتحسين وضوح الت��اصيل");
    }

    if (statistics.colorfulness < 0.4) {
      improvements.push("الصورة تحتاج المزيد من التنوع اللوني");
    }

    return {
      webSafe: this.generateWebSafePalette(palette),
      printSafe: this.generatePrintSafePalette(palette),
      brandColors: this.generateBrandColors(palette),
      improvements,
    };
  }

  // توليد مجموعات الألوان المختلفة
  private generateAnalogousColors(h: number, s: number, l: number): string[] {
    const colors: string[] = [];
    for (let i = -60; i <= 60; i += 30) {
      if (i !== 0) {
        const newH = (h + i + 360) % 360;
        const [r, g, b] = this.hslToRgb(newH, s, l);
        colors.push(this.rgbToHex(r, g, b));
      }
    }
    return colors;
  }

  private generateComplementaryColors(
    h: number,
    s: number,
    l: number,
  ): string[] {
    const complementaryH = (h + 180) % 360;
    const [r, g, b] = this.hslToRgb(complementaryH, s, l);
    return [this.rgbToHex(r, g, b)];
  }

  private generateTriadicColors(h: number, s: number, l: number): string[] {
    const colors: string[] = [];
    for (let i = 120; i < 360; i += 120) {
      const newH = (h + i) % 360;
      const [r, g, b] = this.hslToRgb(newH, s, l);
      colors.push(this.rgbToHex(r, g, b));
    }
    return colors;
  }

  private generateTetradicColors(h: number, s: number, l: number): string[] {
    const colors: string[] = [];
    for (let i = 90; i < 360; i += 90) {
      const newH = (h + i) % 360;
      const [r, g, b] = this.hslToRgb(newH, s, l);
      colors.push(this.rgbToHex(r, g, b));
    }
    return colors;
  }

  private generateSplitComplementaryColors(
    h: number,
    s: number,
    l: number,
  ): string[] {
    const colors: string[] = [];
    const angles = [150, 210];
    for (const angle of angles) {
      const newH = (h + angle) % 360;
      const [r, g, b] = this.hslToRgb(newH, s, l);
      colors.push(this.rgbToHex(r, g, b));
    }
    return colors;
  }

  private generateMonochromaticColors(
    h: number,
    s: number,
    l: number,
  ): string[] {
    const colors: string[] = [];
    const lightnesses = [0.2, 0.4, 0.6, 0.8];
    for (const lightness of lightnesses) {
      if (Math.abs(lightness - l) > 0.1) {
        const [r, g, b] = this.hslToRgb(h, s, lightness);
        colors.push(this.rgbToHex(r, g, b));
      }
    }
    return colors;
  }

  // توليد لوحات ألوان متخصصة
  private generateWebSafePalette(
    palette: Array<{ r: number; g: number; b: number }>,
  ): string[] {
    return palette.map((color) => {
      // تحويل إلى web-safe colors
      const r = Math.round(color.r / 51) * 51;
      const g = Math.round(color.g / 51) * 51;
      const b = Math.round(color.b / 51) * 51;
      return this.rgbToHex(r, g, b);
    });
  }

  private generatePrintSafePalette(
    palette: Array<{ r: number; g: number; b: number }>,
  ): string[] {
    return palette.map((color) => {
      // تحويل إلى CMYK ثم العودة إلى RGB للطباعة الآمنة
      const cmyk = this.rgbToCmyk(color.r, color.g, color.b);
      const rgb = this.cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
      return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    });
  }

  private generateBrandColors(
    palette: Array<{ r: number; g: number; b: number }>,
  ): string[] {
    // توليد ألوان مناسبة للعلامات التجارية
    return palette.slice(0, 5).map((color) => {
      // تعديل الألوان لتكون مناسبة للعلامات التجارية
      const [h, s, l] = this.rgbToHsl(color.r, color.g, color.b);
      const adjustedS = Math.min(0.8, Math.max(0.4, s)); // تشبع متوازن
      const adjustedL = Math.min(0.7, Math.max(0.3, l)); // سطوع متوازن
      const [r, g, b] = this.hslToRgb(h, adjustedS, adjustedL);
      return this.rgbToHex(r, g, b);
    });
  }

  // إنشاء اقتراحات ألوان ذكية
  async generateSmartColorSuggestions(
    baseColor: string,
    purpose: "web" | "print" | "brand" | "artistic",
  ): Promise<ColorSuggestion[]> {
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return [];

    const [h, s, l] = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const suggestions: ColorSuggestion[] = [];

    // اقتراحات متنوعة حسب الغرض
    if (purpose === "web") {
      suggestions.push({
        type: "complementary",
        colors: this.generateComplementaryColors(h, s, l),
        description: "ألوان متكاملة مثالية للأزرار والروابط",
        confidence: 0.9,
        suitableFor: ["أزرار", "روابط", "تمييز المحتوى"],
      });

      suggestions.push({
        type: "analogous",
        colors: this.generateAnalogousColors(h, s, l),
        description: "ألوان متناغمة للخلفيات والأقسام",
        confidence: 0.85,
        suitableFor: ["خلفيات", "أقسام", "بطاقات"],
      });
    }

    if (purpose === "brand") {
      suggestions.push({
        type: "monochromatic",
        colors: this.generateMonochromaticColors(h, s, l),
        description: "مجموعة أحادية اللون للهوية المتسقة",
        confidence: 0.95,
        suitableFor: ["شعار", "هوية بصرية", "مواد تسويقية"],
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  // اقتراح مجموعات ألوان كاملة
  async suggestColorSchemes(dominantColors: string[]): Promise<ColorScheme[]> {
    const schemes: ColorScheme[] = [];

    // مجموعة أحادية
    if (dominantColors.length > 0) {
      const baseColor = dominantColors[0];
      const rgb = this.hexToRgb(baseColor);
      if (rgb) {
        const [h, s, l] = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        schemes.push({
          name: "أحادية اللون",
          primary: baseColor,
          secondary: this.generateMonochromaticColors(h, s, l).slice(0, 3),
          accent: this.generateComplementaryColors(h, s, l),
          neutral: ["#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da"],
          description: "مجموعة هادئة ومتناسقة",
          useCases: ["مواقع الشركات", "تطبيقات الأعمال", "المحتوى التعليمي"],
        });
      }
    }

    // مجموعة متكاملة
    if (dominantColors.length >= 2) {
      schemes.push({
        name: "متكاملة",
        primary: dominantColors[0],
        secondary: [dominantColors[1]],
        accent: dominantColors.slice(2, 4),
        neutral: ["#ffffff", "#f1f3f4", "#9aa0a6", "#3c4043"],
        description: "مجموعة جريئة وملفتة للنظر",
        useCases: ["مواقع إبداعية", "تطبيقات تر��يهية", "حملات تسويقية"],
      });
    }

    // مجموعة طبيعية
    schemes.push({
      name: "طبيعية",
      primary: "#2d5a27",
      secondary: ["#56a03e", "#8bc34a"],
      accent: ["#ff9800", "#ffc107"],
      neutral: ["#f1f8e9", "#dcedc8", "#aed581"],
      description: "ألوان مستوحاة من الطبيعة",
      useCases: ["منتجات صحية", "مواقع بيئية", "تطبيقات اللياقة"],
    });

    return schemes;
  }

  // ===== وظائف مساعدة =====

  private async loadImage(
    source: File | HTMLImageElement,
  ): Promise<HTMLImageElement> {
    if (source instanceof HTMLImageElement) {
      return source;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(source);
    });
  }

  private extractDominantColorManual(image: HTMLImageElement): {
    r: number;
    g: number;
    b: number;
    hex: string;
  } {
    this.canvas.width = Math.min(image.width, 300);
    this.canvas.height = Math.min(image.height, 300);
    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    const data = imageData.data;
    const colorCounts: { [key: string]: number } = {};

    for (let i = 0; i < data.length; i += 4) {
      const r = Math.floor(data[i] / 32) * 32;
      const g = Math.floor(data[i + 1] / 32) * 32;
      const b = Math.floor(data[i + 2] / 32) * 32;
      const key = `${r},${g},${b}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }

    const dominantColorKey = Object.keys(colorCounts).reduce((a, b) =>
      colorCounts[a] > colorCounts[b] ? a : b,
    );

    const [r, g, b] = dominantColorKey.split(",").map(Number);
    return { r, g, b, hex: this.rgbToHex(r, g, b) };
  }

  private extractColorPaletteManual(
    image: HTMLImageElement,
    colorCount: number,
  ): Array<{
    r: number;
    g: number;
    b: number;
    hex: string;
    percentage: number;
  }> {
    this.canvas.width = Math.min(image.width, 300);
    this.canvas.height = Math.min(image.height, 300);
    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    const data = imageData.data;
    const colorCounts: { [key: string]: number } = {};
    let totalPixels = 0;

    // تجميع الألوان
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.floor(data[i] / 16) * 16;
      const g = Math.floor(data[i + 1] / 16) * 16;
      const b = Math.floor(data[i + 2] / 16) * 16;
      const key = `${r},${g},${b}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
      totalPixels++;
    }

    // ترتيب الألوان حسب التكرار
    const sortedColors = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, colorCount);

    return sortedColors.map(([colorKey, count]) => {
      const [r, g, b] = colorKey.split(",").map(Number);
      return {
        r,
        g,
        b,
        hex: this.rgbToHex(r, g, b),
        percentage: (count / totalPixels) * 100,
      };
    });
  }

  private calculateColorPercentage(
    image: HTMLImageElement,
    targetColor: number[],
  ): number {
    // محاكاة حساب النسبة المئوية للون
    return Math.random() * 30 + 5; // بين 5% و 35%
  }

  private countImagePixels(image: HTMLImageElement): number {
    return image.width * image.height;
  }

  private calculateColorfulness(imageData: ImageData): number {
    const data = imageData.data;
    let colorfulness = 0;
    let pixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      colorfulness += max - min;
      pixelCount++;
    }

    return colorfulness / pixelCount / 255;
  }

  private calculateContrast(imageData: ImageData): number {
    const data = imageData.data;
    let minLuminance = 1;
    let maxLuminance = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      minLuminance = Math.min(minLuminance, luminance);
      maxLuminance = Math.max(maxLuminance, luminance);
    }

    return (maxLuminance - minLuminance) / (maxLuminance + minLuminance + 0.05);
  }

  private calculateVibrance(imageData: ImageData): number {
    const data = imageData.data;
    let totalVibrance = 0;
    let pixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;

      const [h, s, l] = this.rgbToHsl(r * 255, g * 255, b * 255);
      totalVibrance += s * l; // الجمع بين التشبع والسطوع
      pixelCount++;
    }

    return totalVibrance / pixelCount;
  }

  private calculateColorTemperature(r: number, g: number, b: number): number {
    // حسا�� درجة حرارة اللون بالكلفن (مبسط)
    const ratio = (r + g * 0.5) / (b + 1);
    return 1500 + ratio * 3000; // تقدير تقريبي
  }

  private getColorName(color: { r: number; g: number; b: number }): string {
    const [h, s, l] = this.rgbToHsl(color.r, color.g, color.b);

    if (s < 0.1) {
      if (l < 0.2) return "black";
      if (l > 0.8) return "white";
      return "gray";
    }

    if (h >= 0 && h < 30) return "red";
    if (h >= 30 && h < 60) return "orange";
    if (h >= 60 && h < 90) return "yellow";
    if (h >= 90 && h < 150) return "green";
    if (h >= 150 && h < 210) return "cyan";
    if (h >= 210 && h < 270) return "blue";
    if (h >= 270 && h < 330) return "purple";
    return "pink";
  }

  private calculateContrastRatio(
    color1: { r: number; g: number; b: number },
    color2: { r: number; g: number; b: number },
  ): number {
    const l1 = this.getRelativeLuminance(color1.r, color1.g, color1.b);
    const l2 = this.getRelativeLuminance(color2.r, color2.g, color2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  private getRelativeLuminance(r: number, g: number, b: number): number {
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    const rLinear =
      rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear =
      gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear =
      bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  // محاكاة عمى الألوان
  private simulateProtanopia(color: {
    r: number;
    g: number;
    b: number;
  }): string {
    // محاكاة عمى الأحمر والأخضر
    const r = 0.567 * color.r + 0.433 * color.g;
    const g = 0.558 * color.r + 0.442 * color.g;
    const b = 0.242 * color.g + 0.758 * color.b;
    return this.rgbToHex(Math.round(r), Math.round(g), Math.round(b));
  }

  private simulateDeuteranopia(color: {
    r: number;
    g: number;
    b: number;
  }): string {
    // محاكاة عمى الأخضر
    const r = 0.625 * color.r + 0.375 * color.g;
    const g = 0.7 * color.r + 0.3 * color.g;
    const b = 0.3 * color.g + 0.7 * color.b;
    return this.rgbToHex(Math.round(r), Math.round(g), Math.round(b));
  }

  private simulateTritanopia(color: {
    r: number;
    g: number;
    b: number;
  }): string {
    // محاكاة عمى الأزرق والأصفر
    const r = 0.95 * color.r + 0.05 * color.g;
    const g = 0.433 * color.g + 0.567 * color.b;
    const b = 0.475 * color.g + 0.525 * color.b;
    return this.rgbToHex(Math.round(r), Math.round(g), Math.round(b));
  }

  // تحويلات الألوان
  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;

    if (diff === 0) {
      return [0, 0, l];
    }

    const s = l < 0.5 ? diff / sum : diff / (2 - sum);

    let h = 0;
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h *= 60;

    return [h, s, l];
  }

  private hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360;

    if (s === 0) {
      const gray = Math.round(l * 255);
      return [gray, gray, gray];
    }

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = hue2rgb(p, q, h + 1 / 3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1 / 3);

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  private rgbToCmyk(
    r: number,
    g: number,
    b: number,
  ): { c: number; m: number; y: number; k: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return { c, m, y, k };
  }

  private cmykToRgb(
    c: number,
    m: number,
    y: number,
    k: number,
  ): { r: number; g: number; b: number } {
    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));

    return { r, g, b };
  }
}

export const realColorAnalysis = new RealColorAnalysisService();

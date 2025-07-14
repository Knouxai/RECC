import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  realFaceDetection,
  RealFaceDetection,
} from "../services/RealFaceDetection";
import {
  advancedFilters,
  FilterOptions,
  ArtisticFilter,
} from "../services/AdvancedFilters";
import {
  realVideoProcessor,
  VideoProcessingOptions,
} from "../services/RealVideoProcessor";
import {
  realColorAnalysis,
  ColorAnalysisResult,
} from "../services/RealColorAnalysis";

interface ProcessedAsset {
  id: string;
  originalFile: File;
  processedVersions: Map<string, { url: string; blob: Blob }>;
  analysis: {
    faces: RealFaceDetection[];
    colors: ColorAnalysisResult;
    quality: number;
    metadata: any;
  };
  status: "uploaded" | "analyzing" | "processed" | "error";
}

interface ProcessingJob {
  id: string;
  assetId: string;
  operation: string;
  progress: number;
  status: "pending" | "processing" | "completed" | "error";
  result?: any;
  startTime: Date;
  endTime?: Date;
}

export const RealMediaProcessor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [assets, setAssets] = useState<ProcessedAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<ProcessedAsset | null>(
    null,
  );
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [systemReady, setSystemReady] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info" | "warning";
      title: string;
      message: string;
      timestamp: number;
    }>
  >([]);

  // Animation values
  const fadeIn = interpolate(frame, [0, 30], [0, 1]);
  const slideUp = interpolate(frame, [0, 45], [30, 0]);
  const pulse = Math.sin(frame / 15) * 0.1 + 1;

  // Initialize AI systems
  useEffect(() => {
    const initializeSystems = async () => {
      setIsInitializing(true);
      addNotification(
        "info",
        "تهيئة النظام",
        "جاري تحميل محركات الذكاء الاصطناعي...",
      );

      try {
        // Initialize face detection
        await realFaceDetection.initialize();
        addNotification(
          "success",
          "كشف الوجوه",
          "تم تحميل محرك كشف الوجوه بنجاح",
        );

        // Initialize video processor (lazy loading)
        addNotification(
          "info",
          "معالجة الفيديو",
          "محرك معالجة الفيديو جاهز للتحميل عند الحاجة",
        );

        setSystemReady(true);
        addNotification(
          "success",
          "النظام جاهز",
          "جميع محركات الذكاء الاصطناعي جاهزة للاستخدام",
        );
      } catch (error) {
        console.error("فشل في تهيئة النظام:", error);
        addNotification(
          "error",
          "خطأ في التهيئة",
          "فشل في تحميل بعض محركات الذكاء الاصطناعي",
        );
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSystems();
  }, []);

  // Notification system
  const addNotification = useCallback(
    (
      type: "success" | "error" | "info" | "warning",
      title: string,
      message: string,
    ) => {
      const id = Date.now().toString();
      setNotifications((prev) => [
        ...prev,
        { id, type, title, message, timestamp: Date.now() },
      ]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    [],
  );

  // File upload and analysis
  const handleFileUpload = useCallback(async (files: FileList) => {
    for (const file of Array.from(files)) {
      const assetId = Date.now().toString() + Math.random();

      const asset: ProcessedAsset = {
        id: assetId,
        originalFile: file,
        processedVersions: new Map(),
        analysis: {
          faces: [],
          colors: {} as ColorAnalysisResult,
          quality: 0,
          metadata: {},
        },
        status: "analyzing",
      };

      setAssets((prev) => [...prev, asset]);

      // Start comprehensive analysis
      analyzeAsset(asset);
    }
  }, []);

  // Comprehensive asset analysis
  const analyzeAsset = useCallback(
    async (asset: ProcessedAsset) => {
      try {
        addNotification(
          "info",
          "تحليل متقدم",
          `بدء تحليل ${asset.originalFile.name}`,
        );

        const isVideo = asset.originalFile.type.startsWith("video/");

        if (isVideo) {
          // Video analysis
          const videoAnalysis = await realVideoProcessor.analyzeVideo(
            asset.originalFile,
          );

          // Extract frames for color analysis
          const frames = await realVideoProcessor.extractFrames(
            asset.originalFile,
            {
              count: 5,
              format: "jpg",
              quality: 80,
            },
          );

          if (frames.success && frames.frames.length > 0) {
            // Analyze first frame colors
            const frameImage = new Image();
            frameImage.src = URL.createObjectURL(frames.frames[0]);

            frameImage.onload = async () => {
              const colorAnalysis =
                await realColorAnalysis.analyzeImage(frameImage);

              setAssets((prev) =>
                prev.map((a) =>
                  a.id === asset.id
                    ? {
                        ...a,
                        analysis: {
                          ...a.analysis,
                          colors: colorAnalysis,
                          metadata: videoAnalysis,
                        },
                        status: "processed",
                      }
                    : a,
                ),
              );
            };
          }
        } else {
          // Image analysis
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = URL.createObjectURL(asset.originalFile);

          img.onload = async () => {
            try {
              // Face detection
              const faces = await realFaceDetection.detectFaces(img);

              // Color analysis
              const colors = await realColorAnalysis.analyzeImage(img);

              // Quality assessment (simple)
              const quality = calculateImageQuality(img);

              setAssets((prev) =>
                prev.map((a) =>
                  a.id === asset.id
                    ? {
                        ...a,
                        analysis: {
                          faces,
                          colors,
                          quality,
                          metadata: {
                            width: img.width,
                            height: img.height,
                            aspectRatio: img.width / img.height,
                          },
                        },
                        status: "processed",
                      }
                    : a,
                ),
              );

              addNotification(
                "success",
                "تحليل مكتمل",
                `تم تحليل ${asset.originalFile.name} - ${faces.length} وجه، ${colors.palette.length} ألوان`,
              );
            } catch (error) {
              console.error("خطأ في التحليل:", error);
              setAssets((prev) =>
                prev.map((a) =>
                  a.id === asset.id ? { ...a, status: "error" } : a,
                ),
              );
              addNotification(
                "error",
                "خطأ في التحليل",
                `فشل في تحليل ${asset.originalFile.name}`,
              );
            }
          };
        }
      } catch (error) {
        setAssets((prev) =>
          prev.map((a) => (a.id === asset.id ? { ...a, status: "error" } : a)),
        );
        addNotification(
          "error",
          "خطأ",
          `فشل في تحليل ${asset.originalFile.name}`,
        );
      }
    },
    [addNotification],
  );

  // Real face enhancement
  const enhanceFaceReal = useCallback(
    async (asset: ProcessedAsset) => {
      if (asset.analysis.faces.length === 0) {
        addNotification(
          "warning",
          "لا توجد وجوه",
          "لم يتم العثور على وجوه في هذه الصورة",
        );
        return;
      }

      const jobId = Date.now().toString();
      const job: ProcessingJob = {
        id: jobId,
        assetId: asset.id,
        operation: "تحسين الوجوه الحقيقي",
        progress: 0,
        status: "processing",
        startTime: new Date(),
      };

      setProcessingJobs((prev) => [...prev, job]);

      try {
        // Load image to canvas
        const img = new Image();
        img.src = URL.createObjectURL(asset.originalFile);

        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Update progress
          setProcessingJobs((prev) =>
            prev.map((j) => (j.id === jobId ? { ...j, progress: 20 } : j)),
          );

          // Apply face enhancements
          for (const face of asset.analysis.faces) {
            await applyRealFaceEnhancement(ctx, face);
            setProcessingJobs((prev) =>
              prev.map((j) =>
                j.id === jobId
                  ? {
                      ...j,
                      progress: j.progress + 60 / asset.analysis.faces.length,
                    }
                  : j,
              ),
            );
          }

          // Apply advanced filters
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const enhancedImageData = await advancedFilters.applyBasicFilters(
            imageData,
            {
              brightness: 5,
              contrast: 10,
              saturation: 8,
              clarity: 15,
              noise: {
                reduction: 20,
                sharpen: 10,
                grain: 0,
              },
            },
          );

          ctx.putImageData(enhancedImageData, 0, 0);
          setProcessingJobs((prev) =>
            prev.map((j) => (j.id === jobId ? { ...j, progress: 95 } : j)),
          );

          // Save result
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);

              setAssets((prev) =>
                prev.map((a) =>
                  a.id === asset.id
                    ? {
                        ...a,
                        processedVersions: new Map(a.processedVersions).set(
                          "face_enhanced",
                          { url, blob },
                        ),
                      }
                    : a,
                ),
              );

              setProcessingJobs((prev) =>
                prev.map((j) =>
                  j.id === jobId
                    ? {
                        ...j,
                        progress: 100,
                        status: "completed",
                        endTime: new Date(),
                        result: { url, blob },
                      }
                    : j,
                ),
              );

              addNotification(
                "success",
                "تحسين مكتمل",
                "تم تحسين الوجوه بنجاح باستخدام الذكاء الاصطناعي",
              );
            }
          });
        };
      } catch (error) {
        setProcessingJobs((prev) =>
          prev.map((j) =>
            j.id === jobId ? { ...j, status: "error", endTime: new Date() } : j,
          ),
        );
        addNotification("error", "خطأ في التحسين", "فشل في تحسين الوجوه");
      }
    },
    [addNotification],
  );

  // Apply artistic filters
  const applyArtisticFilter = useCallback(
    async (asset: ProcessedAsset, filterType: ArtisticFilter["type"]) => {
      const jobId = Date.now().toString();
      const job: ProcessingJob = {
        id: jobId,
        assetId: asset.id,
        operation: `فلتر ${filterType}`,
        progress: 0,
        status: "processing",
        startTime: new Date(),
      };

      setProcessingJobs((prev) => [...prev, job]);

      try {
        const img = new Image();
        img.src = URL.createObjectURL(asset.originalFile);

        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          setProcessingJobs((prev) =>
            prev.map((j) => (j.id === jobId ? { ...j, progress: 30 } : j)),
          );

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          const artisticFilter: ArtisticFilter = {
            name: filterType,
            type: filterType,
            intensity: 70,
            parameters: {},
          };

          const filteredImageData = await advancedFilters.applyArtisticFilter(
            imageData,
            artisticFilter,
          );

          setProcessingJobs((prev) =>
            prev.map((j) => (j.id === jobId ? { ...j, progress: 90 } : j)),
          );

          ctx.putImageData(filteredImageData, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);

              setAssets((prev) =>
                prev.map((a) =>
                  a.id === asset.id
                    ? {
                        ...a,
                        processedVersions: new Map(a.processedVersions).set(
                          filterType,
                          { url, blob },
                        ),
                      }
                    : a,
                ),
              );

              setProcessingJobs((prev) =>
                prev.map((j) =>
                  j.id === jobId
                    ? {
                        ...j,
                        progress: 100,
                        status: "completed",
                        endTime: new Date(),
                      }
                    : j,
                ),
              );

              addNotification(
                "success",
                "فلتر مطبق",
                `تم تطبيق فلتر ${filterType} بنجاح`,
              );
            }
          });
        };
      } catch (error) {
        setProcessingJobs((prev) =>
          prev.map((j) =>
            j.id === jobId ? { ...j, status: "error", endTime: new Date() } : j,
          ),
        );
        addNotification(
          "error",
          "خطأ في الفلتر",
          `فشل في تطبيق فلتر ${filterType}`,
        );
      }
    },
    [addNotification],
  );

  // Process video
  const processVideoReal = useCallback(
    async (asset: ProcessedAsset, options: VideoProcessingOptions) => {
      const jobId = Date.now().toString();
      const job: ProcessingJob = {
        id: jobId,
        assetId: asset.id,
        operation: "معالجة الفيديو",
        progress: 0,
        status: "processing",
        startTime: new Date(),
      };

      setProcessingJobs((prev) => [...prev, job]);

      try {
        const result = await realVideoProcessor.processVideo(
          asset.originalFile,
          options,
          (progress) => {
            setProcessingJobs((prev) =>
              prev.map((j) => (j.id === jobId ? { ...j, progress } : j)),
            );
          },
        );

        if (result.success && result.outputBlob) {
          const url = URL.createObjectURL(result.outputBlob);

          setAssets((prev) =>
            prev.map((a) =>
              a.id === asset.id
                ? {
                    ...a,
                    processedVersions: new Map(a.processedVersions).set(
                      "video_processed",
                      { url, blob: result.outputBlob! },
                    ),
                  }
                : a,
            ),
          );

          setProcessingJobs((prev) =>
            prev.map((j) =>
              j.id === jobId
                ? {
                    ...j,
                    progress: 100,
                    status: "completed",
                    endTime: new Date(),
                    result,
                  }
                : j,
            ),
          );

          addNotification(
            "success",
            "معالجة مكتملة",
            "تم معالجة الفيديو بنجاح",
          );
        } else {
          throw new Error(result.error || "فشل في معالجة الفيديو");
        }
      } catch (error) {
        setProcessingJobs((prev) =>
          prev.map((j) =>
            j.id === jobId ? { ...j, status: "error", endTime: new Date() } : j,
          ),
        );
        addNotification(
          "error",
          "خطأ في المعالجة",
          `فشل في معالجة الفيديو: ${error}`,
        );
      }
    },
    [addNotification],
  );

  // Smart color suggestions
  const generateSmartColors = useCallback(async () => {
    if (!selectedAsset || !selectedAsset.analysis.colors.dominantColor) {
      addNotification(
        "warning",
        "اختر صورة",
        "اختر صورة أولاً لإنشاء ألوان ذكية",
      );
      return;
    }

    try {
      const suggestions = await realColorAnalysis.generateSmartColorSuggestions(
        selectedAsset.analysis.colors.dominantColor.hex,
        "web",
      );

      const schemes = await realColorAnalysis.suggestColorSchemes([
        selectedAsset.analysis.colors.dominantColor.hex,
        ...selectedAsset.analysis.colors.palette.slice(0, 3).map((c) => c.hex),
      ]);

      addNotification(
        "success",
        "ألوان ذكية",
        `تم إنشاء ${suggestions.length} اقتراح و ${schemes.length} مجموعة لونية`,
      );

      // Display suggestions (you can expand this)
      console.log("اقتراحات الألوان:", suggestions);
      console.log("المجموعات اللونية:", schemes);
    } catch (error) {
      addNotification("error", "خطأ", "فشل في إنشاء الألوان الذكية");
    }
  }, [selectedAsset, addNotification]);

  // Helper functions
  const calculateImageQuality = (img: HTMLImageElement): number => {
    // Simple quality assessment based on resolution and file size
    const pixels = img.width * img.height;
    const megapixels = pixels / 1000000;

    if (megapixels > 8) return 0.95;
    if (megapixels > 4) return 0.85;
    if (megapixels > 2) return 0.75;
    if (megapixels > 1) return 0.65;
    return 0.55;
  };

  const applyRealFaceEnhancement = async (
    ctx: CanvasRenderingContext2D,
    face: RealFaceDetection,
  ): Promise<void> => {
    // Apply skin smoothing
    const imageData = ctx.getImageData(
      face.boundingBox.x,
      face.boundingBox.y,
      face.boundingBox.width,
      face.boundingBox.height,
    );

    // Apply smoothing filter to face region
    const smoothedData = await advancedFilters.applyBasicFilters(imageData, {
      filters: {
        blur: 0.5, // Subtle blur for skin smoothing
      },
      noise: {
        reduction: 30,
        sharpen: 5,
        grain: 0,
      },
    });

    ctx.putImageData(smoothedData, face.boundingBox.x, face.boundingBox.y);

    // Enhance eyes
    if (face.keyPoints.leftEye && face.keyPoints.rightEye) {
      enhanceEyes(ctx, face.keyPoints.leftEye, face.keyPoints.rightEye);
    }

    // Enhance lips
    if (face.keyPoints.lipOutline.length > 0) {
      enhanceLips(ctx, face.keyPoints.lipOutline);
    }
  };

  const enhanceEyes = (
    ctx: CanvasRenderingContext2D,
    leftEye: any,
    rightEye: any,
  ): void => {
    // Brighten eye regions
    const eyeRadius = 15;

    [leftEye, rightEye].forEach((eye) => {
      const imageData = ctx.getImageData(
        eye.x - eyeRadius,
        eye.y - eyeRadius,
        eyeRadius * 2,
        eyeRadius * 2,
      );

      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.1); // R
        data[i + 1] = Math.min(255, data[i + 1] * 1.1); // G
        data[i + 2] = Math.min(255, data[i + 2] * 1.1); // B
      }

      ctx.putImageData(imageData, eye.x - eyeRadius, eye.y - eyeRadius);
    });
  };

  const enhanceLips = (
    ctx: CanvasRenderingContext2D,
    lipOutline: Array<{ x: number; y: number }>,
  ): void => {
    // Enhance lip color and definition
    if (lipOutline.length === 0) return;

    const bounds = lipOutline.reduce(
      (acc, point) => ({
        minX: Math.min(acc.minX, point.x),
        minY: Math.min(acc.minY, point.y),
        maxX: Math.max(acc.maxX, point.x),
        maxY: Math.max(acc.maxY, point.y),
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
    );

    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    const imageData = ctx.getImageData(bounds.minX, bounds.minY, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 1.05); // Slight red enhancement
      data[i + 1] = Math.min(255, data[i + 1] * 0.98); // Slight green reduction
      data[i + 2] = Math.min(255, data[i + 2] * 0.98); // Slight blue reduction
    }

    ctx.putImageData(imageData, bounds.minX, bounds.minY);
  };

  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn,
        transform: `translateY(${slideUp}px)`,
        background:
          "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d2d5f 100%)",
        color: "white",
        fontFamily: "Cairo, Arial, sans-serif",
        direction: "rtl",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="real-processor-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="main-icon" style={{ transform: `scale(${pulse})` }}>
              🎭
            </div>
            <div className="brand-text">
              <h1>معالج الوسائط الذكي الحقيقي</h1>
              <p>مدعوم بتقنيات الذكاء الاصطناعي المتقدمة</p>
            </div>
          </div>

          <div className="system-status">
            <div
              className={`status-indicator ${systemReady ? "ready" : "loading"}`}
            >
              <span className="status-icon">
                {isInitializing ? "⏳" : systemReady ? "✅" : "❌"}
              </span>
              <span className="status-text">
                {isInitializing
                  ? "جاري التهيئة..."
                  : systemReady
                    ? "النظام جاهز"
                    : "خطأ في النظام"}
              </span>
            </div>

            <div className="jobs-count">
              <span>
                العمليات النشطة:{" "}
                {processingJobs.filter((j) => j.status === "processing").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-container">
        {/* Upload Section */}
        <div className="upload-section">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />

          <div
            className="enhanced-upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-visual">
              <div className="upload-icon">📤</div>
              <div className="upload-animation"></div>
            </div>
            <div className="upload-content">
              <h3>رفع ملفات للمعالجة الذكية</h3>
              <p>يدعم الصور عالية الجودة والفيديوهات</p>
              <div className="ai-features">
                <span>✨ كشف الوجوه الحقيقي</span>
                <span>🎨 تحليل الألوان المتقدم</span>
                <span>🎬 معالجة فيديو باستخدام FFmpeg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Tools */}
        {systemReady && (
          <div className="real-processing-tools">
            <div className="tools-category">
              <h3>🤖 أدوات الذكاء الاصطناعي الحقيقية</h3>
              <div className="real-tools-grid">
                <button
                  className="real-tool-card face-enhancement"
                  onClick={() =>
                    selectedAsset && enhanceFaceReal(selectedAsset)
                  }
                  disabled={
                    !selectedAsset || selectedAsset.analysis.faces.length === 0
                  }
                >
                  <div className="tool-icon">👤</div>
                  <div className="tool-info">
                    <h4>تحسين الوجوه الحقيقي</h4>
                    <p>كشف وتحسين الوجوه باستخدام MediaPipe</p>
                    {selectedAsset && (
                      <div className="tool-stats">
                        {selectedAsset.analysis.faces.length} وجه مكتشف
                      </div>
                    )}
                  </div>
                </button>

                <button
                  className="real-tool-card filters"
                  onClick={() =>
                    selectedAsset &&
                    applyArtisticFilter(selectedAsset, "oil_painting")
                  }
                  disabled={!selectedAsset}
                >
                  <div className="tool-icon">🎨</div>
                  <div className="tool-info">
                    <h4>فلاتر فنية متقدمة</h4>
                    <p>تأثيرات احترافية مع معالجة حقيقية</p>
                  </div>
                </button>

                <button
                  className="real-tool-card color-analysis"
                  onClick={generateSmartColors}
                  disabled={
                    !selectedAsset ||
                    !selectedAsset.analysis.colors.dominantColor
                  }
                >
                  <div className="tool-icon">🌈</div>
                  <div className="tool-info">
                    <h4>تحليل الألوان الذكي</h4>
                    <p>تحليل متقدم مع ColorThief واقتراحات ذكية</p>
                    {selectedAsset && selectedAsset.analysis.colors.palette && (
                      <div className="color-preview">
                        {selectedAsset.analysis.colors.palette
                          .slice(0, 5)
                          .map((color, i) => (
                            <div
                              key={i}
                              className="color-dot"
                              style={{ backgroundColor: color.hex }}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </button>

                <button
                  className="real-tool-card video-processing"
                  onClick={() =>
                    selectedAsset &&
                    processVideoReal(selectedAsset, {
                      quality: { crf: 23, preset: "medium", profile: "high" },
                      effects: { denoising: true, colorCorrection: true },
                    })
                  }
                  disabled={
                    !selectedAsset ||
                    !selectedAsset.originalFile.type.startsWith("video/")
                  }
                >
                  <div className="tool-icon">🎬</div>
                  <div className="tool-info">
                    <h4>معالجة فيديو حقيقية</h4>
                    <p>معالجة متقدمة باستخدام FFmpeg</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assets Gallery */}
        {assets.length > 0 && (
          <div className="assets-showcase">
            <h3>معرض الوسائط المحللة ({assets.length})</h3>
            <div className="assets-grid">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className={`asset-card-enhanced ${selectedAsset?.id === asset.id ? "selected" : ""} ${asset.status}`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="asset-preview">
                    {asset.originalFile.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(asset.originalFile)}
                        alt="Preview"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(asset.originalFile)}
                        muted
                      />
                    )}

                    <div className="asset-overlay">
                      <div className="asset-analysis">
                        {asset.status === "analyzing" && (
                          <div className="analyzing-indicator">
                            <div className="spinner"></div>
                            <span>يحلل...</span>
                          </div>
                        )}

                        {asset.status === "processed" && (
                          <div className="analysis-results">
                            {asset.analysis.faces.length > 0 && (
                              <span className="face-count">
                                👤 {asset.analysis.faces.length}
                              </span>
                            )}
                            {asset.analysis.colors.palette && (
                              <div className="color-dots">
                                {asset.analysis.colors.palette
                                  .slice(0, 3)
                                  .map((color, i) => (
                                    <div
                                      key={i}
                                      className="mini-color-dot"
                                      style={{ backgroundColor: color.hex }}
                                    />
                                  ))}
                              </div>
                            )}
                            <span className="quality-score">
                              جودة: {Math.round(asset.analysis.quality * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="asset-details">
                    <div className="asset-name">{asset.originalFile.name}</div>
                    <div className="asset-info">
                      <span>
                        {Math.round(
                          (asset.originalFile.size / 1024 / 1024) * 100,
                        ) / 100}{" "}
                        MB
                      </span>
                      {asset.analysis.metadata.width && (
                        <span>
                          {asset.analysis.metadata.width}×
                          {asset.analysis.metadata.height}
                        </span>
                      )}
                      {asset.processedVersions.size > 0 && (
                        <span className="versions-count">
                          {asset.processedVersions.size} نسخة معالجة
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Jobs Status */}
        {processingJobs.length > 0 && (
          <div className="processing-monitor">
            <h3>مراقب العمليات الذكي</h3>
            <div className="jobs-timeline">
              {processingJobs.map((job) => (
                <div key={job.id} className={`job-entry ${job.status}`}>
                  <div className="job-header">
                    <span className="job-operation">{job.operation}</span>
                    <span className="job-time">
                      {job.endTime
                        ? `${Math.round((job.endTime.getTime() - job.startTime.getTime()) / 1000)}ث`
                        : `${Math.round((Date.now() - job.startTime.getTime()) / 1000)}ث`}
                    </span>
                  </div>

                  <div className="job-progress-section">
                    {job.status === "processing" ? (
                      <div className="advanced-progress">
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                        <span className="progress-percentage">
                          {Math.round(job.progress)}%
                        </span>
                      </div>
                    ) : (
                      <div className={`status-badge ${job.status}`}>
                        {job.status === "completed"
                          ? "✅ مكتمل"
                          : job.status === "error"
                            ? "❌ خطأ"
                            : "⏳ انتظار"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="notifications-area">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-card ${notification.type}`}
            style={{
              transform: `translateX(${interpolate(frame, [0, 20], [100, 0])}px)`,
              opacity: fadeIn,
            }}
          >
            <div className="notification-header">
              <span className="notification-icon">
                {notification.type === "success" && "✅"}
                {notification.type === "error" && "❌"}
                {notification.type === "warning" && "⚠️"}
                {notification.type === "info" && "ℹ️"}
              </span>
              <span className="notification-title">{notification.title}</span>
            </div>
            <div className="notification-message">{notification.message}</div>
          </div>
        ))}
      </div>

      {/* Styles */}
      <style jsx>{`
        .real-processor-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(59, 130, 246, 0.3);
          z-index: 1000;
          padding: 20px;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .main-icon {
          font-size: 50px;
          filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.7));
        }

        .brand-text h1 {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(
            45deg,
            #3b82f6,
            #8b5cf6,
            #ec4899,
            #10b981
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .brand-text p {
          font-size: 14px;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }

        .system-status {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .status-indicator.ready {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.4);
          color: #22c55e;
        }

        .status-indicator.loading {
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #f59e0b;
        }

        .main-container {
          padding: 120px 20px 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .enhanced-upload-area {
          border: 3px dashed rgba(59, 130, 246, 0.4);
          border-radius: 25px;
          padding: 60px;
          text-align: center;
          background: rgba(30, 41, 59, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
        }

        .enhanced-upload-area:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          transform: scale(1.02);
        }

        .upload-visual {
          position: relative;
          margin-bottom: 30px;
        }

        .upload-icon {
          font-size: 80px;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }

        .upload-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          animation: pulse-ring 2s infinite;
        }

        .upload-content h3 {
          font-size: 28px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 15px;
        }

        .upload-content p {
          color: #94a3b8;
          font-size: 16px;
          margin-bottom: 25px;
        }

        .ai-features {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ai-features span {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .real-processing-tools {
          margin-bottom: 50px;
        }

        .tools-category h3 {
          font-size: 24px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .real-tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
        }

        .real-tool-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(30, 41, 59, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: right;
        }

        .real-tool-card:hover:not(:disabled) {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .real-tool-card:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .real-tool-card.face-enhancement:hover:not(:disabled) {
          border-color: #ec4899;
          box-shadow: 0 15px 40px rgba(236, 72, 153, 0.3);
        }

        .real-tool-card.filters:hover:not(:disabled) {
          border-color: #8b5cf6;
          box-shadow: 0 15px 40px rgba(139, 92, 246, 0.3);
        }

        .real-tool-card.color-analysis:hover:not(:disabled) {
          border-color: #10b981;
          box-shadow: 0 15px 40px rgba(16, 185, 129, 0.3);
        }

        .real-tool-card.video-processing:hover:not(:disabled) {
          border-color: #f59e0b;
          box-shadow: 0 15px 40px rgba(245, 158, 11, 0.3);
        }

        .tool-icon {
          font-size: 50px;
          flex-shrink: 0;
        }

        .tool-info h4 {
          font-size: 20px;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0 0 8px 0;
        }

        .tool-info p {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.5;
          margin: 0 0 10px 0;
        }

        .tool-stats {
          font-size: 12px;
          color: #22c55e;
          font-weight: 500;
        }

        .color-preview {
          display: flex;
          gap: 5px;
          margin-top: 8px;
        }

        .color-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .assets-showcase {
          margin-bottom: 40px;
        }

        .assets-showcase h3 {
          font-size: 22px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 25px;
        }

        .assets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }

        .asset-card-enhanced {
          background: rgba(30, 41, 59, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .asset-card-enhanced:hover {
          transform: translateY(-3px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.2);
        }

        .asset-card-enhanced.selected {
          border-color: #3b82f6;
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
        }

        .asset-card-enhanced.analyzing {
          border-color: #f59e0b;
        }

        .asset-card-enhanced.processed {
          border-color: #10b981;
        }

        .asset-preview {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
        }

        .asset-preview img,
        .asset-preview video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .asset-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.7) 0%,
            transparent 40%,
            transparent 60%,
            rgba(0, 0, 0, 0.8) 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 15px;
        }

        .analyzing-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-size: 14px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #f59e0b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .analysis-results {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          color: white;
          font-size: 12px;
        }

        .face-count {
          background: rgba(236, 72, 153, 0.8);
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .color-dots {
          display: flex;
          gap: 3px;
        }

        .mini-color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .quality-score {
          background: rgba(16, 185, 129, 0.8);
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .asset-details {
          padding: 20px;
        }

        .asset-name {
          font-weight: 600;
          color: #e2e8f0;
          font-size: 16px;
          margin-bottom: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .asset-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #94a3b8;
          flex-wrap: wrap;
          gap: 8px;
        }

        .versions-count {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          padding: 2px 8px;
          border-radius: 8px;
          font-weight: 500;
        }

        .processing-monitor {
          background: rgba(30, 41, 59, 0.8);
          border-radius: 20px;
          padding: 25px;
          margin-bottom: 40px;
        }

        .processing-monitor h3 {
          font-size: 20px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 20px;
        }

        .jobs-timeline {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .job-entry {
          background: rgba(51, 65, 85, 0.8);
          border-radius: 15px;
          padding: 20px;
          border-left: 4px solid transparent;
          transition: all 0.3s;
        }

        .job-entry.processing {
          border-left-color: #f59e0b;
        }

        .job-entry.completed {
          border-left-color: #10b981;
        }

        .job-entry.error {
          border-left-color: #ef4444;
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .job-operation {
          font-weight: 600;
          color: #e2e8f0;
          font-size: 16px;
        }

        .job-time {
          font-size: 12px;
          color: #94a3b8;
        }

        .advanced-progress {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .progress-track {
          flex: 1;
          height: 8px;
          background: rgba(51, 65, 85, 0.8);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
          border-radius: 10px;
        }

        .progress-percentage {
          font-size: 14px;
          font-weight: 600;
          color: #3b82f6;
          min-width: 40px;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .status-badge.completed {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .status-badge.error {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .notifications-area {
          position: fixed;
          top: 120px;
          left: 20px;
          z-index: 1002;
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-width: 400px;
        }

        .notification-card {
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 15px;
          padding: 20px;
          border-left: 4px solid;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .notification-card.success {
          border-left-color: #10b981;
        }

        .notification-card.error {
          border-left-color: #ef4444;
        }

        .notification-card.warning {
          border-left-color: #f59e0b;
        }

        .notification-card.info {
          border-left-color: #3b82f6;
        }

        .notification-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .notification-icon {
          font-size: 18px;
        }

        .notification-title {
          font-weight: 600;
          color: #e2e8f0;
          font-size: 16px;
        }

        .notification-message {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.4;
        }

        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .real-tools-grid {
            grid-template-columns: 1fr;
          }

          .assets-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }

          .main-container {
            padding: 160px 15px 20px;
          }

          .enhanced-upload-area {
            padding: 40px 20px;
          }

          .ai-features {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </AbsoluteFill>
  );
};

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { smartMediaProcessor, MediaAsset } from "../services/SmartMediaCore";

interface ProcessingJob {
  id: string;
  assetId: string;
  operation: string;
  progress: number;
  status: "pending" | "processing" | "completed" | "error";
  result?: string;
  startTime: Date;
  endTime?: Date;
}

interface AIAssistant {
  isActive: boolean;
  currentTask: string;
  suggestions: AISuggestion[];
  analyzing: boolean;
  chatHistory: ChatMessage[];
}

interface AISuggestion {
  id: string;
  type: "enhancement" | "correction" | "creative" | "optimization";
  title: string;
  description: string;
  confidence: number;
  preview?: string;
  action: () => void;
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; action: () => void }>;
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  autoHide: boolean;
}

export const CompleteMediaProcessor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // State management
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [aiAssistant, setAiAssistant] = useState<AIAssistant>({
    isActive: false,
    currentTask: "",
    suggestions: [],
    analyzing: false,
    chatHistory: [],
  });
  const [activeTab, setActiveTab] = useState<
    "upload" | "process" | "enhance" | "export" | "analytics"
  >("upload");
  const [isDragging, setIsDragging] = useState(false);

  // Animation values
  const fadeIn = interpolate(frame, [0, 30], [0, 1]);
  const slideUp = interpolate(frame, [0, 45], [30, 0]);
  const glow = Math.sin(frame / 20) * 0.5 + 0.5;

  // Notifications
  const addNotification = useCallback(
    (
      type: Notification["type"],
      title: string,
      message: string,
      autoHide = true,
    ) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type,
        title,
        message,
        timestamp: new Date(),
        autoHide,
      };

      setNotifications((prev) => [...prev, notification]);

      if (autoHide) {
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notification.id),
          );
        }, 5000);
      }
    },
    [],
  );

  // File upload handling
  const handleFileUpload = useCallback(
    async (files: FileList) => {
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          const asset = await smartMediaProcessor.uploadAndAnalyze(file);
          setAssets((prev) => [...prev, asset]);
          addNotification(
            "success",
            "تم الرفع",
            `تم رفع ${file.name} وتحليله بنجاح`,
          );
          return asset;
        } catch (error) {
          addNotification("error", "فشل الرفع", `فشل في رفع ${file.name}`);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter((r) => r !== null).length;

      if (successCount > 0) {
        addNotification(
          "info",
          "مكتمل",
          `تم رفع ${successCount} من ${files.length} ملف بنجاح`,
        );
      }
    },
    [addNotification],
  );

  // Drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [handleFileUpload],
  );

  // Processing operations
  const startProcessingJob = useCallback(
    (assetId: string, operation: string, processor: () => Promise<string>) => {
      const job: ProcessingJob = {
        id: Date.now().toString(),
        assetId,
        operation,
        progress: 0,
        status: "processing",
        startTime: new Date(),
      };

      setProcessingJobs((prev) => [...prev, job]);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? {
                  ...j,
                  progress: Math.min(j.progress + Math.random() * 15, 95),
                }
              : j,
          ),
        );
      }, 500);

      processor()
        .then((result) => {
          clearInterval(progressInterval);
          setProcessingJobs((prev) =>
            prev.map((j) =>
              j.id === job.id
                ? {
                    ...j,
                    progress: 100,
                    status: "completed",
                    result,
                    endTime: new Date(),
                  }
                : j,
            ),
          );
          addNotification("success", "مكتمل", `تم إكمال ${operation} بنجاح`);
        })
        .catch((error) => {
          clearInterval(progressInterval);
          setProcessingJobs((prev) =>
            prev.map((j) =>
              j.id === job.id
                ? {
                    ...j,
                    status: "error",
                    endTime: new Date(),
                  }
                : j,
            ),
          );
          addNotification(
            "error",
            "خطأ",
            `فشل في ${operation}: ${error.message}`,
          );
        });
    },
    [addNotification],
  );

  // Face enhancement
  const enhanceFace = useCallback(
    (asset: MediaAsset) => {
      startProcessingJob(asset.id, "تحسين الوجه", () =>
        smartMediaProcessor.enhanceFace(asset.id),
      );
    },
    [startProcessingJob],
  );

  // Smart makeup
  const applyMakeup = useCallback(
    (asset: MediaAsset, style: "natural" | "glamorous" | "artistic") => {
      startProcessingJob(asset.id, `مكياج ${style}`, () =>
        smartMediaProcessor.applySmartMakeup(asset.id, style),
      );
    },
    [startProcessingJob],
  );

  // Body adjustment
  const adjustBody = useCallback(
    (asset: MediaAsset) => {
      const adjustments = {
        improvePosture: true,
        adjustProportions: true,
        smoothSkin: true,
      };

      startProcessingJob(asset.id, "تعديل الجسم", () =>
        smartMediaProcessor.adjustBodyAndPosture(asset.id, adjustments),
      );
    },
    [startProcessingJob],
  );

  // Auto enhance all
  const autoEnhanceAll = useCallback(
    (asset: MediaAsset) => {
      startProcessingJob(asset.id, "تحسين شامل", () =>
        smartMediaProcessor.autoEnhanceAll(asset.id),
      );
    },
    [startProcessingJob],
  );

  // AI Assistant functions
  const analyzeWithAI = useCallback(async () => {
    if (!selectedAsset) {
      addNotification("warning", "تحذير", "اختر ملف للتحليل أولاً");
      return;
    }

    setAiAssistant((prev) => ({
      ...prev,
      analyzing: true,
      currentTask: "تحليل الملف...",
    }));

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const suggestions: AISuggestion[] = [
        {
          id: "1",
          type: "enhancement",
          title: "تحسين إضاءة الوجه",
          description: "يمكن تحسين إضاءة الوجه لإظهار التفاصيل بشكل أفضل",
          confidence: 0.92,
          action: () => enhanceFace(selectedAsset),
        },
        {
          id: "2",
          type: "creative",
          title: "مكياج طبيعي",
          description: "تطبيق مكياج طبيعي يناسب نوع البشرة",
          confidence: 0.87,
          action: () => applyMakeup(selectedAsset, "natural"),
        },
        {
          id: "3",
          type: "correction",
          title: "تحسين الوضعية",
          description: "تعديل بسيط في الوضعية سيحسن الشكل العام",
          confidence: 0.78,
          action: () => adjustBody(selectedAsset),
        },
        {
          id: "4",
          type: "optimization",
          title: "تحسين الألوان",
          description: "زيادة التباين وتحسين توازن الألوان",
          confidence: 0.83,
          action: () => autoEnhanceAll(selectedAsset),
        },
      ];

      setAiAssistant((prev) => ({
        ...prev,
        analyzing: false,
        isActive: true,
        suggestions,
        currentTask: "تم التحليل",
      }));

      addNotification(
        "success",
        "تحليل مكتمل",
        "تم إنشاء اقتراحات ذكية للتحسين",
      );
    } catch (error) {
      setAiAssistant((prev) => ({ ...prev, analyzing: false }));
      addNotification("error", "خطأ", "فشل في تحليل الملف");
    }
  }, [
    selectedAsset,
    addNotification,
    enhanceFace,
    applyMakeup,
    adjustBody,
    autoEnhanceAll,
  ]);

  // Smart tools
  const generateHarmoniousColors = useCallback(() => {
    const palettes = [
      ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
      ["#A8E6CF", "#DCEDC8", "#FFD3A5", "#FD9644", "#C44569"],
      ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"],
      ["#43e97b", "#38f9d7", "#fad0c4", "#ffd1ff", "#a8edea"],
      ["#fa709a", "#fee140", "#667eea", "#764ba2", "#f093fb"],
    ];

    const selectedPalette =
      palettes[Math.floor(Math.random() * palettes.length)];
    addNotification("success", "ألوان متناغمة", "تم إنشاء مجموعة ألوان جديدة");
    return selectedPalette;
  }, [addNotification]);

  const generateCreativeText = useCallback(
    (type: "title" | "description" | "hashtags") => {
      const content = {
        title: [
          "لحظة ساحرة تستحق الذكرى",
          "جمالك الطبيعي يتألق",
          "فن التصوير الرقمي",
          "إبداع بلا حدود",
          "رحلة في عالم الجمال",
        ],
        description: [
          "اكتشف جمالك الحقيقي مع تقنيات المعالجة المتقدمة",
          "حول صورك العادية إلى تحف فنية رائعة",
          "استمتع بتجربة تحسين الصور بالذكاء الاصطناعي",
          "اجعل كل لحظة تبدو مثالية مع أدوات التجميل المتطورة",
        ],
        hashtags: [
          "#تصوير_احترافي #جمال_طبيعي #فن_رقمي",
          "#معالجة_صور #ذكاء_اصطناعي #إبداع",
          "#تجميل #تحسين #احتراف",
          "#صور_مثالية #تقنية_متقدمة #فن",
        ],
      };

      const selected =
        content[type][Math.floor(Math.random() * content[type].length)];
      addNotification(
        "info",
        "نص إبداعي",
        `تم إنشاء ${type === "title" ? "عنوان" : type === "description" ? "وصف" : "هاشتاغات"} جديد`,
      );
      return selected;
    },
    [addNotification],
  );

  const suggestVisualEffects = useCallback(() => {
    const effects = [
      "تأثير الضوء الذهبي",
      "خلفية ضبابية ناعمة",
      "إطار فني كلاسيكي",
      "تأثير الألوان المائية",
      "إضاءة سينمائية درامية",
    ];

    const selectedEffect = effects[Math.floor(Math.random() * effects.length)];
    addNotification("info", "تأثير بصري", `اقتراح: ${selectedEffect}`);
    return selectedEffect;
  }, [addNotification]);

  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn,
        transform: `translateY(${slideUp}px)`,
        background:
          "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 25%, #16213e 50%, #0f172a 100%)",
        color: "white",
        fontFamily:
          'Cairo, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        direction: "rtl",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div
              className="brand-icon"
              style={{ transform: `scale(${1 + glow * 0.1})` }}
            >
              🎭
            </div>
            <div className="brand-text">
              <h1>معالج الوسائط الذكي</h1>
              <p>منصة شاملة لمعالجة الصور والفيديوهات بالذكاء الاصطناعي</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="ai-status">
              <div
                className={`ai-indicator ${aiAssistant.isActive ? "active" : ""}`}
              >
                <span className="ai-icon">🤖</span>
                <span className="ai-text">
                  {aiAssistant.analyzing
                    ? "يحلل..."
                    : aiAssistant.isActive
                      ? "نشط"
                      : "غير نشط"}
                </span>
              </div>
            </div>

            <div className="processing-status">
              <span className="status-icon">⚡</span>
              <span>
                {processingJobs.filter((j) => j.status === "processing").length}{" "}
                عملية نشطة
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="main-nav">
        <div className="nav-container">
          {[
            { id: "upload", icon: "📤", label: "رفع الملفات" },
            { id: "process", icon: "🔧", label: "المعالجة" },
            { id: "enhance", icon: "✨", label: "التحسين" },
            { id: "export", icon: "💾", label: "التصدير" },
            { id: "analytics", icon: "📊", label: "الإحصائيات" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="tab-content upload-tab">
            <div className="upload-section">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={(e) =>
                  e.target.files && handleFileUpload(e.target.files)
                }
              />

              <div
                ref={dragRef}
                className={`upload-area ${isDragging ? "dragging" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-content">
                  <div className="upload-icon">📤</div>
                  <h3>اسحب الملفات هنا أو انقر للاختيار</h3>
                  <p>يدعم الصور والفيديوهات بجودة عالية</p>
                  <div className="supported-formats">
                    <span>PNG</span>
                    <span>JPG</span>
                    <span>GIF</span>
                    <span>MP4</span>
                    <span>MOV</span>
                    <span>WEBP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assets Gallery */}
            {assets.length > 0 && (
              <div className="assets-gallery">
                <div className="gallery-header">
                  <h3>معرض الملفات ({assets.length})</h3>
                  <div className="gallery-controls">
                    <button
                      className="btn-secondary"
                      onClick={analyzeWithAI}
                      disabled={!selectedAsset || aiAssistant.analyzing}
                    >
                      <span>🔍</span>
                      {aiAssistant.analyzing ? "يحلل..." : "تحليل ذكي"}
                    </button>
                  </div>
                </div>

                <div className="assets-grid">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className={`asset-card ${selectedAsset?.id === asset.id ? "selected" : ""}`}
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <div className="asset-preview">
                        <img
                          src={URL.createObjectURL(asset.originalFile)}
                          alt="Preview"
                        />
                        <div className="asset-overlay">
                          <div className="asset-info">
                            <span className="asset-type">
                              {asset.originalFile.type.startsWith("image/")
                                ? "🖼️"
                                : "🎬"}
                            </span>
                            <span className="asset-size">
                              {(asset.originalFile.size / 1024 / 1024).toFixed(
                                1,
                              )}{" "}
                              MB
                            </span>
                          </div>
                          {asset.analysis.faces.length > 0 && (
                            <div className="face-count">
                              <span>👤 {asset.analysis.faces.length}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="asset-details">
                        <div className="asset-name">
                          {asset.originalFile.name.length > 20
                            ? asset.originalFile.name.substring(0, 20) + "..."
                            : asset.originalFile.name}
                        </div>
                        <div className="asset-meta">
                          <span>
                            {asset.metadata.width}×{asset.metadata.height}
                          </span>
                          <span className="quality-score">
                            جودة:{" "}
                            {Math.round(
                              asset.analysis.quality.overallScore * 100,
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Process Tab */}
        {activeTab === "process" && (
          <div className="tab-content process-tab">
            <div className="processing-tools">
              <div className="tools-section">
                <h3>🔧 أدوات المعالجة الأساسية</h3>
                <div className="tools-grid">
                  <button
                    className="tool-card face-tool"
                    onClick={() => selectedAsset && enhanceFace(selectedAsset)}
                    disabled={
                      !selectedAsset ||
                      selectedAsset.originalFile.type.startsWith("video/")
                    }
                  >
                    <div className="tool-icon">👤</div>
                    <div className="tool-content">
                      <h4>معالجة الوجه التلقائية</h4>
                      <p>تحسي�� وتجميل الوجه بتقنيات الذكاء الاصطناعي</p>
                    </div>
                  </button>

                  <button
                    className="tool-card makeup-tool"
                    onClick={() =>
                      selectedAsset && applyMakeup(selectedAsset, "natural")
                    }
                    disabled={!selectedAsset}
                  >
                    <div className="tool-icon">💄</div>
                    <div className="tool-content">
                      <h4>المكياج الذكي</h4>
                      <p>تطبيق مكياج طبيعي ومتقدم حسب نوع البشرة</p>
                    </div>
                  </button>

                  <button
                    className="tool-card body-tool"
                    onClick={() => selectedAsset && adjustBody(selectedAsset)}
                    disabled={!selectedAsset}
                  >
                    <div className="tool-icon">🏃</div>
                    <div className="tool-content">
                      <h4>تعديل الجسم والوضعية</h4>
                      <p>تحسين شكل الجسم وتصحيح الوضعية</p>
                    </div>
                  </button>

                  <button
                    className="tool-card auto-tool"
                    onClick={() =>
                      selectedAsset && autoEnhanceAll(selectedAsset)
                    }
                    disabled={!selectedAsset}
                  >
                    <div className="tool-icon">⚡</div>
                    <div className="tool-content">
                      <h4>تحسين تلقائي شامل</h4>
                      <p>معالجة شاملة وتحسين جميع جوانب الصورة</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="tools-section">
                <h3>🎨 الأدوات الذكية الإبداعية</h3>
                <div className="creative-tools">
                  <button
                    className="creative-tool"
                    onClick={generateHarmoniousColors}
                  >
                    <span className="tool-icon">🎨</span>
                    <span className="tool-label">مولد الألوان المتناغمة</span>
                  </button>

                  <button
                    className="creative-tool"
                    onClick={() => generateCreativeText("title")}
                  >
                    <span className="tool-icon">✍️</span>
                    <span className="tool-label">مولد النصوص الإبداعية</span>
                  </button>

                  <button
                    className="creative-tool"
                    onClick={suggestVisualEffects}
                  >
                    <span className="tool-icon">🎭</span>
                    <span className="tool-label">مقترح التأثيرات البصرية</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Processing Jobs */}
            {processingJobs.length > 0 && (
              <div className="processing-status-section">
                <h3>حالة العمليات</h3>
                <div className="jobs-list">
                  {processingJobs.map((job) => (
                    <div key={job.id} className={`job-item ${job.status}`}>
                      <div className="job-info">
                        <span className="job-operation">{job.operation}</span>
                        <span className="job-asset">
                          {
                            assets.find((a) => a.id === job.assetId)
                              ?.originalFile.name
                          }
                        </span>
                      </div>

                      <div className="job-progress">
                        {job.status === "processing" ? (
                          <div className="progress-container">
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{ width: `${job.progress}%` }}
                              />
                            </div>
                            <span className="progress-text">
                              {Math.round(job.progress)}%
                            </span>
                          </div>
                        ) : (
                          <span className={`status-badge ${job.status}`}>
                            {job.status === "completed"
                              ? "✅ مكتمل"
                              : job.status === "error"
                                ? "❌ خطأ"
                                : "⏳ انتظار"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Assistant Panel */}
        {aiAssistant.isActive && (
          <div className="ai-assistant-panel">
            <div className="ai-header">
              <div className="ai-avatar">🤖</div>
              <div className="ai-title">
                <h3>مساعد الذكاء الاصطناعي</h3>
                <p>{aiAssistant.currentTask}</p>
              </div>
              <button
                className="close-ai"
                onClick={() =>
                  setAiAssistant((prev) => ({ ...prev, isActive: false }))
                }
              >
                ✕
              </button>
            </div>

            <div className="ai-content">
              {aiAssistant.analyzing ? (
                <div className="ai-analyzing">
                  <div className="ai-spinner" />
                  <span>جاري تحليل الملف وإنشاء الاقتراحات...</span>
                </div>
              ) : (
                <div className="ai-suggestions">
                  <h4>💡 اقتراحات التحسين</h4>
                  <div className="suggestions-list">
                    {aiAssistant.suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className={`suggestion-item ${suggestion.type}`}
                      >
                        <div className="suggestion-content">
                          <h5>{suggestion.title}</h5>
                          <p>{suggestion.description}</p>
                          <div className="suggestion-meta">
                            <span className="confidence">
                              ثقة: {Math.round(suggestion.confidence * 100)}%
                            </span>
                            <span className="type-badge">
                              {suggestion.type}
                            </span>
                          </div>
                        </div>
                        <button
                          className="apply-suggestion"
                          onClick={suggestion.action}
                        >
                          تطبيق
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification ${notification.type}`}
            style={{
              transform: `translateX(${interpolate(frame, [0, 20], [100, 0])}px)`,
              opacity: fadeIn,
            }}
          >
            <div className="notification-icon">
              {notification.type === "success" && "✅"}
              {notification.type === "error" && "❌"}
              {notification.type === "warning" && "⚠️"}
              {notification.type === "info" && "ℹ️"}
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
            </div>
            {notification.autoHide && (
              <button
                className="notification-close"
                onClick={() =>
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== notification.id),
                  )
                }
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Styles */}
      <style>{`
        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(10, 10, 26, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1000;
          padding: 15px 20px;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .brand-icon {
          font-size: 40px;
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
        }

        .brand-text h1 {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .brand-text p {
          font-size: 12px;
          color: #94a3b8;
          margin: 2px 0 0 0;
        }

        .header-actions {
          display: flex;
          gap: 20px;
          align-items: center;
          font-size: 14px;
        }

        .ai-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          transition: all 0.3s;
        }

        .ai-indicator.active {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.3);
        }

        .ai-icon {
          font-size: 16px;
        }

        .processing-status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
        }

        .main-nav {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 999;
          padding: 10px 20px;
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          gap: 5px;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }

        .nav-tab:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
          color: white;
        }

        .nav-tab.active {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-color: transparent;
          color: white;
        }

        .tab-icon {
          font-size: 16px;
        }

        .tab-label {
          font-weight: 500;
        }

        .main-content {
          padding: 140px 20px 20px;
          max-width: 1400px;
          margin: 0 auto;
          min-height: calc(100vh - 140px);
        }

        .tab-content {
          animation: fadeInUp 0.5s ease-out;
        }

        .upload-area {
          border: 3px dashed rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          padding: 60px 40px;
          text-align: center;
          background: rgba(30, 41, 59, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 40px;
        }

        .upload-area:hover,
        .upload-area.dragging {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          transform: scale(1.02);
        }

        .upload-content {
          max-width: 500px;
          margin: 0 auto;
        }

        .upload-icon {
          font-size: 80px;
          margin-bottom: 20px;
          opacity: 0.8;
        }

        .upload-area h3 {
          font-size: 24px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 10px;
        }

        .upload-area p {
          color: #94a3b8;
          font-size: 16px;
          margin-bottom: 20px;
        }

        .supported-formats {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .supported-formats span {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .assets-gallery {
          margin-top: 40px;
        }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .gallery-header h3 {
          font-size: 22px;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0;
        }

        .gallery-controls {
          display: flex;
          gap: 10px;
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(59, 130, 246, 0.2);
          border-color: #3b82f6;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .assets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .asset-card {
          background: rgba(30, 41, 59, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .asset-card:hover {
          transform: translateY(-5px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
        }

        .asset-card.selected {
          border-color: #3b82f6;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }

        .asset-preview {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
        }

        .asset-preview img {
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
            transparent 30%,
            transparent 70%,
            rgba(0, 0, 0, 0.7) 100%
          );
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 15px;
        }

        .asset-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .asset-type,
        .asset-size {
          background: rgba(0, 0, 0, 0.8);
          padding: 4px 8px;
          border-radius: 10px;
          font-size: 12px;
          color: white;
        }

        .face-count {
          background: rgba(236, 72, 153, 0.9);
          padding: 4px 8px;
          border-radius: 10px;
          font-size: 12px;
          color: white;
        }

        .asset-details {
          padding: 15px;
        }

        .asset-name {
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .asset-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #94a3b8;
        }

        .quality-score {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          padding: 2px 6px;
          border-radius: 8px;
        }

        .processing-tools {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .tools-section h3 {
          font-size: 22px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 25px;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .tool-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(30, 41, 59, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: right;
        }

        .tool-card:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .tool-card:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tool-card.face-tool:hover:not(:disabled) {
          border-color: #ec4899;
          box-shadow: 0 10px 30px rgba(236, 72, 153, 0.3);
        }

        .tool-card.makeup-tool:hover:not(:disabled) {
          border-color: #f59e0b;
          box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
        }

        .tool-card.body-tool:hover:not(:disabled) {
          border-color: #10b981;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .tool-card.auto-tool:hover:not(:disabled) {
          border-color: #8b5cf6;
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }

        .tool-icon {
          font-size: 50px;
        }

        .tool-content h4 {
          font-size: 18px;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0 0 8px 0;
        }

        .tool-content p {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.5;
          margin: 0;
        }

        .creative-tools {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }

        .creative-tool {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 15px 20px;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }

        .creative-tool:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .processing-status-section {
          margin-top: 40px;
          background: rgba(30, 41, 59, 0.8);
          border-radius: 15px;
          padding: 25px;
        }

        .processing-status-section h3 {
          font-size: 20px;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0 0 20px 0;
        }

        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .job-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(51, 65, 85, 0.8);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .job-item.processing {
          border-color: rgba(245, 158, 11, 0.5);
        }

        .job-item.completed {
          border-color: rgba(34, 197, 94, 0.5);
        }

        .job-item.error {
          border-color: rgba(239, 68, 68, 0.5);
        }

        .job-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .job-operation {
          font-weight: 600;
          color: #e2e8f0;
          font-size: 16px;
        }

        .job-asset {
          font-size: 14px;
          color: #94a3b8;
        }

        .job-progress {
          min-width: 200px;
          text-align: left;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .progress-bar {
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

        .progress-text {
          font-size: 14px;
          font-weight: 600;
          color: #3b82f6;
          min-width: 35px;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .status-badge.completed {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .status-badge.error {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .ai-assistant-panel {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 450px;
          max-height: 500px;
          background: rgba(10, 10, 26, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          z-index: 1001;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .ai-header {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .ai-avatar {
          font-size: 30px;
        }

        .ai-title h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .ai-title p {
          margin: 2px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .close-ai {
          margin-right: auto;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .close-ai:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .ai-content {
          padding: 20px;
          max-height: 400px;
          overflow-y: auto;
        }

        .ai-analyzing {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 40px 20px;
        }

        .ai-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(59, 130, 246, 0.3);
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .ai-suggestions h4 {
          color: #e2e8f0;
          margin-bottom: 20px;
          font-size: 16px;
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .suggestion-item {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .suggestion-item.enhancement {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .suggestion-item.creative {
          border-color: rgba(236, 72, 153, 0.3);
        }

        .suggestion-item.correction {
          border-color: rgba(245, 158, 11, 0.3);
        }

        .suggestion-item.optimization {
          border-color: rgba(139, 92, 246, 0.3);
        }

        .suggestion-content {
          flex: 1;
        }

        .suggestion-content h5 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #e2e8f0;
        }

        .suggestion-content p {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.4;
        }

        .suggestion-meta {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .confidence {
          font-size: 12px;
          color: #22c55e;
          font-weight: 500;
        }

        .type-badge {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 500;
        }

        .apply-suggestion {
          background: linear-gradient(45deg, #22c55e, #16a34a);
          border: none;
          color: white;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .apply-suggestion:hover {
          background: linear-gradient(45deg, #16a34a, #15803d);
          transform: translateY(-1px);
        }

        .notifications-container {
          position: fixed;
          top: 140px;
          right: 20px;
          z-index: 1002;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 400px;
        }

        .notification {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          background: rgba(10, 10, 26, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 15px;
          padding: 20px;
          border-right: 4px solid;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .notification.success {
          border-color: #22c55e;
        }

        .notification.error {
          border-color: #ef4444;
        }

        .notification.warning {
          border-color: #f59e0b;
        }

        .notification.info {
          border-color: #3b82f6;
        }

        .notification-icon {
          font-size: 20px;
          margin-top: 2px;
        }

        .notification-content {
          flex: 1;
        }

        .notification-title {
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 4px;
          font-size: 16px;
        }

        .notification-message {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.4;
        }

        .notification-close {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .notification-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

          .nav-container {
            flex-wrap: wrap;
          }

          .nav-tab {
            flex: 1;
            justify-content: center;
            min-width: 120px;
          }

          .tools-grid {
            grid-template-columns: 1fr;
          }

          .assets-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }

          .ai-assistant-panel {
            position: fixed;
            bottom: 0;
            right: 0;
            left: 0;
            width: auto;
            border-radius: 20px 20px 0 0;
            max-height: 60vh;
          }

          .notifications-container {
            right: 10px;
            left: 10px;
            max-width: none;
          }

          .main-content {
            padding: 160px 15px 20px;
          }
        }
      `}</style>
    </AbsoluteFill>
  );
};

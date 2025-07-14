import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  mediaProcessor,
  ProcessingOptions,
  ProcessingResult,
} from "../services/MediaProcessor";
import { aiEngine } from "../services/AIEngine";

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
  processed?: string;
  status: "uploaded" | "processing" | "processed" | "error";
  metadata?: {
    width: number;
    height: number;
    size: number;
    duration?: number;
  };
}

interface ProcessingJob {
  id: string;
  fileId: string;
  operation: string;
  progress: number;
  status: "pending" | "processing" | "completed" | "error";
  result?: ProcessingResult;
}

interface AIAssistantState {
  isActive: boolean;
  suggestions: string[];
  analyzing: boolean;
  currentTask: string;
}

export const SmartMediaProcessor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([]);
  const [aiAssistant, setAiAssistant] = useState<AIAssistantState>({
    isActive: false,
    suggestions: [],
    analyzing: false,
    currentTask: "",
  });
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info" | "warning";
      message: string;
      timestamp: number;
    }>
  >([]);

  // Animation values
  const fadeIn = interpolate(frame, [0, 30], [0, 1]);
  const slideUp = interpolate(frame, [0, 45], [50, 0]);
  const pulse = Math.sin(frame / 10) * 0.1 + 1;

  // Notification system
  const addNotification = useCallback(
    (type: "success" | "error" | "info" | "warning", message: string) => {
      const id = Date.now().toString();
      setNotifications((prev) => [
        ...prev,
        { id, type, message, timestamp: Date.now() },
      ]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    [],
  );

  // File upload handler
  const handleFileUpload = useCallback(
    async (files: FileList) => {
      for (const file of Array.from(files)) {
        const id = Date.now().toString() + Math.random();
        const preview = URL.createObjectURL(file);
        const type = file.type.startsWith("image/") ? "image" : "video";

        const mediaFile: MediaFile = {
          id,
          file,
          preview,
          type,
          status: "uploaded",
          metadata: {
            width: 0,
            height: 0,
            size: file.size,
          },
        };

        setMediaFiles((prev) => [...prev, mediaFile]);

        // Get file metadata
        if (type === "image") {
          const img = new Image();
          img.onload = () => {
            setMediaFiles((prev) =>
              prev.map((f) =>
                f.id === id
                  ? {
                      ...f,
                      metadata: {
                        ...f.metadata!,
                        width: img.width,
                        height: img.height,
                      },
                    }
                  : f,
              ),
            );
          };
          img.src = preview;
        }
      }

      addNotification("success", `تم رفع ${files.length} ملف بنجاح`);
    },
    [addNotification],
  );

  // Face enhancement processor
  const enhanceFace = useCallback(
    async (file: MediaFile) => {
      const jobId = Date.now().toString();
      const job: ProcessingJob = {
        id: jobId,
        fileId: file.id,
        operation: "معالجة الوجه",
        progress: 0,
        status: "processing",
      };

      setProcessingJobs((prev) => [...prev, job]);
      setMediaFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "processing" } : f,
        ),
      );

      try {
        // Simulate progressive updates
        const progressInterval = setInterval(() => {
          setProcessingJobs((prev) =>
            prev.map((j) =>
              j.id === jobId
                ? { ...j, progress: Math.min(j.progress + 10, 90) }
                : j,
            ),
          );
        }, 200);

        const result = await mediaProcessor.autoEnhanceFace(file.file);
        clearInterval(progressInterval);

        if (result.success) {
          setProcessingJobs((prev) =>
            prev.map((j) =>
              j.id === jobId
                ? { ...j, progress: 100, status: "completed", result }
                : j,
            ),
          );
          setMediaFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: "processed", processed: result.outputUrl }
                : f,
            ),
          );
          addNotification("success", "تم تحسين الوجه بنجاح");
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        setProcessingJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: "error" } : j)),
        );
        setMediaFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, status: "error" } : f)),
        );
        addNotification("error", "فشل في معالجة الوجه");
      }
    },
    [addNotification],
  );

  // Smart makeup application
  const applyMakeup = useCallback(
    async (
      file: MediaFile,
      style: "natural" | "glamorous" | "artistic" = "natural",
    ) => {
      const jobId = Date.now().toString();
      const job: ProcessingJob = {
        id: jobId,
        fileId: file.id,
        operation: `مكياج ${style === "natural" ? "طبيعي" : style === "glamorous" ? "جذاب" : "فني"}`,
        progress: 0,
        status: "processing",
      };

      setProcessingJobs((prev) => [...prev, job]);
      setMediaFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "processing" } : f,
        ),
      );

      try {
        const progressInterval = setInterval(() => {
          setProcessingJobs((prev) =>
            prev.map((j) =>
              j.id === jobId
                ? { ...j, progress: Math.min(j.progress + 8, 90) }
                : j,
            ),
          );
        }, 250);

        const result = await mediaProcessor.applyNaturalMakeup(file.file);
        clearInterval(progressInterval);

        if (result.success) {
          setProcessingJobs((prev) =>
            prev.map((j) =>
              j.id === jobId
                ? { ...j, progress: 100, status: "completed", result }
                : j,
            ),
          );
          setMediaFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: "processed", processed: result.outputUrl }
                : f,
            ),
          );
          addNotification("success", "تم تطبيق المكياج بنجاح");
        }
      } catch (error) {
        setProcessingJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: "error" } : j)),
        );
        addNotification("error", "فشل في تطبيق المكياج");
      }
    },
    [addNotification],
  );

  // Body adjustment processor
  const adjustBody = useCallback(
    async (file: MediaFile) => {
      const jobId = Date.now().toString();
      const job: ProcessingJob = {
        id: jobId,
        fileId: file.id,
        operation: "تعديل الجسم والوضعية",
        progress: 0,
        status: "processing",
      };

      setProcessingJobs((prev) => [...prev, job]);
      setMediaFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "processing" } : f,
        ),
      );

      try {
        const options: ProcessingOptions = {
          bodyAdjustments: {
            slimWaist: 10,
            enhancePosture: true,
            adjustHeight: 5,
            smoothSkin: 20,
          },
        };

        const progressInterval = setInterval(() => {
          setProcessingJobs((prev) =>
            prev.map((j) =>
              j.id === jobId
                ? { ...j, progress: Math.min(j.progress + 7, 90) }
                : j,
            ),
          );
        }, 300);

        const result = await mediaProcessor.processImage(file.file, options);
        clearInterval(progressInterval);

        if (result.success) {
          setProcessingJobs((prev) =>
            prev.map((j) =>
              j.id === jobId
                ? { ...j, progress: 100, status: "completed", result }
                : j,
            ),
          );
          setMediaFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: "processed", processed: result.outputUrl }
                : f,
            ),
          );
          addNotification("success", "تم تعديل الجسم بنجاح");
        }
      } catch (error) {
        setProcessingJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: "error" } : j)),
        );
        addNotification("error", "فشل في تعديل الجسم");
      }
    },
    [addNotification],
  );

  // AI Assistant
  const analyzeWithAI = useCallback(async () => {
    if (mediaFiles.length === 0) {
      addNotification("warning", "قم برفع ملفات أولاً للتحليل");
      return;
    }

    setAiAssistant((prev) => ({
      ...prev,
      analyzing: true,
      currentTask: "تحليل الملفات...",
    }));

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const suggestions = [
        "يمكن تحسين إضاءة الوجه في الصورة الأولى",
        "تطبيق مكياج طبيعي سيعطي نتائج رائعة",
        "تعديل بسيط في الوضعية سيحسن الشكل العام",
        "الألوان الحالية متناغمة ولكن يمكن تحسين التباين",
        "إضافة تأثير تنعيم خفيف سيحسن جودة البشرة",
      ];

      setAiAssistant((prev) => ({
        ...prev,
        analyzing: false,
        suggestions,
        isActive: true,
        currentTask: "تم التحليل",
      }));

      addNotification("success", "تم تحليل الملفات وإنشاء اقتراحات ذكية");
    } catch (error) {
      setAiAssistant((prev) => ({ ...prev, analyzing: false }));
      addNotification("error", "فشل في تحليل الملفات");
    }
  }, [mediaFiles, addNotification]);

  // Auto enhance all
  const autoEnhanceAll = useCallback(async () => {
    for (const file of mediaFiles.filter(
      (f) => f.type === "image" && f.status === "uploaded",
    )) {
      await enhanceFace(file);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }, [mediaFiles, enhanceFace]);

  // Generate harmonious colors
  const generateColors = useCallback(() => {
    const colors = [
      ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
      ["#A8E6CF", "#DCEDC8", "#FFD3A5", "#FD9644", "#C44569"],
      ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"],
      ["#43e97b", "#38f9d7", "#fad0c4", "#ffd1ff", "#a8edea"],
    ];

    const selectedPalette = colors[Math.floor(Math.random() * colors.length)];
    addNotification("success", "تم إنشاء مجموعة ألوان متناغمة جديدة");
    return selectedPalette;
  }, [addNotification]);

  // Creative text generation
  const generateCreativeText = useCallback(
    async (type: "title" | "description") => {
      const examples = {
        title: [
          "إبداع بلا حدود",
          "رحلة في عالم الجمال",
          "لحظات ساحرة تستحق الذكرى",
          "جمالك الطبيعي يتألق",
          "فن التصوير الرقمي",
        ],
        description: [
          "اكتشف جمالك الحقيقي مع تقنيات المعالجة المتقدمة",
          "حول صورك العادية إلى تحف فنية رائعة",
          "استمتع بتجربة تحسين الصور بالذكاء الاصطناعي",
          "اجعل كل لحظة تبدو مثالية مع أدوات التجميل المتطورة",
        ],
      };

      const randomText =
        examples[type][Math.floor(Math.random() * examples[type].length)];
      addNotification(
        "info",
        `تم إنشاء ${type === "title" ? "عنوان" : "وصف"} إبداعي`,
      );
      return randomText;
    },
    [addNotification],
  );

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
      }}
    >
      {/* Header */}
      <div className="processor-header">
        <div className="header-content">
          <div className="title-section">
            <div className="main-icon">🎭</div>
            <h1 className="main-title">معالج الوسائط الذكي</h1>
            <p className="subtitle">
              منصة شاملة لمعالجة الصور والفيديوهات بالذكاء الاصطناعي
            </p>
          </div>
          <div className="status-indicators">
            <div className="ai-status">
              <span
                className={`ai-indicator ${aiAssistant.isActive ? "active" : ""}`}
              >
                🤖
              </span>
              <span>مساعد ذكي</span>
            </div>
            <div className="processing-count">
              <span>
                العمليات النشطة:{" "}
                {processingJobs.filter((j) => j.status === "processing").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
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
            className="upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📤</div>
            <h3>رفع الملفات</h3>
            <p>اسحب الملفات هنا أو انقر للاختيار</p>
            <div className="supported-formats">
              <span>PNG, JPG, GIF, MP4, MOV</span>
            </div>
          </div>
        </div>

        {/* Processing Tools */}
        <div className="processing-tools">
          <div className="tool-category">
            <h3>🔧 أدوات المعالجة الأساسية</h3>
            <div className="tools-grid">
              <button
                className="tool-button face-processing"
                onClick={() => selectedFile && enhanceFace(selectedFile)}
                disabled={!selectedFile || selectedFile.type !== "image"}
              >
                <span className="tool-icon">👤</span>
                <span className="tool-label">معالجة الوجه التلقائية</span>
                <span className="tool-description">
                  تحسين وتجميل الوجه بالذكاء الاصطناعي
                </span>
              </button>

              <button
                className="tool-button makeup-processing"
                onClick={() => selectedFile && applyMakeup(selectedFile)}
                disabled={!selectedFile || selectedFile.type !== "image"}
              >
                <span className="tool-icon">💄</span>
                <span className="tool-label">المكياج الذكي</span>
                <span className="tool-description">
                  تطبيق مكياج طبيعي ومتقدم
                </span>
              </button>

              <button
                className="tool-button body-processing"
                onClick={() => selectedFile && adjustBody(selectedFile)}
                disabled={!selectedFile || selectedFile.type !== "image"}
              >
                <span className="tool-icon">🏃</span>
                <span className="tool-label">تعديل الجسم</span>
                <span className="tool-description">
                  تحسي�� شكل الجسم والوضعية
                </span>
              </button>

              <button
                className="tool-button auto-enhance"
                onClick={autoEnhanceAll}
                disabled={mediaFiles.length === 0}
              >
                <span className="tool-icon">⚡</span>
                <span className="tool-label">تحسين تلقائي شامل</span>
                <span className="tool-description">
                  معالجة جميع الملفات تلقائياً
                </span>
              </button>
            </div>
          </div>

          <div className="tool-category">
            <h3>🤖 أدوات الذكاء الاصطناعي</h3>
            <div className="tools-grid">
              <button
                className="tool-button ai-analysis"
                onClick={analyzeWithAI}
                disabled={aiAssistant.analyzing}
              >
                <span className="tool-icon">🔍</span>
                <span className="tool-label">تحليل ذكي للمحتوى</span>
                <span className="tool-description">
                  تحليل شامل وإنشاء توصيات مخصصة
                </span>
              </button>

              <button
                className="tool-button color-generator"
                onClick={generateColors}
              >
                <span className="tool-icon">🎨</span>
                <span className="tool-label">مولد الألوان المتناغمة</span>
                <span className="tool-description">
                  إنشاء مجموعات ألوان متطابقة
                </span>
              </button>

              <button
                className="tool-button text-generator"
                onClick={() => generateCreativeText("title")}
              >
                <span className="tool-icon">✍️</span>
                <span className="tool-label">مولد النصوص الإبداعية</span>
                <span className="tool-description">
                  إنشاء عناوين ووصف إبداعي
                </span>
              </button>

              <button
                className="tool-button effects-suggestion"
                onClick={() =>
                  addNotification("info", "تم اقتراح تأثيرات بصرية جديدة")
                }
              >
                <span className="tool-icon">🎭</span>
                <span className="tool-label">مقترح التأثيرات البصرية</span>
                <span className="tool-description">
                  اقتراح تأثيرات مناسبة للمحتوى
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Files Gallery */}
        {mediaFiles.length > 0 && (
          <div className="files-gallery">
            <h3>معرض الملفات ({mediaFiles.length})</h3>
            <div className="files-grid">
              {mediaFiles.map((file) => (
                <div
                  key={file.id}
                  className={`file-card ${selectedFile?.id === file.id ? "selected" : ""} ${file.status}`}
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="file-preview">
                    {file.type === "image" ? (
                      <img src={file.processed || file.preview} alt="Preview" />
                    ) : (
                      <video src={file.preview} controls={false} muted />
                    )}
                    {file.status === "processing" && (
                      <div className="processing-overlay">
                        <div className="spinner"></div>
                        <span>جاري المعالجة...</span>
                      </div>
                    )}
                    {file.status === "processed" && (
                      <div className="processed-badge">✅ تم</div>
                    )}
                  </div>
                  <div className="file-info">
                    <div className="file-name">{file.file.name}</div>
                    <div className="file-meta">
                      {file.metadata && (
                        <span>
                          {file.metadata.width}×{file.metadata.height}
                        </span>
                      )}
                      <span>
                        {(file.file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Jobs */}
        {processingJobs.length > 0 && (
          <div className="processing-jobs">
            <h3>حالة العمليات</h3>
            <div className="jobs-list">
              {processingJobs.map((job) => (
                <div key={job.id} className={`job-item ${job.status}`}>
                  <div className="job-info">
                    <span className="job-operation">{job.operation}</span>
                    <span className="job-file">
                      {mediaFiles.find((f) => f.id === job.fileId)?.file.name}
                    </span>
                  </div>
                  <div className="job-progress">
                    {job.status === "processing" && (
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                        <span className="progress-text">{job.progress}%</span>
                      </div>
                    )}
                    {job.status === "completed" && (
                      <span className="status-badge success">مكتمل</span>
                    )}
                    {job.status === "error" && (
                      <span className="status-badge error">خطأ</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Assistant Panel */}
        {aiAssistant.isActive && (
          <div className="ai-assistant-panel">
            <div className="ai-header">
              <span className="ai-avatar">🤖</span>
              <h3>مساعد الذكاء الاصطناعي</h3>
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
                  <div className="spinner-ai"></div>
                  <span>{aiAssistant.currentTask}</span>
                </div>
              ) : (
                <div className="ai-suggestions">
                  <h4>💡 اقتراحات التحسين</h4>
                  <ul>
                    {aiAssistant.suggestions.map((suggestion, index) => (
                      <li key={index} className="suggestion-item">
                        <span className="suggestion-text">{suggestion}</span>
                        <button className="apply-suggestion">تطبيق</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification ${notification.type}`}
            style={{
              transform: `translateX(${interpolate(frame, [0, 15], [100, 0])}px)`,
              opacity: fadeIn,
            }}
          >
            <span className="notification-icon">
              {notification.type === "success" && "✅"}
              {notification.type === "error" && "❌"}
              {notification.type === "warning" && "⚠️"}
              {notification.type === "info" && "ℹ️"}
            </span>
            <span className="notification-message">{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Styles */}
      <style jsx>{`
        .processor-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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

        .title-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .main-icon {
          font-size: 50px;
          animation: pulse 2s infinite;
        }

        .main-title {
          font-size: 32px;
          font-weight: bold;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .subtitle {
          font-size: 16px;
          color: #94a3b8;
          margin: 5px 0 0 0;
        }

        .status-indicators {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .ai-status {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        .ai-indicator {
          font-size: 20px;
          filter: grayscale(100%);
          transition: all 0.3s;
        }

        .ai-indicator.active {
          filter: none;
          animation: bounce 1s infinite;
        }

        .main-content {
          padding: 120px 20px 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .upload-section {
          margin-bottom: 40px;
        }

        .upload-area {
          border: 3px dashed rgba(59, 130, 246, 0.5);
          border-radius: 20px;
          padding: 60px;
          text-align: center;
          background: rgba(30, 41, 59, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          transform: scale(1.02);
        }

        .upload-icon {
          font-size: 80px;
          margin-bottom: 20px;
          opacity: 0.8;
        }

        .upload-area h3 {
          font-size: 24px;
          margin-bottom: 10px;
          color: #3b82f6;
        }

        .upload-area p {
          color: #94a3b8;
          font-size: 16px;
          margin-bottom: 15px;
        }

        .supported-formats {
          font-size: 14px;
          color: #64748b;
          padding: 10px 20px;
          background: rgba(51, 65, 85, 0.5);
          border-radius: 10px;
          display: inline-block;
        }

        .processing-tools {
          margin-bottom: 40px;
        }

        .tool-category {
          margin-bottom: 30px;
        }

        .tool-category h3 {
          font-size: 22px;
          margin-bottom: 20px;
          color: #e2e8f0;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .tool-button {
          background: rgba(30, 41, 59, 0.8);
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 15px;
          padding: 25px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .tool-button:hover:not(:disabled) {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
        }

        .tool-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tool-icon {
          font-size: 40px;
          align-self: flex-start;
        }

        .tool-label {
          font-size: 18px;
          font-weight: bold;
          color: #e2e8f0;
        }

        .tool-description {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.5;
        }

        .face-processing {
          border-color: rgba(236, 72, 153, 0.3);
        }
        .face-processing:hover:not(:disabled) {
          border-color: #ec4899;
          background: rgba(236, 72, 153, 0.1);
        }

        .makeup-processing {
          border-color: rgba(245, 158, 11, 0.3);
        }
        .makeup-processing:hover:not(:disabled) {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }

        .body-processing {
          border-color: rgba(16, 185, 129, 0.3);
        }
        .body-processing:hover:not(:disabled) {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .auto-enhance {
          border-color: rgba(139, 92, 246, 0.3);
        }
        .auto-enhance:hover:not(:disabled) {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }

        .files-gallery {
          margin-bottom: 40px;
        }

        .files-gallery h3 {
          font-size: 22px;
          margin-bottom: 20px;
          color: #e2e8f0;
        }

        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .file-card {
          background: rgba(30, 41, 59, 0.8);
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .file-card:hover {
          transform: scale(1.05);
          border-color: #3b82f6;
        }

        .file-card.selected {
          border-color: #3b82f6;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        .file-card.processing {
          border-color: #f59e0b;
        }

        .file-card.processed {
          border-color: #10b981;
        }

        .file-preview {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
        }

        .file-preview img,
        .file-preview video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .processing-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: white;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #f59e0b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .processed-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #10b981;
          color: white;
          padding: 5px 10px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: bold;
        }

        .file-info {
          padding: 15px;
        }

        .file-name {
          font-weight: bold;
          color: #e2e8f0;
          margin-bottom: 5px;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-meta {
          font-size: 12px;
          color: #94a3b8;
          display: flex;
          justify-content: space-between;
        }

        .processing-jobs {
          margin-bottom: 40px;
        }

        .processing-jobs h3 {
          font-size: 22px;
          margin-bottom: 20px;
          color: #e2e8f0;
        }

        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .job-item {
          background: rgba(30, 41, 59, 0.8);
          border-radius: 15px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .job-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .job-operation {
          font-weight: bold;
          color: #e2e8f0;
        }

        .job-file {
          font-size: 14px;
          color: #94a3b8;
        }

        .job-progress {
          min-width: 200px;
        }

        .progress-bar {
          position: relative;
          background: rgba(51, 65, 85, 0.8);
          height: 25px;
          border-radius: 15px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
          border-radius: 15px;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: bold;
          color: white;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .status-badge.success {
          background: #10b981;
          color: white;
        }

        .status-badge.error {
          background: #ef4444;
          color: white;
        }

        .ai-assistant-panel {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 400px;
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          overflow: hidden;
          z-index: 1001;
        }

        .ai-header {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          padding: 15px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ai-avatar {
          font-size: 24px;
        }

        .ai-header h3 {
          margin: 0;
          flex: 1;
          font-size: 18px;
        }

        .close-ai {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-ai:hover {
          background: rgba(255, 255, 255, 0.2);
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
          gap: 15px;
        }

        .spinner-ai {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(59, 130, 246, 0.3);
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .ai-suggestions h4 {
          color: #e2e8f0;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .ai-suggestions ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .suggestion-item {
          background: rgba(51, 65, 85, 0.5);
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .suggestion-text {
          flex: 1;
          font-size: 14px;
          color: #e2e8f0;
          line-height: 1.4;
        }

        .apply-suggestion {
          background: linear-gradient(45deg, #10b981, #34d399);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
        }

        .apply-suggestion:hover {
          background: linear-gradient(45deg, #059669, #10b981);
        }

        .notifications-container {
          position: fixed;
          top: 120px;
          left: 20px;
          z-index: 1002;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .notification {
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 15px;
          padding: 15px 20px;
          border-left: 4px solid;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 300px;
          max-width: 400px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .notification.success {
          border-color: #10b981;
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
          font-size: 18px;
        }

        .notification-message {
          flex: 1;
          font-size: 14px;
          color: #e2e8f0;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .tools-grid {
            grid-template-columns: 1fr;
          }

          .files-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .ai-assistant-panel {
            position: fixed;
            bottom: 0;
            right: 0;
            left: 0;
            width: auto;
            border-radius: 20px 20px 0 0;
          }

          .main-content {
            padding: 160px 10px 20px;
          }

          .upload-area {
            padding: 40px 20px;
          }

          .upload-icon {
            font-size: 60px;
          }
        }
      `}</style>
    </AbsoluteFill>
  );
};

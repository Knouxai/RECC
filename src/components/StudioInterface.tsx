import React, { useState, useRef, useCallback } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Sequence } from "remotion";
import { fileManager, VideoProject } from "../services/FileManager";
import { aiEngine, AISuggestion } from "../services/AIEngine";
import { mediaProcessor, ProcessingOptions } from "../services/MediaProcessor";
import { TemplateGallery } from "./TemplateGallery";
import { VideoTemplate, videoTemplates } from "../templates/TemplateData";

type StudioMode =
  | "welcome"
  | "templates"
  | "projects"
  | "editor"
  | "ai"
  | "media"
  | "export"
  | "settings";

interface StudioState {
  currentMode: StudioMode;
  selectedProject: VideoProject | null;
  selectedTemplate: VideoTemplate | null;
  aiSuggestions: AISuggestion[];
  mediaFiles: File[];
  isProcessing: boolean;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: Date;
}

export const StudioInterface: React.FC = () => {
  const frame = useCurrentFrame();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<StudioState>({
    currentMode: "welcome",
    selectedProject: null,
    selectedTemplate: null,
    aiSuggestions: [],
    mediaFiles: [],
    isProcessing: false,
    notifications: [],
  });

  // Animation
  const fadeIn = interpolate(frame, [0, 30], [0, 1]);
  const slideIn = interpolate(frame, [0, 60], [-100, 0]);

  // الوظائف الأساسية
  const addNotification = useCallback(
    (type: Notification["type"], message: string) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        notifications: [...prev.notifications, notification],
      }));

      // إزالة الإشعار بعد 5 ثوانِ
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.filter(
            (n) => n.id !== notification.id,
          ),
        }));
      }, 5000);
    },
    [],
  );

  const changeMode = useCallback((mode: StudioMode) => {
    setState((prev) => ({ ...prev, currentMode: mode }));
  }, []);

  const createNewProject = useCallback(
    async (template: VideoTemplate) => {
      try {
        const newProject: VideoProject = {
          id: Date.now().toString(),
          name: `مشروع جديد - ${template.name}`,
          templateId: template.id,
          settings: template.customizableProps,
          timeline: [],
          assets: [],
          metadata: {
            title: template.name,
            description: template.description,
            tags: template.tags,
            category: template.category,
            difficulty: template.difficulty,
            duration: template.duration,
            fps: template.fps,
            resolution: {
              width: template.width,
              height: template.height,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            author: "المستخدم الحالي",
            version: "1.0.0",
          },
        };

        await fileManager.saveProject(newProject);
        setState((prev) => ({
          ...prev,
          selectedProject: newProject,
          selectedTemplate: template,
          currentMode: "editor",
        }));

        addNotification("success", "تم إنشاء المشروع بنجاح!");
      } catch (error) {
        addNotification("error", "فشل في إنشاء المشروع");
      }
    },
    [addNotification],
  );

  const uploadMedia = useCallback(
    async (files: FileList) => {
      setState((prev) => ({ ...prev, isProcessing: true }));

      try {
        const uploadedFiles = Array.from(files);
        const processedAssets = await Promise.all(
          uploadedFiles.map((file) => fileManager.uploadMedia(file)),
        );

        setState((prev) => ({
          ...prev,
          mediaFiles: [...prev.mediaFiles, ...uploadedFiles],
          isProcessing: false,
        }));

        addNotification("success", `تم رفع ${uploadedFiles.length} ملف بنجاح`);
      } catch (error) {
        setState((prev) => ({ ...prev, isProcessing: false }));
        addNotification("error", "فشل في رفع الملفات");
      }
    },
    [addNotification],
  );

  const getAISuggestions = useCallback(async () => {
    if (!state.selectedProject) return;

    setState((prev) => ({ ...prev, isProcessing: true }));

    try {
      const analysis = await aiEngine.analyzeProject(state.selectedProject);
      setState((prev) => ({
        ...prev,
        aiSuggestions: analysis.suggestions,
        isProcessing: false,
      }));

      addNotification(
        "info",
        `تم العثور على ${analysis.suggestions.length} اقتراح للتحسين`,
      );
    } catch (error) {
      setState((prev) => ({ ...prev, isProcessing: false }));
      addNotification("error", "فشل في تحليل المشروع");
    }
  }, [state.selectedProject, addNotification]);

  const renderWelcomeScreen = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        textAlign: "center",
        direction: "rtl",
      }}
    >
      <div
        style={{
          fontSize: 120,
          marginBottom: "30px",
          animation: "bounce 2s infinite",
        }}
      >
        🎬
      </div>

      <h1
        style={{
          fontSize: 64,
          fontWeight: "bold",
          marginBottom: "20px",
          background: "linear-gradient(45deg, #fff, #f0f0f0)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        استوديو الإبداع الذكي
      </h1>

      <p
        style={{
          fontSize: 24,
          marginBottom: "50px",
          opacity: 0.9,
          maxWidth: "800px",
        }}
      >
        منصة شاملة لإنتاج الفيديوهات بالذكاء الاصطناعي
        <br />
        مع معالجة متقدمة للصور والفيديو
      </p>

      <div
        style={{
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => changeMode("templates")}
          style={{
            background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
            border: "none",
            borderRadius: "25px",
            padding: "20px 40px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(255, 107, 107, 0.4)",
            transition: "all 0.3s ease",
          }}
        >
          🎨 إنشاء من قالب
        </button>

        <button
          onClick={() => changeMode("projects")}
          style={{
            background: "linear-gradient(45deg, #4ecdc4, #44a08d)",
            border: "none",
            borderRadius: "25px",
            padding: "20px 40px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(78, 205, 196, 0.4)",
            transition: "all 0.3s ease",
          }}
        >
          📁 مشاريعي
        </button>

        <button
          onClick={() => changeMode("media")}
          style={{
            background: "linear-gradient(45deg, #a8edea, #fed6e3)",
            border: "none",
            borderRadius: "25px",
            padding: "20px 40px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#333",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(168, 237, 234, 0.4)",
            transition: "all 0.3s ease",
          }}
        >
          🎭 معالجة الوسائط
        </button>

        <button
          onClick={() => changeMode("ai")}
          style={{
            background: "linear-gradient(45deg, #ffecd2, #fcb69f)",
            border: "none",
            borderRadius: "25px",
            padding: "20px 40px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#333",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(255, 236, 210, 0.4)",
            transition: "all 0.3s ease",
          }}
        >
          🤖 الذكاء الاصطناعي
        </button>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(20px)",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 1000,
        borderBottom: "1px solid #334155",
      }}
    >
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => changeMode("welcome")}
        >
          🎬 الاستوديو
        </div>

        {["templates", "projects", "ai", "media", "export"].map((mode) => (
          <button
            key={mode}
            onClick={() => changeMode(mode as StudioMode)}
            style={{
              background:
                state.currentMode === mode
                  ? "linear-gradient(45deg, #3b82f6, #8b5cf6)"
                  : "transparent",
              border: "1px solid #475569",
              borderRadius: "10px",
              padding: "8px 16px",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {mode === "templates" && "📋 القوالب"}
            {mode === "projects" && "📁 المشاريع"}
            {mode === "ai" && "🤖 الذكاء الاصطناعي"}
            {mode === "media" && "🎭 المعالجة"}
            {mode === "export" && "📤 التصدير"}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {state.isProcessing && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#3b82f6",
              fontSize: "14px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #3b82f6",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            جاري المعالجة...
          </div>
        )}

        <button
          style={{
            background: "linear-gradient(45deg, #10b981, #34d399)",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            color: "white",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          💾 حفظ
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "20px",
        zIndex: 1001,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {state.notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            background:
              notification.type === "success"
                ? "linear-gradient(45deg, #10b981, #34d399)"
                : notification.type === "error"
                  ? "linear-gradient(45deg, #ef4444, #f87171)"
                  : notification.type === "warning"
                    ? "linear-gradient(45deg, #f59e0b, #fbbf24)"
                    : "linear-gradient(45deg, #3b82f6, #60a5fa)",
            borderRadius: "10px",
            padding: "12px 20px",
            color: "white",
            fontSize: "14px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            animation: "slideInRight 0.3s ease-out",
            maxWidth: "300px",
            direction: "rtl",
          }}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );

  const renderMediaProcessor = () => (
    <div
      style={{
        padding: "100px 30px 30px",
        height: "100vh",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "white",
        direction: "rtl",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          textAlign: "center",
          marginBottom: "50px",
          background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🎭 معالج الوسائط الذكي
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* رفع الملفات */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            borderRadius: "20px",
            padding: "30px",
            border: "2px solid #334155",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>📤</div>
          <h3 style={{ fontSize: "24px", marginBottom: "15px" }}>
            رفع الملفات
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
            ارفع الصور والفيديوهات للمعالجة
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files && uploadMedia(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
              border: "none",
              borderRadius: "15px",
              padding: "12px 30px",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            اختر الملفات
          </button>
        </div>

        {/* معالجة الوجه */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            borderRadius: "20px",
            padding: "30px",
            border: "2px solid #334155",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>👤</div>
          <h3 style={{ fontSize: "24px", marginBottom: "15px" }}>
            معالجة الوجه
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
            تحسين وتجميل الوجه تلقائياً
          </p>
          <button
            style={{
              background: "linear-gradient(45deg, #ec4899, #f9a8d4)",
              border: "none",
              borderRadius: "15px",
              padding: "12px 30px",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            تحسين تلقائي
          </button>
        </div>

        {/* المكياج الذكي */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            borderRadius: "20px",
            padding: "30px",
            border: "2px solid #334155",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>💄</div>
          <h3 style={{ fontSize: "24px", marginBottom: "15px" }}>
            المكياج الذكي
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
            تطبيق مكياج طبيعي ومتقدم
          </p>
          <button
            style={{
              background: "linear-gradient(45deg, #f59e0b, #fbbf24)",
              border: "none",
              borderRadius: "15px",
              padding: "12px 30px",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            تطبيق المكياج
          </button>
        </div>

        {/* تعديل الجسم */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            borderRadius: "20px",
            padding: "30px",
            border: "2px solid #334155",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>🏃</div>
          <h3 style={{ fontSize: "24px", marginBottom: "15px" }}>
            تعديل الجسم
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
            تحسين شكل الجسم والوضعية
          </p>
          <button
            style={{
              background: "linear-gradient(45deg, #10b981, #34d399)",
              border: "none",
              borderRadius: "15px",
              padding: "12px 30px",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            تعديل الجسم
          </button>
        </div>
      </div>

      {/* عرض الملفات المرفوعة */}
      {state.mediaFiles.length > 0 && (
        <div
          style={{
            marginTop: "50px",
            background: "rgba(30, 41, 59, 0.8)",
            borderRadius: "20px",
            padding: "30px",
            border: "2px solid #334155",
            maxWidth: "1200px",
            margin: "50px auto 0",
          }}
        >
          <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>
            الملفات المرفوعة
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "15px",
            }}
          >
            {state.mediaFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(51, 65, 85, 0.8)",
                  borderRadius: "10px",
                  padding: "15px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                  {file.type.startsWith("image/") ? "🖼️" : "🎬"}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {file.name.length > 15
                    ? file.name.substring(0, 15) + "..."
                    : file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAIAssistant = () => (
    <div
      style={{
        padding: "100px 30px 30px",
        height: "100vh",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "white",
        direction: "rtl",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          textAlign: "center",
          marginBottom: "50px",
          background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🤖 مساعد الذكاء الاصطناعي
      </h1>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
        }}
      >
        {/* الاقتراحات */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            borderRadius: "20px",
            padding: "30px",
            border: "2px solid #334155",
          }}
        >
          <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>
            💡 اقتراحات التحسين
          </h3>

          <button
            onClick={getAISuggestions}
            style={{
              background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
              border: "none",
              borderRadius: "15px",
              padding: "12px 30px",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            تحليل المشروع
          </button>

          {state.aiSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              style={{
                background: "rgba(51, 65, 85, 0.8)",
                borderRadius: "15px",
                padding: "20px",
                marginBottom: "15px",
                border: "1px solid #475569",
              }}
            >
              <h4 style={{ fontSize: "18px", marginBottom: "10px" }}>
                {suggestion.title}
              </h4>
              <p style={{ color: "#94a3b8", marginBottom: "10px" }}>
                {suggestion.description}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "14px", color: "#22c55e" }}>
                  ثقة: {Math.round(suggestion.confidence * 100)}%
                </span>
                <button
                  onClick={suggestion.action}
                  style={{
                    background: "linear-gradient(45deg, #10b981, #34d399)",
                    border: "none",
                    borderRadius: "10px",
                    padding: "8px 16px",
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  تطبيق
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* الأدوات الذكية */}
        <div
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            borderRadius: "20px",
            padding: "30px",
            border: "2px solid #334155",
          }}
        >
          <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>
            🛠️ الأدوات الذكية
          </h3>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <button
              style={{
                background: "linear-gradient(45deg, #ec4899, #f9a8d4)",
                border: "none",
                borderRadius: "15px",
                padding: "15px",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
                textAlign: "right",
              }}
            >
              🎨 اقتراح ألوان متناغمة
            </button>

            <button
              style={{
                background: "linear-gradient(45deg, #f59e0b, #fbbf24)",
                border: "none",
                borderRadius: "15px",
                padding: "15px",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
                textAlign: "right",
              }}
            >
              ✍️ توليد نصوص إبداعية
            </button>

            <button
              style={{
                background: "linear-gradient(45deg, #8b5cf6, #a78bfa)",
                border: "none",
                borderRadius: "15px",
                padding: "15px",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
                textAlign: "right",
              }}
            >
              🎭 اقتراح تأثيرات بصرية
            </button>

            <button
              style={{
                background: "linear-gradient(45deg, #10b981, #34d399)",
                border: "none",
                borderRadius: "15px",
                padding: "15px",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
                textAlign: "right",
              }}
            >
              ⚡ تحسين تلقائي شامل
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn,
        transform: `translateX(${slideIn}px)`,
        fontFamily: "Cairo, Arial, sans-serif",
      }}
    >
      {state.currentMode !== "welcome" && renderNavigation()}
      {renderNotifications()}

      {state.currentMode === "welcome" && renderWelcomeScreen()}
      {state.currentMode === "templates" && (
        <div style={{ paddingTop: "80px" }}>
          <TemplateGallery
            onTemplateSelect={createNewProject}
            selectedTemplate={state.selectedTemplate}
          />
        </div>
      )}
      {state.currentMode === "media" && renderMediaProcessor()}
      {state.currentMode === "ai" && renderAIAssistant()}

      {/* إضافة CSS للحركات */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-30px); }
            60% { transform: translateY(-15px); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </AbsoluteFill>
  );
};

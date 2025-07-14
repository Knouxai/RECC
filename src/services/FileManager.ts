export interface ProjectFile {
  id: string;
  name: string;
  type: "project" | "template" | "video" | "image" | "audio";
  data: any;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    size: number;
    author: string;
    tags: string[];
    description?: string;
  };
  thumbnail?: string;
  version: string;
}

export interface VideoProject {
  id: string;
  name: string;
  templateId: string;
  settings: any;
  timeline: TimelineItem[];
  assets: AssetItem[];
  metadata: ProjectMetadata;
}

export interface TimelineItem {
  id: string;
  type: "video" | "image" | "text" | "effect";
  startTime: number;
  duration: number;
  layer: number;
  properties: any;
}

export interface AssetItem {
  id: string;
  name: string;
  type: "video" | "image" | "audio";
  url: string;
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    size: number;
  };
}

export interface ProjectMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  fps: number;
  resolution: {
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
  author: string;
  version: string;
}

export class FileManager {
  private storage: Storage;
  private projects: Map<string, VideoProject> = new Map();
  private templates: Map<string, ProjectFile> = new Map();

  constructor() {
    this.storage =
      typeof window !== "undefined" ? localStorage : ({} as Storage);
    this.loadFromStorage();
  }

  // حفظ مشروع
  async saveProject(project: VideoProject): Promise<boolean> {
    try {
      project.metadata.updatedAt = new Date();
      this.projects.set(project.id, project);

      const projectsData = Array.from(this.projects.entries());
      this.storage.setItem("video_projects", JSON.stringify(projectsData));

      return true;
    } catch (error) {
      console.error("Failed to save project:", error);
      return false;
    }
  }

  // تحميل مشروع
  async loadProject(projectId: string): Promise<VideoProject | null> {
    try {
      return this.projects.get(projectId) || null;
    } catch (error) {
      console.error("Failed to load project:", error);
      return null;
    }
  }

  // حذف مشروع
  async deleteProject(projectId: string): Promise<boolean> {
    try {
      this.projects.delete(projectId);
      const projectsData = Array.from(this.projects.entries());
      this.storage.setItem("video_projects", JSON.stringify(projectsData));
      return true;
    } catch (error) {
      console.error("Failed to delete project:", error);
      return false;
    }
  }

  // تصدير مشروع
  async exportProject(
    projectId: string,
    format: "json" | "mp4" | "gif",
  ): Promise<Blob | null> {
    try {
      const project = this.projects.get(projectId);
      if (!project) return null;

      switch (format) {
        case "json":
          const jsonData = JSON.stringify(project, null, 2);
          return new Blob([jsonData], { type: "application/json" });

        case "mp4":
          // هنا سيتم تكامل مع محرك الرندر
          return await this.renderToVideo(project);

        case "gif":
          return await this.renderToGif(project);

        default:
          return null;
      }
    } catch (error) {
      console.error("Failed to export project:", error);
      return null;
    }
  }

  // استيراد مشروع
  async importProject(file: File): Promise<VideoProject | null> {
    try {
      const text = await file.text();
      const projectData = JSON.parse(text);

      // التحقق من صحة البيانات
      if (this.validateProjectData(projectData)) {
        const project: VideoProject = {
          ...projectData,
          id: this.generateId(),
          metadata: {
            ...projectData.metadata,
            updatedAt: new Date(),
          },
        };

        await this.saveProject(project);
        return project;
      }

      return null;
    } catch (error) {
      console.error("Failed to import project:", error);
      return null;
    }
  }

  // تحميل ملف وسائط
  async uploadMedia(file: File): Promise<AssetItem | null> {
    try {
      const asset: AssetItem = {
        id: this.generateId(),
        name: file.name,
        type: this.getMediaType(file),
        url: URL.createObjectURL(file),
        metadata: {
          size: file.size,
          width: undefined,
          height: undefined,
          duration: undefined,
        },
      };

      // إضافة معلومات إضافية للصور والفيديوهات
      if (asset.type === "image") {
        const dimensions = await this.getImageDimensions(file);
        asset.metadata.width = dimensions.width;
        asset.metadata.height = dimensions.height;
      } else if (asset.type === "video") {
        const videoInfo = await this.getVideoInfo(file);
        asset.metadata.width = videoInfo.width;
        asset.metadata.height = videoInfo.height;
        asset.metadata.duration = videoInfo.duration;
      }

      return asset;
    } catch (error) {
      console.error("Failed to upload media:", error);
      return null;
    }
  }

  // حفظ قالب مخصص
  async saveCustomTemplate(template: ProjectFile): Promise<boolean> {
    try {
      this.templates.set(template.id, template);
      const templatesData = Array.from(this.templates.entries());
      this.storage.setItem("custom_templates", JSON.stringify(templatesData));
      return true;
    } catch (error) {
      console.error("Failed to save template:", error);
      return false;
    }
  }

  // الحصول على جميع المشاريع
  getProjects(): VideoProject[] {
    return Array.from(this.projects.values());
  }

  // الحصول على جميع القوالب المخصصة
  getCustomTemplates(): ProjectFile[] {
    return Array.from(this.templates.values());
  }

  // البحث في المشاريع
  searchProjects(query: string): VideoProject[] {
    const searchTerm = query.toLowerCase();
    return this.getProjects().filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm) ||
        project.metadata.description.toLowerCase().includes(searchTerm) ||
        project.metadata.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm),
        ),
    );
  }

  // تحديد نوع الوسائط
  private getMediaType(file: File): "video" | "image" | "audio" {
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("audio/")) return "audio";
    return "video"; // افتراضي
  }

  // الحصول على أبعاد الصورة
  private async getImageDimensions(
    file: File,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  // الحصول على معلومات الفيديو
  private async getVideoInfo(
    file: File,
  ): Promise<{ width: number; height: number; duration: number }> {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
        });
      };
      video.src = URL.createObjectURL(file);
    });
  }

  // التحقق من صحة بيانات المشروع
  private validateProjectData(data: any): boolean {
    return (
      data &&
      typeof data.id === "string" &&
      typeof data.name === "string" &&
      typeof data.templateId === "string" &&
      data.settings &&
      Array.isArray(data.timeline) &&
      Array.isArray(data.assets) &&
      data.metadata
    );
  }

  // توليد معرف فريد
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // تحميل البيانات من التخزين المحلي
  private loadFromStorage(): void {
    try {
      const projectsData = this.storage.getItem("video_projects");
      if (projectsData) {
        const projects = JSON.parse(projectsData);
        this.projects = new Map(projects);
      }

      const templatesData = this.storage.getItem("custom_templates");
      if (templatesData) {
        const templates = JSON.parse(templatesData);
        this.templates = new Map(templates);
      }
    } catch (error) {
      console.error("Failed to load from storage:", error);
    }
  }

  // رندر إلى فيديو (محاكاة)
  private async renderToVideo(project: VideoProject): Promise<Blob> {
    // هنا سيتم التكامل مع محرك الرندر الحقيقي
    // حالياً سنعيد blob فارغ كمحاكاة
    return new Promise((resolve) => {
      setTimeout(() => {
        const canvas = document.createElement("canvas");
        canvas.width = project.metadata.resolution.width;
        canvas.height = project.metadata.resolution.height;

        canvas.toBlob((blob) => {
          resolve(blob || new Blob());
        });
      }, 2000); // محاكاة وقت الرندر
    });
  }

  // رندر إلى GIF (محاكاة)
  private async renderToGif(project: VideoProject): Promise<Blob> {
    // محاكاة رندر GIF
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Blob(["fake gif data"], { type: "image/gif" }));
      }, 1500);
    });
  }

  // نسخ احتياطي للسحابة (محاكاة)
  async backupToCloud(): Promise<boolean> {
    try {
      const allData = {
        projects: Array.from(this.projects.entries()),
        templates: Array.from(this.templates.entries()),
        timestamp: new Date().toISOString(),
      };

      // محاكاة رفع للسحابة
      console.log("Backing up to cloud...", allData);

      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 2000);
      });
    } catch (error) {
      console.error("Cloud backup failed:", error);
      return false;
    }
  }

  // استعادة من السحابة (محاكاة)
  async restoreFromCloud(): Promise<boolean> {
    try {
      // محاكاة تحميل من السحابة
      console.log("Restoring from cloud...");

      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 2000);
      });
    } catch (error) {
      console.error("Cloud restore failed:", error);
      return false;
    }
  }
}

// نسخة واحدة من مدير الملفات
export const fileManager = new FileManager();

import { VideoProject } from "./FileManager";

export interface ExportOptions {
  format: "mp4" | "webm" | "gif" | "png_sequence" | "mov" | "avi";
  quality: "low" | "medium" | "high" | "ultra" | "custom";
  resolution: {
    width: number;
    height: number;
  };
  fps: number;
  codec?: string;
  bitrate?: number;
  audio?: {
    enabled: boolean;
    codec?: string;
    bitrate?: number;
  };
  customSettings?: {
    [key: string]: any;
  };
}

export interface ExportProgress {
  percentage: number;
  currentFrame: number;
  totalFrames: number;
  estimatedTimeRemaining: number;
  stage:
    | "preparing"
    | "rendering"
    | "encoding"
    | "finalizing"
    | "complete"
    | "error";
  message: string;
}

export interface ExportResult {
  success: boolean;
  outputUrl?: string;
  outputSize?: number;
  exportTime?: number;
  error?: string;
  metadata?: {
    duration: number;
    fps: number;
    resolution: string;
    fileSize: string;
    codec: string;
  };
}

export interface RenderJob {
  id: string;
  project: VideoProject;
  options: ExportOptions;
  status: "queued" | "processing" | "completed" | "failed";
  progress: ExportProgress;
  startTime: Date;
  endTime?: Date;
  result?: ExportResult;
}

export class ExportEngine {
  private jobs: Map<string, RenderJob> = new Map();
  private activeJobs: number = 0;
  private maxConcurrentJobs: number = 2;
  private progressCallbacks: Map<string, (progress: ExportProgress) => void> =
    new Map();

  // بدء عملية التصدير
  async startExport(
    project: VideoProject,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void,
  ): Promise<string> {
    const jobId = this.generateJobId();

    const job: RenderJob = {
      id: jobId,
      project,
      options,
      status: "queued",
      progress: {
        percentage: 0,
        currentFrame: 0,
        totalFrames: project.metadata.duration * project.metadata.fps,
        estimatedTimeRemaining: 0,
        stage: "preparing",
        message: "تجهيز المشروع للتصدير...",
      },
      startTime: new Date(),
    };

    this.jobs.set(jobId, job);

    if (onProgress) {
      this.progressCallbacks.set(jobId, onProgress);
    }

    // بدء المعالجة
    this.processJob(jobId);

    return jobId;
  }

  // معالجة المهمة
  private async processJob(jobId: string): Promise<void> {
    if (this.activeJobs >= this.maxConcurrentJobs) {
      // إضافة إلى قائمة الانتظار
      setTimeout(() => this.processJob(jobId), 1000);
      return;
    }

    const job = this.jobs.get(jobId);
    if (!job) return;

    this.activeJobs++;
    job.status = "processing";

    try {
      // مرحلة التجهيز
      await this.prepareRender(job);

      // مرحلة الرندر
      await this.renderFrames(job);

      // مرحلة التشفير
      await this.encodeVideo(job);

      // مرحلة الإنهاء
      await this.finalizeExport(job);

      job.status = "completed";
      job.endTime = new Date();
    } catch (error) {
      job.status = "failed";
      job.result = {
        success: false,
        error: `فشل في التصدير: ${error}`,
      };

      this.updateProgress(jobId, {
        ...job.progress,
        stage: "error",
        message: `خطأ: ${error}`,
      });
    } finally {
      this.activeJobs--;
    }
  }

  // تجهيز الرندر
  private async prepareRender(job: RenderJob): Promise<void> {
    this.updateProgress(job.id, {
      ...job.progress,
      stage: "preparing",
      message: "تجهيز المشروع وتحميل الأصول...",
    });

    // محاكاة تجهيز المشروع
    await this.sleep(1000);

    // تحديد إعدادات الجودة
    const qualitySettings = this.getQualitySettings(job.options.quality);
    job.options = { ...job.options, ...qualitySettings };

    this.updateProgress(job.id, {
      ...job.progress,
      percentage: 10,
      message: "تم تجهيز المشروع بنجاح",
    });
  }

  // رندر الإطارات
  private async renderFrames(job: RenderJob): Promise<void> {
    const totalFrames = job.progress.totalFrames;
    const startTime = Date.now();

    for (let frame = 0; frame < totalFrames; frame++) {
      // محاكاة رندر إطار
      await this.sleep(50); // 50ms لكل إطار

      const percentage = 10 + (frame / totalFrames) * 70; // 10-80%
      const elapsedTime = Date.now() - startTime;
      const estimatedTotal = (elapsedTime / frame) * totalFrames;
      const estimatedRemaining = estimatedTotal - elapsedTime;

      this.updateProgress(job.id, {
        percentage,
        currentFrame: frame,
        totalFrames,
        estimatedTimeRemaining: Math.round(estimatedRemaining / 1000),
        stage: "rendering",
        message: `رندر الإطار ${frame + 1} من ${totalFrames}`,
      });

      // إيقاف مؤقت للسماح بالتحديث
      if (frame % 10 === 0) {
        await this.sleep(10);
      }
    }
  }

  // تشفير الفيديو
  private async encodeVideo(job: RenderJob): Promise<void> {
    this.updateProgress(job.id, {
      ...job.progress,
      percentage: 80,
      stage: "encoding",
      message: "تشفير الفيديو بالجودة المطلوبة...",
    });

    // محاكاة التشفير
    const encodingSteps = [
      "تحليل الإطارات",
      "ضغط البيانات",
      "تطبيق الكودك",
      "تحسين الجودة",
    ];

    for (let i = 0; i < encodingSteps.length; i++) {
      await this.sleep(1500);

      const stepPercentage = 80 + (i / encodingSteps.length) * 15;
      this.updateProgress(job.id, {
        ...job.progress,
        percentage: stepPercentage,
        message: encodingSteps[i],
      });
    }
  }

  // إنهاء التصدير
  private async finalizeExport(job: RenderJob): Promise<void> {
    this.updateProgress(job.id, {
      ...job.progress,
      percentage: 95,
      stage: "finalizing",
      message: "إنهاء التصدير وحفظ الملف...",
    });

    await this.sleep(1000);

    // إنشاء ملف نتيجة وهمي
    const outputBlob = this.createMockVideoFile(job);
    const outputUrl = URL.createObjectURL(outputBlob);

    job.result = {
      success: true,
      outputUrl,
      outputSize: outputBlob.size,
      exportTime: Date.now() - job.startTime.getTime(),
      metadata: {
        duration: job.project.metadata.duration / job.project.metadata.fps,
        fps: job.options.fps,
        resolution: `${job.options.resolution.width}x${job.options.resolution.height}`,
        fileSize: this.formatFileSize(outputBlob.size),
        codec: job.options.codec || "H.264",
      },
    };

    this.updateProgress(job.id, {
      ...job.progress,
      percentage: 100,
      stage: "complete",
      message: "تم التصدير بنجاح!",
    });
  }

  // الحصول على حالة المهمة
  getJobStatus(jobId: string): RenderJob | null {
    return this.jobs.get(jobId) || null;
  }

  // إلغاء المهمة
  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status === "completed") return false;

    job.status = "failed";
    job.result = {
      success: false,
      error: "تم إلغاء التصدير بواسطة المستخدم",
    };

    this.jobs.delete(jobId);
    this.progressCallbacks.delete(jobId);

    return true;
  }

  // الحصول على جميع المهام
  getAllJobs(): RenderJob[] {
    return Array.from(this.jobs.values());
  }

  // تصدير سريع بإعدادات افتراضية
  async quickExport(
    project: VideoProject,
    format: ExportOptions["format"] = "mp4",
  ): Promise<string> {
    const options: ExportOptions = {
      format,
      quality: "high",
      resolution: {
        width: project.metadata.resolution.width,
        height: project.metadata.resolution.height,
      },
      fps: project.metadata.fps,
      audio: {
        enabled: true,
      },
    };

    return this.startExport(project, options);
  }

  // تصدير مخصص متقدم
  async advancedExport(
    project: VideoProject,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void,
  ): Promise<string> {
    // التحقق من صحة الخيارات
    this.validateExportOptions(options);

    // تحسين الإعدادات تلقائياً
    const optimizedOptions = this.optimizeExportSettings(project, options);

    return this.startExport(project, optimizedOptions, onProgress);
  }

  // تصدير دفعي
  async batchExport(
    projects: VideoProject[],
    options: ExportOptions,
    onBatchProgress?: (completed: number, total: number) => void,
  ): Promise<string[]> {
    const jobIds: string[] = [];

    for (let i = 0; i < projects.length; i++) {
      const jobId = await this.startExport(projects[i], options);
      jobIds.push(jobId);

      if (onBatchProgress) {
        onBatchProgress(i + 1, projects.length);
      }

      // تأخير بسيط بين المهام
      await this.sleep(100);
    }

    return jobIds;
  }

  // ======== الوظائف المساعدة ========

  private updateProgress(jobId: string, progress: ExportProgress): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.progress = progress;

      const callback = this.progressCallbacks.get(jobId);
      if (callback) {
        callback(progress);
      }
    }
  }

  private getQualitySettings(
    quality: ExportOptions["quality"],
  ): Partial<ExportOptions> {
    const settings = {
      low: { bitrate: 1000, codec: "H.264" },
      medium: { bitrate: 2500, codec: "H.264" },
      high: { bitrate: 5000, codec: "H.264" },
      ultra: { bitrate: 10000, codec: "H.265" },
      custom: {},
    };

    return settings[quality] || settings.medium;
  }

  private validateExportOptions(options: ExportOptions): void {
    if (!options.resolution.width || !options.resolution.height) {
      throw new Error("دقة الفيديو مطلوبة");
    }

    if (options.fps <= 0 || options.fps > 120) {
      throw new Error("معدل الإطارات يجب أن يكون بين 1 و 120");
    }
  }

  private optimizeExportSettings(
    project: VideoProject,
    options: ExportOptions,
  ): ExportOptions {
    const optimized = { ...options };

    // تحسين الدقة للأجهزة المحمولة
    if (optimized.resolution.width > 1920) {
      optimized.resolution.width = 1920;
      optimized.resolution.height = Math.round(
        (optimized.resolution.height * 1920) / optimized.resolution.width,
      );
    }

    // تحسين معدل الإطارات
    if (optimized.fps > 60 && optimized.quality !== "ultra") {
      optimized.fps = 60;
    }

    return optimized;
  }

  private createMockVideoFile(job: RenderJob): Blob {
    // إنشاء ملف وهمي للاختبار
    const duration = job.project.metadata.duration / job.project.metadata.fps;
    const estimatedSize = this.estimateFileSize(job.options, duration);

    return new Blob(["mock video data".repeat(estimatedSize / 20)], {
      type: this.getMimeType(job.options.format),
    });
  }

  private estimateFileSize(options: ExportOptions, duration: number): number {
    const bitrate = options.bitrate || 2500;
    return Math.round(((bitrate * duration) / 8) * 1024); // بايت
  }

  private getMimeType(format: ExportOptions["format"]): string {
    const mimeTypes = {
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      gif: "image/gif",
      png_sequence: "application/zip",
    };

    return mimeTypes[format] || "video/mp4";
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 بايت";

    const k = 1024;
    const sizes = ["بايت", "كيلوبايت", "ميجابايت", "جيجابايت"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  private generateJobId(): string {
    return (
      "export_" + Date.now().toString(36) + Math.random().toString(36).substr(2)
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // تنظيف المهام المكتملة
  cleanupCompletedJobs(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 ساعة

    for (const [jobId, job] of this.jobs.entries()) {
      if (job.status === "completed" || job.status === "failed") {
        const jobAge = now - job.startTime.getTime();
        if (jobAge > maxAge) {
          this.jobs.delete(jobId);
          this.progressCallbacks.delete(jobId);
        }
      }
    }
  }

  // إحصائيات التصدير
  getExportStats(): {
    totalJobs: number;
    completedJobs: number;
    failedJobs: number;
    activeJobs: number;
    avgExportTime: number;
  } {
    const jobs = Array.from(this.jobs.values());
    const completed = jobs.filter((j) => j.status === "completed");
    const failed = jobs.filter((j) => j.status === "failed");
    const active = jobs.filter((j) => j.status === "processing");

    const avgExportTime =
      completed.length > 0
        ? completed.reduce((sum, job) => {
            return sum + (job.endTime!.getTime() - job.startTime.getTime());
          }, 0) / completed.length
        : 0;

    return {
      totalJobs: jobs.length,
      completedJobs: completed.length,
      failedJobs: failed.length,
      activeJobs: active.length,
      avgExportTime: Math.round(avgExportTime / 1000), // بالثواني
    };
  }
}

export const exportEngine = new ExportEngine();

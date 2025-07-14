const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  shell,
} = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

// تخزين النافذة الرئيسية
let mainWindow;
let remotionProcess;

// إعداد التطبيق
const APP_CONFIG = {
  name: "الاستوديو الذكي للفيديو",
  version: "1.0.0",
  width: 1400,
  height: 900,
  minWidth: 1200,
  minHeight: 700,
};

// إنشاء النافذة الرئيسية
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: APP_CONFIG.width,
    height: APP_CONFIG.height,
    minWidth: APP_CONFIG.minWidth,
    minHeight: APP_CONFIG.minHeight,
    icon: path.join(__dirname, "assets", "icon.png"),
    title: APP_CONFIG.name,
    show: false, // لا تظهر حتى تصبح جاهزة
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false, // للسماح بتحميل الملفات المحلية
    },
    titleBarStyle: "default",
    frame: true,
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
  });

  // تحميل صفحة التحميل أولاً
  mainWindow.loadFile("loading.html");

  // بدء Remotion Studio
  startRemotionStudio();

  // إظهار النافذة عند الانتهاء من التحميل
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // تركيز النافذة
    if (process.platform === "darwin") {
      app.dock.show();
    }
    mainWindow.focus();
  });

  // التعامل مع إغلاق النافذة
  mainWindow.on("closed", () => {
    stopRemotionStudio();
    mainWindow = null;
  });

  // منع إغلاق التطبيق عند إخفاء النافذة على macOS
  mainWindow.on("close", (event) => {
    if (process.platform === "darwin" && !app.isQuittingApp) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // فتح الروابط الخارجية في المتصفح الافتراضي
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // إنشاء القائمة
  createMenu();
}

// بدء تشغيل Remotion Studio
function startRemotionStudio() {
  console.log("🚀 بدء تشغيل Remotion Studio...");

  try {
    // تشغيل Remotion Studio كعملية منفصلة
    remotionProcess = spawn("npm", ["run", "dev"], {
      cwd: __dirname,
      shell: true,
      stdio: "pipe",
    });

    remotionProcess.stdout.on("data", (data) => {
      console.log(`Remotion: ${data}`);

      // البحث عن رسالة الجاهزية
      if (data.toString().includes("Server ready")) {
        setTimeout(() => {
          // تحميل Remotion Studio
          mainWindow.loadURL("http://localhost:3000");
        }, 2000);
      }
    });

    remotionProcess.stderr.on("data", (data) => {
      console.error(`Remotion Error: ${data}`);
    });

    remotionProcess.on("close", (code) => {
      console.log(`Remotion process exited with code ${code}`);
    });
  } catch (error) {
    console.error("فشل في تشغيل Remotion Studio:", error);

    // عرض صفحة خطأ
    mainWindow.loadFile("error.html");
  }
}

// إيقاف Remotion Studio
function stopRemotionStudio() {
  if (remotionProcess) {
    console.log("⏹️ إيقاف Remotion Studio...");
    remotionProcess.kill();
    remotionProcess = null;
  }
}

// إنشاء القائمة الرئيسية
function createMenu() {
  const template = [
    {
      label: "ملف",
      submenu: [
        {
          label: "مشروع جديد",
          accelerator: "Ctrl+N",
          click: () => {
            mainWindow.webContents.send("menu-new-project");
          },
        },
        {
          label: "فتح مشروع",
          accelerator: "Ctrl+O",
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              title: "فتح مشروع",
              filters: [
                { name: "مشاريع الفيديو", extensions: ["json", "remotion"] },
                { name: "جميع الملفات", extensions: ["*"] },
              ],
              properties: ["openFile"],
            });

            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow.webContents.send(
                "menu-open-project",
                result.filePaths[0],
              );
            }
          },
        },
        {
          label: "حفظ",
          accelerator: "Ctrl+S",
          click: () => {
            mainWindow.webContents.send("menu-save-project");
          },
        },
        {
          label: "حفظ باسم",
          accelerator: "Ctrl+Shift+S",
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              title: "حفظ المشروع",
              defaultPath: "مشروع-جديد.json",
              filters: [{ name: "مشاريع الفيديو", extensions: ["json"] }],
            });

            if (!result.canceled) {
              mainWindow.webContents.send(
                "menu-save-project-as",
                result.filePath,
              );
            }
          },
        },
        { type: "separator" },
        {
          label: "تصدير فيديو",
          accelerator: "Ctrl+E",
          click: () => {
            mainWindow.webContents.send("menu-export-video");
          },
        },
        { type: "separator" },
        {
          label: "خروج",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "تحرير",
      submenu: [
        {
          label: "تراجع",
          accelerator: "Ctrl+Z",
          click: () => {
            mainWindow.webContents.send("menu-undo");
          },
        },
        {
          label: "إعادة",
          accelerator: "Ctrl+Y",
          click: () => {
            mainWindow.webContents.send("menu-redo");
          },
        },
        { type: "separator" },
        {
          label: "نسخ",
          accelerator: "Ctrl+C",
          role: "copy",
        },
        {
          label: "لصق",
          accelerator: "Ctrl+V",
          role: "paste",
        },
        {
          label: "قص",
          accelerator: "Ctrl+X",
          role: "cut",
        },
      ],
    },
    {
      label: "عرض",
      submenu: [
        {
          label: "تكبير",
          accelerator: "Ctrl+Plus",
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(currentZoom + 1);
          },
        },
        {
          label: "تصغير",
          accelerator: "Ctrl+-",
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(currentZoom - 1);
          },
        },
        {
          label: "حجم طبيعي",
          accelerator: "Ctrl+0",
          click: () => {
            mainWindow.webContents.setZoomLevel(0);
          },
        },
        { type: "separator" },
        {
          label: "شاشة كاملة",
          accelerator: "F11",
          click: () => {
            const isFullScreen = mainWindow.isFullScreen();
            mainWindow.setFullScreen(!isFullScreen);
          },
        },
        { type: "separator" },
        {
          label: "أدوات المطور",
          accelerator: "F12",
          click: () => {
            mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    },
    {
      label: "أدوات",
      submenu: [
        {
          label: "الذكاء الاصطناعي",
          submenu: [
            {
              label: "مولد المحتوى",
              click: () => {
                mainWindow.webContents.send("menu-ai-content-generator");
              },
            },
            {
              label: "تحسين تلقائي",
              click: () => {
                mainWindow.webContents.send("menu-ai-auto-optimize");
              },
            },
            {
              label: "اقتراحات ذكية",
              click: () => {
                mainWindow.webContents.send("menu-ai-suggestions");
              },
            },
          ],
        },
        {
          label: "مكتبة الأصول",
          click: () => {
            mainWindow.webContents.send("menu-asset-library");
          },
        },
        {
          label: "إعدادات التصدير",
          click: () => {
            mainWindow.webContents.send("menu-export-settings");
          },
        },
        { type: "separator" },
        {
          label: "إعدادات التطبيق",
          accelerator: "Ctrl+,",
          click: () => {
            createSettingsWindow();
          },
        },
      ],
    },
    {
      label: "مساعدة",
      submenu: [
        {
          label: "دليل المستخدم",
          click: () => {
            shell.openExternal("https://docs.smartvideostudio.com");
          },
        },
        {
          label: "اختصارات لوحة المفاتيح",
          click: () => {
            createShortcutsWindow();
          },
        },
        {
          label: "الإبلاغ عن مشكلة",
          click: () => {
            shell.openExternal("https://github.com/smartvideostudio/issues");
          },
        },
        { type: "separator" },
        {
          label: "تحديث التطبيق",
          click: () => {
            checkForUpdates();
          },
        },
        {
          label: "حول التطبيق",
          click: () => {
            createAboutWindow();
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// نافذة الإعدادات
function createSettingsWindow() {
  const settingsWindow = new BrowserWindow({
    width: 600,
    height: 500,
    parent: mainWindow,
    modal: true,
    title: "إعدادات التطبيق",
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  settingsWindow.loadFile("settings.html");
}

// نافذة اختصارات لوحة المفاتيح
function createShortcutsWindow() {
  const shortcutsWindow = new BrowserWindow({
    width: 500,
    height: 600,
    parent: mainWindow,
    modal: true,
    title: "اختصارات لوحة المفاتيح",
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  shortcutsWindow.loadFile("shortcuts.html");
}

// نافذة حول التطبيق
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    width: 400,
    height: 350,
    parent: mainWindow,
    modal: true,
    title: "حول التطبيق",
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  aboutWindow.loadFile("about.html");
}

// فحص التحديثات
function checkForUpdates() {
  dialog.showMessageBox(mainWindow, {
    type: "info",
    title: "فحص التحديثات",
    message: "فحص التحديثات",
    detail:
      "يتم البحث عن تحديثات جديدة...\n\nالإصدار الحالي: v1.0.0\nآخر فحص: " +
      new Date().toLocaleString("ar-SA"),
    buttons: ["موافق"],
  });
}

// التعامل مع أحداث التطبيق
app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

app.on("window-all-closed", () => {
  stopRemotionStudio();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  app.isQuittingApp = true;
  stopRemotionStudio();
});

// التعامل مع رسائل IPC
ipcMain.handle("get-app-info", () => {
  return {
    name: APP_CONFIG.name,
    version: APP_CONFIG.version,
    platform: process.platform,
    arch: process.arch,
    electron: process.versions.electron,
    node: process.versions.node,
    chrome: process.versions.chrome,
  };
});

ipcMain.handle("show-message", (event, options) => {
  return dialog.showMessageBox(mainWindow, options);
});

ipcMain.handle("save-file", async (event, data, fileName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: "حفظ الملف",
    defaultPath: fileName,
    filters: [{ name: "جميع الملفات", extensions: ["*"] }],
  });

  if (!result.canceled) {
    try {
      fs.writeFileSync(result.filePath, data);
      return { success: true, path: result.filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: false, canceled: true };
});

console.log(`🎬 ${APP_CONFIG.name} v${APP_CONFIG.version} - بدء التشغيل...`);

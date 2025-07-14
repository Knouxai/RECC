const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

// الاحتفاظ بمرجع النافذة الرئيسية
let mainWindow;

function createWindow() {
  // إنشاء النافذة الرئيسية
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false, // لدعم تحميل الموارد المحلية
    },
    icon: path.join(__dirname, "icon.png"), // أيقونة التطبيق
    show: false, // لا تظهر حتى تكتمل التهيئة
    titleBarStyle: "default",
    frame: true,
    transparent: false,
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
    focusable: true,
    alwaysOnTop: false,
    fullscreenable: true,
    skipTaskbar: false,
  });

  // تحديد محتوى النافذة
  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startUrl);

  // إظهار النافذة عند اكتمال التحميل
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // التركيز على النافذة
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // تعامل مع إغلاق النافذة
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // منع التنقل إلى مواقع خارجية
  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (
      parsedUrl.origin !== "http://localhost:3000" &&
      !navigationUrl.startsWith("file://")
    ) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // فتح الروابط الخارجية في المتصفح
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // إعداد القائمة
  createMenu();
}

// إنشاء قائمة التطبيق
function createMenu() {
  const template = [
    {
      label: "ملف",
      submenu: [
        {
          label: "جديد",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow.webContents.send("menu-new-project");
          },
        },
        {
          label: "فتح",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ["openFile"],
              filters: [
                {
                  name: "الصور",
                  extensions: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
                },
                {
                  name: "الفيديوهات",
                  extensions: ["mp4", "avi", "mov", "mkv", "webm"],
                },
                { name: "جميع الملفات", extensions: ["*"] },
              ],
            });

            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow.webContents.send(
                "menu-open-file",
                result.filePaths[0],
              );
            }
          },
        },
        {
          label: "حفظ",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            mainWindow.webContents.send("menu-save");
          },
        },
        {
          label: "حفظ باسم",
          accelerator: "CmdOrCtrl+Shift+S",
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              filters: [
                { name: "صور PNG", extensions: ["png"] },
                { name: "صور JPEG", extensions: ["jpg", "jpeg"] },
                { name: "فيديو MP4", extensions: ["mp4"] },
                { name: "جميع الملفات", extensions: ["*"] },
              ],
            });

            if (!result.canceled) {
              mainWindow.webContents.send("menu-save-as", result.filePath);
            }
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
          accelerator: "CmdOrCtrl+Z",
          click: () => {
            mainWindow.webContents.send("menu-undo");
          },
        },
        {
          label: "إعادة",
          accelerator: "CmdOrCtrl+Y",
          click: () => {
            mainWindow.webContents.send("menu-redo");
          },
        },
        { type: "separator" },
        {
          label: "نسخ",
          accelerator: "CmdOrCtrl+C",
          role: "copy",
        },
        {
          label: "لصق",
          accelerator: "CmdOrCtrl+V",
          role: "paste",
        },
      ],
    },
    {
      label: "عرض",
      submenu: [
        {
          label: "إعادة تحميل",
          accelerator: "CmdOrCtrl+R",
          click: () => {
            mainWindow.reload();
          },
        },
        {
          label: "تبديل أدوات المطور",
          accelerator:
            process.platform === "darwin" ? "Alt+Cmd+I" : "Ctrl+Shift+I",
          click: () => {
            mainWindow.webContents.toggleDevTools();
          },
        },
        { type: "separator" },
        {
          label: "تكبير الفعلي",
          accelerator: "CmdOrCtrl+0",
          click: () => {
            mainWindow.webContents.setZoomLevel(0);
          },
        },
        {
          label: "تكبير",
          accelerator: "CmdOrCtrl+Plus",
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(currentZoom + 1);
          },
        },
        {
          label: "تصغير",
          accelerator: "CmdOrCtrl+-",
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(currentZoom - 1);
          },
        },
        { type: "separator" },
        {
          label: "ملء الشاشة",
          accelerator: process.platform === "darwin" ? "Ctrl+Cmd+F" : "F11",
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          },
        },
      ],
    },
    {
      label: "نافذة",
      submenu: [
        {
          label: "تصغير",
          accelerator: "CmdOrCtrl+M",
          role: "minimize",
        },
        {
          label: "إغلاق",
          accelerator: "CmdOrCtrl+W",
          role: "close",
        },
      ],
    },
    {
      label: "مساعدة",
      submenu: [
        {
          label: "حول المعالج الذكي للوسائط",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "حول التطبيق",
              message: "المعالج الذكي للوسائط",
              detail:
                "تطبيق متقدم لمعالجة الصور والفيديوهات بالذكاء الاصطناعي\n\nالإصدار: 1.0.0\nمطور بواسطة: فريق التطوير\nالبريد الإلكتروني: knouxio@zohomail.com",
              buttons: ["موافق"],
            });
          },
        },
        {
          label: "تقرير مشكلة",
          click: () => {
            shell.openExternal(
              "mailto:knouxio@zohomail.com?subject=تقرير مشكلة - المعالج الذكي للوسائط",
            );
          },
        },
        { type: "separator" },
        {
          label: "زيارة الموقع",
          click: () => {
            shell.openExternal("https://github.com");
          },
        },
      ],
    },
  ];

  // تعديل القائمة لنظام macOS
  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: "حول " + app.getName(),
          role: "about",
        },
        { type: "separator" },
        {
          label: "الخدمات",
          role: "services",
          submenu: [],
        },
        { type: "separator" },
        {
          label: "إخفاء " + app.getName(),
          accelerator: "Command+H",
          role: "hide",
        },
        {
          label: "إخفاء الآخرين",
          accelerator: "Command+Shift+H",
          role: "hideothers",
        },
        {
          label: "إظهار الكل",
          role: "unhide",
        },
        { type: "separator" },
        {
          label: "خروج",
          accelerator: "Command+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// تطبيق جاهز
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // في macOS إنشاء نافذة جديدة عند النقر على أيقونة الدوك
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// إغلاق التطبيق عند إغلاق جميع النوافذ
app.on("window-all-closed", () => {
  // في macOS التطبيقات تبقى نشطة حتى مع إغلاق جميع النوافذ
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// منع إنشاء نوافذ متعددة
app.on("second-instance", () => {
  // شخص حاول تشغيل instance ثاني، التركيز على النافذة الموجودة
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// منع تشغيل نسخ متعددة
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // شخص حاول تشغيل instance ثاني
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// تعامل مع الأخطاء
process.on("uncaughtException", (error) => {
  console.error("خطأ غير معالج:", error);
});

// منع حفظ حالة النافذة
app.on("before-quit", () => {
  // تنظيف الموارد قبل الإغلاق
});

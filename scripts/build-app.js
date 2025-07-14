#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("🚀 بدء عملية بناء التطبيق...\n");

// التحقق من وجود الملفات المطلوبة
function checkRequiredFiles() {
  console.log("📋 التحقق من الملفات المطلوبة...");

  const requiredFiles = ["public/electron.js", "package.json", "src"];

  const missingFiles = requiredFiles.filter((file) => {
    const fullPath = path.join(process.cwd(), file);
    return !fs.existsSync(fullPath);
  });

  if (missingFiles.length > 0) {
    console.error("❌ ملفات مفقودة:", missingFiles.join(", "));
    process.exit(1);
  }

  console.log("✅ جميع الم��فات المطلوبة موجودة\n");
}

// تنظيف مجلدات البناء السابقة
function cleanBuildDirs() {
  console.log("🧹 تنظيف مجلدات البناء السابقة...");

  const dirsToClean = ["dist", "release", "build/dist"];

  dirsToClean.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`   ✅ تم حذف ${dir}`);
      } catch (error) {
        console.warn(`   ⚠️  لم يتم حذف ${dir}: ${error.message}`);
      }
    }
  });

  console.log("✅ تم تنظيف مجلدات البناء\n");
}

// بناء تطبيق الويب
function buildWeb() {
  console.log("🌐 بناء تطبيق الويب...");
  try {
    execSync("pnpm run web-build", { stdio: "inherit" });
    console.log("✅ تم بناء تطبيق الويب بنجاح\n");
  } catch (error) {
    console.error("❌ فشل في بناء تطبيق الويب:", error.message);
    process.exit(1);
  }
}

// بناء تطبيق Electron
function buildElectron() {
  console.log("⚡ بناء تطبيق Electron...");
  try {
    execSync("pnpm run electron-pack", { stdio: "inherit" });
    console.log("✅ تم بناء تطبيق Electron بنجاح\n");
  } catch (error) {
    console.error("❌ فشل في بناء تطبيق Electron:", error.message);
    process.exit(1);
  }
}

// عرض معلومات الملفات المُنتجة
function showBuildInfo() {
  console.log("📊 معلومات البناء:");
  console.log("=".repeat(50));

  const releaseDir = path.join(process.cwd(), "release");

  if (fs.existsSync(releaseDir)) {
    const files = fs.readdirSync(releaseDir);

    files.forEach((file) => {
      const filePath = path.join(releaseDir, file);
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      console.log(`📦 ${file}`);
      console.log(`   الحجم: ${sizeMB} MB`);
      console.log(`   التاريخ: ${stats.mtime.toLocaleDateString("ar-SA")}`);
      console.log("");
    });
  } else {
    console.log("⚠️  مجلد release غير موجود");
  }
}

// تشغيل عملية البناء الكاملة
async function main() {
  try {
    const startTime = Date.now();

    checkRequiredFiles();
    cleanBuildDirs();
    buildWeb();
    buildElectron();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("���� تم إنهاء عملية البناء بنجاح!");
    console.log(`⏱️  الوقت المستغرق: ${duration} ثانية\n`);

    showBuildInfo();

    console.log("📋 الخطوات التالية:");
    console.log("1. انتقل إلى مجلد release/");
    console.log("2. ستجد ملف المثبت (.exe) جاهز للتوزيع");
    console.log("3. يمكنك تشغيله على أي جهاز Windows لتثبيت التطبيق");
  } catch (error) {
    console.error("❌ حدث خطأ في عملية البناء:", error.message);
    process.exit(1);
  }
}

// معالجة الإشارات
process.on("SIGINT", () => {
  console.log("\n⏹️  تم إيقاف عملية البناء بواسطة المستخدم");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n⏹️  تم إنهاء عملية البناء");
  process.exit(0);
});

// تشغيل السكريبت
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkRequiredFiles,
  cleanBuildDirs,
  buildWeb,
  buildElectron,
};

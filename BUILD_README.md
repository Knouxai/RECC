# 📦 دليل بناء وتصدير التطبيق

## المعالج الذكي للوسائط - Smart Media Processor

تطبيق سطح مكتب متقدم لمعالجة الصور والفيديوهات بالذكاء الاصطناعي

---

## 🚀 البناء السريع

```bash
# بناء التطبيق وإنشاء ملف المثبت
pnpm run package-exe
```

---

## 📋 الخطوات التفصيلية

### 1. التأكد من المتطلبات

```bash
# التأكد من تثبيت Node.js (16+ مطلوب)
node --version

# التأكد من تثبيت pnpm
pnpm --version

# تثبيت الحزم إذا لم تكن مثبتة
pnpm install
```

### 2. تطوير التطبيق

```bash
# تشغيل التطبيق في وضع التطوير (ويب)
pnpm dev

# تشغيل التطبيق في وضع Electron للتطوير
pnpm run electron-dev
```

### 3. بناء التطبيق للإنتاج

```bash
# بناء تطبيق الويب فقط
pnpm run web-build

# بناء تطبيق Electron (بدون تطبيق الويب)
pnpm run electron-pack

# بناء كامل (ويب + electron)
pnpm run electron-dist
```

### 4. إنشاء ملف المثبت النهائي

```bash
# استخدام السكريبت المخصص (مُستحسن)
pnpm run build-app

# أو
pnpm run package-exe
```

---

## 📁 هيكل الملفات المُنتجة

```
release/
├── المعالج الذكي للوسائط-Setup-1.0.0.exe    # مثبت Windows
├── win-unpacked/                              # ملفات التطبيق المفكوكة
└── builder-debug.yml                          # ملف التشخيص

dist/                                          # تطبيق الويب المبني
├── index.html
├── bundle.js
└── assets/
```

---

## 🎯 أنواع البناء المدعومة

| المنصة  | التنسيق        | الملف المُنتج   |
| ------- | -------------- | --------------- |
| Windows | NSIS Installer | `*.exe`         |
| Windows | Portable       | `win-unpacked/` |
| macOS   | DMG            | `*.dmg`         |
| Linux   | AppImage       | `*.AppImage`    |

---

## ⚙️ خيارات التخصيص

### تغيير معلومات التطبيق

عدّل في `package.json`:

```json
{
  "name": "smart-media-processor",
  "productName": "المعالج الذكي للوسائط",
  "version": "1.0.0",
  "description": "تطبيق متقدم لمعالجة الصور والفيديوهات...",
  "author": {
    "name": "فريق التطوير",
    "email": "knouxio@zohomail.com"
  }
}
```

### تخصيص المثبت

عدّل في `package.json` > `build` > `nsis`:

```json
{
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "المعالج الذكي للوسائط"
  }
}
```

---

## 🔧 حل المشاكل الشائعة

### مشكلة: فشل في البناء

```bash
# تنظيف الحزم وإعادة التثبيت
rm -rf node_modules pnpm-lock.yaml
pnpm install

# تنظيف مجلدات البناء
rm -rf dist release build/dist
```

### مشكلة: الأيقونة لا تظهر

1. تأكد من وجود ملفات الأيقونة:

   - `public/icon.png` (256x256)
   - `public/icon.ico` (متعدد الأ��جام)

2. استخدم أدوات التحويل:
   - [IcoConvert](https://icoconvert.com/)
   - [CloudConvert](https://cloudconvert.com/)

### مشكلة: المثبت لا يعمل

1. تشغيل كمشرف (Run as Administrator)
2. التأكد من تعطيل مكافح الفيروسات مؤقتاً
3. فحص ملف `builder-debug.yml` للأخطاء

---

## 📊 تفاصيل البناء

### الملفات المضمنة في التطبيق

- `dist/**/*` - ملفات تطبيق الويب
- `node_modules/**/*` - حزم Node.js المطلوبة
- `public/electron.js` - العملية الرئيسية لـ Electron
- `public/icon.*` - أيقونات التطبيق

### المعمارات المدعومة

- **Windows**: x64, ia32 (32-bit)
- **macOS**: x64 (Intel), arm64 (Apple Silicon)
- **Linux**: x64

---

## 🔒 الأمان

- التطبيق يعمل في sandbox آمن
- لا يتطلب صلاحيات مشرف للتشغيل
- جميع الملفات موقعة رقمياً (في النسخة النهائية)

---

## 📞 الدعم

للمساعدة أو الإبلاغ عن مشاكل:

- **البريد الإلكتروني**: knouxio@zohomail.com
- **المشاكل**: افتح issue في المستودع

---

## 📝 ملاحظات مهمة

1. **الأيقونات**: أضف ملفات الأيقونات قبل البناء النهائي
2. **الشهادات**: في النسخة التجارية، ستحتاج شهادة توقيع رقمي
3. **الحجم**: الملف النهائي سيكون حوالي 150-200 MB
4. **المتطلبات**: يتطلب Windows 10+ لأفضل أداء

---

## 🏆 النتيجة النهائية

بعد تشغيل `pnpm run package-exe` بنجاح، ستحصل على:

✅ ملف مثبت `.exe` جاهز للتوزيع  
✅ يعمل على جميع أجهزة Windows  
✅ تثبيت سهل مع واجهة عربية  
✅ اختصارات تلقائية على سطح المكتب وقائمة ابدأ  
✅ إمكانية إلغاء التثبيت من لوحة التحكم

**🎉 التطبيق جاهز للتوزيع كتطبيق سطح مكتب محترف!**

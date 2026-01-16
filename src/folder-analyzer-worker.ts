import fs from 'fs';
import path from 'path';

// Simulate folder analysis
async function analyzeFolder(folderPath: string): Promise<void> {
  console.log('[Worker] Started');
  
  // Check if folder exists
  if (!fs.existsSync(folderPath)) {
    console.error(`[Worker] Folder does not exist: ${folderPath}`);
    process.exit(1);
  }

  console.log(`[Worker] Scanning folder: ${folderPath}`);
  
  const startTime = Date.now();
  let fileCount = 0;
  let totalSize = 0;
  const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.mp4', '.avi', '.mov', '.mkv', '.webm', '.wmv', '.flv'];
  const mediaFiles: string[] = [];
  
  // Recursively scan folder
  async function scanDirectory(dirPath: string, depth: number = 0): Promise<void> {
    if (depth > 5) return; // Prevent too deep recursion
    
    const items = fs.readdirSync(dirPath);
    const totalItems = items.length;
    
    for (let i = 0; i < items.length; i++) {
      const itemName = items[i];
      const itemPath = path.join(dirPath, itemName);
      
      try {
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          console.log(`[Worker] Analyzing subfolder: ${itemPath}`);
          await scanDirectory(itemPath, depth + 1);
        } else if (stats.isFile()) {
          fileCount++;
          totalSize += stats.size;
          
          // Check if it's a media file
          const ext = path.extname(itemName).toLowerCase();
          if (mediaExtensions.includes(ext)) {
            mediaFiles.push(itemPath);
          }
          
          // Report progress every 10 files
          if (fileCount % 10 === 0) {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(95, Math.floor((fileCount / Math.max(totalItems * 3, 100)) * 100));
            console.log(`[Worker] Progress: ${progress}% - Processed ${fileCount} files`);
          }
        }
      } catch (err) {
        console.warn(`[Worker] Could not access: ${itemPath}`, err);
      }
    }
  }
  
  await scanDirectory(folderPath);
  
  // Final progress update
  console.log(`[Worker] Progress: 100% - Completed analysis`);
  console.log(`[Worker] Found ${fileCount} files (${(totalSize / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`[Worker] Found ${mediaFiles.length} media files`);
  
  // Output results
  console.log(JSON.stringify({
    totalFiles: fileCount,
    totalSize: totalSize,
    mediaFiles: mediaFiles,
    elapsedTime: Date.now() - startTime
  }));
}

// Get folder path from command line arguments
const folderPath = process.argv[2];

if (!folderPath) {
  console.error('[Worker] No folder path provided');
  process.exit(1);
}

// Run analysis
analyzeFolder(folderPath).catch(err => {
  console.error('[Worker] Error:', err);
  process.exit(1);
});
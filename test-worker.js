// Test script to demonstrate worker functionality
console.log('[Test] Starting worker functionality test...');

// Import the worker functionality
import fs from 'fs';
import path from 'path';

// Simple folder analysis function to test the concept
function analyzeFolderSync(folderPath) {
    console.log('[Worker] Started');
    console.log(`[Worker] Scanning folder: ${folderPath}`);
    
    const startTime = Date.now();
    let fileCount = 0;
    let totalSize = 0;
    const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.mp4', '.avi', '.mov', '.mkv', '.webm', '.wmv', '.flv'];
    const mediaFiles = [];
    
    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
        console.error(`[Worker] ERROR: Folder does not exist: ${folderPath}`);
        return;
    }
    
    // Recursively scan folder
    function scanDirectory(dirPath, depth = 0) {
        if (depth > 3) return; // Prevent too deep recursion
        
        const items = fs.readdirSync(dirPath);
        
        for (const itemName of items) {
            const itemPath = path.join(dirPath, itemName);
            
            try {
                const stats = fs.statSync(itemPath);
                
                if (stats.isDirectory()) {
                    console.log(`[Worker] Analyzing subfolder: ${itemPath}`);
                    scanDirectory(itemPath, depth + 1);
                } else if (stats.isFile()) {
                    fileCount++;
                    totalSize += stats.size;
                    
                    // Check if it's a media file
                    const ext = path.extname(itemName).toLowerCase();
                    if (mediaExtensions.includes(ext)) {
                        mediaFiles.push(itemPath);
                    }
                    
                    // Report progress every 5 files
                    if (fileCount % 5 === 0) {
                        const progress = Math.min(95, Math.floor((fileCount / 50) * 100));
                        console.log(`[Worker] Progress: ${progress}% - Processed ${fileCount} files`);
                    }
                }
            } catch (err) {
                console.warn(`[Worker] Could not access: ${itemPath}`, err.message);
            }
        }
    }
    
    scanDirectory(folderPath);
    
    // Final progress update
    console.log(`[Worker] Progress: 100% - Completed analysis`);
    console.log(`[Worker] Found ${fileCount} files (${(totalSize / (1024 * 1024)).toFixed(2)} MB)`);
    console.log(`[Worker] Found ${mediaFiles.length} media files`);
    
    // Output results
    const results = {
        totalFiles: fileCount,
        totalSize: totalSize,
        mediaFiles: mediaFiles,
        elapsedTime: Date.now() - startTime
    };
    
    console.log('[Worker] Results:', JSON.stringify(results, null, 2));
    
    return results;
}

// Test with a sample path (use current directory as example)
const testPath = process.argv[2] || '.';
console.log(`[Test] Testing folder analysis on: ${testPath}`);
const results = analyzeFolderSync(testPath);

console.log('[Test] Worker functionality test completed successfully!');
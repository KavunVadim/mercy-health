import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const INPUT_DIR = path.join(ROOT, 'public/images/_raw');
const IMAGES_BASE = path.join(ROOT, 'public/images');
const PROCESSED_BASE = path.join(ROOT, 'public/images/_processed_originals');

async function processDirectory(currentDir, relativePath = '') {
  const items = await fs.readdir(currentDir, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(currentDir, item.name);
    const itemRelativePath = path.join(relativePath, item.name);

    if (item.isDirectory()) {
      // Skip the base directories to avoid infinite loops
      if (item.name === 'processed' || item.name === '_processed_originals' || item.name === '_raw') continue;
      
      await processDirectory(itemPath, itemRelativePath);
    } else if (/\.(jpe?g|png|tiff|webp|avif)$/i.test(item.name)) {
      const filename = path.parse(item.name).name.toLowerCase().replace(/\s+/g, '-');
      
      // Determine target path. 
      // If the image is directly in _raw, we put it in gallery/ by default.
      // Otherwise, we follow the folder structure.
      let targetBase = IMAGES_BASE;
      let finalRelativePath = relativePath;
      
      if (relativePath === '') {
        // No subfolder? Put it in gallery by default
        finalRelativePath = 'gallery';
      }

      const targetSubDir = path.join(targetBase, finalRelativePath);
      const processedSubDir = path.join(PROCESSED_BASE, relativePath || 'root');
      const outputPath = path.join(targetSubDir, `${filename}.webp`);
      const processedPath = path.join(processedSubDir, item.name);

      // Ensure target directories exist
      await fs.mkdir(targetSubDir, { recursive: true });
      await fs.mkdir(processedSubDir, { recursive: true });

      console.log(`📸 Processing: ${itemRelativePath}...`);

      try {
        await sharp(itemPath)
          .resize(1920, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: 80, effort: 4 })
          .toFile(outputPath);

        // Move original to processed folder
        await fs.rename(itemPath, processedPath);
        console.log(`✅ Saved to public/images/${path.join(finalRelativePath, filename)}.webp`);
      } catch (err) {
        console.error(`❌ Failed to process ${item.name}:`, err.message);
      }
    }
  }
}

async function optimizeImages() {
  try {
    // Ensure base directories exist
    await fs.mkdir(INPUT_DIR, { recursive: true });
    await fs.mkdir(PROCESSED_BASE, { recursive: true });

    console.log(`🚀 Starting multi-category optimization...`);
    await processDirectory(INPUT_DIR);

    console.log('\n✨ All images processed successfully!');
    console.log(`📍 Originals moved to: public/images/_processed_originals`);
    console.log(`📍 Optimized files updated in their respective folders in public/images/`);

  } catch (error) {
    console.error('❌ Critical Error:', error);
  }
}

optimizeImages();

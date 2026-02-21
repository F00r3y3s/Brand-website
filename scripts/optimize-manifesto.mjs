import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputDir = 'public/menifesto-video';
const outputDir = 'public/menifesto-video-optimized';

async function optimizeImages() {
    try {
        await fs.mkdir(outputDir, { recursive: true });
        const files = await fs.readdir(inputDir);
        const pngFiles = files.filter(f => f.endsWith('.png'));

        console.log(`Found ${pngFiles.length} frames. Starting optimization...`);

        for (const file of pngFiles) {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, file.replace('.png', '.webp'));

            await sharp(inputPath)
                .resize(1280, 720, { fit: 'inside' })
                .webp({ quality: 75 })
                .toFile(outputPath);

            console.log(`Optimized: ${file}`);
        }

        console.log('Optimization complete. Move files to original folder manually or update code.');
    } catch (err) {
        console.error('Error during optimization:', err);
    }
}

optimizeImages();

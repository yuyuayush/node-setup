import { parentPort, workerData } from 'worker_threads';
import sharp from 'sharp';

async function processImages() {
    const { buffer } = workerData;

    try {
        const [mobile, laptop, desktop] = await Promise.all([
            // Mobile: 300px
            sharp(buffer)
                .resize(300, 300, { fit: 'cover' })
                .webp({ quality: 80 })
                .toBuffer(),
            
            // Laptop: 720px
            sharp(buffer)
                .resize(720, 720, { fit: 'cover' })
                .webp({ quality: 80 })
                .toBuffer(),
            
            // Desktop: 1200px
            sharp(buffer)
                .resize(1200, 1200, { fit: 'cover' })
                .webp({ quality: 80 })
                .toBuffer()
        ]);

        parentPort.postMessage({
            success: true,
            results: {
                mobile,
                laptop,
                desktop
            }
        });
    } catch (error) {
        parentPort.postMessage({
            success: false,
            error: error.message
        });
    }
}

processImages();

/**
 * RASS HAUTE JOAILLERIE — CLIENT-SIDE IMAGE OPTIMIZER
 * 
 * Automatically compresses, downscales, and optimizes user-uploaded images
 * to crisp WebP/JPEG formats suitable for fast storefront loading and safe
 * localStorage persistence (well under the 5MB browser quota).
 */

export interface OptimizedImageResult {
  dataUrl: string;
  originalSizeBytes: number;
  optimizedSizeBytes: number;
  originalSizeFormatted: string;
  optimizedSizeFormatted: string;
  reductionPercent: number;
  width: number;
  height: number;
  format: 'image/webp' | 'image/jpeg';
}

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.82)
  targetMaxBytes?: number; // Target max size (default 250KB)
}

/**
 * Format raw byte count into human-readable string (KB, MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Optimize and compress an uploaded image File using HTML Canvas
 */
export async function optimizeImageFile(
  file: File,
  options: OptimizeOptions = {}
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
    targetMaxBytes = 250 * 1024, // 250 KB target
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to decode image. Please ensure file is a valid image (PNG, JPG, WebP).'));
      };

      img.onload = () => {
        try {
          let origWidth = img.naturalWidth || img.width;
          let origHeight = img.naturalHeight || img.height;

          if (!origWidth || !origHeight) {
            origWidth = 800;
            origHeight = 800;
          }

          // Compute bounded dimensions preserving aspect ratio
          let targetWidth = origWidth;
          let targetHeight = origHeight;

          if (targetWidth > maxWidth || targetHeight > maxHeight) {
            const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
            targetWidth = Math.round(targetWidth * ratio);
            targetHeight = Math.round(targetHeight * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            // Fallback to raw data url if canvas 2D context is unavailable
            const rawUrl = reader.result as string;
            resolve({
              dataUrl: rawUrl,
              originalSizeBytes: file.size,
              optimizedSizeBytes: file.size,
              originalSizeFormatted: formatBytes(file.size),
              optimizedSizeFormatted: formatBytes(file.size),
              reductionPercent: 0,
              width: origWidth,
              height: origHeight,
              format: 'image/jpeg',
            });
            return;
          }

          // High quality bicubic downsampling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Clear & draw image
          ctx.clearRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Test WebP support with fallback to JPEG
          let format: 'image/webp' | 'image/jpeg' = 'image/webp';
          let outputDataUrl = canvas.toDataURL(format, quality);

          // If browser doesn't support WebP or returned PNG fallback (starts with data:image/png)
          if (!outputDataUrl.startsWith('data:image/webp')) {
            format = 'image/jpeg';
            outputDataUrl = canvas.toDataURL(format, quality);
          }

          // Estimate byte size from base64 string
          let estimatedBytes = Math.round((outputDataUrl.length * 3) / 4);

          // If still over targetMaxBytes, perform secondary pass with reduced dimensions and quality
          if (estimatedBytes > targetMaxBytes && (targetWidth > 800 || targetHeight > 800)) {
            const secondaryRatio = 0.8;
            canvas.width = Math.round(targetWidth * secondaryRatio);
            canvas.height = Math.round(targetHeight * secondaryRatio);
            const secCtx = canvas.getContext('2d');
            if (secCtx) {
              secCtx.imageSmoothingEnabled = true;
              secCtx.imageSmoothingQuality = 'high';
              secCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
              outputDataUrl = canvas.toDataURL(format, Math.max(0.68, quality - 0.12));
              estimatedBytes = Math.round((outputDataUrl.length * 3) / 4);
              targetWidth = canvas.width;
              targetHeight = canvas.height;
            }
          }

          const reduction = file.size > 0 
            ? Math.max(0, Math.round(((file.size - estimatedBytes) / file.size) * 100))
            : 0;

          resolve({
            dataUrl: outputDataUrl,
            originalSizeBytes: file.size,
            optimizedSizeBytes: estimatedBytes,
            originalSizeFormatted: formatBytes(file.size),
            optimizedSizeFormatted: formatBytes(estimatedBytes),
            reductionPercent: reduction,
            width: targetWidth,
            height: targetHeight,
            format,
          });
        } catch (err: any) {
          reject(new Error(err?.message || 'Error processing image canvas'));
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validate that an image URL can be loaded successfully by the browser
 */
export async function validateImageUrl(url: string, timeoutMs = 5000): Promise<boolean> {
  if (!url || !url.trim()) return false;
  const trimmed = url.trim();

  // Data URLs are already loaded locally
  if (trimmed.startsWith('data:image/')) return true;

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(false);
    }, timeoutMs);

    const testImg = new Image();
    testImg.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };
    testImg.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };
    testImg.src = trimmed;
  });
}

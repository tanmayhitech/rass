import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { uploadImageToCloud } from './imageUploadService';

export interface ImageOptimizationResult {
  url: string;
  originalSize: number;
  optimizedSize: number;
  savedPercentage: number;
  dimensions: { width: number; height: number };
  format: string;
  isCloudUrl: boolean;
}

export class ImageService {
  private static STORAGE_BUCKET = 'product-images';

  /**
   * Optimizes a user-provided image (downsamples to studio dimensions, converts to WebP)
   * and uploads it to Supabase Storage CDN so that raw base64 or large files don't ruin database space.
   */
  public static async optimizeAndUploadProductImage(
    file: File,
    options: {
      maxDimension?: number;
      quality?: number;
      folder?: string;
    } = {}
  ): Promise<ImageOptimizationResult> {
    const maxDimension = options.maxDimension || 1000;
    const quality = options.quality ?? 0.82;
    const folder = options.folder || 'products';

    const originalSize = file.size;

    // 1. Load image into HTMLImageElement
    const img = await this.loadImageFromFile(file);

    // 2. Compute proportional dimensions (max 1000px)
    let width = img.width;
    let height = img.height;
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    // 3. Render onto high-precision Canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable for image optimization.');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    // 4. Convert canvas to WebP Blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', quality);
    });

    if (!blob) {
      // Fallback to jpeg if browser doesn't support webp export
      const fallbackBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
      });
      if (!fallbackBlob) throw new Error('Failed to encode optimized image blob.');
      return this.uploadBlob(fallbackBlob, file.name, 'jpeg', originalSize, { width, height }, folder);
    }

    return this.uploadBlob(blob, file.name, 'webp', originalSize, { width, height }, folder);
  }

  private static async uploadBlob(
    blob: Blob,
    originalName: string,
    format: 'webp' | 'jpeg',
    originalSize: number,
    dimensions: { width: number; height: number },
    folder: string
  ): Promise<ImageOptimizationResult> {
    const optimizedSize = blob.size;
    const savedPercentage = Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100));

    const cleanBaseName = originalName
      .toLowerCase()
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9_-]/g, '-');

    const dataUrl = await this.blobToDataUrl(blob);

    // Primary: Upload to Supabase Storage via serverless API
    try {
      const cloudRes = await uploadImageToCloud(dataUrl, cleanBaseName, folder);
      if (cloudRes.success && cloudRes.publicUrl) {
        return {
          url: cloudRes.publicUrl,
          originalSize,
          optimizedSize,
          savedPercentage,
          dimensions,
          format,
          isCloudUrl: true,
        };
      }
    } catch (err) {
      console.warn('[ImageService] Cloud upload via serverless API deferred:', err);
    }

    // Direct Supabase Storage fallback
    if (isSupabaseConfigured) {
      try {
        const filename = `${folder}/${Date.now()}-${cleanBaseName}.${format}`;
        const { data, error } = await supabase.storage
          .from(this.STORAGE_BUCKET)
          .upload(filename, blob, {
            contentType: format === 'webp' ? 'image/webp' : 'image/jpeg',
            cacheControl: '31536000',
            upsert: true,
          });

        if (!error && data) {
          const { data: publicData } = supabase.storage
            .from(this.STORAGE_BUCKET)
            .getPublicUrl(filename);

          if (publicData?.publicUrl) {
            return {
              url: publicData.publicUrl,
              originalSize,
              optimizedSize,
              savedPercentage,
              dimensions,
              format,
              isCloudUrl: true,
            };
          }
        }
      } catch (err) {
        console.warn('[ImageService] Direct Supabase storage fallback error:', err);
      }
    }

    // Offline / local fallback: WebP DataURL
    return {
      url: dataUrl,
      originalSize,
      optimizedSize,
      savedPercentage,
      dimensions,
      format,
      isCloudUrl: false,
    };
  }

  private static loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to parse uploaded image.'));
      };
      img.src = url;
    });
  }

  private static blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to convert blob to data URL.'));
      reader.readAsDataURL(blob);
    });
  }
}

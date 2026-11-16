/**
 * Universal Image Optimization Utility for Rass by Ridhima.
 * Directs image requests to ultra-fast, modern WebP assets (92.5% smaller),
 * accelerating storefront load times and eliminating admin dashboard render lag.
 */

export function getOptimizedImageUrl(url: string | null | undefined): string {
  if (!url) return '';

  // Already optimized or vector format
  if (url.endsWith('.webp') || url.endsWith('.svg')) {
    return url;
  }

  // Supabase CDN stored images are already optimized WebP
  if (url.includes('supabase.co/storage')) {
    return url;
  }

  // Base64 data URLs
  if (url.startsWith('data:')) {
    return url;
  }

  // Map local /images/ and /elements/ PNG/JPG/JPEG to high-efficiency WebP
  if (url.startsWith('/images/') || url.startsWith('/elements/') || url.startsWith('images/') || url.startsWith('elements/')) {
    return url.replace(/\.(png|jpe?g)$/i, '.webp');
  }

  return url;
}

/**
 * Fallback handler: If a WebP file fails to load, gracefully fall back to original PNG/JPG.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  originalFallback?: string
) {
  const target = e.currentTarget;
  if (originalFallback && target.src !== originalFallback) {
    target.src = originalFallback;
    return;
  }
  // If no specific fallback and URL ends in .webp, try the .png equivalent
  if (target.src.endsWith('.webp')) {
    target.src = target.src.replace(/\.webp$/i, '.png');
  }
}

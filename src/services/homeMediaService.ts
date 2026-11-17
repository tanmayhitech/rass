import { ProductCategory } from '../types';
import { uploadImageToCloud } from './imageUploadService';

export interface HomeMediaItem {
  id: string;
  title: string;
  subtitle?: string;
  section: 'category' | 'editorial';
  categoryKey?: ProductCategory;
  column?: 1 | 2 | 3;
  order: number;
  heightClass: string;
  currentImage: string;
  defaultImage: string;
  cleanImage?: string;
  altText: string;
  isVisible: boolean;
  isCustom?: boolean;
  lastUpdated?: string;
}

const STORAGE_KEY = 'rass_home_media_v26';
const CLOUD_CONFIG_URL = 'https://ukgjkmjhhxtaedxyhaeu.supabase.co/storage/v1/object/public/product-images/home-media-config.json';

export const INITIAL_HOME_MEDIA: HomeMediaItem[] = [
  // --- COLUMN 1 (Left Column) ---
  // Slot 1 (Top) → 1. Jhumka (Minimal Solid Background Text Card)
  {
    id: 'cat-jhumka',
    title: 'JHUMKA',
    subtitle: 'Mughal Bell Dome Drops',
    section: 'category',
    categoryKey: 'jhumka',
    column: 1,
    order: 1,
    heightClass: 'aspect-[1/1]',
    defaultImage: '/images/card_text_jhumka.png',
    cleanImage: '/images/card_text_jhumka.png',
    currentImage: '/images/card_text_jhumka.png',
    altText: 'Jhumka handcrafted bell dome drops text card',
    isVisible: true,
    isCustom: false,
  },
  // Slot 4 (Middle) → 4. Western Jewellery
  {
    id: 'cat-western',
    title: 'WESTERN JEWELLERY',
    subtitle: 'Contemporary Fusion Drops',
    section: 'category',
    categoryKey: 'western',
    column: 1,
    order: 2,
    heightClass: 'aspect-[1/1.14]',
    defaultImage: '/images/cat_western.png',
    cleanImage: '/images/cat_western.png',
    currentImage: '/images/cat_western.png',
    altText: 'Contemporary western jewellery ruby bee pendant necklace in blooming studio',
    isVisible: true,
    isCustom: false,
  },
  // Slot 7 (Bottom) → 7. Earrings (Under Western Jewellery)
  {
    id: 'cat-earrings',
    title: 'EARRINGS',
    subtitle: 'Chandbalis & Kundan Drops',
    section: 'category',
    categoryKey: 'earrings',
    column: 1,
    order: 3,
    heightClass: 'aspect-[1/1.10]',
    defaultImage: '/images/Pastel Tribal Silver Jhumka Earrings.png',
    cleanImage: '/images/Pastel Tribal Silver Jhumka Earrings.png',
    currentImage: '/images/Pastel Tribal Silver Jhumka Earrings.png',
    altText: 'Pastel Tribal Silver Jhumka Earrings with delicate enamel drops and filigree bell domes',
    isVisible: true,
    isCustom: false,
  },

  // --- COLUMN 2 (Center Column) ---
  // Slot 2 (Top) → 2. Necklaces
  {
    id: 'cat-necklaces',
    title: 'NECKLACES',
    subtitle: 'Royal Chokers & Layered Rani Haars',
    section: 'category',
    categoryKey: 'necklaces',
    column: 2,
    order: 1,
    heightClass: 'aspect-[1/1.30]',
    defaultImage: '/images/cat_silver_choker.png',
    cleanImage: '/images/cat_silver_choker.png',
    currentImage: '/images/cat_silver_choker.png',
    altText: 'Ornate silver choker necklace on velvet bust with filigree drops',
    isVisible: true,
    isCustom: false,
  },
  // Slot 5 (Middle) → 5. Kadas (Minimal Solid Background Text Card in Hindi)
  {
    id: 'cat-kadas',
    title: 'KADAS',
    subtitle: 'Statement Wrist Cuffs',
    section: 'category',
    categoryKey: 'kadas',
    column: 2,
    order: 2,
    heightClass: 'aspect-[1/1.24]',
    defaultImage: '/images/card_text_kadas.png',
    cleanImage: '/images/card_text_kadas.png',
    currentImage: '/images/card_text_kadas.png',
    altText: 'कड़ा royal kada cuff bangles text card',
    isVisible: true,
    isCustom: false,
  },
  // Slot 8 (Bottom) → 8. Toran
  {
    id: 'cat-toran',
    title: 'TORAN',
    subtitle: 'Festive Door Hangings',
    section: 'category',
    categoryKey: 'toran',
    column: 2,
    order: 3,
    heightClass: 'aspect-[1/0.82]',
    defaultImage: '/images/cat_toran_mauve.png',
    cleanImage: '/images/cat_toran_mauve.png',
    currentImage: '/images/cat_toran_mauve.png',
    altText: 'Elegant handcrafted mauve floral doorway toran with hanging pearls',
    isVisible: true,
    isCustom: false,
  },

  // --- COLUMN 3 (Right Column) ---
  // Slot 3 (Top) → 3. Rings
  {
    id: 'cat-rings',
    title: 'RINGS',
    subtitle: 'Cocktail & Statement Bands',
    section: 'category',
    categoryKey: 'rings',
    column: 3,
    order: 1,
    heightClass: 'aspect-[1/1.40]',
    defaultImage: '/images/cat_ring.png',
    cleanImage: '/images/cat_ring.png',
    currentImage: '/images/cat_ring.png',
    altText: 'Ornate oxidised silver floral medallion cocktail ring on velvet riser',
    isVisible: true,
    isCustom: false,
  },
  // Slot 6 (Middle) → 6. Earpins & Bugadi (Replaces Accessories)
  {
    id: 'cat-accessories',
    title: 'EARPINS & BUGADI',
    subtitle: 'Traditional Helix Pins & Bugadi Clips',
    section: 'category',
    categoryKey: 'accessories',
    column: 3,
    order: 2,
    heightClass: 'aspect-[1/1.08]',
    defaultImage: '/images/cat_earpins_bugadi.png',
    cleanImage: '/images/cat_earpins_bugadi.png',
    currentImage: '/images/cat_earpins_bugadi.png',
    altText: 'Handcrafted gold lotus kundan ear pins and bugadi clips on velvet plinth',
    isVisible: true,
    isCustom: false,
  },
  // Slot 9 (Bottom) → 9. Buy 4 Any for 999 (Minimal Solid Background Text Card in English)
  {
    id: 'cat-promo-4for999',
    title: 'BUY 4 ANY FOR 999',
    subtitle: 'Mix & Match Any 4 Pieces',
    section: 'category',
    categoryKey: 'rings',
    column: 3,
    order: 3,
    heightClass: 'aspect-[1/0.76]',
    defaultImage: '/images/card_text_buy4.png',
    cleanImage: '/images/card_text_buy4.png',
    currentImage: '/images/card_text_buy4.png',
    altText: 'Buy 4 for 999 promotional text card',
    isVisible: true,
    isCustom: false,
  },

  // ─── EDITORIAL HIGHLIGHTS ──────────────────────────────────────────────────
  {
    id: 'editorial-craftsmanship',
    title: 'OUR CRAFTSMANSHIP',
    subtitle: 'Rooted in tradition, made for today',
    section: 'editorial',
    order: 1,
    heightClass: 'aspect-[16/10]',
    defaultImage: '/images/craftsmanship.png',
    cleanImage: '/images/craftsmanship.png',
    currentImage: '/images/craftsmanship.png',
    altText: 'Artisan jeweler delicately setting emerald gemstone onto gold filigree ring',
    isVisible: true,
    isCustom: false,
  },
  {
    id: 'editorial-everyday',
    title: 'EVERYDAY MOMENTS',
    subtitle: 'Intricate golden chandelier jhumka earrings',
    section: 'editorial',
    order: 2,
    heightClass: 'aspect-[1/1.2]',
    defaultImage: '/images/everyday_moments.png',
    cleanImage: '/images/everyday_moments.png',
    currentImage: '/images/everyday_moments.png',
    altText: 'Intricate golden chandelier jhumka earrings resting gracefully on stone block',
    isVisible: true,
    isCustom: false,
  },
];

class HomeMediaService {
  private mediaItems: HomeMediaItem[] = [];
  private listeners: Set<(items: HomeMediaItem[]) => void> = new Set();

  constructor() {
    this.loadFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
          this.loadFromStorage();
        }
      });
      // Synchronize with cloud config so any customer sees live admin updates
      this.syncWithCloud();
    }
  }

  /**
   * Synchronize media config from Supabase Cloud Storage
   */
  public async syncWithCloud(): Promise<void> {
    try {
      const resp = await fetch(CLOUD_CONFIG_URL + '?t=' + Date.now(), {
        cache: 'no-store',
      });
      if (resp.ok) {
        const cloudItems = (await resp.json()) as HomeMediaItem[];
        if (Array.isArray(cloudItems) && cloudItems.length > 0) {
          const merged = INITIAL_HOME_MEDIA.map((def) => {
            const found = cloudItems.find((p) => p.id === def.id);
            if (found) {
              const isCustom = Boolean(found.isCustom);
              return {
                ...def,
                ...found,
                column: isCustom && found.column !== undefined ? found.column : def.column,
                order: isCustom && found.order !== undefined ? found.order : def.order,
                heightClass: def.heightClass,
                isCustom,
                currentImage: found.currentImage || def.currentImage,
                cleanImage: isCustom ? undefined : (found.cleanImage ?? def.cleanImage),
                isVisible: found.isVisible !== undefined ? found.isVisible : def.isVisible,
                title: found.title || def.title,
                subtitle: found.subtitle !== undefined ? found.subtitle : def.subtitle,
                altText: found.altText || def.altText,
              };
            }
            return def;
          });

          const customAdded = cloudItems.filter(
            (p) => !INITIAL_HOME_MEDIA.some((def) => def.id === p.id)
          );

          this.mediaItems = [...merged, ...customAdded];
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(this.mediaItems));
            } catch (e) {
              console.warn('[HomeMediaService] Failed to cache cloud items to localStorage:', e);
            }
          }
          this.notifyListeners();
        }
      }
    } catch (e) {
      // Offline or network deferred
    }
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as HomeMediaItem[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge with initial defaults to ensure all required fields exist
            const merged = INITIAL_HOME_MEDIA.map((def) => {
              const found = parsed.find((p) => p.id === def.id);
              if (found) {
                const isCustom = Boolean(found.isCustom);
                return {
                  ...def,
                  ...found,
                  column: isCustom && found.column !== undefined ? found.column : def.column,
                  order: isCustom && found.order !== undefined ? found.order : def.order,
                  heightClass: def.heightClass,
                  isCustom,
                  currentImage: found.currentImage || def.currentImage,
                  cleanImage: isCustom ? undefined : (found.cleanImage ?? def.cleanImage),
                  isVisible: found.isVisible !== undefined ? found.isVisible : def.isVisible,
                  title: found.title || def.title,
                  subtitle: found.subtitle !== undefined ? found.subtitle : def.subtitle,
                  altText: found.altText || def.altText,
                };
              }
              return def;
            });

            // Also keep any custom added cards
            const customAdded = parsed.filter(
              (p) => !INITIAL_HOME_MEDIA.some((def) => def.id === p.id)
            );

            this.mediaItems = [...merged, ...customAdded];
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Could not load home media from localStorage:', e);
    }

    // Default fallback: initialize in-memory array ONLY.
    // CRITICAL: NEVER call saveToStorage() or pushToCloud() here!
    // A fresh visitor or second device opening the site must NEVER overwrite the cloud config.
    this.mediaItems = [...INITIAL_HOME_MEDIA];
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.mediaItems));
      } catch (err) {
        // ignore
      }
    }
  }

  /**
   * Save media items to browser localStorage ONLY (fast, non-destructive, zero network)
   */
  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.mediaItems));
      }
    } catch (e: any) {
      console.error('Failed to save home media to localStorage:', e);
    }
    this.notifyListeners();
  }

  /**
   * Explicitly broadcast media items to Supabase Cloud Storage (home-media-config.json)
   * ONLY invoked by verified Admin actions (replace, toggle, reset, add, delete)
   */
  public async pushToCloud(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.location?.host) {
      return false;
    }

    try {
      const sanitizedItems = this.mediaItems.map((item) => ({
        ...item,
        cleanImage: item.isCustom ? undefined : (item.cleanImage ?? item.defaultImage),
      }));

      const res = await fetch('/api/sync-home-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: sanitizedItems }),
      });

      if (!res.ok) {
        console.warn('[HomeMediaService] /api/sync-home-media returned status:', res.status);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[HomeMediaService] Cloud push error:', err);
      return false;
    }
  }

  private notifyListeners(): void {
    const copy = [...this.mediaItems];
    this.listeners.forEach((listener) => {
      try {
        listener(copy);
      } catch (err) {
        console.error('Error in homeMediaService listener:', err);
      }
    });
  }

  /**
   * Subscribe to media changes. Returns unsubscribe function.
   */
  public subscribe(listener: (items: HomeMediaItem[]) => void): () => void {
    this.listeners.add(listener);
    // Initial call
    listener([...this.mediaItems]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get all managed home media items
   */
  public getAll(): HomeMediaItem[] {
    return [...this.mediaItems];
  }

  /**
   * Get storage usage statistics
   */
  public getStorageStats(): {
    usedBytes: number;
    usedFormatted: string;
    itemCount: number;
    customCount: number;
    quotaPercent: number;
    isNearLimit: boolean;
  } {
    let bytes = 0;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          bytes = new Blob([stored]).size;
        }
      }
    } catch {
      bytes = 0;
    }

    const maxBytes = 5 * 1024 * 1024; // 5MB standard quota
    const quotaPercent = Math.min(100, Math.round((bytes / maxBytes) * 100));

    return {
      usedBytes: bytes,
      usedFormatted: bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` : `${Math.round(bytes / 1024)} KB`,
      itemCount: this.mediaItems.length,
      customCount: this.mediaItems.filter((i) => i.isCustom).length,
      quotaPercent,
      isNearLimit: quotaPercent > 75,
    };
  }

  /**
   * Get item by id
   */
  public getById(id: string): HomeMediaItem | undefined {
    return this.mediaItems.find((item) => item.id === id);
  }

  /**
   * Get category cards, optionally filtered by column
   */
  public getCategoryItems(column?: 1 | 2 | 3): HomeMediaItem[] {
    return this.mediaItems
      .filter((item) => item.section === 'category' && (column === undefined || item.column === column))
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get editorial highlights
   */
  public getEditorialItems(): HomeMediaItem[] {
    return this.mediaItems
      .filter((item) => item.section === 'editorial')
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Replace an image with a new image URL or base64 data URL asynchronously.
   * If a base64 data URL is provided, it uploads to Supabase CDN FIRST,
   * ensuring the permanent CDN URL is stored and pushed to cloud config.
   */
  public async replaceImageAsync(
    id: string,
    newImageUrl: string,
    options?: { title?: string; subtitle?: string; altText?: string }
  ): Promise<HomeMediaItem> {
    const index = this.mediaItems.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Media item with id '${id}' not found`);
    }

    let finalImageUrl = newImageUrl.trim();

    // If new image is a base64 data URL, upload to Supabase Cloud Storage BEFORE saving
    if (finalImageUrl.startsWith('data:')) {
      const uploadRes = await uploadImageToCloud(finalImageUrl, id, 'home-media');
      if (uploadRes.success && uploadRes.publicUrl) {
        finalImageUrl = uploadRes.publicUrl;
      }
    }

    const current = this.mediaItems[index];
    const updated: HomeMediaItem = {
      ...current,
      currentImage: finalImageUrl,
      cleanImage: undefined, // Clear clean image override so custom image takes priority
      isCustom: true,
      lastUpdated: new Date().toISOString(),
      ...(options?.title !== undefined && { title: options.title.trim() }),
      ...(options?.subtitle !== undefined && { subtitle: options.subtitle.trim() }),
      ...(options?.altText !== undefined && { altText: options.altText.trim() }),
    };

    this.mediaItems[index] = updated;
    this.saveToStorage();
    await this.pushToCloud();

    return updated;
  }

  /**
   * Replace an image with a new image URL or base64 data URL (Synchronous)
   */
  public replaceImage(
    id: string,
    newImageUrl: string,
    options?: { title?: string; subtitle?: string; altText?: string }
  ): HomeMediaItem {
    const index = this.mediaItems.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Media item with id '${id}' not found`);
    }

    const current = this.mediaItems[index];
    const updated: HomeMediaItem = {
      ...current,
      currentImage: newImageUrl.trim(),
      cleanImage: undefined, // Clear clean image override so custom image takes priority
      isCustom: true,
      lastUpdated: new Date().toISOString(),
      ...(options?.title !== undefined && { title: options.title.trim() }),
      ...(options?.subtitle !== undefined && { subtitle: options.subtitle.trim() }),
      ...(options?.altText !== undefined && { altText: options.altText.trim() }),
    };

    this.mediaItems[index] = updated;
    this.saveToStorage();

    // If new image is a base64 data URL, upload to Supabase Cloud Storage in the background
    if (newImageUrl.startsWith('data:')) {
      uploadImageToCloud(newImageUrl, id, 'home-media')
        .then((res) => {
          if (res.success && res.publicUrl) {
            const itemIdx = this.mediaItems.findIndex((i) => i.id === id);
            if (itemIdx !== -1) {
              this.mediaItems[itemIdx] = {
                ...this.mediaItems[itemIdx],
                currentImage: res.publicUrl,
              };
              this.saveToStorage();
              this.pushToCloud();
            }
          }
        })
        .catch((e) => {
          console.warn('[HomeMediaService] Background cloud image upload deferred:', e);
        });
    } else {
      this.pushToCloud();
    }

    return updated;
  }

  /**
   * Toggle visibility (show or hide from the home section)
   */
  public toggleVisibility(id: string): boolean {
    const index = this.mediaItems.findIndex((item) => item.id === id);
    if (index === -1) return false;

    const current = this.mediaItems[index];
    const nextVisibility = !current.isVisible;
    this.mediaItems[index] = {
      ...current,
      isVisible: nextVisibility,
      lastUpdated: new Date().toISOString(),
    };

    this.saveToStorage();
    this.pushToCloud();
    return nextVisibility;
  }

  /**
   * Set visibility explicitly
   */
  public setVisibility(id: string, isVisible: boolean): void {
    const index = this.mediaItems.findIndex((item) => item.id === id);
    if (index === -1) return;

    this.mediaItems[index] = {
      ...this.mediaItems[index],
      isVisible,
      lastUpdated: new Date().toISOString(),
    };

    this.saveToStorage();
    this.pushToCloud();
  }

  /**
   * Reset a single item back to original default image
   */
  public resetToDefault(id: string): HomeMediaItem {
    const initial = INITIAL_HOME_MEDIA.find((def) => def.id === id);
    const index = this.mediaItems.findIndex((item) => item.id === id);

    if (index === -1 || !initial) {
      throw new Error(`Default media item for '${id}' not found`);
    }

    const restored: HomeMediaItem = {
      ...initial,
      currentImage: initial.cleanImage || initial.defaultImage,
      cleanImage: initial.cleanImage,
      isCustom: false,
      isVisible: true,
      lastUpdated: new Date().toISOString(),
    };

    this.mediaItems[index] = restored;
    this.saveToStorage();
    this.pushToCloud();
    return restored;
  }

  /**
   * Reset all home section media back to factory defaults
   */
  public resetAllToDefault(): HomeMediaItem[] {
    this.mediaItems = INITIAL_HOME_MEDIA.map((def) => ({
      ...def,
      currentImage: def.cleanImage || def.defaultImage,
      cleanImage: def.cleanImage,
      isCustom: false,
      isVisible: true,
      lastUpdated: new Date().toISOString(),
    }));

    this.saveToStorage();
    this.pushToCloud();
    return [...this.mediaItems];
  }

  /**
   * Add a custom card to the gallery
   */
  public addCustomCard(card: Omit<HomeMediaItem, 'id' | 'isCustom' | 'lastUpdated'>): HomeMediaItem {
    const id = `custom-card-${Date.now()}`;
    const newCard: HomeMediaItem = {
      ...card,
      id,
      isCustom: true,
      lastUpdated: new Date().toISOString(),
    };

    this.mediaItems.push(newCard);
    this.saveToStorage();

    if (card.currentImage.startsWith('data:')) {
      uploadImageToCloud(card.currentImage, id, 'home-media')
        .then((res) => {
          if (res.success && res.publicUrl) {
            const itemIdx = this.mediaItems.findIndex((i) => i.id === id);
            if (itemIdx !== -1) {
              this.mediaItems[itemIdx] = {
                ...this.mediaItems[itemIdx],
                currentImage: res.publicUrl,
                defaultImage: res.publicUrl,
              };
              this.saveToStorage();
              this.pushToCloud();
            }
          }
        })
        .catch((e) => {
          console.warn('[HomeMediaService] Background cloud image upload deferred:', e);
        });
    } else {
      this.pushToCloud();
    }

    return newCard;
  }

  /**
   * Remove a custom card or item permanently
   */
  public deleteItem(id: string): boolean {
    const prevLen = this.mediaItems.length;
    this.mediaItems = this.mediaItems.filter((item) => item.id !== id);
    if (this.mediaItems.length !== prevLen) {
      this.saveToStorage();
      this.pushToCloud();
      return true;
    }
    return false;
  }
}

export const homeMediaService = new HomeMediaService();
export default homeMediaService;

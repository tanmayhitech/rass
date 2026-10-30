import { ProductCategory } from '../types';

export interface HomeMediaItem {
  id: string;
  title: string;
  subtitle?: string;
  section: 'category' | 'editorial';
  categoryKey?: ProductCategory | 'kangna';
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

const STORAGE_KEY = 'rass_home_media';

export const INITIAL_HOME_MEDIA: HomeMediaItem[] = [
  // --- COLUMN 1 (Left Column) ---
  {
    id: 'cat-rings',
    title: 'RINGS',
    subtitle: 'Cocktail & Statement Bands',
    section: 'category',
    categoryKey: 'rings',
    column: 1,
    order: 1,
    heightClass: 'aspect-[1/1]',
    defaultImage: '/images/cat_rings.png',
    cleanImage: '/images/clean_cat_rings.png',
    currentImage: '/images/clean_cat_rings.png',
    altText: 'Handcrafted cocktail and statement rings collection',
    isVisible: true,
    isCustom: false,
  },
  {
    id: 'cat-earrings',
    title: 'EARRINGS',
    subtitle: 'Chandeliers, Drops & Studs',
    section: 'category',
    categoryKey: 'earrings',
    column: 1,
    order: 2,
    heightClass: 'aspect-[1/1.36]',
    defaultImage: '/images/cat_earrings.png',
    cleanImage: '/images/clean_cat_earrings.png',
    currentImage: '/images/clean_cat_earrings.png',
    altText: 'Royal handcrafted earrings collection',
    isVisible: true,
    isCustom: false,
  },

  // --- COLUMN 2 (Center Column) ---
  {
    id: 'cat-jhumka',
    title: 'JHUMKA',
    subtitle: 'Mughal Architecture Domes',
    section: 'category',
    categoryKey: 'jhumka',
    column: 2,
    order: 1,
    heightClass: 'aspect-[1/1.12]',
    defaultImage: '/images/cat_jhumka.png',
    cleanImage: '/images/clean_cat_jhumka.png',
    currentImage: '/images/clean_cat_jhumka.png',
    altText: 'Authentic bell dome jhumka collection with hanging pearls',
    isVisible: true,
    isCustom: false,
  },
  {
    id: 'cat-kangan-sets',
    title: 'KANGAN SETS',
    subtitle: 'Harmonized Bridal Bangles',
    section: 'category',
    categoryKey: 'kangan-sets',
    column: 2,
    order: 2,
    heightClass: 'aspect-[1/1.32]',
    defaultImage: '/images/cat_kangan_sets.png',
    cleanImage: '/images/clean_cat_kangan_sets.png',
    currentImage: '/images/clean_cat_kangan_sets.png',
    altText: 'Harmonized bridal and celebratory kangan sets',
    isVisible: true,
    isCustom: false,
  },
  {
    id: 'cat-kangna',
    title: 'KANGNA',
    subtitle: 'Open jaali heritage bangles',
    section: 'category',
    categoryKey: 'kangna',
    column: 2,
    order: 3,
    heightClass: 'aspect-[1/0.78]',
    defaultImage: '/images/cat_kangna_1.png',
    cleanImage: '/images/clean_cat_kangna_1.png',
    currentImage: '/images/clean_cat_kangna_1.png',
    altText: 'Fine pierced jaali kangna jewellery',
    isVisible: true,
    isCustom: false,
  },

  // --- COLUMN 3 (Right Column) ---
  {
    id: 'cat-necklaces',
    title: 'NECKLACES',
    subtitle: 'Collars, Chokers & Cascades',
    section: 'category',
    categoryKey: 'necklaces',
    column: 3,
    order: 1,
    heightClass: 'aspect-[1/1.58]',
    defaultImage: '/images/cat_necklaces.png',
    cleanImage: '/images/clean_cat_necklaces.png',
    currentImage: '/images/clean_cat_necklaces.png',
    altText: 'Majestic necklaces and chokers collection',
    isVisible: true,
    isCustom: false,
  },
  {
    id: 'cat-bracelets',
    title: 'BRACELETS',
    subtitle: 'Gemstone Cuffs & Chains',
    section: 'category',
    categoryKey: 'bracelets',
    column: 3,
    order: 2,
    heightClass: 'aspect-[1/1.08]',
    defaultImage: '/images/cat_bracelets.png',
    cleanImage: '/images/clean_cat_bracelets.png',
    currentImage: '/images/clean_cat_bracelets.png',
    altText: 'Modern delicate bracelets and cuffs collection',
    isVisible: true,
    isCustom: false,
  },
  {
    id: 'cat-kangna-2',
    title: 'KANGNA',
    subtitle: 'Slim Jaali Landscape',
    section: 'category',
    categoryKey: 'kangna',
    column: 3,
    order: 3,
    heightClass: 'aspect-[1/0.52]',
    defaultImage: '/images/cat_kangna_2.png',
    cleanImage: '/images/clean_cat_kangna_2.png',
    currentImage: '/images/clean_cat_kangna_2.png',
    altText: 'Fine pierced jaali kangna bangles',
    isVisible: true,
    isCustom: false,
  },

  // --- EDITORIAL HIGHLIGHTS ---
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
                  isCustom,
                  // Ensure currentImage fallback
                  currentImage: found.currentImage || def.currentImage,
                  // When custom, cleanImage must NOT be restored from def
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

    this.mediaItems = [...INITIAL_HOME_MEDIA];
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.mediaItems));
      }
    } catch (e: any) {
      console.error('Failed to save home media to localStorage:', e);
      if (e?.name === 'QuotaExceededError' || e?.code === 22 || e?.code === 1014) {
        throw new Error('Browser storage quota exceeded. The image file is too large. Please use an optimized image under 1MB.');
      }
      throw e;
    }
    this.notifyListeners();
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
   * Replace an image with a new image URL or base64 data URL
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
      return true;
    }
    return false;
  }
}

export const homeMediaService = new HomeMediaService();
export default homeMediaService;

import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  CheckCircle2,
  ExternalLink,
  Plus,
  Search,
  Sparkles,
  AlertCircle,
  X,
  Link2,
  ArrowRight,
  Filter,
  Layers,
  HelpCircle,
  Trash2,
  Columns3,
  Grid,
  Loader2,
  Maximize2,
  HardDrive
} from 'lucide-react';
import { homeMediaService, HomeMediaItem, INITIAL_HOME_MEDIA } from '../services/homeMediaService';
import { optimizeImageFile, validateImageUrl, formatBytes, OptimizedImageResult } from '../lib/imageOptimizer';
import { ProductCategory } from '../types';

interface AdminHomeMediaManagerProps {
  onPreviewStorefront?: () => void;
}

type ViewMode = 'columns' | 'grid';
type FilterTab = 'all' | 'col1' | 'col2' | 'col3' | 'editorial' | 'custom' | 'hidden';

// Curated Luxury Jewellery Presets for quick testing and editorial replacement
const CURATED_BRAND_PRESETS = [
  {
    name: 'Solitaire Diamond Ring',
    category: 'rings',
    aspect: '1:1',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Emerald Cascade Chandeliers',
    category: 'earrings',
    aspect: '1:1.36',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Heritage Pearl Jhumka',
    category: 'jhumka',
    aspect: '1:1.12',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Gold Polki Kangan Bangles',
    category: 'kangan-sets',
    aspect: '1:1.32',
    url: 'https://images.unsplash.com/photo-1611591475836-8a0a86b97395?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Royal Choker Necklace',
    category: 'necklaces',
    aspect: '1:1.58',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Diamond Tennis Bracelet',
    category: 'bracelets',
    aspect: '1:1.08',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=900',
  },
];

export const AdminHomeMediaManager: React.FC<AdminHomeMediaManagerProps> = ({
  onPreviewStorefront,
}) => {
  const [mediaList, setMediaList] = useState<HomeMediaItem[]>(() => homeMediaService.getAll());
  const [viewMode, setViewMode] = useState<ViewMode>('columns');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Storage usage stats
  const [storageStats, setStorageStats] = useState(() => homeMediaService.getStorageStats());

  // Modal States
  const [replacingItem, setReplacingItem] = useState<HomeMediaItem | null>(null);
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [previewZoomImage, setPreviewZoomImage] = useState<{ src: string; title: string } | null>(null);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' | 'error'; linkAction?: boolean } | null>(null);

  // Replace Modal Form State
  const [replaceMode, setReplaceMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageFileInput, setImageFileInput] = useState<string | null>(null);
  const [optimizationStats, setOptimizationStats] = useState<OptimizedImageResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [customAltText, setCustomAltText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick swap file input state
  const quickFileInputRef = useRef<HTMLInputElement>(null);
  const [quickSwapTargetId, setQuickSwapTargetId] = useState<string | null>(null);

  // New Custom Card Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('rings');
  const [newColumn, setNewColumn] = useState<1 | 2 | 3>(1);
  const [newHeightClass, setNewHeightClass] = useState('aspect-[1/1]');
  const [newImageSource, setNewImageSource] = useState<'upload' | 'url'>('upload');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState<string | null>(null);
  const [newImageStats, setNewImageStats] = useState<OptimizedImageResult | null>(null);
  const [isNewCardOptimizing, setIsNewCardOptimizing] = useState(false);
  const newFileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to service updates
  useEffect(() => {
    return homeMediaService.subscribe((updated) => {
      setMediaList(updated);
      setStorageStats(homeMediaService.getStorageStats());
    });
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success', linkAction = false) => {
    setNotification({ text, type, linkAction });
    setTimeout(() => {
      setNotification((curr) => (curr?.text === text ? null : curr));
    }, 4500);
  };

  // Open Replace Modal
  const openReplaceModal = (item: HomeMediaItem) => {
    setReplacingItem(item);
    setReplaceMode('upload');
    setImageUrlInput(item.isCustom ? item.currentImage : '');
    setImageFileInput(null);
    setOptimizationStats(null);
    setCustomTitle(item.title);
    setCustomSubtitle(item.subtitle || '');
    setCustomAltText(item.altText || '');
  };

  // Handle File Upload & Convert to Data URL with REAL Canvas Image Compression
  const handleFileUpload = async (file: File, isNewCard = false) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, JPG, WebP, AVIF).', 'error');
      return;
    }

    if (isNewCard) {
      setIsNewCardOptimizing(true);
    } else {
      setIsOptimizing(true);
    }

    try {
      // Auto-compress and downscale to 1200px max, quality 0.82
      const result = await optimizeImageFile(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.82,
        targetMaxBytes: 250 * 1024,
      });

      if (isNewCard) {
        setNewImageFile(result.dataUrl);
        setNewImageStats(result);
        setIsNewCardOptimizing(false);
      } else {
        setImageFileInput(result.dataUrl);
        setOptimizationStats(result);
        setIsOptimizing(false);
      }

      showToast(
        `Optimized: ${result.originalSizeFormatted} → ${result.optimizedSizeFormatted} (${result.reductionPercent}% smaller)`,
        'info'
      );
    } catch (err: any) {
      if (isNewCard) setIsNewCardOptimizing(false);
      else setIsOptimizing(false);
      showToast(err.message || 'Failed to optimize image file', 'error');
    }
  };

  // Quick 1-click Photo Swap directly from the card
  const handleQuickSwapSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !quickSwapTargetId) return;

    const targetItem = mediaList.find((i) => i.id === quickSwapTargetId);
    if (!targetItem) return;

    try {
      showToast(`Optimizing image for "${targetItem.title}"...`, 'info');
      const result = await optimizeImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 });
      
      homeMediaService.replaceImage(quickSwapTargetId, result.dataUrl);
      showToast(`Replaced photo for "${targetItem.title}" (${result.optimizedSizeFormatted})!`, 'success', true);
    } catch (err: any) {
      showToast(err.message || 'Failed to replace image', 'error');
    } finally {
      setQuickSwapTargetId(null);
      if (quickFileInputRef.current) quickFileInputRef.current.value = '';
    }
  };

  // Trigger quick swap file picker for a specific card
  const triggerQuickSwap = (itemId: string) => {
    setQuickSwapTargetId(itemId);
    quickFileInputRef.current?.click();
  };

  // Save Image Replacement from Modal
  const handleSaveReplacement = async () => {
    if (!replacingItem) return;

    let finalImage = '';

    if (replaceMode === 'upload') {
      finalImage = imageFileInput || '';
    } else if (replaceMode === 'url') {
      finalImage = imageUrlInput.trim();
    } else if (replaceMode === 'presets') {
      finalImage = imageUrlInput.trim();
    }

    if (!finalImage) {
      showToast('Please select, upload, or paste a new image first.', 'error');
      return;
    }

    // Optional validation for external URLs
    if (replaceMode === 'url' && !finalImage.startsWith('data:')) {
      const isValid = await validateImageUrl(finalImage);
      if (!isValid) {
        showToast('Image URL appears unreachable or invalid. Please check link.', 'error');
        return;
      }
    }

    try {
      homeMediaService.replaceImage(replacingItem.id, finalImage, {
        title: customTitle.trim() || undefined,
        subtitle: customSubtitle.trim() || undefined,
        altText: customAltText.trim() || undefined,
      });

      showToast(`Published new image for "${customTitle.trim() || replacingItem.title}" to homepage!`, 'success', true);
      setReplacingItem(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to replace image', 'error');
    }
  };

  // Toggle Visibility (Hide / Show)
  const handleToggleVisibility = (item: HomeMediaItem) => {
    const isNowVisible = homeMediaService.toggleVisibility(item.id);
    if (isNowVisible) {
      showToast(`"${item.title}" is now visible on storefront homepage.`, 'success', true);
    } else {
      showToast(`"${item.title}" is hidden from storefront homepage.`, 'info', true);
    }
  };

  // Reset to Default Image
  const handleResetToDefault = (item: HomeMediaItem) => {
    if (window.confirm(`Reset "${item.title}" back to its original brand photography?`)) {
      homeMediaService.resetToDefault(item.id);
      showToast(`"${item.title}" restored to factory default image.`, 'info', true);
    }
  };

  // Reset All to Default
  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to restore ALL homepage images back to original defaults?')) {
      homeMediaService.resetAllToDefault();
      showToast('All homepage media restored to factory defaults.', 'info', true);
    }
  };

  // Save New Custom Card
  const handleSaveNewCard = () => {
    const finalImage = newImageSource === 'upload' ? newImageFile : newImageUrl.trim();
    if (!newTitle.trim()) {
      showToast('Please enter a title for the card.', 'error');
      return;
    }
    if (!finalImage) {
      showToast('Please provide an image for the new card.', 'error');
      return;
    }

    try {
      homeMediaService.addCustomCard({
        title: newTitle.trim().toUpperCase(),
        subtitle: newSubtitle.trim() || undefined,
        section: 'category',
        categoryKey: newCategory,
        column: newColumn,
        order: 99,
        heightClass: newHeightClass,
        currentImage: finalImage,
        defaultImage: finalImage,
        altText: newSubtitle.trim() || `${newTitle} collection`,
        isVisible: true,
      });

      showToast(`New card "${newTitle.toUpperCase()}" added to Column ${newColumn}!`, 'success', true);
      setIsNewCardModalOpen(false);
      setNewTitle('');
      setNewSubtitle('');
      setNewImageUrl('');
      setNewImageFile(null);
      setNewImageStats(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to add card', 'error');
    }
  };

  // Delete Custom Card
  const handleDeleteCard = (id: string, title: string) => {
    if (window.confirm(`Permanently remove custom card "${title}"?`)) {
      homeMediaService.deleteItem(id);
      showToast(`Card "${title}" deleted.`, 'info');
    }
  };

  // Filter items for Grid view
  const filteredItems = mediaList.filter((item) => {
    if (activeFilter === 'col1' && (item.section !== 'category' || item.column !== 1)) return false;
    if (activeFilter === 'col2' && (item.section !== 'category' || item.column !== 2)) return false;
    if (activeFilter === 'col3' && (item.section !== 'category' || item.column !== 3)) return false;
    if (activeFilter === 'editorial' && item.section !== 'editorial') return false;
    if (activeFilter === 'custom' && !item.isCustom) return false;
    if (activeFilter === 'hidden' && item.isVisible) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = (item.subtitle || '').toLowerCase().includes(q);
      const matchKey = (item.categoryKey || '').toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchKey;
    }

    return true;
  });

  const customCount = mediaList.filter((i) => i.isCustom).length;
  const visibleCount = mediaList.filter((i) => i.isVisible).length;
  const hiddenCount = mediaList.filter((i) => !i.isVisible).length;

  // Items grouped by column for layout view
  const col1Items = mediaList.filter((i) => i.section === 'category' && i.column === 1);
  const col2Items = mediaList.filter((i) => i.section === 'category' && i.column === 2);
  const col3Items = mediaList.filter((i) => i.section === 'category' && i.column === 3);
  const editorialItems = mediaList.filter((i) => i.section === 'editorial');

  // Helper to format aspect ratio into friendly text
  const getAspectFriendlyName = (heightClass: string) => {
    if (heightClass.includes('1/1.58')) return '1:1.58 Tall Portrait';
    if (heightClass.includes('1/1.36')) return '1:1.36 Portrait';
    if (heightClass.includes('1/1.32')) return '1:1.32 Portrait';
    if (heightClass.includes('1/1.12')) return '1:1.12 Soft Portrait';
    if (heightClass.includes('1/1.08')) return '1:1.08 Square-ish';
    if (heightClass.includes('1/1')) return '1:1 Square';
    if (heightClass.includes('1/0.78')) return '1:0.78 Landscape';
    if (heightClass.includes('1/0.52')) return '1:0.52 Slim Banner';
    if (heightClass.includes('16/10')) return '16:10 Arch Showcase';
    if (heightClass.includes('1/1.2')) return '1:1.2 Domed Arch';
    return heightClass.replace('aspect-[', '').replace(']', '');
  };

  // Renders a single editable media card
  const renderCard = (item: HomeMediaItem, showColumnBadge = true) => {
    const isCustom = item.isCustom;
    const isVisible = item.isVisible;
    const isCustomAdded = !INITIAL_HOME_MEDIA.some((def) => def.id === item.id);

    return (
      <div
        key={item.id}
        className={`bg-white rounded-xl border transition-all duration-300 flex flex-col overflow-hidden shadow-subtle hover:shadow-md ${
          !isVisible
            ? 'border-dashed border-[#D5CEC7] opacity-65 bg-[#FAF8F5]/80'
            : isCustom
            ? 'border-[#8B5E86]/50 ring-1 ring-[#8B5E86]/25'
            : 'border-[#E7E0DA]'
        }`}
      >
        {/* Visual Thumbnail & Aspect Preview */}
        <div className="relative w-full bg-[#FAF8F5] overflow-hidden group">
          <div className={`w-full ${item.heightClass} max-h-[220px] overflow-hidden relative`}>
            <img
              src={item.currentImage}
              alt={item.altText || item.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />

            {/* Quick zoom preview button */}
            <button
              onClick={() => setPreviewZoomImage({ src: item.currentImage, title: item.title })}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium cursor-pointer backdrop-blur-2xs"
              title="Click to zoom image"
            >
              <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/30 flex items-center gap-1.5 shadow-sm">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Zoom</span>
              </span>
            </button>
          </div>

          {/* Quick Swap Floating Action Button on Hover */}
          <button
            onClick={() => triggerQuickSwap(item.id)}
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-[#292624] hover:bg-[#8B5E86] hover:text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-10 hover:scale-105"
            title="Fast Photo Swap: Select an image file to swap immediately"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          {/* Section & Status Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none">
            {showColumnBadge && (
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-medium tracking-wide uppercase bg-black/75 text-white backdrop-blur-xs shadow-xs">
                {item.section === 'category'
                  ? `Col ${item.column} · #${item.order}`
                  : item.id === 'editorial-craftsmanship'
                  ? 'Editorial · Craft'
                  : 'Editorial · Everyday'}
              </span>
            )}
            {isCustom && (
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-[#8B5E86] text-white shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#F5E8D2]" />
                <span>Custom Replaced</span>
              </span>
            )}
          </div>

          {/* Visibility status indicator */}
          <div className="absolute top-2.5 right-2.5 pointer-events-none">
            {isVisible ? (
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-emerald-700/90 text-white shadow-xs flex items-center gap-1">
                <Check className="w-2.5 h-2.5" />
                <span>Live</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-[#77716F]/90 text-white shadow-xs flex items-center gap-1">
                <EyeOff className="w-2.5 h-2.5" />
                <span>Hidden</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Information */}
        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h4 className="font-serif font-bold text-sm text-[#292624] tracking-wide">
                {item.title}
              </h4>
              {item.categoryKey && (
                <span className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E7E0DA] text-[10px] font-mono text-[#77716F]">
                  /{item.categoryKey}
                </span>
              )}
            </div>
            {item.subtitle && (
              <p className="text-[11px] text-[#77716F] line-clamp-1 mt-0.5">{item.subtitle}</p>
            )}
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-block px-1.5 py-0.5 rounded bg-[#FAF8F5] text-[10px] text-[#77716F] font-mono border border-[#EBE5DF]">
                {getAspectFriendlyName(item.heightClass)}
              </span>
            </div>
          </div>

          {/* Actions Toolbar */}
          <div className="pt-2 border-t border-[#F0EBE6] space-y-1.5">
            {/* Primary Replace Button */}
            <button
              onClick={() => openReplaceModal(item)}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-[#FAF8F5] hover:bg-[#8B5E86] text-[#292624] hover:text-white border border-[#E7E0DA] hover:border-transparent text-xs font-medium transition-all cursor-pointer group"
            >
              <Upload className="w-3.5 h-3.5 text-[#8B5E86] group-hover:text-white transition-colors" />
              <span>Replace Image</span>
            </button>

            {/* Secondary Actions: Show/Hide & Reset/Delete */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleToggleVisibility(item)}
                className={`flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                  isVisible
                    ? 'border-[#E7E0DA] text-[#77716F] hover:bg-[#FAF8F5] hover:text-[#292624]'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
                title={isVisible ? 'Hide from storefront homepage' : 'Restore visibility on storefront'}
              >
                {isVisible ? (
                  <>
                    <EyeOff className="w-3 h-3 text-[#77716F]" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 text-emerald-700" />
                    <span>Show</span>
                  </>
                )}
              </button>

              {isCustomAdded ? (
                <button
                  onClick={() => handleDeleteCard(item.id, item.title)}
                  className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-[11px] font-medium border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete custom card permanently"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              ) : isCustom ? (
                <button
                  onClick={() => handleResetToDefault(item)}
                  className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg text-[11px] font-medium border border-amber-200 text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
                  title="Restore original brand default image"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              ) : (
                <div className="flex items-center justify-center py-1.5 px-2 text-[10px] text-[#A69F9B] font-mono border border-transparent">
                  <span>Default</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for 1-click quick photo swapping */}
      <input
        ref={quickFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={handleQuickSwapSelect}
      />

      {/* Elegant Toast Alert with Storefront Shortcut */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-xl border text-xs font-medium animate-slideLeft transition-all ${
            notification.type === 'success'
              ? 'bg-[#1C2C1D] text-[#A6E3A1] border-[#2E4A30]'
              : notification.type === 'error'
              ? 'bg-[#331C1C] text-[#F38BA8] border-[#4D2828]'
              : 'bg-[#292624] text-[#F5E8D2] border-[#403B38]'
          }`}
          role="status"
        >
          {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#A6E3A1] shrink-0" />}
          {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-[#F38BA8] shrink-0" />}
          {notification.type === 'info' && <Sparkles className="w-4 h-4 text-[#C8A97E] shrink-0" />}
          <div className="flex items-center gap-2">
            <span>{notification.text}</span>
            {notification.linkAction && onPreviewStorefront && (
              <button
                onClick={onPreviewStorefront}
                className="underline font-semibold hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:opacity-75 focus:outline-none ml-1 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP HEADER & STATS STRIP */}
      <div className="bg-white rounded-xl border border-[#E7E0DA] p-4 sm:p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E7E0DA] text-[#8B5E86]">
                <ImageIcon className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-base sm:text-lg font-serif font-bold text-[#292624] tracking-wide flex items-center gap-2">
                  <span>Home Section Media Manager</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-[#8B5E86]/10 text-[#8B5E86] border border-[#8B5E86]/20">
                    Live Storefront Sync
                  </span>
                </h1>
                <p className="text-xs text-[#77716F] mt-0.5">
                  Update, replace, or hide hero category photography (Columns 1-3) and editorial showcases on your homepage.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {onPreviewStorefront && (
              <button
                onClick={onPreviewStorefront}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#E7E0DA] hover:bg-[#FAF8F5] text-[#292624] text-xs font-medium transition-colors cursor-pointer"
                title="View storefront homepage"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#77716F]" />
              </button>
            )}

            <button
              onClick={() => setIsNewCardModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#8B5E86] hover:bg-[#71456D] text-white text-xs font-medium shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Card</span>
            </button>

            {customCount > 0 && (
              <button
                onClick={handleResetAll}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
                title="Reset all replaced images back to factory defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Defaults</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats & Storage Health Meter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#F0EBE6]">
          <div className="bg-[#FAF8F5] rounded-lg p-2.5 border border-[#EBE5DF]">
            <span className="text-[10.5px] text-[#77716F] font-medium block">Total Managed Assets</span>
            <span className="text-lg font-bold text-[#292624] font-serif">{mediaList.length}</span>
          </div>
          <div className="bg-[#FAF8F5] rounded-lg p-2.5 border border-[#EBE5DF]">
            <span className="text-[10.5px] text-[#77716F] font-medium block">Visible on Homepage</span>
            <span className="text-lg font-bold text-emerald-700 font-serif">{visibleCount}</span>
          </div>
          <div className="bg-[#FAF8F5] rounded-lg p-2.5 border border-[#EBE5DF]">
            <span className="text-[10.5px] text-[#77716F] font-medium block">Custom Replaced</span>
            <span className="text-lg font-bold text-[#8B5E86] font-serif">{customCount}</span>
          </div>
          <div className="bg-[#FAF8F5] rounded-lg p-2.5 border border-[#EBE5DF] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] text-[#77716F] font-medium">Storage Quota</span>
              <HardDrive className={`w-3.5 h-3.5 ${storageStats.isNearLimit ? 'text-rose-500' : 'text-emerald-600'}`} />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xs font-bold font-mono text-[#292624]">{storageStats.usedFormatted}</span>
              <span className="text-[10px] text-[#77716F] font-medium">
                {storageStats.quotaPercent}% of ~5MB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE & FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* View Mode Toggle: Columns Layout View (Storefront Match) vs Grid View */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-[#E7E0DA] shadow-2xs self-start">
          <button
            onClick={() => setViewMode('columns')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'columns'
                ? 'bg-[#292624] text-white shadow-xs'
                : 'text-[#77716F] hover:text-[#292624] hover:bg-[#FAF8F5]'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>Storefront Columns View</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#292624] text-white shadow-xs'
                : 'text-[#77716F] hover:text-[#292624] hover:bg-[#FAF8F5]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Catalog Grid View</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {viewMode === 'grid' && (
            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-[#E7E0DA] shadow-2xs overflow-x-auto text-xs">
              {[
                { id: 'all', label: `All (${mediaList.length})` },
                { id: 'col1', label: 'Col 1' },
                { id: 'col2', label: 'Col 2' },
                { id: 'col3', label: 'Col 3' },
                { id: 'editorial', label: 'Editorial' },
                { id: 'custom', label: `Custom (${customCount})` },
                { id: 'hidden', label: `Hidden (${hiddenCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as FilterTab)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-[#8B5E86] text-white shadow-xs'
                      : 'text-[#77716F] hover:text-[#292624] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77716F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-[#E7E0DA] bg-white text-xs text-[#292624] focus:outline-none focus:border-[#8B5E86]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#77716F] hover:text-[#292624]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VIEW MODE 1: STOREFRONT COLUMNS (AS SEEN ON HOMEPAGE)                 */}
      {/* ===================================================================== */}
      {viewMode === 'columns' && (
        <div className="space-y-8">
          {/* SECTION 1: 3-COLUMN CATEGORY MASONRY GALLERY */}
          <div className="bg-[#FAF8F5]/60 rounded-2xl border border-[#E7E0DA] p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E0DA] pb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-[#292624] flex items-center gap-2">
                  <span>Hero Category Masonry Gallery</span>
                  <span className="text-xs font-sans font-normal text-[#77716F]">
                    (3 Asymmetrical Staggered Columns)
                  </span>
                </h3>
                <p className="text-xs text-[#77716F]">
                  Cards appear on your homepage in this exact 3-column layout. Hover any card for a 1-click quick photo swap.
                </p>
              </div>
            </div>

            {/* 3 Columns Side-by-Side Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              
              {/* COLUMN 1 (Left - Lowest Stagger) */}
              <div className="space-y-4 bg-white p-3.5 rounded-xl border border-[#E7E0DA] shadow-xs">
                <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" />
                    <span className="font-serif font-bold text-xs text-[#292624] uppercase tracking-wider">
                      Column 1 · Left
                    </span>
                  </div>
                  <span className="text-[10.5px] font-mono text-[#77716F] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EBE5DF]">
                    {col1Items.length} items
                  </span>
                </div>
                <div className="space-y-4">
                  {col1Items.map((item) => renderCard(item, false))}
                </div>
              </div>

              {/* COLUMN 2 (Center - Intermediate Stagger) */}
              <div className="space-y-4 bg-white p-3.5 rounded-xl border border-[#E7E0DA] shadow-xs">
                <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                    <span className="font-serif font-bold text-xs text-[#292624] uppercase tracking-wider">
                      Column 2 · Center
                    </span>
                  </div>
                  <span className="text-[10.5px] font-mono text-[#77716F] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EBE5DF]">
                    {col2Items.length} items
                  </span>
                </div>
                <div className="space-y-4">
                  {col2Items.map((item) => renderCard(item, false))}
                </div>
              </div>

              {/* COLUMN 3 (Right - Top Stagger) */}
              <div className="space-y-4 bg-white p-3.5 rounded-xl border border-[#E7E0DA] shadow-xs">
                <div className="flex items-center justify-between border-b border-[#F0EBE6] pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                    <span className="font-serif font-bold text-xs text-[#292624] uppercase tracking-wider">
                      Column 3 · Right
                    </span>
                  </div>
                  <span className="text-[10.5px] font-mono text-[#77716F] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EBE5DF]">
                    {col3Items.length} items
                  </span>
                </div>
                <div className="space-y-4">
                  {col3Items.map((item) => renderCard(item, false))}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: EDITORIAL SHOWCASES & STORYTELLING BANNERS */}
          <div className="bg-white rounded-2xl border border-[#E7E0DA] p-4 sm:p-6 shadow-subtle space-y-4">
            <div className="border-b border-[#E7E0DA] pb-3">
              <h3 className="font-serif font-bold text-base text-[#292624] flex items-center gap-2">
                <span>Editorial Showcases & Storytelling Banners</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-[#B49A6C]/15 text-[#8A7045]">
                  Architectural Curves
                </span>
              </h3>
              <p className="text-xs text-[#77716F] mt-0.5">
                The full-width narrative sections displayed further down the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {editorialItems.map((item) => renderCard(item, true))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW MODE 2: CATALOG GRID VIEW                                        */}
      {/* ===================================================================== */}
      {viewMode === 'grid' && (
        <>
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E7E0DA] p-12 text-center space-y-3">
              <ImageIcon className="w-10 h-10 text-[#C8A97E] mx-auto opacity-70" />
              <h3 className="font-serif text-base font-semibold text-[#292624]">No media assets found</h3>
              <p className="text-xs text-[#77716F] max-w-sm mx-auto">
                {searchQuery
                  ? `No images match your search for "${searchQuery}".`
                  : 'No images match the selected filter.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1 rounded-md text-xs bg-[#FAF8F5] border border-[#E7E0DA] text-[#292624] hover:bg-white cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => renderCard(item, true))}
            </div>
          )}
        </>
      )}

      {/* ===================================================================== */}
      {/* REPLACE IMAGE MODAL (HIGH-PRECISION EDITING & AUTO-COMPRESSION)       */}
      {/* ===================================================================== */}
      {replacingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl border border-[#E7E0DA] w-full max-w-xl shadow-2xl overflow-hidden animate-slideUp my-6">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E7E0DA] flex items-center justify-between bg-[#FAF8F5]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#292624]">
                  Replace Image for {replacingItem.title}
                </h3>
                <p className="text-xs text-[#77716F] mt-0.5">
                  Slot:{' '}
                  {replacingItem.section === 'category'
                    ? `Category Gallery · Column ${replacingItem.column}`
                    : 'Editorial Story Showcase'}
                  {' · '}
                  <span className="font-mono text-[#8B5E86]">
                    Optimal: {getAspectFriendlyName(replacingItem.heightClass)}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setReplacingItem(null)}
                className="p-1.5 rounded-lg hover:bg-white text-[#77716F] hover:text-[#292624] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5">
              {/* Source Mode Switcher: Upload vs URL vs Presets */}
              <div className="flex rounded-lg p-1 bg-[#FAF8F5] border border-[#E7E0DA] text-xs">
                <button
                  type="button"
                  onClick={() => setReplaceMode('upload')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    replaceMode === 'upload' ? 'bg-white shadow-xs text-[#292624]' : 'text-[#77716F] hover:text-[#292624]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-[#8B5E86]" />
                  <span>Upload & Compress</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReplaceMode('url')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    replaceMode === 'url' ? 'bg-white shadow-xs text-[#292624]' : 'text-[#77716F] hover:text-[#292624]'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5 text-[#8B5E86]" />
                  <span>Direct URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReplaceMode('presets')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    replaceMode === 'presets' ? 'bg-white shadow-xs text-[#292624]' : 'text-[#77716F] hover:text-[#292624]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B49A6C]" />
                  <span>Curated Presets</span>
                </button>
              </div>

              {/* Mode A: Auto-Compacted File Dropzone */}
              {replaceMode === 'upload' && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#8B5E86] bg-[#8B5E86]/5'
                      : imageFileInput
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-[#D5CEC7] hover:border-[#8B5E86] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E7E0DA] flex items-center justify-center mx-auto text-[#8B5E86]">
                      {isOptimizing ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#8B5E86]" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#292624]">
                        {isOptimizing
                          ? 'Optimizing and compressing image...'
                          : imageFileInput
                          ? 'Photo loaded & compressed! Click to choose another'
                          : 'Drag & drop image here, or click to browse'}
                      </p>
                      <p className="text-[11px] text-[#77716F] mt-0.5">
                        Automatic downsampling to crisp WebP/JPEG under 200KB for instant page load.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Optimization Feedback Badge */}
              {replaceMode === 'upload' && optimizationStats && (
                <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Original: <strong>{optimizationStats.originalSizeFormatted}</strong> → Compressed:{' '}
                      <strong>{optimizationStats.optimizedSizeFormatted}</strong>
                    </span>
                  </div>
                  <span className="font-semibold text-[11px] px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900">
                    {optimizationStats.reductionPercent}% smaller
                  </span>
                </div>
              )}

              {/* Mode B: Direct Image URL */}
              {replaceMode === 'url' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#292624] block">Image URL (HTTPS)</label>
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... or Supabase storage link"
                    className="w-full px-3 py-2 rounded-lg border border-[#E7E0DA] text-xs text-[#292624] focus:outline-none focus:border-[#8B5E86]"
                  />
                  <p className="text-[10.5px] text-[#77716F]">
                    Paste any public image URL from Unsplash, Shopify CDN, or Supabase Storage.
                  </p>
                </div>
              )}

              {/* Mode C: Curated Presets Selection */}
              {replaceMode === 'presets' && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#292624] block">
                    Pick a Curated Luxury Jewellery Photo
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                    {CURATED_BRAND_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          setImageUrlInput(preset.url);
                          setCustomTitle(preset.name.toUpperCase());
                        }}
                        className={`group relative rounded-lg border overflow-hidden p-1 text-left transition-all cursor-pointer ${
                          imageUrlInput === preset.url
                            ? 'border-[#8B5E86] ring-2 ring-[#8B5E86]/30 bg-[#8B5E86]/5'
                            : 'border-[#E7E0DA] hover:border-[#8B5E86]'
                        }`}
                      >
                        <div className="aspect-[1/1] rounded overflow-hidden mb-1">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="block text-[10px] font-medium text-[#292624] truncate">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Side-by-Side Live Comparison Preview */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <span className="text-[10.5px] text-[#77716F] font-medium block">Current Live on Storefront</span>
                  <div className="relative h-28 rounded-lg overflow-hidden border border-[#E7E0DA] bg-[#FAF8F5]">
                    <img
                      src={replacingItem.currentImage}
                      alt={replacingItem.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10.5px] text-[#77716F] font-medium block">New Replacement Preview</span>
                  <div className="relative h-28 rounded-lg overflow-hidden border border-dashed border-[#8B5E86] bg-[#8B5E86]/5 flex items-center justify-center">
                    {replaceMode === 'upload' && imageFileInput ? (
                      <img
                        src={imageFileInput}
                        alt="New preview"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (replaceMode === 'url' || replaceMode === 'presets') && imageUrlInput.trim() ? (
                      <img
                        src={imageUrlInput.trim()}
                        alt="New preview"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-[11px] text-[#8B5E86] font-medium px-2 text-center">
                        Select or upload an image to preview
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable Meta details */}
              <div className="pt-2 border-t border-[#F0EBE6] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#292624] block mb-1">
                      Display Title
                    </label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder={replacingItem.title}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7E0DA] text-xs text-[#292624] focus:outline-none focus:border-[#8B5E86]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#292624] block mb-1">
                      Subtitle / Caption
                    </label>
                    <input
                      type="text"
                      value={customSubtitle}
                      onChange={(e) => setCustomSubtitle(e.target.value)}
                      placeholder="Optional caption"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7E0DA] text-xs text-[#292624] focus:outline-none focus:border-[#8B5E86]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#292624] block mb-1">
                    Alt Text (Accessibility & SEO)
                  </label>
                  <input
                    type="text"
                    value={customAltText}
                    onChange={(e) => setCustomAltText(e.target.value)}
                    placeholder={replacingItem.altText}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7E0DA] text-xs text-[#292624] focus:outline-none focus:border-[#8B5E86]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-5 border-t border-[#E7E0DA] bg-[#FAF8F5] flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setReplacingItem(null)}
                className="px-4 py-2 rounded-lg border border-[#E7E0DA] hover:bg-white text-xs font-medium text-[#292624] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReplacement}
                disabled={isOptimizing}
                className="px-5 py-2 rounded-lg bg-[#8B5E86] hover:bg-[#71456D] disabled:opacity-50 text-white text-xs font-medium shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Compressing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save & Publish to Homepage</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ADD CUSTOM CARD MODAL                                                 */}
      {/* ===================================================================== */}
      {isNewCardModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl border border-[#E7E0DA] w-full max-w-lg shadow-2xl overflow-hidden animate-slideUp my-6">
            <div className="p-4 sm:p-5 border-b border-[#E7E0DA] flex items-center justify-between bg-[#FAF8F5]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#292624]">
                  Add Custom Card to Category Gallery
                </h3>
                <p className="text-xs text-[#77716F]">
                  Add a seasonal showcase or new collection card into the 3-column masonry gallery.
                </p>
              </div>
              <button
                onClick={() => setIsNewCardModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white text-[#77716F] hover:text-[#292624] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="font-medium text-[#292624] block mb-1">Card Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. BRIDAL NOSE RINGS"
                  className="w-full px-3 py-2 rounded-lg border border-[#E7E0DA] text-[#292624] focus:outline-none focus:border-[#8B5E86]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-[#292624] block mb-1">Target Category Filter</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E7E0DA] text-[#292624] bg-white focus:outline-none focus:border-[#8B5E86]"
                  >
                    <option value="rings">Rings</option>
                    <option value="earrings">Earrings</option>
                    <option value="jhumka">Jhumka</option>
                    <option value="kangan-sets">Kangan Sets</option>
                    <option value="kangna">Kangna</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="bracelets">Bracelets</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-[#292624] block mb-1">Gallery Column</label>
                  <select
                    value={newColumn}
                    onChange={(e) => setNewColumn(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E7E0DA] text-[#292624] bg-white focus:outline-none focus:border-[#8B5E86]"
                  >
                    <option value={1}>Column 1 (Left Column)</option>
                    <option value={2}>Column 2 (Center Column)</option>
                    <option value={3}>Column 3 (Right Column)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-[#292624] block mb-1">Aspect Ratio</label>
                <select
                  value={newHeightClass}
                  onChange={(e) => setNewHeightClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E7E0DA] text-[#292624] bg-white focus:outline-none focus:border-[#8B5E86]"
                >
                  <option value="aspect-[1/1]">1:1 Square (Rings style)</option>
                  <option value="aspect-[1/1.36]">1:1.36 Portrait (Earrings style)</option>
                  <option value="aspect-[1/1.58]">1:1.58 Tall Portrait (Necklaces style)</option>
                  <option value="aspect-[1/0.78]">1:0.78 Landscape (Kangna style)</option>
                  <option value="aspect-[1/0.52]">1:0.52 Slim Banner</option>
                </select>
              </div>

              {/* Image Source Selection */}
              <div className="space-y-2 pt-2 border-t border-[#F0EBE6]">
                <label className="font-medium text-[#292624] block">Image Source *</label>
                <div className="flex rounded-lg p-0.5 bg-[#FAF8F5] border border-[#E7E0DA]">
                  <button
                    type="button"
                    onClick={() => setNewImageSource('upload')}
                    className={`flex-1 py-1 rounded text-xs font-medium cursor-pointer ${
                      newImageSource === 'upload' ? 'bg-white shadow-xs text-[#292624]' : 'text-[#77716F]'
                    }`}
                  >
                    Upload File (Auto-Compressed)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewImageSource('url')}
                    className={`flex-1 py-1 rounded text-xs font-medium cursor-pointer ${
                      newImageSource === 'url' ? 'bg-white shadow-xs text-[#292624]' : 'text-[#77716F]'
                    }`}
                  >
                    Image URL
                  </button>
                </div>

                {newImageSource === 'upload' ? (
                  <div
                    onClick={() => newFileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#D5CEC7] hover:border-[#8B5E86] rounded-xl p-4 text-center cursor-pointer bg-[#FAF8F5]"
                  >
                    <input
                      ref={newFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], true);
                        }
                      }}
                    />
                    {isNewCardOptimizing ? (
                      <Loader2 className="w-5 h-5 mx-auto text-[#8B5E86] animate-spin mb-1" />
                    ) : (
                      <Upload className="w-5 h-5 mx-auto text-[#8B5E86] mb-1" />
                    )}
                    <p className="text-[11px] text-[#292624] font-medium">
                      {isNewCardOptimizing
                        ? 'Optimizing image...'
                        : newImageFile
                        ? `File loaded (${newImageStats?.optimizedSizeFormatted || 'Compressed'})`
                        : 'Click to select image file'}
                    </p>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-[#E7E0DA] text-[#292624] focus:outline-none focus:border-[#8B5E86]"
                  />
                )}
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-[#E7E0DA] bg-[#FAF8F5] flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setIsNewCardModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#E7E0DA] hover:bg-white text-xs font-medium text-[#292624] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewCard}
                disabled={isNewCardOptimizing}
                className="px-5 py-2 rounded-lg bg-[#8B5E86] hover:bg-[#71456D] disabled:opacity-50 text-white text-xs font-medium shadow-sm cursor-pointer"
              >
                Add Card to Homepage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULL IMAGE ZOOM MODAL                                                 */}
      {/* ===================================================================== */}
      {previewZoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setPreviewZoomImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-white rounded-xl overflow-hidden shadow-2xl p-2 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-2 border-b border-[#E7E0DA] mb-2">
              <span className="font-serif font-bold text-sm text-[#292624]">{previewZoomImage.title}</span>
              <button
                onClick={() => setPreviewZoomImage(null)}
                className="p-1 rounded-md hover:bg-[#FAF8F5] text-[#77716F] hover:text-[#292624] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={previewZoomImage.src}
              alt={previewZoomImage.title}
              className="max-h-[70vh] w-auto mx-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomeMediaManager;

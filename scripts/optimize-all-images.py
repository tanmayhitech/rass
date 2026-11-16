#!/usr/bin/env python3
"""
Convert all uncompressed PNG and JPG images in public/images and public/elements
into high-efficiency WebP images (max dimension 1200px, quality 84).
Reduces asset weight by >90% while maintaining crisp retina clarity.
"""

import os
from PIL import Image

TARGET_DIRS = ['public/images', 'public/elements']
MAX_DIM = 1200
QUALITY = 84

converted_count = 0
orig_total_bytes = 0
new_total_bytes = 0

print("🚀 Starting Image Optimization Engine for Rass by Ridhima...")

for target_dir in TARGET_DIRS:
    if not os.path.exists(target_dir):
        continue
    for root, dirs, files in os.walk(target_dir):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ['.png', '.jpg', '.jpeg']:
                src_path = os.path.join(root, f)
                webp_path = os.path.splitext(src_path)[0] + '.webp'
                
                try:
                    orig_size = os.path.getsize(src_path)
                    im = Image.open(src_path)
                    
                    # Convert palette or RGBA with solid background if needed
                    # WebP supports full RGBA transparency natively
                    
                    # Resize if greater than MAX_DIM
                    if max(im.size) > MAX_DIM:
                        ratio = MAX_DIM / max(im.size)
                        new_w = max(1, int(im.size[0] * ratio))
                        new_h = max(1, int(im.size[1] * ratio))
                        im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
                    
                    im.save(webp_path, 'WEBP', quality=QUALITY, method=4)
                    new_size = os.path.getsize(webp_path)
                    
                    converted_count += 1
                    orig_total_bytes += orig_size
                    new_total_bytes += new_size
                    
                    if converted_count % 25 == 0:
                        print(f"  Processed {converted_count} images... ({new_total_bytes / (1024*1024):.1f} MB generated)")
                except Exception as e:
                    print(f"  ⚠️ Error processing {src_path}: {e}")

saved_bytes = orig_total_bytes - new_total_bytes
saved_pct = (saved_bytes / orig_total_bytes * 100) if orig_total_bytes > 0 else 0

print(f"\n✨ Optimization Complete!")
print(f"  • Total Images Processed: {converted_count}")
print(f"  • Original Total Weight: {orig_total_bytes / (1024*1024):.2f} MB")
print(f"  • New Optimized WebP Weight: {new_total_bytes / (1024*1024):.2f} MB")
print(f"  • Bandwidth Saved: {saved_bytes / (1024*1024):.2f} MB ({saved_pct:.1f}% reduction)")

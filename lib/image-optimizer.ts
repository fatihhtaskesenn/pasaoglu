export interface OptimizeImageOptions {
  /** Maksimum genişlik veya yükseklik (px). Varsayılan: 1200 */
  maxDimension?: number;
  /** Hedef maksimum dosya boyutu (byte). Varsayılan: 180 KB */
  targetMaxBytes?: number;
  /** Başlangıç WebP kalitesi (0-1). Varsayılan: 0.85 */
  initialQuality?: number;
  /** Minimum kalite sınırı (canlılığı korumak için). Varsayılan: 0.7 */
  minQuality?: number;
}

export interface OptimizedImageResult {
  file: File;
  originalSize: number;
  optimizedSize: number;
  wasOptimized: boolean;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Görsel okunamadı.'));
    };
    img.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

/**
 * Yüklenen ürün ve kampanya görsellerini tarayıcıda yüksek kaliteyle yeniden boyutlandırıp
 * WebP formatına sıkıştırır. Canlı renkleri ve şeffaflığı korurken dosya boyutunu ciddi oranda düşürür.
 */
export async function optimizeImageForWeb(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<OptimizedImageResult> {
  const originalSize = file.size;

  // SVG, GIF veya görsel olmayan dosyaları olduğu gibi bırak
  if (
    typeof window === 'undefined' ||
    !file.type.startsWith('image/') ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return { file, originalSize, optimizedSize: originalSize, wasOptimized: false };
  }

  const {
    maxDimension = 1200,
    targetMaxBytes = 180 * 1024,
    initialQuality = 0.85,
    minQuality = 0.7,
  } = options;

  try {
    const img = await loadImageFromFile(file);
    const { naturalWidth: origW, naturalHeight: origH } = img;

    if (!origW || !origH) {
      return { file, originalSize, optimizedSize: originalSize, wasOptimized: false };
    }

    // Asla büyütme yapma; sadece maxDimension'ı aşıyorsa orantılı küçült
    const scale = Math.min(1, maxDimension / Math.max(origW, origH));
    const targetW = Math.max(1, Math.round(origW * scale));
    const targetH = Math.max(1, Math.round(origH * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { file, originalSize, optimizedSize: originalSize, wasOptimized: false };
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Önce WebP dene (hem şeffaflığı korur hem JPEG'den %25-35 daha küçük)
    let mimeType = 'image/webp';
    let ext = 'webp';
    let bestBlob = await canvasToBlob(canvas, mimeType, initialQuality);

    // Tarayıcı WebP encode desteklemiyorsa beyaz arka planlı JPEG'e düş
    if (!bestBlob || bestBlob.type !== 'image/webp') {
      mimeType = 'image/jpeg';
      ext = 'jpg';
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = targetW;
      fallbackCanvas.height = targetH;
      const fCtx = fallbackCanvas.getContext('2d');
      if (fCtx) {
        fCtx.fillStyle = '#ffffff';
        fCtx.fillRect(0, 0, targetW, targetH);
        fCtx.imageSmoothingEnabled = true;
        fCtx.imageSmoothingQuality = 'high';
        fCtx.drawImage(img, 0, 0, targetW, targetH);
        bestBlob = await canvasToBlob(fallbackCanvas, mimeType, initialQuality);
        if (bestBlob && bestBlob.size > targetMaxBytes) {
          let q = initialQuality - 0.06;
          while (q >= minQuality) {
            const candidate = await canvasToBlob(fallbackCanvas, mimeType, q);
            if (candidate) {
              bestBlob = candidate;
              if (candidate.size <= targetMaxBytes) break;
            }
            q -= 0.06;
          }
        }
      }
    } else if (bestBlob.size > targetMaxBytes) {
      // Hedef boyutu aşıyorsa kaliteyi canlılığı bozmadan kademeli düşür
      let q = initialQuality - 0.05;
      while (q >= minQuality) {
        const candidate = await canvasToBlob(canvas, mimeType, q);
        if (candidate) {
          bestBlob = candidate;
          if (candidate.size <= targetMaxBytes) break;
        }
        q -= 0.05;
      }
    }

    if (!bestBlob) {
      return { file, originalSize, optimizedSize: originalSize, wasOptimized: false };
    }

    // Zaten çok küçük ve boyut küçülmediyse orijinali koru
    if (bestBlob.size >= originalSize && scale === 1) {
      return { file, originalSize, optimizedSize: originalSize, wasOptimized: false };
    }

    const baseName = file.name.replace(/\.[^/.]+$/, '') || 'image';
    const optimizedFile = new File([bestBlob], `${baseName}.${ext}`, {
      type: mimeType,
      lastModified: Date.now(),
    });

    return {
      file: optimizedFile,
      originalSize,
      optimizedSize: optimizedFile.size,
      wasOptimized: true,
    };
  } catch {
    return { file, originalSize, optimizedSize: originalSize, wasOptimized: false };
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}


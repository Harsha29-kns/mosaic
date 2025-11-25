export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

export const getAverageColor = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): [number, number, number] => {
  const imageData = ctx.getImageData(x, y, width, height);
  const data = imageData.data;
  let r = 0, g = 0, b = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  return [
    Math.round(r / pixelCount),
    Math.round(g / pixelCount),
    Math.round(b / pixelCount)
  ];
};

export const colorDistance = (
  color1: [number, number, number],
  color2: [number, number, number]
): number => {
  const [r1, g1, b1] = color1;
  const [r2, g2, b2] = color2;
  return Math.sqrt(
    Math.pow(r2 - r1, 2) +
    Math.pow(g2 - g1, 2) +
    Math.pow(b2 - b1, 2)
  );
};

export const findBestMatchingPhoto = (
  targetColor: [number, number, number],
  photoColors: Map<string, [number, number, number]>
): string => {
  let bestMatch = '';
  let minDistance = Infinity;

  photoColors.forEach((color, photoId) => {
    const distance = colorDistance(targetColor, color);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = photoId;
    }
  });

  return bestMatch;
};

export const createPhotoColorMap = async (
  photos: { id: string; url: string }[]
): Promise<Map<string, [number, number, number]>> => {
  const colorMap = new Map<string, [number, number, number]>();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  canvas.width = 50;
  canvas.height = 50;

  for (const photo of photos) {
    try {
      const img = await loadImage(photo.url);
      ctx.drawImage(img, 0, 0, 50, 50);
      const avgColor = getAverageColor(ctx, 0, 0, 50, 50);
      colorMap.set(photo.id, avgColor);
    } catch (error) {
      console.error(`Failed to process photo ${photo.id}:`, error);
    }
  }

  return colorMap;
};

export const correctImageOrientation = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const compressImage = (file: File, maxWidth = 1920): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.85);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

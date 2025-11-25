export const createShapeMask = (
  width: number,
  height: number,
  shapeType: string,
  shapeValue?: string
): boolean[][] => {
  const mask: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));
  const centerX = width / 2;
  const centerY = height / 2;

  switch (shapeType) {
    case 'circle':
      const radius = Math.min(width, height) * 0.45;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const distance = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );
          if (distance <= radius) {
            mask[y][x] = true;
          }
        }
      }
      break;

    case 'heart':
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const nx = (x - centerX) / (width * 0.4);
          const ny = (y - centerY * 0.8) / (height * 0.4);
          const heart = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * ny * ny * ny;
          if (heart <= 0) {
            mask[y][x] = true;
          }
        }
      }
      break;

    case 'star':
      const outerRadius = Math.min(width, height) * 0.45;
      const innerRadius = outerRadius * 0.4;
      const points = 5;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const angle = Math.atan2(dy, dx) + Math.PI / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angleSection = ((angle + Math.PI) / (2 * Math.PI)) * points;
          const t = angleSection % 1;
          const radius = innerRadius + (outerRadius - innerRadius) * (0.5 + 0.5 * Math.cos(2 * Math.PI * t));
          if (distance <= radius) {
            mask[y][x] = true;
          }
        }
      }
      break;

    case 'number':
    case 'letter':
      if (shapeValue) {
        drawTextMask(mask, width, height, shapeValue);
      }
      break;

    case 'silhouette':
    default:
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          mask[y][x] = true;
        }
      }
      break;
  }

  return mask;
};

const drawTextMask = (
  mask: boolean[][],
  width: number,
  height: number,
  text: string
): void => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'black';
  const fontSize = Math.min(width, height) * 0.7;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const brightness = data[i];
      mask[y][x] = brightness < 128;
    }
  }
};

export const removeBackground = async (imageUrl: string): Promise<string> => {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const cornerSamples = [
    [0, 0],
    [canvas.width - 1, 0],
    [0, canvas.height - 1],
    [canvas.width - 1, canvas.height - 1]
  ];

  let bgR = 0, bgG = 0, bgB = 0;
  cornerSamples.forEach(([x, y]) => {
    const i = (y * canvas.width + x) * 4;
    bgR += data[i];
    bgG += data[i + 1];
    bgB += data[i + 2];
  });
  bgR /= cornerSamples.length;
  bgG /= cornerSamples.length;
  bgB /= cornerSamples.length;

  const threshold = 80;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const diff = Math.sqrt(
      Math.pow(r - bgR, 2) +
      Math.pow(g - bgG, 2) +
      Math.pow(b - bgB, 2)
    );

    if (diff < threshold) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
};

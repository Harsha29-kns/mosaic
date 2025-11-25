import { useEffect, useRef, useState } from 'react';
import { Photo, MosaicConfig } from '../types';
import { loadImage, createPhotoColorMap, getAverageColor, findBestMatchingPhoto } from '../utils/imageProcessing';
import { createShapeMask } from '../utils/shapeGenerator';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';

interface MosaicCanvasProps {
  mainPhoto: Photo | null;
  tilePhotos: Photo[];
  config: MosaicConfig;
  showRevealAnimation: boolean;
  onRevealComplete?: () => void;
}

export default function MosaicCanvas({
  mainPhoto,
  tilePhotos,
  config,
  showRevealAnimation,
  onRevealComplete
}: MosaicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null);
  const [revealProgress, setRevealProgress] = useState(0);
  const tileMapRef = useRef<Map<string, Photo>>(new Map());

  useEffect(() => {
    if (mainPhoto && tilePhotos.length >= 5) {
      generateMosaic();
    }
  }, [mainPhoto, tilePhotos, config]);

  useEffect(() => {
    if (showRevealAnimation && revealProgress < 100) {
      const timer = setTimeout(() => {
        setRevealProgress(prev => {
          const next = Math.min(prev + 2, 100);
          if (next === 100 && onRevealComplete) {
            onRevealComplete();
          }
          return next;
        });
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [showRevealAnimation, revealProgress, onRevealComplete]);

  const generateMosaic = async () => {
    if (!canvasRef.current || !mainPhoto) return;

    setIsGenerating(true);
    setProgress(0);
    tileMapRef.current.clear();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    const mainImg = await loadImage(mainPhoto.url);
    setProgress(10);

    const maxWidth = 2400;
    let width = mainImg.width;
    let height = mainImg.height;

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(mainImg, 0, 0, width, height);
    setProgress(20);

    const cols = Math.floor(width / config.tileSize);
    const rows = Math.floor(height / config.tileSize);
    const tileWidth = width / cols;
    const tileHeight = height / rows;

    let shapeMask: boolean[][] | null = null;
    if (config.shapeType !== 'none') {
      shapeMask = createShapeMask(cols, rows, config.shapeType, config.shapeValue);
    }
    setProgress(30);

    const photoColorMap = await createPhotoColorMap(tilePhotos);
    setProgress(50);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })!;

    const totalTiles = cols * rows;
    let processedTiles = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (shapeMask && !shapeMask[row]?.[col]) {
          continue;
        }

        const x = col * tileWidth;
        const y = row * tileHeight;

        let targetColor: [number, number, number];
        if (config.colorMatching) {
          targetColor = getAverageColor(ctx, x, y, tileWidth, tileHeight);
        } else {
          targetColor = [128, 128, 128];
        }

        const photoId = findBestMatchingPhoto(targetColor, photoColorMap);
        const photo = tilePhotos.find(p => p.id === photoId);

        if (photo) {
          const tileKey = `${col}-${row}`;
          tileMapRef.current.set(tileKey, photo);

          try {
            const tileImg = await loadImage(photo.url);
            tempCtx.save();

            if (config.frameStyle === 'rounded') {
              tempCtx.beginPath();
              const radius = Math.min(tileWidth, tileHeight) * 0.1;
              tempCtx.roundRect(x, y, tileWidth, tileHeight, radius);
              tempCtx.clip();
            } else if (config.frameStyle === 'polaroid') {
              tempCtx.fillStyle = 'white';
              tempCtx.fillRect(x, y, tileWidth, tileHeight);
              const padding = tileWidth * 0.05;
              tempCtx.drawImage(tileImg, x + padding, y + padding, tileWidth - padding * 2, tileHeight - padding * 2);
              tempCtx.restore();
              processedTiles++;
              continue;
            }

            tempCtx.drawImage(tileImg, x, y, tileWidth, tileHeight);

            if (config.frameStyle === 'shadow') {
              tempCtx.strokeStyle = 'rgba(0,0,0,0.2)';
              tempCtx.lineWidth = 2;
              tempCtx.strokeRect(x + 1, y + 1, tileWidth - 2, tileHeight - 2);
            }

            tempCtx.restore();
          } catch (error) {
            console.error('Error drawing tile:', error);
          }
        }

        processedTiles++;
        if (processedTiles % 10 === 0) {
          setProgress(50 + (processedTiles / totalTiles) * 45);
        }
      }
    }

    ctx.clearRect(0, 0, width, height);
    if (!shapeMask) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(tempCanvas, 0, 0);

    setProgress(100);
    setIsGenerating(false);
    setRevealProgress(0);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !mainPhoto) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const cols = Math.floor(canvas.width / config.tileSize);
    const rows = Math.floor(canvas.height / config.tileSize);
    const tileWidth = canvas.width / cols;
    const tileHeight = canvas.height / rows;

    const col = Math.floor(x / tileWidth);
    const row = Math.floor(y / tileHeight);

    const tileKey = `${col}-${row}`;
    const photo = tileMapRef.current.get(tileKey);

    if (photo) {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
      modal.onclick = () => modal.remove();

      const img = document.createElement('img');
      img.src = photo.url;
      img.className = 'max-w-[90%] max-h-[90%] rounded-lg shadow-2xl';

      modal.appendChild(img);
      document.body.appendChild(modal);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !mainPhoto) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const cols = Math.floor(canvas.width / config.tileSize);
    const rows = Math.floor(canvas.height / config.tileSize);
    const tileWidth = canvas.width / cols;
    const tileHeight = canvas.height / rows;

    const col = Math.floor(x / tileWidth);
    const row = Math.floor(y / tileHeight);

    setHoveredTile({ x: col, y: row });
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'photo-mosaic.png';
    link.href = url;
    link.click();
  };

  const canvasStyle = showRevealAnimation ? {
    clipPath: `inset(0 ${100 - revealProgress}% 0 0)`
  } : {};

  return (
    <div ref={containerRef} className="relative">
      {isGenerating && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10 rounded-lg">
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-gray-700 font-medium">Generating mosaic... {Math.round(progress)}%</p>
        </div>
      )}

      <div className="mb-4 flex gap-2 justify-end">
        <button
          onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={() => setZoom(z => Math.min(3, z + 0.25))}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleDownload}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          title="Download"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-auto max-h-[600px] bg-white rounded-lg shadow-lg border-2 border-gray-200">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredTile(null)}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            cursor: 'pointer',
            ...canvasStyle,
            transition: showRevealAnimation ? 'clip-path 0.05s linear' : 'none'
          }}
          className="max-w-full"
        />
      </div>

      {hoveredTile && (
        <div className="mt-2 text-sm text-gray-600 text-center">
          Click on any tile to view the full photo
        </div>
      )}
    </div>
  );
}

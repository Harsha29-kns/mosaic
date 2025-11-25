import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Photo } from '../types';

interface PhotoSlideshowProps {
  photos: Photo[];
  autoPlay?: boolean;
  interval?: number;
}

export default function PhotoSlideshow({ photos, autoPlay = false, interval = 3000 }: PhotoSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, photos.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const openSlideshow = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Photo Gallery</h3>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
          >
            {isPlaying ? 'Pause' : 'Play'} Slideshow
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => openSlideshow(index)}
              className={`relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all ${
                index === currentIndex ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <img
                src={photo.url}
                alt={`Memory ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-4xl max-h-[80vh] px-16">
            <img
              src={photos[currentIndex].url}
              alt={`Slide ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="text-center mt-4 text-white">
              {currentIndex + 1} / {photos.length}
            </div>
          </div>

          <button
            onClick={goToNext}
            className="absolute right-4 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  );
}

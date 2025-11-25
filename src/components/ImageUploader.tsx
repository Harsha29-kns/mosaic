import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { Photo } from '../types';
import { correctImageOrientation, compressImage } from '../utils/imageProcessing';

interface ImageUploaderProps {
  type: 'main' | 'tiles';
  onUpload: (photos: Photo[]) => void;
  photos: Photo[];
  onRemove: (id: string) => void;
}

export default function ImageUploader({ type, onUpload, photos, onRemove }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const newPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const compressed = await compressImage(file);
          const url = await correctImageOrientation(compressed);
          newPhotos.push({
            id: `${Date.now()}-${i}`,
            url,
            file: compressed
          });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    }

    onUpload(newPhotos);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const isMain = type === 'main';
  const maxPhotos = isMain ? 1 : 500;

  return (
    <div className="w-full">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {isMain ? 'Main Photo' : 'Memory Photos'}
        </h3>
        <p className="text-sm text-gray-600">
          {isMain
            ? 'Upload the main photo that will be formed by the mosaic'
            : `Upload 5-500 photos (${photos.length} uploaded)`}
        </p>
      </div>

      {(!isMain || photos.length === 0) && (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-700 font-medium mb-2">
            {isMain ? 'Drop your main photo here' : 'Drop your photos here'}
          </p>
          <p className="text-sm text-gray-500">or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={!isMain}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {photos.length > 0 && (
        <div className={`grid gap-4 ${isMain ? 'grid-cols-1' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6'}`}>
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt="Uploaded"
                className="w-full h-24 object-cover rounded-lg shadow-sm"
              />
              <button
                onClick={() => onRemove(photo.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {!isMain && photos.length < maxPhotos && (
            <div
              onClick={handleClick}
              className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-all"
            >
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

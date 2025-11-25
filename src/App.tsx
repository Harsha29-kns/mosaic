import { useState, useRef } from 'react';
import { Photo, MosaicConfig, BirthdayConfig, AnimationConfig } from './types';
import ImageUploader from './components/ImageUploader';
import MosaicCanvas from './components/MosaicCanvas';
import MosaicControls from './components/MosaicControls';
import BirthdayPersonalization from './components/BirthdayPersonalization';
import AnimationControls from './components/AnimationControls';
import AudioPlayer from './components/AudioPlayer';
import PhotoSlideshow from './components/PhotoSlideshow';
import BirthdayPage from './components/BirthdayPage';
import { Eye, Settings, Wand2 } from 'lucide-react';

type View = 'editor' | 'preview';

function App() {
  const [view, setView] = useState<View>('editor');
  const [mainPhoto, setMainPhoto] = useState<Photo | null>(null);
  const [tilePhotos, setTilePhotos] = useState<Photo[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showRevealAnimation, setShowRevealAnimation] = useState(false);

  const [mosaicConfig, setMosaicConfig] = useState<MosaicConfig>({
    tileSize: 40,
    cols: 0,
    rows: 0,
    frameStyle: 'square',
    shapeType: 'none',
    colorMatching: true
  });

  const [birthdayConfig, setBirthdayConfig] = useState<BirthdayConfig>({
    name: '',
    age: 0,
    message: '',
    theme: 'party',
    backgroundColor: '#ffffff',
    showCountdown: false
  });

  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>({
    reveal: true,
    confetti: true,
    balloons: true,
    fireworks: false,
    fadeIn: true
  });

  const handleMainPhotoUpload = (photos: Photo[]) => {
    if (photos.length > 0) {
      setMainPhoto(photos[0]);
    }
  };

  const handleTilePhotosUpload = (photos: Photo[]) => {
    setTilePhotos((prev) => [...prev, ...photos]);
  };

  const handleRemoveMainPhoto = () => {
    setMainPhoto(null);
  };

  const handleRemoveTilePhoto = (id: string) => {
    setTilePhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePreview = () => {
    if (animationConfig.reveal) {
      setShowRevealAnimation(true);
    }
    setView('preview');
  };

  const handleBackToEditor = () => {
    setView('editor');
    setShowRevealAnimation(false);
  };

  const getMosaicImageUrl = (): string | undefined => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    return canvas?.toDataURL('image/png');
  };

  const canGenerateMosaic = mainPhoto && tilePhotos.length >= 5;

  if (view === 'preview') {
    return (
      <BirthdayPage
        mainPhoto={mainPhoto}
        birthdayConfig={birthdayConfig}
        animationConfig={animationConfig}
        mosaicImageUrl={getMosaicImageUrl()}
        onBack={handleBackToEditor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Wand2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Birthday Photo Mosaic Creator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Create stunning photo mosaics for unforgettable birthday celebrations
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-800">Setup</h2>
              </div>

              <div className="space-y-6">
                <ImageUploader
                  type="main"
                  onUpload={handleMainPhotoUpload}
                  photos={mainPhoto ? [mainPhoto] : []}
                  onRemove={handleRemoveMainPhoto}
                />

                <div className="border-t border-gray-200 pt-6">
                  <ImageUploader
                    type="tiles"
                    onUpload={handleTilePhotosUpload}
                    photos={tilePhotos}
                    onRemove={handleRemoveTilePhoto}
                  />
                </div>
              </div>

              {!canGenerateMosaic && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    {!mainPhoto
                      ? 'Please upload a main photo to get started.'
                      : `Please upload at least ${5 - tilePhotos.length} more photos to generate the mosaic.`}
                  </p>
                </div>
              )}
            </div>

            {canGenerateMosaic && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mosaic Preview</h2>
                <MosaicCanvas
                  mainPhoto={mainPhoto}
                  tilePhotos={tilePhotos}
                  config={mosaicConfig}
                  showRevealAnimation={false}
                />
              </div>
            )}

            {tilePhotos.length > 0 && (
              <PhotoSlideshow photos={tilePhotos} autoPlay={false} />
            )}
          </div>

          <div className="space-y-6">
            <MosaicControls config={mosaicConfig} onChange={setMosaicConfig} />

            <BirthdayPersonalization
              config={birthdayConfig}
              onChange={setBirthdayConfig}
            />

            <AnimationControls
              config={animationConfig}
              onChange={setAnimationConfig}
            />

            <AudioPlayer autoPlay={false} />

            <button
              onClick={handlePreview}
              disabled={!canGenerateMosaic}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                canGenerateMosaic
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Eye className="w-6 h-6" />
              Preview Birthday Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

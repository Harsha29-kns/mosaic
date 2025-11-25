import { useState } from 'react';
import { Photo, MosaicConfig, BirthdayConfig, AnimationConfig } from './types';
import ImageUploader from './components/ImageUploader';
import MosaicCanvas from './components/MosaicCanvas';
import MosaicControls from './components/MosaicControls';
import BirthdayPersonalization from './components/BirthdayPersonalization';
import AnimationControls from './components/AnimationControls';
import AudioPlayer from './components/AudioPlayer';
import PhotoSlideshow from './components/PhotoSlideshow';
import BirthdayPage from './components/BirthdayPage';
import Login from './components/Login';
import { Eye, Settings, Wand2, LogOut } from 'lucide-react';

type UserRole = 'admin' | 'user' | null;

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [mainPhoto, setMainPhoto] = useState<Photo | null>(null);
  const [tilePhotos, setTilePhotos] = useState<Photo[]>([]);
  const [mosaicDataUrl, setMosaicDataUrl] = useState<string>('');
  
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

  const handleMosaicGenerated = (dataUrl: string) => {
    setMosaicDataUrl(dataUrl);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  const canGenerateMosaic = mainPhoto && tilePhotos.length >= 5;

  if (!userRole) {
    return <Login onLogin={setUserRole} />;
  }

  // USER VIEW (READ ONLY)
  if (userRole === 'user') {
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/40 text-gray-800 rounded-lg backdrop-blur-sm transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
        <BirthdayPage
          mainPhoto={mainPhoto}
          birthdayConfig={birthdayConfig}
          animationConfig={animationConfig}
          mosaicImageUrl={mosaicDataUrl}
          onBack={handleLogout}
        />
        <div className="hidden">
           <AudioPlayer autoPlay={true} />
        </div>
      </>
    );
  }

  // ADMIN VIEW (CONTROLS)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mosaic Preview & Generation</h2>
                <MosaicCanvas
                  mainPhoto={mainPhoto}
                  tilePhotos={tilePhotos}
                  config={mosaicConfig}
                  showRevealAnimation={false}
                  onMosaicGenerated={handleMosaicGenerated}
                />
                <p className="mt-4 text-sm text-gray-500 text-center italic">
                  Note: The mosaic generated here will be what the User sees.
                </p>
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

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-800">
              <div className="flex items-center gap-2 font-semibold mb-2">
                 <Eye className="w-5 h-5" />
                 Preview User View
              </div>
              <p>
                To see exactly what the user sees, sign out and log in as <strong>user</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
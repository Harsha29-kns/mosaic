// src/components/AdminDashboard.tsx
import { useState } from 'react';
import ImageUploader from './ImageUploader';
import MosaicCanvas from './MosaicCanvas';
import MosaicControls from './MosaicControls';
import { Photo, MosaicConfig } from '../types';
import { createTimelineEvent, saveMosaic } from '../utils/api';
import { Upload, LayoutGrid, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'mosaic' | 'timeline'>('mosaic');
  
  // --- Mosaic State ---
  const [mainPhoto, setMainPhoto] = useState<Photo | null>(null);
  const [tilePhotos, setTilePhotos] = useState<Photo[]>([]);
  const [mosaicConfig, setMosaicConfig] = useState<MosaicConfig>({
    tileSize: 40, cols: 0, rows: 0, frameStyle: 'square',
    shapeType: 'none', colorMatching: true
  });

  // --- Timeline State ---
  const [timelineData, setTimelineData] = useState({
    year: '', title: '', description: ''
  });
  const [timelinePhotos, setTimelinePhotos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // --- Mosaic Handlers ---
  const handleMosaicGenerated = async (dataUrl: string) => {
    if (confirm("Mosaic generated! Do you want to save this for the User View?")) {
      try {
        await saveMosaic(dataUrl);
        alert("Mosaic saved to database successfully!");
      } catch (e) {
        console.error(e);
        alert("Failed to save mosaic to database.");
      }
    }
  };

  // --- Timeline Handlers ---
  const handleTimelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    formData.append('year', timelineData.year);
    formData.append('title', timelineData.title);
    formData.append('description', timelineData.description);
    
    timelinePhotos.forEach(file => {
      formData.append('photos', file);
    });

    try {
      await createTimelineEvent(formData);
      alert("Timeline Event Created Successfully!");
      setTimelineData({ year: '', title: '', description: '' });
      setTimelinePhotos([]);
    } catch (e) {
      console.error(e);
      alert("Error uploading timeline event. Check server logs.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('mosaic')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'mosaic' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <LayoutGrid className="w-4 h-4" /> Mosaic Studio
            </button>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'timeline' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Calendar className="w-4 h-4" /> Timeline Manager
            </button>
          </div>
        </header>

        {activeTab === 'mosaic' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">Mosaic Preview</h2>
              
              <div className="space-y-6">
                <ImageUploader 
                  type="main" 
                  onUpload={p => setMainPhoto(p[0])} 
                  photos={mainPhoto ? [mainPhoto] : []} 
                  onRemove={() => setMainPhoto(null)} 
                />
                <div className="border-t border-gray-100 pt-4">
                  <ImageUploader 
                    type="tiles" 
                    onUpload={p => setTilePhotos([...tilePhotos, ...p])} 
                    photos={tilePhotos} 
                    onRemove={(id) => setTilePhotos(prev => prev.filter(p => p.id !== id))} 
                  />
                </div>
              </div>
              
              <div className="mt-6">
                {mainPhoto && tilePhotos.length > 5 ? (
                  <MosaicCanvas 
                    mainPhoto={mainPhoto} 
                    tilePhotos={tilePhotos} 
                    config={mosaicConfig} 
                    showRevealAnimation={false}
                    onMosaicGenerated={handleMosaicGenerated}
                  />
                ) : (
                  <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                    Upload a main photo and at least 5 tile photos to generate
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <MosaicControls config={mosaicConfig} onChange={setMosaicConfig} />
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Timeline Memory</h2>
              <form onSubmit={handleTimelineSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year / Time Period</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 2018 or 'Childhood'" 
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={timelineData.year}
                      onChange={e => setTimelineData({...timelineData, year: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., College Days" 
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={timelineData.title}
                      onChange={e => setTimelineData({...timelineData, title: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    placeholder="Share a story about this time..." 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    value={timelineData.description}
                    onChange={e => setTimelineData({...timelineData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={e => e.target.files && setTimelinePhotos(Array.from(e.target.files))}
                      className="w-full cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-2">{timelinePhotos.length} files selected</p>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isUploading ? 'Uploading...' : <><Upload className="w-5 h-5" /> Upload Memory</>}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
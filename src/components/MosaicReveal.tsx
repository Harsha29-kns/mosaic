// src/components/MosaicReveal.tsx
import { useEffect, useState } from 'react';
import { getLatestMosaic } from '../utils/api';
import { Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MosaicReveal() {
  const [mosaicUrl, setMosaicUrl] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    getLatestMosaic()
      .then(res => {
        if (res.data && res.data.imageUrl) {
          setMosaicUrl(res.data.imageUrl);
        }
      })
      .catch(err => console.error("Mosaic fetch error", err));
  }, []);

  if (!mosaicUrl) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black opacity-50" />

      {!isRevealed ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsRevealed(true)}
          className="z-10 flex flex-col items-center gap-6 text-white cursor-pointer"
        >
          <div className="relative">
            <Gift className="w-32 h-32 text-yellow-400 animate-bounce" />
            <div className="absolute -inset-4 bg-yellow-400/20 blur-xl rounded-full animate-pulse" />
          </div>
          <span className="text-3xl font-bold tracking-wider">Tap to Open the Surprise</span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="z-10 max-w-5xl w-full bg-white p-2 rounded-lg shadow-2xl"
        >
          <img 
            src={mosaicUrl} 
            alt="Final Birthday Mosaic" 
            className="w-full h-auto max-h-[80vh] object-contain rounded" 
          />
          <div className="text-center mt-6 text-white">
            <h2 className="text-4xl font-bold mb-2">Happy Birthday!</h2>
            <p className="text-gray-400">A collection of beautiful memories</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
// src/components/Timeline.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTimeline } from '../utils/api';
import { TimelineEvent } from '../types';
import { X } from 'lucide-react';

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    getTimeline()
      .then((res) => {
        setEvents(res.data);
        if (res.data.length > 0) setActiveEvent(res.data[0]);
      })
      .catch(err => console.error("Failed to load timeline", err));
  }, []);

  // Determine background image (fallback if activeEvent has no bg)
  const currentBg = activeEvent?.backgroundBlurImage || activeEvent?.photos?.[0] || '';

  if (events.length === 0) {
    return <div className="py-20 text-center text-gray-500">Loading Timeline memories...</div>;
  }

  return (
    <div className="relative min-h-screen py-20 px-4 overflow-hidden transition-all duration-700">
      {/* Dynamic Blurred Background */}
      {currentBg && (
        <div 
          className="fixed inset-0 z-0 transition-all duration-1000 scale-110 blur-xl opacity-40"
          style={{
            backgroundImage: `url(${currentBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 drop-shadow-sm">
          Journey Through Time
        </h2>

        <div className="space-y-32">
          {events.map((event, index) => (
            <motion.div
              key={event._id || index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-40% 0px -40% 0px" }}
              onViewportEnter={() => setActiveEvent(event)}
              className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Text Content */}
              <div className="flex-1 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full">
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-bold mb-4">
                  {event.year}
                </span>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{event.title}</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>

              {/* Photo Stack */}
              <div className="flex-1 relative group cursor-pointer w-full max-w-md" onClick={() => setSelectedPhoto(event.photos[0])}>
                {event.photos && event.photos.length > 0 ? (
                  <>
                    <div className="absolute inset-0 bg-white/50 rounded-xl transform rotate-6 scale-95 transition-transform group-hover:rotate-12" />
                    <div className="absolute inset-0 bg-white rounded-xl transform -rotate-3 scale-95 transition-transform group-hover:-rotate-6 border-2 border-gray-100" />
                    <img 
                      src={event.photos[0]} 
                      alt={event.title}
                      className="relative rounded-xl shadow-lg w-full h-64 object-cover transform transition-transform group-hover:scale-105"
                    />
                    {event.photos.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        +{event.photos.length - 1} more
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">No Photos</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full">
              <X className="w-8 h-8" />
            </button>
            <img src={selectedPhoto} alt="Memory" className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// src/components/WishesWall.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Rocket } from 'lucide-react';
import { getWishes, sendWish, likeWish } from '../utils/api';
import { Wish } from '../types';

export default function WishesWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState({ author: '', message: '' });
  const [isLaunching, setIsLaunching] = useState(false);

  const refreshWishes = () => {
    getWishes().then(res => setWishes(res.data)).catch(console.error);
  };

  useEffect(() => {
    refreshWishes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);

    const formData = new FormData();
    formData.append('author', newWish.author);
    formData.append('message', newWish.message);

    // Delay actual submission slightly to show rocket taking off
    setTimeout(async () => {
      try {
        await sendWish(formData);
        refreshWishes();
        setNewWish({ author: '', message: '' });
      } catch (error) {
        console.error("Failed to send wish", error);
      }
      setIsLaunching(false);
    }, 2000);
  };

  const handleLike = async (id: string) => {
    try {
      await likeWish(id);
      // Optimistic update
      setWishes(wishes.map(w => w._id === id ? { ...w, reactions: w.reactions + 1 } : w));
    } catch (error) {
      console.error("Failed to like", error);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-indigo-900 mb-12">
          Wishes & Love 💌
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Wish Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl sticky top-24 z-20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Rocket className="text-indigo-600" /> Send a Wish
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newWish.author}
                  onChange={e => setNewWish({...newWish, author: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
                <textarea
                  placeholder="Write your heartfelt message..."
                  value={newWish.message}
                  onChange={e => setNewWish({...newWish, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 h-32 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isLaunching}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLaunching ? 'Launching...' : <><Send className="w-4 h-4" /> Launch Wish</>}
                </button>
              </form>
            </div>
          </div>

          {/* Wishes Grid */}
          <div className="md:col-span-2 grid gap-6 grid-cols-1 sm:grid-cols-2">
            <AnimatePresence>
              {wishes.map((wish) => (
                <motion.div
                  key={wish._id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between"
                >
                  <p className="text-gray-700 text-lg mb-4 italic">"{wish.message}"</p>
                  <div className="flex justify-between items-end border-t pt-4 mt-auto">
                    <span className="font-bold text-indigo-900">- {wish.author}</span>
                    <button 
                      onClick={() => wish._id && handleLike(wish._id)}
                      className="flex items-center gap-1 text-pink-500 hover:bg-pink-50 px-2 py-1 rounded-full transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${wish.reactions > 0 ? 'fill-current' : ''}`} />
                      <span className="text-sm">{wish.reactions}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {wishes.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-10">
                No wishes yet. Be the first to launch one! 🚀
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rocket Animation Overlay */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ y: "100vh", opacity: 1 }}
            animate={{ y: "-100vh", opacity: 0 }}
            transition={{ duration: 2, ease: "easeIn" }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <Rocket className="w-48 h-48 text-orange-500 drop-shadow-2xl filter" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
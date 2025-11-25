// src/components/Hero.tsx
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero({ onStartJourney }: { onStartJourney: () => void }) {
  // You can make this date dynamic if you want
  const targetDate = new Date("2025-10-29"); 

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft as { days: number, hours: number, minutes: number, seconds: number };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-pink-100 to-blue-100 flex flex-col items-center justify-center">
      <Confetti numberOfPieces={150} recycle={true} gravity={0.05} />
      
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10 text-center px-4"
      >
        {/* Hero Photo Placeholder */}
        <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-200">
           {/* Replace with a real image URL or fetch from config */}
           <div className="w-full h-full flex items-center justify-center text-gray-400">
             Birthday Star Photo
           </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4 font-serif">
          Happy Birthday!
        </h1>

        {/* Countdown Timer */}
        <div className="flex gap-3 md:gap-6 justify-center mt-8 text-gray-700">
          {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
            <div key={unit} className="bg-white/80 backdrop-blur-sm p-3 md:p-4 rounded-xl shadow-lg w-20 md:w-24">
              <div className="text-2xl md:text-4xl font-bold text-blue-600">
                {/* @ts-ignore */ timeLeft[unit] !== undefined ? String(timeLeft[unit]).padStart(2, '0') : '00'}
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-wider mt-1">{unit}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.button
        onClick={onStartJourney}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
      >
        <span className="text-sm font-medium uppercase tracking-widest">Begin the Journey</span>
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
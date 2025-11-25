import { useEffect, useState } from 'react';
import { Photo, BirthdayConfig, AnimationConfig } from '../types';
import { Confetti, Balloons, Fireworks, FadeIn } from './Animations';
import { Cake, Calendar, Heart } from 'lucide-react';

interface BirthdayPageProps {
  mainPhoto: Photo | null;
  birthdayConfig: BirthdayConfig;
  animationConfig: AnimationConfig;
  mosaicImageUrl?: string;
  onBack: () => void;
}

export default function BirthdayPage({
  mainPhoto,
  birthdayConfig,
  animationConfig,
  mosaicImageUrl,
  onBack
}: BirthdayPageProps) {
  const [daysUntil, setDaysUntil] = useState<number | null>(null);

  useEffect(() => {
    if (birthdayConfig.showCountdown && birthdayConfig.birthdayDate) {
      const today = new Date();
      const birthday = new Date(birthdayConfig.birthdayDate);
      const diff = birthday.getTime() - today.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysUntil(days);
    }
  }, [birthdayConfig]);

  const getThemeGradient = () => {
    switch (birthdayConfig.theme) {
      case 'party':
        return 'from-pink-400 via-purple-400 to-blue-400';
      case 'neon':
        return 'from-cyan-400 via-pink-400 to-yellow-400';
      case 'elegant':
        return 'from-amber-400 via-rose-400 to-pink-400';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const content = (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: birthdayConfig.backgroundColor }}
    >
      {animationConfig.confetti && <Confetti />}
      {animationConfig.balloons && <Balloons />}
      {animationConfig.fireworks && <Fireworks />}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className={`inline-block bg-gradient-to-r ${getThemeGradient()} text-transparent bg-clip-text mb-4`}>
            <h1 className="text-5xl md:text-7xl font-bold">
              Happy Birthday{birthdayConfig.name ? `, ${birthdayConfig.name}` : ''}!
            </h1>
          </div>

          {birthdayConfig.age > 0 && (
            <div className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              <Cake className="w-10 h-10 text-pink-500" />
              <span>{birthdayConfig.age} Years Old</span>
              <Cake className="w-10 h-10 text-pink-500" />
            </div>
          )}

          {birthdayConfig.showCountdown && daysUntil !== null && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-800">
                {daysUntil > 0
                  ? `${daysUntil} days until birthday!`
                  : daysUntil === 0
                  ? 'Today is the big day!'
                  : 'Hope you had a great birthday!'}
              </span>
            </div>
          )}
        </div>

        {mosaicImageUrl && (
          <div className="mb-12 flex justify-center">
            <div className="bg-white p-4 rounded-2xl shadow-2xl max-w-4xl">
              <img
                src={mosaicImageUrl}
                alt="Birthday Mosaic"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        )}

        {birthdayConfig.message && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-800">A Special Message</h2>
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-center whitespace-pre-wrap">
              {birthdayConfig.message}
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  );

  return animationConfig.fadeIn ? <FadeIn duration={2}>{content}</FadeIn> : content;
}

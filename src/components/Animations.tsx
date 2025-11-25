import { useEffect, useState } from 'react';

export function Confetti() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  );
}

export function Balloons() {
  const [balloons, setBalloons] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
    const newBalloons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 8 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setBalloons(newBalloons);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="absolute animate-balloon"
          style={{
            left: `${balloon.left}%`,
            bottom: '-100px',
            animationDelay: `${balloon.delay}s`,
            animationDuration: `${balloon.duration}s`
          }}
        >
          <div
            className="w-12 h-14 rounded-full shadow-lg relative"
            style={{ backgroundColor: balloon.color }}
          >
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-400"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Fireworks() {
  const [bursts, setBursts] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
    const interval = setInterval(() => {
      const newBurst = {
        id: Date.now(),
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 40,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setBursts(prev => [...prev, newBurst]);

      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== newBurst.id));
      }, 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute"
          style={{
            left: `${burst.x}%`,
            top: `${burst.y}%`
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-firework"
              style={{
                backgroundColor: burst.color,
                transform: `rotate(${i * 30}deg)`,
                animationDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function FadeIn({ children, duration = 1 }: { children: React.ReactNode; duration?: number }) {
  return (
    <div
      className="animate-fadeIn"
      style={{ animationDuration: `${duration}s` }}
    >
      {children}
    </div>
  );
}

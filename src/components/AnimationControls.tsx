import { AnimationConfig } from '../types';
import { Sparkles } from 'lucide-react';

interface AnimationControlsProps {
  config: AnimationConfig;
  onChange: (config: AnimationConfig) => void;
}

export default function AnimationControls({ config, onChange }: AnimationControlsProps) {
  const animations = [
    { key: 'reveal', label: 'Mosaic Reveal Animation', description: 'Tile-by-tile build effect' },
    { key: 'fadeIn', label: 'Fade In Effect', description: 'Slow fade-in on page load' },
    { key: 'confetti', label: 'Confetti Animation', description: 'Falling confetti particles' },
    { key: 'balloons', label: 'Floating Balloons', description: 'Rising balloon animation' },
    { key: 'fireworks', label: 'Fireworks', description: 'Burst effects on page' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Animations</h3>
      </div>

      <div className="space-y-3">
        {animations.map((animation) => (
          <label
            key={animation.key}
            className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
          >
            <input
              type="checkbox"
              checked={config[animation.key as keyof AnimationConfig] as boolean}
              onChange={(e) => onChange({ ...config, [animation.key]: e.target.checked })}
              className="mt-1 w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-800">{animation.label}</div>
              <div className="text-xs text-gray-500">{animation.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

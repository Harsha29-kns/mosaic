import { BirthdayConfig } from '../types';
import { Palette, Calendar } from 'lucide-react';

interface BirthdayPersonalizationProps {
  config: BirthdayConfig;
  onChange: (config: BirthdayConfig) => void;
}

export default function BirthdayPersonalization({ config, onChange }: BirthdayPersonalizationProps) {
  const themes = [
    { label: 'Party', value: 'party', gradient: 'from-pink-400 to-purple-500' },
    { label: 'Neon', value: 'neon', gradient: 'from-cyan-400 to-pink-500' },
    { label: 'Minimal', value: 'minimal', gradient: 'from-gray-300 to-gray-400' },
    { label: 'Elegant', value: 'elegant', gradient: 'from-amber-400 to-rose-400' }
  ];

  const backgroundColors = [
    { label: 'White', value: '#ffffff' },
    { label: 'Light Blue', value: '#e0f2fe' },
    { label: 'Light Pink', value: '#fce7f3' },
    { label: 'Light Yellow', value: '#fef3c7' },
    { label: 'Light Purple', value: '#f3e8ff' },
    { label: 'Light Green', value: '#d1fae5' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Personalization</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => onChange({ ...config, name: e.target.value })}
            placeholder="Enter birthday person's name"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={config.age}
            onChange={(e) => onChange({ ...config, age: parseInt(e.target.value) || 0 })}
            placeholder="Enter age"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Birthday Message
          </label>
          <textarea
            value={config.message}
            onChange={(e) => onChange({ ...config, message: e.target.value })}
            placeholder="Write a special birthday message..."
            rows={4}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => onChange({ ...config, theme: theme.value as any })}
                className={`py-2 px-4 rounded-lg border-2 transition-all ${
                  config.theme === theme.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className={`h-2 w-full rounded mb-1 bg-gradient-to-r ${theme.gradient}`} />
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <div className="grid grid-cols-3 gap-2">
            {backgroundColors.map((color) => (
              <button
                key={color.value}
                onClick={() => onChange({ ...config, backgroundColor: color.value })}
                className={`py-2 px-3 rounded-lg border-2 transition-all ${
                  config.backgroundColor === color.value
                    ? 'border-blue-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div
                  className="h-6 w-full rounded mb-1"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs">{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300">
            <input
              type="checkbox"
              checked={config.showCountdown}
              onChange={(e) => onChange({ ...config, showCountdown: e.target.checked })}
              className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
            />
            <Calendar className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <div className="font-medium text-gray-800">Show Countdown</div>
              <div className="text-xs text-gray-500">Display days until birthday</div>
            </div>
          </label>
        </div>

        {config.showCountdown && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birthday Date
            </label>
            <input
              type="date"
              value={config.birthdayDate || ''}
              onChange={(e) => onChange({ ...config, birthdayDate: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

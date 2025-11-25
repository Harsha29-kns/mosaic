import { MosaicConfig } from '../types';
import { Sliders } from 'lucide-react';

interface MosaicControlsProps {
  config: MosaicConfig;
  onChange: (config: MosaicConfig) => void;
}

export default function MosaicControls({ config, onChange }: MosaicControlsProps) {
  const tileSizes = [
    { label: 'Small', value: 20 },
    { label: 'Medium', value: 40 },
    { label: 'Large', value: 60 }
  ];

  const frameStyles = [
    { label: 'Square', value: 'square' },
    { label: 'Rounded', value: 'rounded' },
    { label: 'Polaroid', value: 'polaroid' },
    { label: 'Shadow', value: 'shadow' }
  ];

  const shapeTypes = [
    { label: 'Full Image', value: 'none' },
    { label: 'Circle', value: 'circle' },
    { label: 'Heart', value: 'heart' },
    { label: 'Star', value: 'star' },
    { label: 'Number', value: 'number' },
    { label: 'Letter', value: 'letter' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Mosaic Settings</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tile Size
          </label>
          <div className="flex gap-2">
            {tileSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => onChange({ ...config, tileSize: size.value })}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  config.tileSize === size.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frame Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {frameStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => onChange({ ...config, frameStyle: style.value as any })}
                className={`py-2 px-4 rounded-lg border-2 transition-all ${
                  config.frameStyle === style.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shape
          </label>
          <select
            value={config.shapeType}
            onChange={(e) => onChange({ ...config, shapeType: e.target.value as any, shapeValue: '' })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            {shapeTypes.map((shape) => (
              <option key={shape.value} value={shape.value}>
                {shape.label}
              </option>
            ))}
          </select>
        </div>

        {config.shapeType === 'number' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Number
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={config.shapeValue || ''}
              onChange={(e) => onChange({ ...config, shapeValue: e.target.value })}
              placeholder="Enter age (1-100)"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        {config.shapeType === 'letter' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Letter
            </label>
            <input
              type="text"
              maxLength={1}
              value={config.shapeValue || ''}
              onChange={(e) => onChange({ ...config, shapeValue: e.target.value.toUpperCase() })}
              placeholder="Enter letter (A-Z)"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.colorMatching}
              onChange={(e) => onChange({ ...config, colorMatching: e.target.checked })}
              className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Enable Color Matching
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-7">
            Match tile colors to the original image for better quality
          </p>
        </div>
      </div>
    </div>
  );
}

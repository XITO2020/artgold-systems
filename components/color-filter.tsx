import React from 'react';
import { motion } from 'framer-motion';
import { COLOR_FILTERS } from '@/types';

interface ColorFilterProps {
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
}

export const ColorFilter: React.FC<ColorFilterProps> = ({
  selectedColor,
  onColorSelect
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_FILTERS.map((color) => (
        <motion.button
          key={color.name}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onColorSelect(color.value)}
          className={`w-8 h-8 rounded-full border-2 ${
            selectedColor === color.value
              ? 'border-rose-500 ring-2 ring-rose-300'
              : 'border-gray-300'
          }`}
          style={{ backgroundColor: color.value }}
          title={color.label}
        />
      ))}
    </div>
  );
};
"use client";

import { useState, useEffect } from 'react';
import { Slider } from "@ui/slider";
import { Input } from "@ui/input";

interface PriceRangeFilterProps {
  range: {
    min: number;
    max: number;
  };
  onChange: (range: { min: number; max: number }) => void;
}

export function PriceRangeFilter({ range, onChange }: PriceRangeFilterProps) {
  const [localRange, setLocalRange] = useState(range);

  useEffect(() => {
    setLocalRange(range);
  }, [range]);

  const handleSliderChange = (value: number[]) => {
    const newRange = {
      min: value[0],
      max: value[1]
    };
    setLocalRange(newRange);
    onChange(newRange);
  };

  const handleInputChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    const newRange = {
      ...localRange,
      [type]: numValue
    };
    setLocalRange(newRange);
    onChange(newRange);
  };

  return (
    <div className="space-y-4">
      <Slider
        defaultValue={[localRange.min, localRange.max]}
        max={10000}
        step={100}
        value={[localRange.min, localRange.max]}
        onValueChange={handleSliderChange}
      />
      
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="number"
            value={localRange.min}
            onChange={(e) => handleInputChange('min', e.target.value)}
            min={0}
            max={localRange.max}
            placeholder="Min"
          />
        </div>
        <div className="flex-1">
          <Input
            type="number"
            value={localRange.max}
            onChange={(e) => handleInputChange('max', e.target.value)}
            min={localRange.min}
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Star } from 'lucide-react';

interface RatingScaleProps {
  value?: number;
  onChange?: (value: number) => void;
  maxScore?: number;
  readOnly?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingScale({
  value = 0,
  onChange,
  maxScore = 5,
  readOnly = false,
  label,
  size = 'md',
}: RatingScaleProps) {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="flex items-center gap-2">
        {[...new Array(maxScore)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= value;

          return (
            <button
              key={index}
              onClick={() => !readOnly && onChange?.(starValue)}
              disabled={readOnly}
              className={`transition-transform ${!readOnly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
            >
              <Star
                className={`${sizeMap[size]} ${
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          );
        })}
        {value > 0 && <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{value}/{maxScore}</span>}
      </div>
    </div>
  );
}

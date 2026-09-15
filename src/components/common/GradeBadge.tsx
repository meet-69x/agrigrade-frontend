import React from 'react';
import type { GradeType } from '../../types';

interface GradeBadgeProps {
  grade: GradeType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  confidence?: number;
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({
  grade,
  size = 'md',
  showLabel = true,
  confidence,
}) => {
  const getStyle = () => {
    switch (grade) {
      case 'A':
        return {
          bg: 'bg-[#D4FF3F]/10',
          text: 'text-[#D4FF3F]',
          border: 'border-[#D4FF3F]/40',
          dot: 'bg-[#D4FF3F]',
          label: 'Grade A',
        };
      case 'B':
        return {
          bg: 'bg-[#FFB800]/10',
          text: 'text-[#FFB800]',
          border: 'border-[#FFB800]/40',
          dot: 'bg-[#FFB800]',
          label: 'Grade B',
        };
      case 'C':
        return {
          bg: 'bg-[#FF4444]/10',
          text: 'text-[#FF4444]',
          border: 'border-[#FF4444]/40',
          dot: 'bg-[#FF4444]',
          label: 'Grade C',
        };
    }
  };

  const style = getStyle();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs rounded',
    md: 'px-3 py-1 text-xs rounded-md font-mono font-semibold',
    lg: 'px-4 py-1.5 text-sm rounded-lg font-mono font-bold tracking-wide',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-2 border ${style.bg} ${style.text} ${style.border} ${sizeClasses} backdrop-blur-md transition-colors`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
      <span>{showLabel ? style.label : `Grade ${grade}`}</span>
      {confidence !== undefined && (
        <span className="font-mono text-[10px] opacity-70 pl-1 border-l border-current">
          {confidence.toFixed(1)}%
        </span>
      )}
    </span>
  );
};

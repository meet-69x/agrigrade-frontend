import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'glass';
  className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(position.x, springConfig);
  const springY = useSpring(position.y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Calculate displacement distance (max 12px shift)
    const distanceX = (e.clientX - centerX) * 0.25;
    const distanceY = (e.clientY - centerY) * 0.25;
    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#D4FF3F] text-[#0B0D0A] font-semibold hover:bg-[#C2F02B] shadow-lime-glow';
      case 'secondary':
        return 'bg-[#FF6B35] text-white font-semibold hover:bg-[#E05A29]';
      case 'glass':
        return 'bg-white/[0.04] text-[#F4F1E8] border border-white/10 hover:border-[#D4FF3F] hover:text-[#D4FF3F] backdrop-blur-md';
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block"
    >
      <button
        onClick={onClick}
        className={`px-7 py-3.5 rounded-xl text-sm tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${getVariantStyles()} ${className}`}
      >
        {children}
      </button>
    </motion.div>
  );
};

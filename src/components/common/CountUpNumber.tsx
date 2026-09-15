import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface CountUpNumberProps {
  end: number;
  decimals?: number;
  duration?: number;
  unit?: string;
  className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  end,
  decimals = 0,
  duration = 2000,
  unit = '',
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setIsFocused(true);
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            setCount(easeOutProgress * end);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <motion.span
      ref={elementRef}
      initial={{ filter: 'blur(10px)', opacity: 0.3 }}
      animate={{
        filter: isFocused ? 'blur(0px)' : 'blur(10px)',
        opacity: isFocused ? 1 : 0.3,
      }}
      transition={{ duration: 0.8 }}
      className={`font-mono ${className}`}
    >
      {count.toFixed(decimals)}
      {unit}
    </motion.span>
  );
};

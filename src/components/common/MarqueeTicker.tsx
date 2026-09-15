import React from 'react';

interface MarqueeTickerProps {
  items?: string[];
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  items = [
    'GRADE A COMMERCIAL',
    'GRADE B RETAIL',
    'GRADE C PROCESSING',
    '100% OBJECTIVE CV',
    '3.2s SCAN SPEED',
    'IS 4805 COMPLIANT',
    'LAB GRADE ACCURACY',
    'APMC INTEGRATED',
  ],
}) => {
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-[#14170F]/80 border-y border-[#2A2E22] py-3 select-none backdrop-blur-md">
      <div className="flex w-max animate-marquee space-x-8">
        {repeatedItems.map((text, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs font-mono tracking-widest text-[#8C9080]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F]" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

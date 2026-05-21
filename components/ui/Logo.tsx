import React from 'react';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path 
          id="blade" 
          d="M50 50 Q65 40 85 50 Q65 60 50 50" 
          fill="currentColor"
        />
      </defs>
      <g transform="translate(50,50)">
        {[...Array(14)].map((_, i) => (
          <path
            key={i}
            d="M0,0 C10,-15 35,-15 45,0 C35,-8 10,-8 0,0"
            fill={i % 2 === 0 ? '#005596' : '#4DB9E7'}
            transform={`rotate(${i * (360 / 14)}) translate(2, 0)`}
          />
        ))}
      </g>
    </svg>
  );
};

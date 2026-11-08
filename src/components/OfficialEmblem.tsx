import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
}

export const OfficialEmblem: React.FC<EmblemProps> = ({ className = 'w-12 h-12', size = 48 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Outer Circular Ring with Iraq Flag & Gold Accent */}
        <circle cx="50" cy="50" r="47" fill="#0F2C59" stroke="#C5A880" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#C5A880" strokeWidth="1" strokeDasharray="3 2" />

        {/* Iraqi Flag Mini Bunting arc at top */}
        <path d="M 20 28 A 40 40 0 0 1 80 28" stroke="#DC2626" strokeWidth="2.5" fill="none" />

        {/* Central Babylon Lion & Palm Motif Symbolism */}
        {/* Palm Fronds */}
        <path
          d="M 50 22 C 50 35, 50 68, 50 78"
          stroke="#C5A880"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 50 35 C 38 25, 26 36, 28 45 C 36 45, 45 40, 50 42"
          fill="#C5A880"
          opacity="0.9"
        />
        <path
          d="M 50 35 C 62 25, 74 36, 72 45 C 64 45, 55 40, 50 42"
          fill="#C5A880"
          opacity="0.9"
        />
        <path
          d="M 50 46 C 35 40, 24 50, 29 58 C 38 56, 45 52, 50 54"
          fill="#A38153"
        />
        <path
          d="M 50 46 C 65 40, 76 50, 71 58 C 62 56, 55 52, 50 54"
          fill="#A38153"
        />

        {/* Historic Babylon Ishtar Gate & Agriculture Shield Base */}
        <path
          d="M 33 62 L 67 62 L 63 80 L 50 86 L 37 80 Z"
          fill="#FAF9F6"
          stroke="#C5A880"
          strokeWidth="1.5"
        />

        {/* Wheat Ear / Stalks representing Agriculture Ministry */}
        <path
          d="M 43 68 L 47 66 L 47 75 L 43 78 Z"
          fill="#0F2C59"
        />
        <path
          d="M 57 68 L 53 66 L 53 75 L 57 78 Z"
          fill="#0F2C59"
        />
        <circle cx="50" cy="73" r="2.5" fill="#C5A880" />

        {/* Star */}
        <polygon
          points="50,17 52,22 57,22 53,25 55,30 50,27 45,30 47,25 43,22 48,22"
          fill="#C5A880"
        />
      </svg>
    </div>
  );
};

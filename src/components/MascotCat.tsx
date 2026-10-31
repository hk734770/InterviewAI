import React from 'react';

interface MascotCatProps {
  className?: string;
  size?: number;
}

export const MascotCat: React.FC<MascotCatProps> = ({ className = '', size = 160 }) => {
  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        className="drop-shadow-[0_10px_25px_rgba(59,130,246,0.35)]"
      >
        <defs>
          <radialGradient id="catAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="catFur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="catBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="tieRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="clipBoardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="goldStar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Aura */}
        <circle cx="100" cy="100" r="95" fill="url(#catAura)" />

        {/* Confetti Particles */}
        <rect x="25" y="45" width="6" height="4" rx="1" fill="#f43f5e" transform="rotate(25 25 45)" opacity="0.8" />
        <rect x="165" y="35" width="5" height="7" rx="1" fill="#fbbf24" transform="rotate(-15 165 35)" opacity="0.85" />
        <rect x="180" y="85" width="4" height="6" rx="1" fill="#38bdf8" transform="rotate(40 180 85)" opacity="0.8" />
        <rect x="20" y="125" width="7" height="4" rx="1" fill="#a855f7" transform="rotate(-30 20 125)" opacity="0.75" />
        <rect x="40" y="20" width="5" height="5" rx="1" fill="#10b981" transform="rotate(12 40 20)" opacity="0.8" />
        <polygon points="170,140 172,146 178,146 173,150 175,156 170,152 165,156 167,150 162,146 168,146" fill="#fbbf24" opacity="0.8" />

        {/* Cat Ears */}
        {/* Left Ear */}
        <polygon points="50,45 78,82 42,78" fill="url(#catFur)" />
        <polygon points="52,50 72,78 46,75" fill="#f472b6" opacity="0.8" />
        {/* Futuristic Ear Neon Bars */}
        <line x1="48" y1="58" x2="62" y2="70" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" filter="url(#softGlow)" />
        <line x1="53" y1="55" x2="65" y2="65" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right Ear */}
        <polygon points="150,45 158,78 122,82" fill="url(#catFur)" />
        <polygon points="148,50 154,75 128,78" fill="#f472b6" opacity="0.8" />
        <line x1="152" y1="58" x2="138" y2="70" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" filter="url(#softGlow)" />
        <line x1="147" y1="55" x2="135" y2="65" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Tail */}
        <path d="M140,150 Q185,145 175,120 Q168,105 155,125" fill="url(#catFur)" />

        {/* Body */}
        <ellipse cx="100" cy="140" rx="46" ry="42" fill="url(#catFur)" />
        <ellipse cx="100" cy="142" rx="30" ry="28" fill="url(#catBelly)" />

        {/* Feet */}
        <ellipse cx="80" cy="176" rx="14" ry="10" fill="url(#catFur)" />
        <ellipse cx="120" cy="176" rx="14" ry="10" fill="url(#catFur)" />
        <ellipse cx="80" cy="177" rx="8" ry="5" fill="#38bdf8" opacity="0.6" />
        <ellipse cx="120" cy="177" rx="8" ry="5" fill="#38bdf8" opacity="0.6" />

        {/* Cat Head */}
        <circle cx="100" cy="95" r="48" fill="url(#catFur)" />
        {/* Soft Cheeks Blush */}
        <circle cx="68" cy="105" r="9" fill="#fb7185" opacity="0.5" />
        <circle cx="132" cy="105" r="9" fill="#fb7185" opacity="0.5" />

        {/* Glasses Wireframe (Tortoiseshell/Golden) */}
        {/* Left Lens */}
        <circle cx="78" cy="94" r="19" fill="none" stroke="#b45309" strokeWidth="3.5" />
        <circle cx="78" cy="94" r="18" fill="rgba(255,255,255,0.15)" stroke="#f59e0b" strokeWidth="1" />
        {/* Right Lens */}
        <circle cx="122" cy="94" r="19" fill="none" stroke="#b45309" strokeWidth="3.5" />
        <circle cx="122" cy="94" r="18" fill="rgba(255,255,255,0.15)" stroke="#f59e0b" strokeWidth="1" />
        {/* Bridge */}
        <path d="M96,92 Q100,89 104,92" fill="none" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />

        {/* Big Expressive Eyes */}
        <ellipse cx="78" cy="94" rx="10" ry="13" fill="#312e81" />
        <circle cx="75" cy="89" r="4" fill="#ffffff" />
        <circle cx="81" cy="98" r="2" fill="#ffffff" />

        <ellipse cx="122" cy="94" rx="10" ry="13" fill="#312e81" />
        <circle cx="119" cy="89" r="4" fill="#ffffff" />
        <circle cx="125" cy="98" r="2" fill="#ffffff" />

        {/* Cute Pink Nose & Smiling Mouth */}
        <polygon points="98,103 102,103 100,106" fill="#f43f5e" />
        <path d="M94,107 Q100,113 100,107 Q100,113 106,107" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        {/* Open happy smile tongue */}
        <path d="M96,108 Q100,116 104,108 Z" fill="#e11d48" />

        {/* Cute Whiskers */}
        <line x1="54" y1="102" x2="40" y2="100" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="55" y1="106" x2="42" y2="108" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="146" y1="102" x2="160" y2="100" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="145" y1="106" x2="158" y2="108" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

        {/* Red & White Striped Tie */}
        <polygon points="96,128 104,128 108,162 100,170 92,162" fill="url(#tieRed)" />
        {/* Tie Stripes */}
        <line x1="95" y1="135" x2="105" y2="141" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        <line x1="94" y1="146" x2="106" y2="152" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        <line x1="93" y1="157" x2="103" y2="163" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        {/* Collar */}
        <path d="M88,126 L97,133 L100,128 L103,133 L112,126" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

        {/* Waving Left Paw */}
        <ellipse cx="44" cy="115" rx="14" ry="12" fill="url(#catFur)" transform="rotate(-25 44 115)" />
        {/* Glowing Paw Pad */}
        <ellipse cx="44" cy="114" rx="7" ry="6" fill="#38bdf8" opacity="0.8" filter="url(#softGlow)" />
        <circle cx="39" cy="107" r="2" fill="#38bdf8" opacity="0.9" />
        <circle cx="44" cy="105" r="2" fill="#38bdf8" opacity="0.9" />
        <circle cx="49" cy="107" r="2" fill="#38bdf8" opacity="0.9" />

        {/* Right Paw holding Glowing Futuristic Clipboard */}
        <g transform="translate(115, 110) rotate(-10)">
          {/* Clipboard Base */}
          <rect x="0" y="0" width="34" height="46" rx="4" fill="url(#clipBoardGrad)" stroke="#7dd3fc" strokeWidth="1.5" />
          <rect x="3" y="6" width="28" height="36" rx="2" fill="#f8fafc" />
          
          {/* Top Gold Star Badge */}
          <path d="M17, -4 L19, 1 L24, 1 L20, 4 L22, 9 L17, 6 L12, 9 L14, 4 L10, 1 L15, 1 Z" fill="url(#goldStar)" stroke="#ca8a04" strokeWidth="1" filter="url(#softGlow)" />
          
          {/* Checkmarks & Lines on Checklist */}
          <path d="M6, 12 L9, 15 L14, 9" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="12" x2="28" y2="12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          
          <path d="M6, 20 L9, 23 L14, 17" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="20" x2="28" y2="20" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

          <path d="M6, 28 L9, 31 L14, 25" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="28" x2="26" y2="28" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

          {/* Golden signature squiggle */}
          <path d="M7, 36 Q12, 33 16, 37 T25, 35" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Paw holding clipboard */}
        <circle cx="132" cy="144" r="10" fill="url(#catFur)" />
      </svg>
    </div>
  );
};

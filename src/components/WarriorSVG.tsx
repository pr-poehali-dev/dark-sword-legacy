interface Props {
  attacking: boolean;
  hurt: boolean;
}

export default function WarriorSVG({ attacking, hurt }: Props) {
  return (
    <svg
      viewBox="0 0 120 220"
      width="110"
      height="220"
      style={{
        filter: 'drop-shadow(0 0 14px #c026d3aa) drop-shadow(0 0 32px #7e22ce66)',
        overflow: 'visible',
        transform: hurt ? 'translateX(-10px)' : undefined,
        transition: 'transform 0.15s',
      }}
    >
      {/* Aura glow blob */}
      <ellipse className="hero-aura" cx="52" cy="130" rx="44" ry="80" fill="#9333ea" opacity="0.35" />

      {/* ---- body group bobs up/down ---- */}
      <g className="hero-body-group">

        {/* Cape behind */}
        <g className="hero-cape">
          <path d="M48 72 Q30 110 22 160 Q34 152 44 140 Q40 120 48 100 Z" fill="#1a0a2e" opacity="0.95" />
        </g>

        {/* Back leg */}
        <g className="hero-leg-back" style={{ transformOrigin: '44px 148px' }}>
          <rect x="38" y="148" width="12" height="38" rx="5" fill="#0f0a1a" />
          {/* boot */}
          <rect x="34" y="180" width="18" height="8" rx="3" fill="#0f0a1a" />
        </g>

        {/* Torso / armour */}
        <rect x="34" y="90" width="36" height="62" rx="8" fill="#1c1028" />
        {/* chest plate */}
        <path d="M36 95 Q52 88 68 95 L66 130 Q52 135 38 130 Z" fill="#2d1b4e" />
        {/* shoulder pads */}
        <ellipse cx="34" cy="96" rx="10" ry="7" fill="#3b1f5e" />
        <ellipse cx="70" cy="96" rx="10" ry="7" fill="#3b1f5e" />
        {/* armour details */}
        <path d="M44 105 L60 105" stroke="#7c3aed" strokeWidth="1.5" opacity="0.7" />
        <path d="M44 115 L60 115" stroke="#7c3aed" strokeWidth="1.5" opacity="0.7" />

        {/* Front leg */}
        <g className="hero-leg-front" style={{ transformOrigin: '56px 148px' }}>
          <rect x="50" y="148" width="12" height="38" rx="5" fill="#1c1028" />
          <rect x="48" y="180" width="20" height="8" rx="3" fill="#1c1028" />
        </g>

        {/* Sword arm — rotates on attack */}
        <g className={`hero-arm ${attacking ? 'attacking' : ''}`} style={{ transformOrigin: '68px 96px' }}>
          {/* upper arm */}
          <rect x="66" y="94" width="11" height="28" rx="5" fill="#2d1b4e" />
          {/* gauntlet */}
          <rect x="64" y="118" width="14" height="12" rx="4" fill="#3b1f5e" />
          {/* sword grip */}
          <rect x="72" y="120" width="6" height="40" rx="2" fill="#4a2070" />
          {/* crossguard */}
          <rect x="62" y="156" width="24" height="5" rx="2" fill="#6d28d9" />
          {/* blade */}
          <path d="M74 161 L76 161 L77 230 L73 230 Z" fill="url(#bladeFill)" />
          {/* blade edge glow */}
          <path d="M76.5 163 L77.5 228" stroke="#e9d5ff" strokeWidth="1" opacity="0.7" />
          <defs>
            <linearGradient id="bladeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="60%" stopColor="#6d28d9" />
              <stop offset="100%" stopColor="#1e0a3c" />
            </linearGradient>
          </defs>
        </g>

        {/* Off-hand / shield arm */}
        <g style={{ transformOrigin: '36px 96px' }}>
          <rect x="24" y="94" width="11" height="28" rx="5" fill="#2d1b4e" />
          <rect x="22" y="118" width="14" height="12" rx="4" fill="#3b1f5e" />
          {/* small shield */}
          <path d="M14 118 Q10 128 14 140 Q20 148 26 140 Q30 128 26 118 Z" fill="#2d1b4e" stroke="#6d28d9" strokeWidth="1.5" />
          <path d="M16 124 Q12 131 16 138" stroke="#9333ea" strokeWidth="1" opacity="0.6" />
        </g>

        {/* Neck */}
        <rect x="46" y="80" width="12" height="14" rx="4" fill="#1c1028" />

        {/* Head — helmet */}
        <ellipse cx="52" cy="70" rx="18" ry="16" fill="#1c1028" />
        {/* helmet top spike */}
        <path d="M52 54 L49 62 L55 62 Z" fill="#2d1b4e" />
        {/* visor */}
        <path d="M36 68 Q52 60 68 68" stroke="#6d28d9" strokeWidth="2" fill="none" />
        {/* eye glow */}
        <ellipse cx="44" cy="70" rx="5" ry="3" fill="#7c3aed" opacity="0.4" />
        <ellipse cx="44" cy="70" rx="3" ry="2" fill="#c026d3" opacity="0.9" />
        <ellipse cx="44" cy="70" rx="1.5" ry="1" fill="#f0abfc" />
        {/* horns */}
        <path d="M38 58 L30 42 L36 46" fill="#2d1b4e" />
        <path d="M66 58 L74 42 L68 46" fill="#2d1b4e" />

      </g>
    </svg>
  );
}

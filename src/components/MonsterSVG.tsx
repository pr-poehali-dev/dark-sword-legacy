interface Props {
  hurt: boolean;
  enemyIdx: number;
}

const COLORS = [
  { body: '#1a1a2e', accent: '#dc2626', glow: '#ef444488' },
  { body: '#1a0a0a', accent: '#b91c1c', glow: '#dc262666' },
  { body: '#0a0a1a', accent: '#7c3aed', glow: '#9333ea88' },
  { body: '#0a0a0a', accent: '#f59e0b', glow: '#f59e0b88' },
];

export default function MonsterSVG({ hurt, enemyIdx }: Props) {
  const c = COLORS[enemyIdx % COLORS.length];
  const hurtStyle = hurt
    ? { transform: 'scaleX(-1) translateX(-14px)', transition: 'transform 0.12s' }
    : { transform: 'scaleX(-1)', transition: 'transform 0.12s' };

  return (
    <svg
      viewBox="0 0 160 240"
      width="150"
      height="240"
      style={{
        filter: `drop-shadow(0 0 16px ${c.glow}) drop-shadow(0 0 40px ${c.glow})`,
        overflow: 'visible',
        ...hurtStyle,
      }}
    >
      {/* Aura */}
      <ellipse className="enemy-aura" cx="80" cy="150" rx="60" ry="95" fill={c.accent} opacity="0.22" />

      <g className="enemy-root" style={{ transformOrigin: '80px 140px' }}>

        {/* Tail */}
        <path d="M90 200 Q130 220 140 200 Q150 180 130 175" stroke={c.body} strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M130 175 L145 165 L135 170" fill={c.accent} opacity="0.8" />

        {/* Back leg */}
        <g style={{ transformOrigin: '65px 185px' }}>
          <path d="M65 185 Q55 210 50 225" stroke={c.body} strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d="M50 225 Q42 230 38 225 Q44 220 50 220" fill={c.body} />
        </g>

        {/* Body mass */}
        <ellipse cx="80" cy="155" rx="50" ry="58" fill={c.body} />

        {/* Belly */}
        <ellipse cx="80" cy="165" rx="32" ry="38" fill="#0d0d0d" opacity="0.6" />

        {/* Front leg */}
        <g style={{ transformOrigin: '95px 195px' }}>
          <path d="M95 195 Q105 218 110 228" stroke={c.body} strokeWidth="18" strokeLinecap="round" fill="none" />
          <path d="M110 228 Q118 233 122 226 Q115 222 110 222" fill={c.body} />
          {/* claw */}
          <path d="M118 226 L125 232 M122 224 L130 228" stroke={c.accent} strokeWidth="2" opacity="0.8" />
        </g>

        {/* Weapon arm */}
        <g style={{ transformOrigin: '112px 135px' }}>
          <path d="M112 135 Q130 150 140 130 Q148 115 138 108" stroke={c.body} strokeWidth="20" strokeLinecap="round" fill="none" />
          {/* big sword / weapon */}
          <path d="M138 108 L152 60 L157 62 L145 112 Z" fill={c.accent} opacity="0.9" />
          <path d="M153 61 L158 63 L148 80" stroke={c.accent} strokeWidth="3" opacity="0.6" />
          <path d="M152 60 L154 60 L148 100 L146 100 Z" fill="white" opacity="0.15" />
        </g>

        {/* Left arm */}
        <path d="M48 135 Q28 155 22 148 Q18 138 30 132" stroke={c.body} strokeWidth="18" strokeLinecap="round" fill="none" />
        {/* claws left */}
        <path d="M22 148 L14 154 M20 144 L12 148 M24 152 L16 159" stroke={c.accent} strokeWidth="2" opacity="0.8" />

        {/* Neck */}
        <rect x="66" y="90" width="28" height="22" rx="8" fill={c.body} />

        {/* Head */}
        <ellipse cx="80" cy="80" rx="38" ry="34" fill={c.body} />

        {/* Snout */}
        <path d="M58 82 Q52 92 56 100 Q64 108 80 108 Q96 108 104 100 Q108 92 102 82" fill="#0d0d0d" />

        {/* Teeth */}
        {[62, 70, 78, 86, 94].map((x, i) => (
          <path key={i} d={`M${x} 104 L${x - 3} 114 L${x + 3} 114 Z`} fill="white" opacity="0.85" />
        ))}

        {/* Horns */}
        <path d="M58 56 L42 26 L52 36" fill={c.body} />
        <path d="M58 56 L44 28 L54 38" fill={c.accent} opacity="0.5" />
        <path d="M102 56 L118 26 L108 36" fill={c.body} />
        <path d="M102 56 L116 28 L106 38" fill={c.accent} opacity="0.5" />

        {/* Spines on back */}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${34 + i * 12} ${100 - i * 6} L${28 + i * 12} ${82 - i * 8} L${38 + i * 12} ${90 - i * 5}`} fill={c.body} />
        ))}

        {/* Eyes */}
        <ellipse cx="66" cy="72" rx="10" ry="8" fill="#0d0d0d" />
        <ellipse cx="66" cy="72" rx="6" ry="5" fill={c.accent} opacity="0.9" />
        <ellipse cx="66" cy="72" rx="3" ry="3" fill={c.accent} />
        <ellipse cx="66" cy="72" rx="1.5" ry="1.5" fill="white" opacity="0.9" />
        <ellipse cx="94" cy="72" rx="10" ry="8" fill="#0d0d0d" />
        <ellipse cx="94" cy="72" rx="6" ry="5" fill={c.accent} opacity="0.9" />
        <ellipse cx="94" cy="72" rx="3" ry="3" fill={c.accent} />
        <ellipse cx="94" cy="72" rx="1.5" ry="1.5" fill="white" opacity="0.9" />

        {/* Scar / war marks */}
        <path d="M74 78 L78 86" stroke={c.accent} strokeWidth="1.5" opacity="0.6" />
        <path d="M82 76 L86 84" stroke={c.accent} strokeWidth="1.5" opacity="0.6" />

      </g>
    </svg>
  );
}

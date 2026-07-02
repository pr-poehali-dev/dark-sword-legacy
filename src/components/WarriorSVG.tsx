interface Props {
  attacking: boolean;
  hurt: boolean;
}

export default function WarriorSVG({ attacking, hurt }: Props) {
  return (
    <svg
      viewBox="0 0 160 320"
      width="130"
      height="280"
      style={{
        overflow: 'visible',
        filter: `drop-shadow(0 0 18px #c026d3bb) drop-shadow(0 0 50px #7e22ce55)`,
        transform: hurt ? 'translateX(-12px)' : 'translateX(0)',
        transition: 'transform 0.15s',
      }}
    >
      <defs>
        <linearGradient id="auraGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#a855f7" stopOpacity="0" />
          <stop offset="60%"  stopColor="#7c3aed" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="bladeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a0a2e" />
          <stop offset="40%"  stopColor="#0d0618" />
          <stop offset="100%" stopColor="#060309" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Aura ground */}
      <ellipse cx="72" cy="305" rx="55" ry="12" fill="#7c3aed" opacity="0.3" />
      <ellipse cx="72" cy="305" rx="38" ry="7"  fill="#a855f7" opacity="0.2" />

      {/* Body aura glow — bottom up */}
      <ellipse className="hero-aura" cx="72" cy="200" rx="52" ry="110" fill="url(#auraGrad)" />

      {/* ── entire figure bobs ── */}
      <g className="hero-body-group">

        {/* ── BACK LEG ── */}
        <g className="hero-leg-back" style={{ transformOrigin: '60px 220px' }}>
          {/* thigh */}
          <path d="M54 220 Q50 250 48 278" stroke="#080510" strokeWidth="18" strokeLinecap="round" fill="none"/>
          {/* shin */}
          <path d="M48 278 Q44 296 38 308" stroke="#080510" strokeWidth="14" strokeLinecap="round" fill="none"/>
          {/* boot */}
          <path d="M38 308 Q28 316 20 312 Q30 304 38 302" fill="#080510"/>
          <path d="M20 312 Q14 310 16 306 Q24 308 38 302" fill="#0d0618"/>
        </g>

        {/* ── TORSO ── */}
        {/* lower body / belt */}
        <path d="M46 210 Q72 218 98 210 L102 240 Q72 248 42 240 Z" fill="#0d0618"/>
        {/* chest — wide armour silhouette */}
        <path d="M38 140 Q24 148 20 168 Q18 195 34 210 L42 212 Q46 200 46 190 L46 148 Z" fill="#0a0612"/>
        <path d="M106 140 Q120 148 124 168 Q126 195 110 210 L102 212 Q98 200 98 190 L98 148 Z" fill="#0a0612"/>
        <path d="M46 140 Q72 130 98 140 L102 210 Q72 218 42 210 Z" fill="#0d0618"/>
        {/* chest centre line */}
        <path d="M72 138 L72 212" stroke="#060309" strokeWidth="3" opacity="0.6"/>
        {/* shoulder spikes — left */}
        <path d="M28 148 L14 128 L26 140" fill="#080510"/>
        <path d="M22 158 L6  140 L20 152" fill="#080510"/>
        <path d="M18 170 L2  156 L16 164" fill="#080510"/>
        {/* shoulder spikes — right */}
        <path d="M116 148 L130 128 L118 140" fill="#080510"/>
        <path d="M122 158 L138 140 L124 152" fill="#080510"/>
        <path d="M126 170 L142 156 L128 164" fill="#080510"/>

        {/* ── FRONT LEG (bent, attack stance) ── */}
        <g className="hero-leg-front" style={{ transformOrigin: '82px 220px' }}>
          <path d="M82 220 Q88 250 90 275" stroke="#0d0618" strokeWidth="20" strokeLinecap="round" fill="none"/>
          <path d="M90 275 Q96 296 104 308" stroke="#0d0618" strokeWidth="15" strokeLinecap="round" fill="none"/>
          <path d="M104 308 Q116 316 124 312 Q114 304 104 300" fill="#0d0618"/>
          <path d="M124 312 Q130 310 128 306 Q120 308 104 300" fill="#0a0612"/>
        </g>

        {/* ── LEFT (off) ARM ── */}
        <path d="M42 150 Q28 170 22 192" stroke="#0a0612" strokeWidth="16" strokeLinecap="round" fill="none"/>
        <path d="M22 192 Q18 208 22 220" stroke="#0a0612" strokeWidth="13" strokeLinecap="round" fill="none"/>

        {/* ── RIGHT ARM + GREATSWORD ── */}
        <g className={`hero-arm ${attacking ? 'attacking' : ''}`} style={{ transformOrigin: '100px 152px' }}>
          {/* upper arm */}
          <path d="M100 152 Q116 172 120 196" stroke="#0a0612" strokeWidth="18" strokeLinecap="round" fill="none"/>
          {/* forearm */}
          <path d="M120 196 Q126 214 122 230" stroke="#0a0612" strokeWidth="14" strokeLinecap="round" fill="none"/>
          {/* gauntlet */}
          <ellipse cx="120" cy="234" rx="11" ry="9" fill="#080510"/>

          {/* ── GREATSWORD — huge, like Dark Sword ── */}
          {/* grip */}
          <rect x="117" y="238" width="9" height="36" rx="3" fill="#0a0612"/>
          {/* crossguard — wide */}
          <path d="M96 270 L148 270 L146 278 L98 278 Z" fill="#080510"/>
          {/* crossguard ends */}
          <path d="M96 270 L88 264 L92 278 Z" fill="#080510"/>
          <path d="M148 270 L156 264 L152 278 Z" fill="#080510"/>
          {/* blade — massive wide greatsword */}
          <path d="M104 278 L140 278 L124 420 Z" fill="url(#bladeGrad)"/>
          {/* blade spine */}
          <path d="M122 280 L121 416" stroke="#1a0a2e" strokeWidth="2" opacity="0.8"/>
          {/* blade edge shimmer */}
          <path d="M140 278 L124 420" stroke="#2d1060" strokeWidth="1.5" opacity="0.5"/>
          <path d="M104 278 L124 420" stroke="#1a0a38" strokeWidth="1" opacity="0.3"/>
        </g>

        {/* ── NECK ── */}
        <path d="M62 128 Q72 122 82 128 L84 142 Q72 146 60 142 Z" fill="#0a0612"/>

        {/* ── HEAD / HELMET ── */}
        {/* main head */}
        <ellipse cx="72" cy="108" rx="30" ry="28" fill="#0a0612"/>
        {/* forehead ridge */}
        <path d="M46 104 Q72 94 98 104" stroke="#080510" strokeWidth="5" fill="none"/>
        {/* visor / face plate */}
        <path d="M48 108 Q72 116 96 108 L94 122 Q72 128 50 122 Z" fill="#060309"/>
        {/* eye glow — single slit */}
        <path d="M56 112 Q72 108 88 112" stroke="#c026d3" strokeWidth="2.5" opacity="0.9" strokeLinecap="round"/>
        <path d="M58 112 Q72 109 86 112" stroke="#f0abfc" strokeWidth="1" opacity="0.7" strokeLinecap="round"/>

        {/* helmet top crest */}
        <path d="M72 80 Q68 90 66 100 L78 100 Q76 90 72 80Z" fill="#0a0612"/>
        <path d="M72 72 L68 84 L76 84Z" fill="#0d0618"/>

        {/* ── HORNS — large curved like Dark Sword ── */}
        {/* left horn */}
        <path d="M50 90 Q30 60 36 38 Q44 52 46 70 Q42 74 50 90Z" fill="#080510"/>
        <path d="M50 90 Q32 62 38 40 Q45 54 47 72Z" fill="#0d0618" opacity="0.7"/>
        {/* right horn */}
        <path d="M94 90 Q114 60 108 38 Q100 52 98 70 Q102 74 94 90Z" fill="#080510"/>
        <path d="M94 90 Q112 62 106 40 Q99 54 97 72Z" fill="#0d0618" opacity="0.7"/>

        {/* ── CAPE ── */}
        <g className="hero-cape">
          <path d="M42 150 Q20 200 14 280 Q28 268 38 248 Q36 220 44 188 Z" fill="#060309" opacity="0.95"/>
          <path d="M42 150 Q22 202 16 278 Q26 270 36 252" stroke="#0d0618" strokeWidth="2" fill="none" opacity="0.6"/>
        </g>

      </g>
    </svg>
  );
}

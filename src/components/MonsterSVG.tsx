const MONSTER_SPRITE = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/8058a8ce-99a0-4342-887f-117bc1bb5576.jpg';

const AURA_COLORS = [
  '#dc2626', // red
  '#b91c1c', // dark red
  '#7c3aed', // purple
  '#d97706', // amber
];

interface Props {
  hurt: boolean;
  enemyIdx: number;
}

export default function MonsterSVG({ hurt, enemyIdx }: Props) {
  const aura = AURA_COLORS[enemyIdx % AURA_COLORS.length];

  return (
    <div style={{
      width: 160,
      height: 290,
      position: 'relative',
      transform: hurt ? 'scaleX(-1) translateX(-16px)' : 'scaleX(-1)',
      transition: 'transform 0.15s',
      animation: hurt ? undefined : 'idle-breathe 3s ease-in-out infinite',
      animationDelay: '1.2s',
    }}>
      <img
        src={MONSTER_SPRITE}
        alt="monster"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom',
          filter: `brightness(0) drop-shadow(0 0 16px ${aura}) drop-shadow(0 0 40px ${aura}88)`,
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          userSelect: 'none',
        }}
      />
    </div>
  );
}

const IDLE_SPRITE   = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/a36f1084-a795-497e-a7f4-f13eb4f0a275.jpg';
const ATTACK_SPRITE = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/38a2e8c7-0897-43a1-b1a9-523fb3a00cce.jpg';

interface Props {
  attacking: boolean;
  hurt: boolean;
}

export default function WarriorSVG({ attacking, hurt }: Props) {
  return (
    <div style={{
      width: 130,
      height: 260,
      position: 'relative',
      transform: hurt ? 'translateX(-14px)' : 'translateX(0)',
      transition: 'transform 0.15s',
      animation: hurt ? undefined : 'idle-breathe 2.4s ease-in-out infinite',
    }}>
      <img
        src={attacking ? ATTACK_SPRITE : IDLE_SPRITE}
        alt="warrior"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom',
          filter: 'drop-shadow(0 0 20px #c026d3bb) drop-shadow(0 0 50px #9333ea66)',
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          userSelect: 'none',
        }}
      />
    </div>
  );
}
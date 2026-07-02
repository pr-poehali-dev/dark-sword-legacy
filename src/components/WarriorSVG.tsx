const IDLE_SPRITE   = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/97cbb287-5887-4ce3-925b-f54467c06679.jpg';
const ATTACK_SPRITE = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/f1f9a9ef-7de5-42d7-8071-32232ab967b1.jpg';

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
          filter: 'brightness(0) drop-shadow(0 0 16px #c026d3) drop-shadow(0 0 36px #9333ea88)',
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          userSelect: 'none',
        }}
      />
    </div>
  );
}

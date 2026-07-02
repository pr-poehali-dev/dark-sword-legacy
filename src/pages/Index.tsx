import { useState, useCallback, useRef } from 'react';
import Icon from '@/components/ui/icon';
import WarriorSVG from '@/components/WarriorSVG';
import MonsterSVG from '@/components/MonsterSVG';

const HERO_IMG = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/15b6f2a5-573d-4020-b3f1-a99cb5c49509.jpg';
const ARENA_BG = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/1cf0aae9-165b-4840-985a-ba6810be5a7d.jpg';

type Screen = 'menu' | 'game' | 'load' | 'settings';

interface Skill {
  id: string; name: string; icon: string; desc: string; cost: number; learned: boolean;
}
interface FloatText {
  id: number; value: string; crit: boolean;
}

const INITIAL_SKILLS: Skill[] = [
  { id: 'cleave',    name: 'Рассекающий удар', icon: 'Swords',     desc: '+8 к урону',     cost: 1, learned: false },
  { id: 'vigor',     name: 'Жизненная сила',   icon: 'HeartPulse', desc: '+40 HP',          cost: 1, learned: false },
  { id: 'fury',      name: 'Ярость берсерка',  icon: 'Flame',      desc: 'Крит x2',         cost: 2, learned: false },
  { id: 'lifesteal', name: 'Похищение жизни',  icon: 'Droplet',    desc: 'Лечит 20% урона', cost: 2, learned: false },
];

const ENEMIES = [
  { name: 'Костяной страж',   maxHp: 60,  dmg: 8  },
  { name: 'Проклятый рыцарь', maxHp: 100, dmg: 14 },
  { name: 'Пожиратель душ',   maxHp: 160, dmg: 22 },
  { name: 'Владыка Тьмы',     maxHp: 260, dmg: 34 },
];

export default function Index() {
  const [screen, setScreen]     = useState<Screen>('menu');
  const [hp, setHp]             = useState(100);
  const [maxHp, setMaxHp]       = useState(100);
  const [level, setLevel]       = useState(1);
  const [xp, setXp]             = useState(0);
  const [points, setPoints]     = useState(0);
  const [skills, setSkills]     = useState<Skill[]>(INITIAL_SKILLS);
  const [enemyIdx, setEnemyIdx] = useState(0);
  const [enemyHp, setEnemyHp]   = useState(ENEMIES[0].maxHp);
  const [floats, setFloats]     = useState<FloatText[]>([]);
  const [heroLunge, setHeroLunge]   = useState(false);
  const [heroHurt, setHeroHurt]     = useState(false);
  const [enemyHurt, setEnemyHurt]   = useState(false);
  const [heroAttack, setHeroAttack] = useState(false);
  const [flash, setFlash]           = useState(false);
  const [log, setLog]               = useState('Тьма пробуждается. Обнажи свой клинок.');
  const floatId = useRef(0);

  const xpNeeded = level * 100;
  const enemy    = ENEMIES[enemyIdx];
  const has      = (id: string) => skills.find((s) => s.id === id)?.learned;

  const spawnFloat = useCallback((value: string, crit: boolean) => {
    const id = floatId.current++;
    setFloats((f) => [...f, { id, value, crit }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 900);
  }, []);

  const resetBattle = () => {
    setHp(100); setMaxHp(100); setLevel(1); setXp(0);
    setPoints(0); setSkills(INITIAL_SKILLS);
    setEnemyIdx(0); setEnemyHp(ENEMIES[0].maxHp);
    setLog('Тьма пробуждается. Обнажи свой клинок.');
    setScreen('game');
  };

  const attack = () => {
    if (hp <= 0) return;
    let dmg = 12 + level * 2 + (has('cleave') ? 8 : 0);
    const critChance = has('fury') ? 0.4 : 0.2;
    const crit = Math.random() < critChance;
    if (crit) dmg = Math.round(dmg * (has('fury') ? 2 : 1.5));

    // hero animation
    setHeroLunge(true);
    setHeroAttack(true);
    setTimeout(() => { setHeroLunge(false); setHeroAttack(false); }, 380);

    // hit flash + enemy react
    setTimeout(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 120);
      setEnemyHurt(true);
      setTimeout(() => setEnemyHurt(false), 380);
      spawnFloat(crit ? `КРИТ! -${dmg}` : `-${dmg}`, crit);
    }, 200);

    if (has('lifesteal')) setHp((h) => Math.min(maxHp, h + Math.round(dmg * 0.2)));

    const newEnemyHp = enemyHp - dmg;
    if (newEnemyHp <= 0) {
      const gained = 40 + enemyIdx * 30;
      setLog(`${enemy.name} повержен! +${gained} опыта.`);
      let newXp = xp + gained, lvl = level, pts = points, mHp = maxHp;
      while (newXp >= lvl * 100) { newXp -= lvl * 100; lvl++; pts++; mHp += 15; }
      setXp(newXp); setLevel(lvl); setPoints(pts); setMaxHp(mHp); setHp(mHp);
      const next = (enemyIdx + 1) % ENEMIES.length;
      setEnemyIdx(next); setEnemyHp(ENEMIES[next].maxHp);
      return;
    }
    setEnemyHp(newEnemyHp);

    // enemy counter
    setTimeout(() => {
      const dealt = enemy.dmg + Math.floor(Math.random() * 5);
      setHeroHurt(true);
      setTimeout(() => setHeroHurt(false), 380);
      setHp((h) => {
        const res = h - dealt;
        if (res <= 0) { setLog('Ты пал во тьме... Смерть — не конец.'); return 0; }
        setLog(`${enemy.name} наносит ${dealt} урона.`);
        return res;
      });
    }, 500);
  };

  const learnSkill = (skill: Skill) => {
    if (skill.learned || points < skill.cost) return;
    setPoints((p) => p - skill.cost);
    setSkills((s) => s.map((x) => x.id === skill.id ? { ...x, learned: true } : x));
    if (skill.id === 'vigor') { setMaxHp((m) => m + 40); setHp((h) => h + 40); }
  };

  // ===== MENU =====
  if (screen === 'menu' || screen === 'load' || screen === 'settings') {
    return (
      <div className="min-h-screen text-foreground relative overflow-hidden flex items-center justify-center" style={{ background: '#060309' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-30 animate-flicker" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/25" />
        <div className="relative z-10 text-center px-6 animate-fade-in">
          <p className="font-gothic tracking-[0.5em] text-accent text-xs mb-3 opacity-70">ЛЕГЕНДА КЛИНКА</p>
          <h1 className="font-gothic font-black text-6xl md:text-8xl text-primary text-glow tracking-wider mb-2">DARK SWORD</h1>
          <div className="w-40 h-px bg-accent/50 mx-auto my-5" />
          <p className="text-muted-foreground italic text-base mb-10 max-w-md mx-auto">
            Один воин. Бесконечная тьма. Только сталь решает, кто увидит рассвет.
          </p>
          {screen === 'menu' && (
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <MenuBtn icon="Sword" label="Начать игру" onClick={resetBattle} primary />
              <MenuBtn icon="FolderOpen" label="Загрузить" onClick={() => setScreen('load')} />
              <MenuBtn icon="Settings" label="Настройки" onClick={() => setScreen('settings')} />
            </div>
          )}
          {screen === 'load' && (
            <div className="max-w-sm mx-auto blade-border rounded bg-card/80 p-6 backdrop-blur">
              <p className="text-muted-foreground italic mb-4">Сохранённые души не найдены.</p>
              <MenuBtn icon="ArrowLeft" label="Назад" onClick={() => setScreen('menu')} />
            </div>
          )}
          {screen === 'settings' && (
            <div className="max-w-sm mx-auto blade-border rounded bg-card/80 p-6 backdrop-blur space-y-4 text-left">
              {['Громкость музыки', 'Звуковые эффекты', 'Кровавые эффекты'].map((s) => (
                <div key={s} className="flex items-center justify-between">
                  <span className="font-gothic text-sm text-foreground/90">{s}</span>
                  <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '70%' }} />
                  </div>
                </div>
              ))}
              <MenuBtn icon="ArrowLeft" label="Назад" onClick={() => setScreen('menu')} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== GAME =====
  const dead        = hp <= 0;
  const heroHpPct   = Math.max(0, (hp / maxHp) * 100);
  const enemyHpPct  = Math.max(0, (enemyHp / enemy.maxHp) * 100);
  const xpPct       = (xp / xpNeeded) * 100;

  return (
    <div className="min-h-screen flex flex-col text-foreground select-none" style={{ background: '#060309' }}>

      {/* ── TOP HUD ── */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1 gap-2 relative z-20">
        {/* Hero HP */}
        <div className="flex items-center gap-2 flex-1 max-w-[45%]">
          <div className="w-9 h-9 rounded border border-purple-700/60 bg-black flex-shrink-0 flex items-center justify-center overflow-hidden">
            <span className="font-gothic text-purple-400 text-lg">⚔</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[10px] font-gothic text-white/50 mb-0.5">
              <span>УР.{level}</span><span>{Math.max(0, hp)}/{maxHp}</span>
            </div>
            <div className="h-3 rounded-sm bg-black/90 overflow-hidden border border-white/8">
              <div className="h-full rounded-sm transition-all duration-300"
                style={{ width: `${heroHpPct}%`, background: 'linear-gradient(90deg,#991b1b,#ef4444)' }} />
            </div>
            <div className="h-1.5 rounded-sm bg-black/80 overflow-hidden mt-0.5 border border-white/5">
              <div className="h-full transition-all duration-500"
                style={{ width: `${xpPct}%`, background: 'linear-gradient(90deg,#15803d,#4ade80)' }} />
            </div>
          </div>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center gap-1">
          <button onClick={() => setScreen('menu')}
            className="font-gothic text-[10px] text-white/30 hover:text-primary transition-colors tracking-widest whitespace-nowrap">
            ← МЕНЮ
          </button>
          {points > 0 && (
            <span className="font-gothic text-[10px] text-yellow-400 animate-pulse">+{points} очк.</span>
          )}
        </div>

        {/* Enemy HP */}
        <div className="flex items-center gap-2 flex-1 max-w-[45%] flex-row-reverse">
          <div className="w-9 h-9 rounded border border-red-800/60 bg-black flex-shrink-0 flex items-center justify-center">
            <span className="font-gothic text-red-500 text-lg">☠</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[10px] font-gothic text-white/50 mb-0.5">
              <span className="truncate">{enemy.name}</span>
              <span className="flex-shrink-0 ml-1">{Math.max(0, enemyHp)}/{enemy.maxHp}</span>
            </div>
            <div className="h-3 rounded-sm bg-black/90 overflow-hidden border border-white/8">
              <div className="h-full rounded-sm transition-all duration-300 ml-auto"
                style={{ width: `${enemyHpPct}%`, background: 'linear-gradient(270deg,#7f1d1d,#dc2626)' }} />
            </div>
            <div className="h-1.5 rounded-sm bg-black/80 mt-0.5 border border-white/5" />
          </div>
        </div>
      </div>

      {/* ── BATTLE ARENA ── */}
      <div className="relative overflow-hidden" style={{ height: '340px' }}>
        {/* bg */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ARENA_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />
        {/* side vignettes */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/70 to-transparent" />

        {/* hit flash */}
        {flash && <div className="absolute inset-0 bg-white/15 z-30 pointer-events-none" />}

        {/* floating damage */}
        <div className="absolute inset-0 pointer-events-none z-20 flex items-start justify-center">
          {floats.map((f) => (
            <span key={f.id}
              className={`absolute font-gothic font-black animate-float-up ${f.crit ? 'text-yellow-300 text-4xl' : 'text-red-400 text-2xl'}`}
              style={{ top: '22%', left: '52%', transform: 'translateX(-50%)',
                textShadow: f.crit ? '0 0 20px #fbbf24' : '0 0 12px #ef4444' }}
            >
              {f.value}
            </span>
          ))}
        </div>

        {/* stone floor */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-10 inset-x-0 h-px bg-white/6" />

        {/* HERO — left, SVG warrior */}
        <div
          className={`absolute bottom-8 z-10 ${heroLunge ? 'animate-lunge' : ''} ${heroHurt ? 'animate-shake' : ''}`}
          style={{ left: '6%' }}
        >
          <WarriorSVG attacking={heroAttack} hurt={heroHurt} />
        </div>

        {/* MONSTER — right, SVG monster */}
        <div
          className={`absolute bottom-6 z-10`}
          style={{ right: '4%' }}
        >
          <MonsterSVG hurt={enemyHurt} enemyIdx={enemyIdx} />
        </div>
      </div>

      {/* ── BOTTOM PANEL ── */}
      <div className="flex-1 bg-gradient-to-b from-black/95 to-black px-4 pt-3 pb-5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>

        {/* log */}
        <p className="text-center font-gothic text-xs text-white/40 italic mb-3 min-h-[16px]">{log}</p>

        {dead ? (
          <div className="text-center">
            <p className="font-gothic text-3xl text-red-500 text-glow mb-4">— ТЫ ПАЛ —</p>
            <button onClick={resetBattle}
              className="font-gothic bg-gradient-to-b from-primary to-destructive text-white px-10 py-3 rounded-sm blade-border hover:brightness-125 transition-all flex items-center gap-2 mx-auto">
              <Icon name="RotateCcw" size={18} /> Восстать вновь
            </button>
          </div>
        ) : (
          <button onClick={attack}
            className="w-full font-gothic font-bold text-xl text-white py-4 rounded-sm active:scale-[0.97] transition-all flex items-center justify-center gap-3 mb-4"
            style={{
              background: 'linear-gradient(180deg,#6b0000 0%,#3a0000 100%)',
              border: '1px solid rgba(220,38,38,0.45)',
              boxShadow: '0 0 24px rgba(220,38,38,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <Icon name="Swords" size={24} /> АТАКОВАТЬ
          </button>
        )}

        {/* Skills */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-gothic text-[11px] tracking-widest text-white/35 uppercase">Умения</span>
          <span className="font-gothic text-[11px] text-yellow-400">Очки: {points}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {skills.map((sk) => (
            <button key={sk.id} onClick={() => learnSkill(sk)}
              disabled={sk.learned || points < sk.cost}
              className={`rounded-sm p-2 text-center transition-all border ${
                sk.learned
                  ? 'bg-purple-900/30 border-purple-500/50'
                  : points >= sk.cost
                  ? 'bg-white/5 border-white/12 hover:border-yellow-500/60 hover:bg-white/10 cursor-pointer'
                  : 'bg-white/3 border-white/6 opacity-35 cursor-not-allowed'
              }`}
            >
              <Icon name={sk.icon} size={18} className={`mx-auto mb-1 ${sk.learned ? 'text-purple-400' : 'text-white/60'}`} fallback="Sparkles" />
              <p className="font-gothic text-[9px] text-white/65 leading-tight">{sk.name}</p>
              {!sk.learned && <p className="font-gothic text-[9px] text-yellow-500/70 mt-0.5">({sk.cost})</p>}
              {sk.learned && <Icon name="Check" size={10} className="text-purple-400 mx-auto mt-0.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuBtn({ icon, label, onClick, primary }: { icon: string; label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button onClick={onClick}
      className={`font-gothic tracking-wider py-3 px-6 rounded-sm flex items-center justify-center gap-3 transition-all hover:brightness-125 active:scale-[0.98] w-full blade-border ${
        primary ? 'text-white text-lg' : 'bg-white/5 text-white/75 border-white/10'
      }`}
      style={primary ? { background: 'linear-gradient(180deg,#7c0000,#3a0000)' } : undefined}
    >
      <Icon name={icon} size={18} fallback="Sword" /> {label}
    </button>
  );
}

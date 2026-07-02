import { useState, useCallback, useRef } from 'react';
import Icon from '@/components/ui/icon';
import WarriorSVG from '@/components/WarriorSVG';
import MonsterSVG from '@/components/MonsterSVG';

const MENU_BG   = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/5888a153-4b25-454c-8291-288cf9410759.jpg';
const ARENA_BG  = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/1cf0aae9-165b-4840-985a-ba6810be5a7d.jpg';

type Screen = 'menu' | 'game' | 'settings';

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

const MENU_SCENE = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/5c3d9c24-8b54-4d94-b416-9eb0d7ed4a83.jpg';

function MenuWarrior() {
  return (
    <div style={{
      animation: 'idle-breathe 3s ease-in-out infinite',
      position: 'relative',
      lineHeight: 0,
    }}>
      <img
        src={MENU_SCENE}
        alt="warriors"
        draggable={false}
        style={{
          height: 370,
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          userSelect: 'none',
          display: 'block',
          filter: 'drop-shadow(0 0 30px #9333ea66)',
        }}
      />
    </div>
  );
}

function MenuWarriorSmall() {
  return null;
}



export default function Index() {
  const [screen, setScreen]       = useState<Screen>('menu');
  const [coins, setCoins]         = useState(1240);
  const [gems, setGems]           = useState(30);
  const [energy, setEnergy]       = useState(29);
  const [hp, setHp]               = useState(100);
  const [maxHp, setMaxHp]         = useState(100);
  const [level, setLevel]         = useState(1);
  const [xp, setXp]               = useState(0);
  const [points, setPoints]       = useState(0);
  const [skills, setSkills]       = useState<Skill[]>(INITIAL_SKILLS);
  const [enemyIdx, setEnemyIdx]   = useState(0);
  const [enemyHp, setEnemyHp]     = useState(ENEMIES[0].maxHp);
  const [floats, setFloats]       = useState<FloatText[]>([]);
  const [heroLunge, setHeroLunge] = useState(false);
  const [heroHurt, setHeroHurt]   = useState(false);
  const [enemyHurt, setEnemyHurt] = useState(false);
  const [heroAttack, setHeroAttack] = useState(false);
  const [flash, setFlash]         = useState(false);
  const [log, setLog]             = useState('Тьма пробуждается. Обнажи свой клинок.');
  const floatId = useRef(0);

  const xpNeeded = level * 100;
  const enemy    = ENEMIES[enemyIdx];
  const has      = (id: string) => skills.find((s) => s.id === id)?.learned;

  const spawnFloat = useCallback((value: string, crit: boolean) => {
    const id = floatId.current++;
    setFloats((f) => [...f, { id, value, crit }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 900);
  }, []);

  const startGame = () => {
    setHp(maxHp); setEnemyIdx(0); setEnemyHp(ENEMIES[0].maxHp);
    setLog('Тьма пробуждается. Обнажи свой клинок.');
    setScreen('game');
  };

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

    setHeroLunge(true); setHeroAttack(true);
    setTimeout(() => { setHeroLunge(false); setHeroAttack(false); }, 380);

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
      setCoins((c) => c + gained * 2);
      setLog(`${enemy.name} повержен! +${gained} опыта.`);
      let newXp = xp + gained, lvl = level, pts = points, mHp = maxHp;
      while (newXp >= lvl * 100) { newXp -= lvl * 100; lvl++; pts++; mHp += 15; }
      setXp(newXp); setLevel(lvl); setPoints(pts); setMaxHp(mHp); setHp(mHp);
      const next = (enemyIdx + 1) % ENEMIES.length;
      setEnemyIdx(next); setEnemyHp(ENEMIES[next].maxHp);
      return;
    }
    setEnemyHp(newEnemyHp);

    setTimeout(() => {
      const dealt = enemy.dmg + Math.floor(Math.random() * 5);
      setHeroHurt(true);
      setTimeout(() => setHeroHurt(false), 380);
      setHp((h) => {
        const res = h - dealt;
        if (res <= 0) { setLog('Ты пал во тьме...'); return 0; }
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

  // ════════════════════════════════════════
  //  MENU
  // ════════════════════════════════════════
  if (screen === 'menu' || screen === 'settings') {
    return (
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#050508', fontFamily: "'Cinzel', serif" }}>

        {/* ── TOP RESOURCE BAR ── */}
        <div className="flex items-center gap-1 px-2 py-1.5 flex-shrink-0"
          style={{ background: 'linear-gradient(180deg,#1a1410 0%,#0e0c08 100%)', borderBottom: '1px solid #2a2010' }}>
          {/* Coins */}
          <ResourceChip icon="🪙" value={coins.toLocaleString()} color="#f59e0b" />
          <div className="w-px h-5 bg-white/10" />
          {/* Gems / mana */}
          <ResourceChip icon="💎" value={gems.toString()} color="#818cf8" />
          <div className="w-px h-5 bg-white/10" />
          {/* Energy */}
          <ResourceChip icon="⚡" value={energy.toString()} color="#a3e635" />
          <div className="flex-1" />
          {/* right icons */}
          <TopIconBtn icon="Mail" />
          <TopIconBtn icon="Upload" />
          <TopIconBtn icon="Settings" onClick={() => setScreen('settings')} />
        </div>

        {/* ── MAIN AREA ── */}
        <div className="relative flex-1 overflow-hidden">
          {/* BG */}
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${MENU_BG})` }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(5,5,8,0.15) 0%, rgba(5,5,8,0.05) 40%, rgba(5,5,8,0.65) 100%)' }} />

          {/* Left side buttons */}
          <div className="absolute left-0 top-4 flex flex-col gap-2 z-10">
            <SideBtn icon="Crown"    label=""         color="#f59e0b" />
            <SideBtn icon="Trophy"   label=""         color="#94a3b8" />
            <SideBtn icon="Sword"    label="Уникальный\nпросмотр" color="#ef4444" red />
            <SideBtn icon="Swords"   label="Ежедневный\nбой"  color="#94a3b8" />
            <SideBtn icon="Skull"    label="Высокая\nсложность" color="#94a3b8" />
          </div>

          {/* Characters silhouettes — center */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-0 z-10"
            style={{ paddingBottom: '10px' }}>
            {/* big warrior */}
            <div style={{ marginRight: '-20px', marginBottom: '0px' }}>
              <MenuWarrior />
            </div>
            {/* small warrior */}
            <div style={{ marginLeft: '10px', marginBottom: '18px' }}>
              <MenuWarriorSmall />
            </div>
          </div>

          {/* Timer + name + xp bar (bottom-left overlay) */}
          <div className="absolute bottom-3 left-20 z-20">
            <p className="text-white/60 text-xs font-gothic mb-0.5" style={{ fontFamily: 'monospace' }}>119:59:43</p>
            <p className="text-white font-bold text-sm font-gothic">Lv.{level} Герой</p>
            <div className="w-28 h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: '#1a1a1a' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${(xp / xpNeeded) * 100}%`, background: '#6d28d9' }} />
            </div>
            <p className="text-white/40 text-[10px] mt-0.5">{((xp / xpNeeded) * 100).toFixed(1)}%</p>
          </div>

          {/* Right side promo panels */}
          <div className="absolute right-2 top-2 flex flex-col gap-2 z-10 w-28">
            <PromoPanel label="Ограниченно" sub="" color="#ec4899" badge="LIMITED" />
            <PromoPanel label="🪙 Бесплатные монеты" sub="+1000 золота" color="#f59e0b" badge="FREE" />
            <PromoPanel label="💜 3 Бесплатных духа" sub="Смотреть рекламу" color="#8b5cf6" badge="FREE" />
          </div>

          {/* Dungeon + Arena buttons — bottom right */}
          <div className="absolute bottom-3 right-2 flex flex-col gap-2 z-20">
            <BigMenuBtn label="Подземелье" color="#374151" />
            <BigMenuBtn label="Арена" color="#92400e" gold />
          </div>
        </div>

        {/* ── BOTTOM NAV ── */}
        <div className="flex-shrink-0 flex"
          style={{ background: 'linear-gradient(180deg,#1a150a 0%,#0e0c06 100%)', borderTop: '1px solid #2a2010' }}>
          <NavBtn icon="ShieldCheck" label="Снаряжение" dot />
          <NavBtn icon="ShoppingBag" label="Магазин"    dot />
          <NavBtn icon="Users"       label="Гильдия"    />
          <NavBtn icon="Castle"      label="Башня\n1F" sub="ПРОЙДЕНО" />
          <NavBtn icon="Swords"      label="Начать бой"  onClick={startGame} primary />
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════
  //  GAME SCREEN
  // ════════════════════════════════════════
  const dead       = hp <= 0;
  const heroHpPct  = Math.max(0, (hp / maxHp) * 100);
  const enemyHpPct = Math.max(0, (enemyHp / enemy.maxHp) * 100);
  const xpPct      = (xp / xpNeeded) * 100;

  return (
    <div className="h-screen flex flex-col text-foreground select-none overflow-hidden" style={{ background: '#060309' }}>

      {/* TOP HUD */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1 gap-2 relative z-20 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 max-w-[45%]">
          <div className="w-9 h-9 rounded border border-purple-700/60 bg-black flex-shrink-0 flex items-center justify-center">
            <span className="text-purple-400 text-lg">⚔</span>
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

        <div className="flex flex-col items-center gap-1">
          <button onClick={() => setScreen('menu')}
            className="font-gothic text-[10px] text-white/30 hover:text-primary transition-colors tracking-widest whitespace-nowrap">
            ← МЕНЮ
          </button>
          {points > 0 && <span className="font-gothic text-[10px] text-yellow-400 animate-pulse">+{points} очк.</span>}
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[45%] flex-row-reverse">
          <div className="w-9 h-9 rounded border border-red-800/60 bg-black flex-shrink-0 flex items-center justify-center">
            <span className="text-red-500 text-lg">☠</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[10px] font-gothic text-white/50 mb-0.5">
              <span className="truncate">{enemy.name}</span>
              <span className="flex-shrink-0 ml-1">{Math.max(0, enemyHp)}/{enemy.maxHp}</span>
            </div>
            <div className="h-3 rounded-sm bg-black/90 overflow-hidden border border-white/8">
              <div className="h-full rounded-sm transition-all duration-300"
                style={{ width: `${enemyHpPct}%`, background: 'linear-gradient(270deg,#7f1d1d,#dc2626)' }} />
            </div>
            <div className="h-1.5 rounded-sm bg-black/80 mt-0.5 border border-white/5" />
          </div>
        </div>
      </div>

      {/* ARENA */}
      <div className="relative overflow-hidden flex-1" style={{ minHeight: 0 }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ARENA_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/70 to-transparent" />

        {flash && <div className="absolute inset-0 bg-white/15 z-30 pointer-events-none" />}

        <div className="absolute inset-0 pointer-events-none z-20 flex items-start justify-center">
          {floats.map((f) => (
            <span key={f.id}
              className={`absolute font-gothic font-black animate-float-up ${f.crit ? 'text-yellow-300 text-4xl' : 'text-red-400 text-2xl'}`}
              style={{ top: '20%', left: '52%', transform: 'translateX(-50%)',
                textShadow: f.crit ? '0 0 20px #fbbf24' : '0 0 12px #ef4444' }}>
              {f.value}
            </span>
          ))}
        </div>

        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-8 inset-x-0 h-px bg-white/5" />

        <div className={`absolute bottom-6 z-10 ${heroLunge ? 'animate-lunge' : ''} ${heroHurt ? 'animate-shake' : ''}`} style={{ left: '5%' }}>
          <WarriorSVG attacking={heroAttack} hurt={heroHurt} />
        </div>

        <div className="absolute bottom-4 z-10" style={{ right: '3%' }}>
          <MonsterSVG hurt={enemyHurt} enemyIdx={enemyIdx} />
        </div>
      </div>

      {/* BOTTOM PANEL */}
      <div className="flex-shrink-0 bg-gradient-to-b from-black/95 to-black px-4 pt-3 pb-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-center font-gothic text-xs text-white/40 italic mb-3 min-h-[16px]">{log}</p>

        {dead ? (
          <div className="text-center">
            <p className="font-gothic text-3xl text-red-500 mb-4" style={{ textShadow: '0 0 20px #ef4444' }}>— ТЫ ПАЛ —</p>
            <button onClick={resetBattle}
              className="font-gothic text-white px-10 py-3 rounded-sm transition-all flex items-center gap-2 mx-auto"
              style={{ background: 'linear-gradient(180deg,#7c0000,#3a0000)', border: '1px solid rgba(220,38,38,0.45)' }}>
              <Icon name="RotateCcw" size={18} /> Восстать вновь
            </button>
          </div>
        ) : (
          <button onClick={attack}
            className="w-full font-gothic font-bold text-xl text-white py-4 rounded-sm active:scale-[0.97] transition-all flex items-center justify-center gap-3 mb-4"
            style={{ background: 'linear-gradient(180deg,#6b0000,#3a0000)', border: '1px solid rgba(220,38,38,0.45)', boxShadow: '0 0 24px rgba(220,38,38,0.18)' }}>
            <Icon name="Swords" size={24} /> АТАКОВАТЬ
          </button>
        )}

        <div className="flex items-center justify-between mb-2">
          <span className="font-gothic text-[11px] tracking-widest text-white/35 uppercase">Умения</span>
          <span className="font-gothic text-[11px] text-yellow-400">Очки: {points}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {skills.map((sk) => (
            <button key={sk.id} onClick={() => learnSkill(sk)}
              disabled={sk.learned || points < sk.cost}
              className={`rounded-sm p-2 text-center transition-all border ${
                sk.learned ? 'bg-purple-900/30 border-purple-500/50'
                : points >= sk.cost ? 'bg-white/5 border-white/12 hover:border-yellow-500/60 cursor-pointer'
                : 'bg-white/3 border-white/6 opacity-35 cursor-not-allowed'
              }`}>
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

/* ── UI helpers ── */
function ResourceChip({ icon, value, color }: { icon: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <span className="text-sm">{icon}</span>
      <span className="font-gothic text-xs font-bold" style={{ color }}>{value}</span>
      <span className="text-white/30 text-xs font-gothic cursor-pointer hover:text-white/60">+</span>
    </div>
  );
}

function TopIconBtn({ icon, onClick }: { icon: string; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-white/10"
      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <Icon name={icon} size={15} className="text-white/60" fallback="Settings" />
    </button>
  );
}

function SideBtn({ icon, label, color, red }: { icon: string; label: string; color: string; red?: boolean }) {
  return (
    <button
      className="w-14 h-12 flex flex-col items-center justify-center rounded-r-lg text-[9px] leading-tight transition-all hover:brightness-125"
      style={{
        background: red ? 'linear-gradient(135deg,#7f1d1d,#450a0a)' : 'linear-gradient(135deg,#1c1a14,#111009)',
        border: `1px solid ${red ? '#dc2626' : 'rgba(255,255,255,0.12)'}`,
        borderLeft: 'none',
        color: red ? '#fca5a5' : color,
      }}>
      <Icon name={icon} size={18} className="mb-0.5" fallback="Sword" style={{ color }} />
      {label && <span style={{ color: red ? '#fca5a5' : 'rgba(255,255,255,0.5)', whiteSpace: 'pre' }}>{label}</span>}
    </button>
  );
}

function PromoPanel({ label, sub, color, badge }: { label: string; sub: string; color: string; badge: string }) {
  return (
    <div className="rounded text-center p-1.5 cursor-pointer hover:brightness-110 transition-all"
      style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${color}60`, position: 'relative', backdropFilter: 'blur(4px)' }}>
      <span className="absolute -top-1.5 -right-1 text-[9px] font-bold px-1 py-0.5 rounded font-gothic"
        style={{ background: color, color: '#000' }}>{badge}</span>
      <p className="text-[10px] font-bold font-gothic leading-tight" style={{ color }}>{label}</p>
      {sub && <p className="text-[9px] text-white/50 mt-0.5">{sub}</p>}
    </div>
  );
}

function BigMenuBtn({ label, color, gold }: { label: string; color: string; gold?: boolean }) {
  return (
    <button className="px-4 py-2.5 rounded font-gothic font-bold text-sm transition-all hover:brightness-125 active:scale-95"
      style={{
        background: gold ? 'linear-gradient(180deg,#92400e,#451a03)' : `linear-gradient(180deg,${color},#111)`,
        border: gold ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.15)',
        color: gold ? '#fbbf24' : 'rgba(255,255,255,0.85)',
        boxShadow: gold ? '0 0 12px rgba(245,158,11,0.3)' : 'none',
        minWidth: '100px',
      }}>
      {label}
    </button>
  );
}

function NavBtn({ icon, label, dot, sub, onClick, primary }: {
  icon: string; label: string; dot?: boolean; sub?: string; onClick?: () => void; primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-all hover:brightness-125 active:scale-95 relative"
      style={{
        background: primary ? 'linear-gradient(180deg,#6b0000,#2a0000)' : 'transparent',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        borderTop: primary ? '1px solid rgba(220,38,38,0.4)' : 'none',
      }}>
      {dot && <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-red-500" />}
      <Icon name={icon} size={20} className={primary ? 'text-red-400' : 'text-white/60'} fallback="Sword" />
      <span className="font-gothic text-[9px] leading-tight text-center whitespace-pre"
        style={{ color: primary ? '#fca5a5' : 'rgba(255,255,255,0.5)' }}>{label}</span>
      {sub && <span className="font-gothic text-[8px] text-green-400">{sub}</span>}
    </button>
  );
}
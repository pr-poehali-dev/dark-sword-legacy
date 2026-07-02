import { useState, useCallback, useRef } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMG = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/15b6f2a5-573d-4020-b3f1-a99cb5c49509.jpg';
const ARENA_BG = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/1cf0aae9-165b-4840-985a-ba6810be5a7d.jpg';
const WARRIOR_SPRITE = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/0a255f05-adc7-424c-b48f-1bd5d963963f.jpg';
const MONSTER_SPRITE = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/5b1a1f7d-8bb6-4edc-ab1e-6ca5f3ef410c.jpg';

type Screen = 'menu' | 'game' | 'load' | 'settings';

interface Skill {
  id: string;
  name: string;
  icon: string;
  desc: string;
  cost: number;
  learned: boolean;
}

interface FloatText {
  id: number;
  value: string;
  crit: boolean;
}

const INITIAL_SKILLS: Skill[] = [
  { id: 'cleave', name: 'Рассекающий удар', icon: 'Swords', desc: '+8 к урону', cost: 1, learned: false },
  { id: 'vigor', name: 'Жизненная сила', icon: 'HeartPulse', desc: '+40 HP', cost: 1, learned: false },
  { id: 'fury', name: 'Ярость берсерка', icon: 'Flame', desc: 'Крит x2', cost: 2, learned: false },
  { id: 'lifesteal', name: 'Похищение жизни', icon: 'Droplet', desc: 'Лечит 20% урона', cost: 2, learned: false },
];

const ENEMIES = [
  { name: 'Костяной страж', maxHp: 60, dmg: 8 },
  { name: 'Проклятый рыцарь', maxHp: 100, dmg: 14 },
  { name: 'Пожиратель душ', maxHp: 160, dmg: 22 },
  { name: 'Владыка Тьмы', maxHp: 260, dmg: 34 },
];

export default function Index() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [points, setPoints] = useState(0);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [enemyIdx, setEnemyIdx] = useState(0);
  const [enemyHp, setEnemyHp] = useState(ENEMIES[0].maxHp);
  const [floats, setFloats] = useState<FloatText[]>([]);
  const [heroLunge, setHeroLunge] = useState(false);
  const [heroHurt, setHeroHurt] = useState(false);
  const [enemyHurt, setEnemyHurt] = useState(false);
  const [flash, setFlash] = useState(false);
  const [log, setLog] = useState('Тьма пробуждается. Обнажи свой клинок.');
  const floatId = useRef(0);

  const xpNeeded = level * 100;
  const enemy = ENEMIES[enemyIdx];
  const has = (id: string) => skills.find((s) => s.id === id)?.learned;

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

    setHeroLunge(true);
    setTimeout(() => setHeroLunge(false), 350);
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    setEnemyHurt(true);
    setTimeout(() => setEnemyHurt(false), 350);
    spawnFloat(crit ? `КРИТ! -${dmg}` : `-${dmg}`, crit);

    if (has('lifesteal')) {
      setHp((h) => Math.min(maxHp, h + Math.round(dmg * 0.2)));
    }

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

    setTimeout(() => {
      const dealt = enemy.dmg + Math.floor(Math.random() * 5);
      setHeroHurt(true);
      setTimeout(() => setHeroHurt(false), 350);
      setHp((h) => {
        const res = h - dealt;
        if (res <= 0) { setLog('Ты пал во тьме... Смерть — не конец.'); return 0; }
        setLog(`${enemy.name} наносит ${dealt} урона.`);
        return res;
      });
    }, 400);
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
      <div className="min-h-screen text-foreground relative overflow-hidden flex items-center justify-center" style={{ background: '#0a0608' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-35 animate-flicker" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="relative z-10 text-center px-6 animate-fade-in">
          <p className="font-gothic tracking-[0.5em] text-accent text-xs mb-4 opacity-80">ЛЕГЕНДА КЛИНКА</p>
          <h1 className="font-gothic font-black text-6xl md:text-8xl text-primary text-glow tracking-wider mb-2">DARK SWORD</h1>
          <div className="w-40 h-px bg-accent/60 mx-auto my-6" />
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
  const dead = hp <= 0;
  const heroHpPct = Math.max(0, (hp / maxHp) * 100);
  const enemyHpPct = Math.max(0, (enemyHp / enemy.maxHp) * 100);
  const xpPct = (xp / xpNeeded) * 100;

  return (
    <div className="min-h-screen flex flex-col text-foreground" style={{ background: '#060408' }}>

      {/* ── TOP HUD (HP bars like Dark Sword) ── */}
      <div className="flex items-start justify-between px-3 pt-3 pb-1 gap-2 relative z-20">
        {/* Hero HP */}
        <div className="flex items-center gap-2 flex-1 max-w-[46%]">
          <div className="w-8 h-8 rounded-sm overflow-hidden border border-primary/50 flex-shrink-0">
            <img src={WARRIOR_SPRITE} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.7) saturate(0)' }} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-gothic text-foreground/60 mb-0.5">
              <span>УР.{level}</span><span>{Math.max(0, hp)}/{maxHp}</span>
            </div>
            <div className="h-3 rounded-sm bg-black/80 overflow-hidden border border-white/10">
              <div
                className="h-full transition-all duration-300 rounded-sm"
                style={{ width: `${heroHpPct}%`, background: heroHpPct > 50 ? 'linear-gradient(90deg,#c0392b,#e74c3c)' : 'linear-gradient(90deg,#7b0000,#c0392b)' }}
              />
            </div>
            {/* XP bar */}
            <div className="h-1.5 rounded-sm bg-black/80 overflow-hidden mt-0.5 border border-white/5">
              <div className="h-full transition-all duration-300" style={{ width: `${xpPct}%`, background: 'linear-gradient(90deg,#2ecc71,#27ae60)' }} />
            </div>
          </div>
        </div>

        {/* Center — menu + level */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button onClick={() => setScreen('menu')} className="font-gothic text-[10px] text-muted-foreground hover:text-primary transition-colors tracking-widest">
            ← МЕНЮ
          </button>
          {points > 0 && (
            <span className="font-gothic text-[10px] text-accent animate-flicker">+{points} очк.</span>
          )}
        </div>

        {/* Enemy HP */}
        <div className="flex items-center gap-2 flex-1 max-w-[46%] flex-row-reverse">
          <div className="w-8 h-8 rounded-sm overflow-hidden border border-destructive/50 flex-shrink-0">
            <img src={MONSTER_SPRITE} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.6) saturate(0)' }} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-gothic text-foreground/60 mb-0.5">
              <span>{Math.max(0, enemyHp)}/{enemy.maxHp}</span>
              <span className="truncate max-w-[80px] text-right">{enemy.name}</span>
            </div>
            <div className="h-3 rounded-sm bg-black/80 overflow-hidden border border-white/10">
              <div
                className="h-full transition-all duration-300 rounded-sm ml-auto"
                style={{ width: `${enemyHpPct}%`, background: 'linear-gradient(90deg,#8e0000,#c0392b)', marginLeft: 'auto' }}
              />
            </div>
            <div className="h-1.5 rounded-sm bg-black/80 overflow-hidden mt-0.5 border border-white/5" />
          </div>
        </div>
      </div>

      {/* ── BATTLE ARENA ── */}
      <div className="relative flex-1 min-h-[320px] md:min-h-[400px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ARENA_BG})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

        {/* Hit flash */}
        {flash && <div className="absolute inset-0 bg-white/10 z-30 pointer-events-none" />}

        {/* Floating damage */}
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          {floats.map((f) => (
            <span
              key={f.id}
              className={`absolute font-gothic font-black animate-float-up ${f.crit ? 'text-yellow-400 text-3xl drop-shadow-[0_0_10px_#f59e0b]' : 'text-red-400 text-2xl'}`}
              style={{ top: '30%', left: '50%', transform: 'translateX(-50%)' }}
            >
              {f.value}
            </span>
          ))}
        </div>

        {/* Stone platform ground */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-14 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        {/* HERO silhouette — left */}
        <div
          className={`absolute bottom-12 left-[8%] md:left-[12%] z-10 transition-transform ${heroLunge ? 'animate-lunge' : 'animate-idle'} ${heroHurt ? 'animate-shake' : ''}`}
        >
          <img
            src={WARRIOR_SPRITE}
            alt="Воин"
            className="h-48 md:h-64 w-auto object-contain select-none"
            style={{
              filter: 'brightness(0) saturate(0) drop-shadow(0 0 18px #c026d3) drop-shadow(0 0 40px #7e22ce88)',
              maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
            }}
            draggable={false}
          />
        </div>

        {/* MONSTER silhouette — right */}
        <div
          className={`absolute bottom-12 right-[6%] md:right-[10%] z-10 ${enemyHurt ? 'animate-shake' : 'animate-idle'}`}
          style={{ animationDelay: '1.5s' }}
        >
          <img
            src={MONSTER_SPRITE}
            alt={enemy.name}
            className="h-52 md:h-72 w-auto object-contain select-none"
            style={{
              filter: 'brightness(0) saturate(0) drop-shadow(0 0 16px #dc262688) drop-shadow(0 0 35px #7f1d1d66)',
              maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
              transform: 'scaleX(-1)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* ── BOTTOM PANEL ── */}
      <div className="relative z-10 bg-gradient-to-b from-black/90 to-black px-4 pt-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Log */}
        <p className="text-center font-gothic text-xs text-foreground/50 italic mb-3 min-h-[16px]">{log}</p>

        {dead ? (
          <div className="text-center">
            <p className="font-gothic text-2xl text-red-500 text-glow mb-3">— ТЫ ПАЛ —</p>
            <button onClick={resetBattle} className="font-gothic bg-gradient-to-b from-primary to-destructive text-white px-8 py-3 rounded blade-border hover:brightness-125 transition-all flex items-center gap-2 mx-auto">
              <Icon name="RotateCcw" size={18} /> Восстать вновь
            </button>
          </div>
        ) : (
          <button
            onClick={attack}
            className="w-full font-gothic font-bold text-lg bg-gradient-to-b from-[#8b0000] to-[#4a0000] text-white py-4 rounded-sm hover:brightness-125 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mb-4"
            style={{ border: '1px solid rgba(220,38,38,0.5)', boxShadow: '0 0 20px rgba(220,38,38,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' }}
          >
            <Icon name="Swords" size={22} />
            АТАКОВАТЬ
          </button>
        )}

        {/* Skills grid */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-gothic text-[11px] tracking-widest text-foreground/40">УМЕНИЯ</span>
          <span className="font-gothic text-[11px] text-accent">Очки: {points}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {skills.map((sk) => (
            <button
              key={sk.id}
              onClick={() => learnSkill(sk)}
              disabled={sk.learned || points < sk.cost}
              className={`rounded-sm p-2 text-center transition-all border ${
                sk.learned
                  ? 'bg-primary/20 border-primary/50'
                  : points >= sk.cost
                  ? 'bg-white/5 border-white/15 hover:border-accent/60 hover:bg-white/10 cursor-pointer'
                  : 'bg-white/3 border-white/8 opacity-40 cursor-not-allowed'
              }`}
            >
              <Icon name={sk.icon} size={20} className={`mx-auto mb-1 ${sk.learned ? 'text-accent' : 'text-foreground/70'}`} fallback="Sparkles" />
              <p className="font-gothic text-[9px] text-foreground/70 leading-tight">{sk.name}</p>
              {!sk.learned && (
                <p className="font-gothic text-[9px] text-accent/70 mt-0.5">({sk.cost})</p>
              )}
              {sk.learned && (
                <Icon name="Check" size={10} className="text-accent mx-auto mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuBtn({ icon, label, onClick, primary }: { icon: string; label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`font-gothic tracking-wider py-3 px-6 rounded-sm blade-border flex items-center justify-center gap-3 transition-all hover:brightness-125 active:scale-[0.98] w-full ${
        primary
          ? 'bg-gradient-to-b from-primary to-destructive text-white text-lg'
          : 'bg-white/5 text-foreground/80 backdrop-blur border-white/10'
      }`}
    >
      <Icon name={icon} size={18} fallback="Sword" /> {label}
    </button>
  );
}

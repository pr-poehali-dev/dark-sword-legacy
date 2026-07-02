import { useState, useCallback, useRef } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMG = 'https://cdn.poehali.dev/projects/6d68c520-376e-41f0-b478-2f63707924a5/files/15b6f2a5-573d-4020-b3f1-a99cb5c49509.jpg';

type Screen = 'menu' | 'game' | 'load' | 'settings';

interface Skill {
  id: string;
  name: string;
  icon: string;
  desc: string;
  cost: number;
  bonus: string;
  learned: boolean;
}

interface FloatText {
  id: number;
  value: string;
  crit: boolean;
  x: number;
}

const INITIAL_SKILLS: Skill[] = [
  { id: 'cleave', name: 'Рассекающий удар', icon: 'Swords', desc: '+8 к урону меча', cost: 1, bonus: '+8 DMG', learned: false },
  { id: 'vigor', name: 'Жизненная сила', icon: 'HeartPulse', desc: '+40 к макс. здоровью', cost: 1, bonus: '+40 HP', learned: false },
  { id: 'fury', name: 'Ярость берсерка', icon: 'Flame', desc: 'Шанс крит. удара x2', cost: 2, bonus: 'CRIT x2', learned: false },
  { id: 'lifesteal', name: 'Похищение жизни', icon: 'Droplet', desc: 'Лечит 20% от урона', cost: 2, bonus: 'LIFESTEAL', learned: false },
];

const ENEMIES = [
  { name: 'Костяной страж', icon: 'Skull', maxHp: 60, dmg: 8 },
  { name: 'Проклятый рыцарь', icon: 'ShieldAlert', maxHp: 100, dmg: 14 },
  { name: 'Пожиратель душ', icon: 'Ghost', maxHp: 160, dmg: 22 },
  { name: 'Владыка Тьмы', icon: 'Crown', maxHp: 260, dmg: 34 },
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
  const [heroShake, setHeroShake] = useState(false);
  const [enemyShake, setEnemyShake] = useState(false);
  const [log, setLog] = useState<string>('Тьма пробуждается. Обнажи свой клинок.');
  const floatId = useRef(0);

  const xpNeeded = level * 100;
  const enemy = ENEMIES[enemyIdx];
  const has = (id: string) => skills.find((s) => s.id === id)?.learned;

  const spawnFloat = useCallback((value: string, crit: boolean) => {
    const id = floatId.current++;
    setFloats((f) => [...f, { id, value, crit, x: 40 + Math.random() * 20 }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 800);
  }, []);

  const resetBattle = () => {
    setHp(maxHp);
    setEnemyIdx(0);
    setEnemyHp(ENEMIES[0].maxHp);
    setLevel(1);
    setXp(0);
    setPoints(0);
    setSkills(INITIAL_SKILLS);
    setMaxHp(100);
    setLog('Тьма пробуждается. Обнажи свой клинок.');
    setScreen('game');
  };

  const attack = () => {
    if (hp <= 0) return;
    let dmg = 12 + level * 2 + (has('cleave') ? 8 : 0);
    const critChance = has('fury') ? 0.4 : 0.2;
    const crit = Math.random() < critChance;
    if (crit) dmg = Math.round(dmg * (has('fury') ? 2 : 1.5));

    spawnFloat(`-${dmg}`, crit);
    setEnemyShake(true);
    setTimeout(() => setEnemyShake(false), 300);

    if (has('lifesteal')) {
      const heal = Math.round(dmg * 0.2);
      setHp((h) => Math.min(maxHp, h + heal));
    }

    const newEnemyHp = enemyHp - dmg;
    if (newEnemyHp <= 0) {
      const gainedXp = 40 + enemyIdx * 30;
      setLog(`${enemy.name} повержен! +${gainedXp} опыта.`);
      let newXp = xp + gainedXp;
      let lvl = level;
      let pts = points;
      let mHp = maxHp;
      while (newXp >= lvl * 100) {
        newXp -= lvl * 100;
        lvl++;
        pts++;
        mHp += 15;
      }
      setXp(newXp);
      setLevel(lvl);
      setPoints(pts);
      setMaxHp(mHp);
      setHp(mHp);
      const next = (enemyIdx + 1) % ENEMIES.length;
      setEnemyIdx(next);
      setEnemyHp(ENEMIES[next].maxHp);
      return;
    }
    setEnemyHp(newEnemyHp);

    // enemy strikes back
    setTimeout(() => {
      setHeroShake(true);
      setTimeout(() => setHeroShake(false), 300);
      setHp((h) => {
        const dealt = enemy.dmg + Math.floor(Math.random() * 5);
        const res = h - dealt;
        if (res <= 0) {
          setLog('Ты пал во тьме... Смерть — не конец.');
          return 0;
        }
        setLog(`${enemy.name} наносит ${dealt} урона.`);
        return res;
      });
    }, 350);
  };

  const learnSkill = (skill: Skill) => {
    if (skill.learned || points < skill.cost) return;
    setPoints((p) => p - skill.cost);
    setSkills((s) => s.map((x) => (x.id === skill.id ? { ...x, learned: true } : x)));
    if (skill.id === 'vigor') {
      setMaxHp((m) => m + 40);
      setHp((h) => h + 40);
    }
  };

  // ===== MENU =====
  if (screen === 'menu' || screen === 'load' || screen === 'settings') {
    return (
      <div className="min-h-screen ember-bg text-foreground relative overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 animate-flicker"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

        <div className="relative z-10 text-center px-6 animate-fade-in">
          <p className="font-gothic tracking-[0.5em] text-accent text-sm mb-4">ЛЕГЕНДА КЛИНКА</p>
          <h1 className="font-gothic font-black text-6xl md:text-8xl text-primary text-glow tracking-wider mb-2">
            DARK SWORD
          </h1>
          <div className="w-40 h-px bg-accent/60 mx-auto my-6" />
          <p className="text-muted-foreground italic text-lg mb-10 max-w-md mx-auto">
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
  return (
    <div className="min-h-screen ember-bg text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,hsl(14_88%_25%/0.4),transparent_60%)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-6">
        {/* top bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setScreen('menu')} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-gothic">
            <Icon name="ArrowLeft" size={16} /> Меню
          </button>
          <h2 className="font-gothic font-bold tracking-widest text-primary text-glow">DARK SWORD</h2>
          <div className="text-sm font-gothic text-accent flex items-center gap-1">
            <Icon name="Star" size={16} /> Ур. {level}
          </div>
        </div>

        {/* XP bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1 font-gothic">
            <span>ОПЫТ</span>
            <span>{xp} / {xpNeeded}</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden blade-border">
            <div className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500" style={{ width: `${(xp / xpNeeded) * 100}%` }} />
          </div>
        </div>

        {/* Enemy */}
        <div className={`blade-border rounded-lg bg-card/70 backdrop-blur p-6 mb-6 text-center relative overflow-hidden ${enemyShake ? 'animate-shake' : ''}`}>
          <div className="absolute inset-0 pointer-events-none">
            {floats.map((f) => (
              <span
                key={f.id}
                className={`absolute top-1/3 font-gothic font-black animate-float-up ${f.crit ? 'text-accent text-4xl' : 'text-primary text-2xl'}`}
                style={{ left: `${f.x}%` }}
              >
                {f.value}{f.crit && '!'}
              </span>
            ))}
          </div>
          <Icon name={enemy.icon} size={64} className="mx-auto text-primary mb-2 animate-flicker" fallback="Skull" />
          <h3 className="font-gothic font-bold text-xl text-foreground mb-3">{enemy.name}</h3>
          <div className="h-3 rounded-full bg-secondary overflow-hidden max-w-sm mx-auto">
            <div className="h-full bg-gradient-to-r from-destructive to-primary transition-all duration-300" style={{ width: `${(enemyHp / enemy.maxHp) * 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-gothic">{Math.max(0, enemyHp)} / {enemy.maxHp}</p>
        </div>

        {/* Hero HP + attack */}
        <div className={`flex items-center gap-4 mb-6 ${heroShake ? 'animate-shake' : ''}`}>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1 font-gothic">
              <span className="flex items-center gap-1"><Icon name="Heart" size={14} className="text-destructive" /> ЗДОРОВЬЕ</span>
              <span>{Math.max(0, hp)} / {maxHp}</span>
            </div>
            <div className="h-4 rounded-full bg-secondary overflow-hidden blade-border">
              <div className="h-full bg-gradient-to-r from-destructive via-primary to-destructive transition-all duration-300" style={{ width: `${Math.max(0, (hp / maxHp) * 100)}%` }} />
            </div>
          </div>
        </div>

        {dead ? (
          <div className="text-center mb-6 animate-fade-in">
            <p className="font-gothic text-2xl text-destructive text-glow mb-4">ТЫ ПАЛ</p>
            <button onClick={resetBattle} className="font-gothic bg-primary text-primary-foreground px-8 py-3 rounded blade-border hover:brightness-125 transition-all inline-flex items-center gap-2">
              <Icon name="RotateCcw" size={18} /> Восстать вновь
            </button>
          </div>
        ) : (
          <button
            onClick={attack}
            className="w-full font-gothic font-bold text-xl bg-gradient-to-b from-primary to-destructive text-primary-foreground py-5 rounded-lg blade-border hover:brightness-125 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mb-6"
          >
            <Icon name="Swords" size={26} /> АТАКОВАТЬ
          </button>
        )}

        {/* log */}
        <p className="text-center text-muted-foreground italic text-sm mb-8 min-h-[20px]">{log}</p>

        {/* Skills */}
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-gothic tracking-widest text-accent text-sm flex items-center gap-2">
            <Icon name="Sparkles" size={16} /> УМЕНИЯ
          </h3>
          <span className="font-gothic text-sm text-foreground/80">Очки: <span className="text-accent">{points}</span></span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {skills.map((sk) => (
            <button
              key={sk.id}
              onClick={() => learnSkill(sk)}
              disabled={sk.learned || points < sk.cost}
              className={`text-left p-4 rounded-lg border transition-all ${
                sk.learned
                  ? 'bg-primary/15 border-primary/60'
                  : points >= sk.cost
                  ? 'bg-card/70 border-border hover:border-accent hover:bg-card cursor-pointer'
                  : 'bg-card/40 border-border/50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon name={sk.icon} size={22} className={sk.learned ? 'text-accent' : 'text-primary'} fallback="Sparkles" />
                {sk.learned ? (
                  <Icon name="Check" size={16} className="text-accent" />
                ) : (
                  <span className="text-xs font-gothic text-muted-foreground flex items-center gap-0.5">
                    <Icon name="Gem" size={12} /> {sk.cost}
                  </span>
                )}
              </div>
              <p className="font-gothic font-semibold text-sm text-foreground">{sk.name}</p>
              <p className="text-xs text-muted-foreground">{sk.desc}</p>
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
      className={`font-gothic tracking-wider py-3 px-6 rounded blade-border flex items-center justify-center gap-3 transition-all hover:brightness-125 active:scale-[0.98] ${
        primary
          ? 'bg-gradient-to-b from-primary to-destructive text-primary-foreground text-lg'
          : 'bg-card/70 text-foreground/90 backdrop-blur'
      }`}
    >
      <Icon name={icon} size={20} fallback="Sword" /> {label}
    </button>
  );
}

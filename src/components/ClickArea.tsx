import { useCallback, useEffect, useRef } from 'react';
import { CRIT_MULTIPLIER } from '../game/config';
import { clickPower } from '../game/engine';
import { playMine } from '../game/audio';
import { formatNumber, type Notation } from '../game/format';
import type { JuiceLevel } from '../game/settings';
import type { GameState } from '../game/types';
import { PickaxeIcon } from './icons';

interface Props {
  state: GameState;
  onMine: () => boolean;
  juice: JuiceLevel;
  sound: boolean;
  notation: Notation;
}

interface Chip {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
}

interface FloatText {
  x: number;
  y: number;
  vy: number;
  life: number;
  ttl: number;
  text: string;
  critical: boolean;
}

const CHIP_COLOR = '#c9a26b';
const TEXT_COLOR = '#ffd98a';
const CRIT_COLOR = '#ff5d5d';

export function ClickArea({ state, onMine, juice, sound, notation }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chips = useRef<Chip[]>([]);
  const texts = useRef<FloatText[]>([]);
  const raf = useRef<number | null>(null);
  const comboRef = useRef({ count: 0, last: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      raf.current = null;
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const chipList = chips.current;
    for (let i = chipList.length - 1; i >= 0; i--) {
      const c = chipList[i];
      c.life += 1;
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.35;
      if (c.life >= c.ttl) {
        chipList.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = 1 - c.life / c.ttl;
      ctx.fillStyle = CHIP_COLOR;
      ctx.fillRect(c.x, c.y, c.size, c.size);
    }

    const textList = texts.current;
    ctx.textAlign = 'center';
    for (let i = textList.length - 1; i >= 0; i--) {
      const t = textList[i];
      t.life += 1;
      t.y += t.vy;
      if (t.life >= t.ttl) {
        textList.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = 1 - t.life / t.ttl;
      ctx.fillStyle = t.critical ? CRIT_COLOR : TEXT_COLOR;
      ctx.font = t.critical ? '800 20px system-ui, sans-serif' : '600 15px system-ui, sans-serif';
      ctx.fillText(t.text, t.x, t.y);
    }
    ctx.globalAlpha = 1;

    if (chipList.length > 0 || textList.length > 0) {
      raf.current = requestAnimationFrame(draw);
    } else {
      raf.current = null;
    }
  }, []);

  const ensureLoop = useCallback(() => {
    if (raf.current === null) raf.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const critical = onMine();
    const gained = clickPower(state) * (critical ? CRIT_MULTIPLIER : 1);

    if (sound) {
      const now = performance.now();
      const combo = comboRef.current;
      combo.count = now - combo.last < 350 ? Math.min(combo.count + 1, 12) : 0;
      combo.last = now;
      playMine((critical ? 1.5 : 1) + combo.count * 0.03);
    }

    if (juice === 'off') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const base = juice === 'max' ? 5 : 2;
    const count = critical ? base * 2 : base;
    for (let i = 0; i < count; i++) {
      const angle = Math.PI + (Math.random() - 0.5) * Math.PI;
      const speed = 2 + Math.random() * (critical ? 5 : 3);
      chips.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 0,
        ttl: 28 + Math.random() * 12,
        size: 2 + Math.random() * (critical ? 3 : 2),
      });
    }
    texts.current.push({
      x,
      y: y - 6,
      vy: -0.9,
      life: 0,
      ttl: critical ? 54 : 42,
      text: `${critical ? 'CRIT ' : ''}+${formatNumber(gained, notation)}`,
      critical,
    });
    ensureLoop();
  };

  return (
    <button type="button" className="click-area" onClick={handleClick}>
      <canvas ref={canvasRef} className="click-canvas" aria-hidden="true" />
      <PickaxeIcon className="click-icon" />
      <span className="click-label">Mine</span>
      <span className="click-power">+{formatNumber(clickPower(state), notation)}</span>
    </button>
  );
}

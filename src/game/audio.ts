type Ctor = typeof AudioContext;

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Impl: Ctor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
  if (!Impl) return null;
  if (!ctx) ctx = new Impl();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType,
  peak: number,
  slideTo?: number,
): void {
  const audio = context();
  if (!audio) return;
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slideTo !== undefined) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playMine(pitch = 1): void {
  tone(180 * pitch, 0.08, 'triangle', 0.12);
}

export function playBuy(): void {
  tone(440, 0.09, 'square', 0.08, 660);
}

export function playPrestige(): void {
  tone(320, 0.6, 'sawtooth', 0.14, 80);
}

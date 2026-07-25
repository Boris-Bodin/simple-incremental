const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '∞';
  if (value < 1000) {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }
  const tier = Math.floor(Math.log10(value) / 3);
  if (tier < SUFFIXES.length) {
    const scaled = value / 1000 ** tier;
    return `${scaled.toFixed(2)}${SUFFIXES[tier]}`;
  }
  return value.toExponential(2);
}

export function formatRate(value: number): string {
  return `${formatNumber(value)}/s`;
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.floor(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (hours === 0 && rest > 0) parts.push(`${rest}s`);
  return parts.length > 0 ? parts.join(' ') : '0s';
}

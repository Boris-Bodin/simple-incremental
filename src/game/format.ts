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

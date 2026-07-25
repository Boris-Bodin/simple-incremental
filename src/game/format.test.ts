import { describe, expect, it } from 'vitest';
import { formatDuration, formatNumber, formatRate } from './format';

describe('formatNumber', () => {
  it('shows small integers as-is', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(42)).toBe('42');
  });

  it('shows one decimal for small non-integers', () => {
    expect(formatNumber(0.5)).toBe('0.5');
  });

  it('uses suffixes for large numbers', () => {
    expect(formatNumber(1000)).toBe('1.00K');
    expect(formatNumber(1_500_000)).toBe('1.50M');
    expect(formatNumber(2_000_000_000)).toBe('2.00B');
  });

  it('falls back to exponential beyond known suffixes', () => {
    expect(formatNumber(1e40)).toBe('1.00e+40');
  });

  it('renders infinity', () => {
    expect(formatNumber(Infinity)).toBe('∞');
  });
});

describe('formatRate', () => {
  it('appends /s', () => {
    expect(formatRate(1000)).toBe('1.00K/s');
  });
});

describe('formatDuration', () => {
  it('formats seconds, minutes and hours', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(45)).toBe('45s');
    expect(formatDuration(60)).toBe('1m');
    expect(formatDuration(90)).toBe('1m 30s');
    expect(formatDuration(3600)).toBe('1h');
    expect(formatDuration(3661)).toBe('1h 1m');
  });
});

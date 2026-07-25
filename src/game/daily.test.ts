import { describe, expect, it } from 'vitest';
import { METEO_POOL } from './config';
import { dailyMeteo, dayKey, endOfDay, isNextDay } from './daily';

const AT = (iso: string): number => Date.parse(iso);

describe('dayKey', () => {
  it('returns the UTC calendar day', () => {
    expect(dayKey(AT('2026-07-25T13:45:00Z'))).toBe('2026-07-25');
    expect(dayKey(AT('2026-07-25T23:59:59Z'))).toBe('2026-07-25');
  });
});

describe('isNextDay', () => {
  it('is true only for consecutive days', () => {
    expect(isNextDay('2026-07-25', '2026-07-26')).toBe(true);
    expect(isNextDay('2026-07-25', '2026-07-25')).toBe(false);
    expect(isNextDay('2026-07-25', '2026-07-27')).toBe(false);
  });
});

describe('endOfDay', () => {
  it('is the next UTC midnight', () => {
    expect(endOfDay(AT('2026-07-25T13:45:00Z'))).toBe(AT('2026-07-26T00:00:00Z'));
  });
});

describe('dailyMeteo', () => {
  it('is deterministic for a given day', () => {
    expect(dailyMeteo('2026-07-25')).toBe(dailyMeteo('2026-07-25'));
  });

  it('always resolves to a pool member', () => {
    expect(METEO_POOL).toContain(dailyMeteo('2026-07-25'));
    expect(METEO_POOL).toContain(dailyMeteo('2030-01-01'));
  });
});

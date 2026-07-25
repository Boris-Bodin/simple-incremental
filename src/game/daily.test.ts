import { describe, expect, it } from 'vitest';
import { DAILY_CHALLENGES, DAILY_CHALLENGES_PER_DAY, METEO_POOL } from './config';
import { dailyChallengeIds, dailyMeteo, dayKey, endOfDay, isNextDay } from './daily';

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

describe('dailyChallengeIds', () => {
  it('is deterministic for a given day', () => {
    expect(dailyChallengeIds('2026-07-25')).toEqual(dailyChallengeIds('2026-07-25'));
  });

  it('returns the configured count of distinct pool ids', () => {
    const ids = dailyChallengeIds('2026-07-25');
    expect(ids).toHaveLength(DAILY_CHALLENGES_PER_DAY);
    expect(new Set(ids).size).toBe(DAILY_CHALLENGES_PER_DAY);
    const poolIds = DAILY_CHALLENGES.map((c) => c.id);
    ids.forEach((id) => expect(poolIds).toContain(id));
  });
});

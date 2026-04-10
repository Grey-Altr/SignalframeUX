import { describe, it, expect } from 'vitest';
import { SYSTEM_STATS } from './system-stats';

describe('SYSTEM_STATS', () => {
  it('components is a positive number', () => {
    expect(typeof SYSTEM_STATS.components).toBe('number');
    expect(SYSTEM_STATS.components).toBeGreaterThan(0);
  });

  it('bundle matches NNNkb or NNNKB pattern', () => {
    expect(SYSTEM_STATS.bundle).toMatch(/^\d+KB$/i);
  });

  it('lighthouse is "100"', () => {
    expect(SYSTEM_STATS.lighthouse).toBe('100');
  });
});

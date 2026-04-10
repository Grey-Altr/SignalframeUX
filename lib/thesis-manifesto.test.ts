import { describe, it, expect } from 'vitest';
import { THESIS_MANIFESTO, type ManifestoSize, type ManifestoPillar } from './thesis-manifesto';

const VALID_SIZES: ManifestoSize[] = ['anchor', 'connector'];
const VALID_PILLARS: ManifestoPillar[] = [
  'signal-frame',
  'enhanced-flat',
  'culture-infrastructure',
  'biophilia',
  'memetic-engineering',
];

describe('THESIS_MANIFESTO', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(THESIS_MANIFESTO)).toBe(true);
    expect(THESIS_MANIFESTO.length).toBeGreaterThan(0);
  });

  it('each statement has required fields: text, size, pillar, anchor', () => {
    for (const statement of THESIS_MANIFESTO) {
      expect(typeof statement.text).toBe('string');
      expect(statement.text.length).toBeGreaterThan(0);
      expect(statement.size).toBeDefined();
      expect(statement.pillar).toBeDefined();
      expect(statement.anchor).toBeDefined();
    }
  });

  it('all size values are valid ManifestoSize union members', () => {
    for (const statement of THESIS_MANIFESTO) {
      expect(VALID_SIZES).toContain(statement.size);
    }
  });

  it('all pillar values are valid ManifestoPillar union members', () => {
    for (const statement of THESIS_MANIFESTO) {
      expect(VALID_PILLARS).toContain(statement.pillar);
    }
  });
});

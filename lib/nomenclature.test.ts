import { describe, it, expect } from 'vitest';
import { assignCodes, CATEGORY_CODE, CATEGORY_ORDER } from './nomenclature';

describe('assignCodes()', () => {
  it('assigns deterministic SF//[CAT]-NNN codes', () => {
    const entries = [
      { category: 'FORMS', name: 'Button' },
      { category: 'FORMS', name: 'Input' },
    ];
    const result = assignCodes(entries);
    expect(result[0].sfCode).toBe('SF//FRM-001');
    expect(result[1].sfCode).toBe('SF//FRM-002');
  });

  it('sorts entries by CATEGORY_ORDER before assigning codes', () => {
    const entries = [
      { category: 'GENERATIVE', name: 'Canvas' },
      { category: 'FORMS', name: 'Button' },
    ];
    const result = assignCodes(entries);
    // FORMS comes before GENERATIVE in CATEGORY_ORDER
    expect(result[0].category).toBe('FORMS');
    expect(result[0].sfCode).toBe('SF//FRM-001');
    expect(result[1].category).toBe('GENERATIVE');
    expect(result[1].sfCode).toBe('SF//GEN-001');
  });

  it('assigns UNK code for unknown categories', () => {
    const entries = [{ category: 'UNKNOWN_CAT', name: 'Mystery' }];
    const result = assignCodes(entries);
    expect(result[0].sfCode).toMatch(/^SF\/\/UNK-\d{3}$/);
  });

  it('does not mutate the input array', () => {
    const entries = [{ category: 'LAYOUT', name: 'Grid' }];
    const original = [...entries];
    assignCodes(entries);
    expect(entries).toEqual(original);
  });
});

describe('CATEGORY_CODE', () => {
  it('maps all 6 required categories', () => {
    expect(CATEGORY_CODE['FORMS']).toBe('FRM');
    expect(CATEGORY_CODE['LAYOUT']).toBe('LAY');
    expect(CATEGORY_CODE['NAVIGATION']).toBe('NAV');
    expect(CATEGORY_CODE['FEEDBACK']).toBe('FBK');
    expect(CATEGORY_CODE['DATA_DISPLAY']).toBe('DAT');
    expect(CATEGORY_CODE['GENERATIVE']).toBe('GEN');
  });
});

describe('CATEGORY_ORDER', () => {
  it('contains exactly 6 entries', () => {
    expect(CATEGORY_ORDER.length).toBe(6);
  });
});

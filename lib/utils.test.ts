import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn()', () => {
  it('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates conflicting Tailwind utilities (last wins)', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('ignores falsy values (false, undefined, null)', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar');
  });
});

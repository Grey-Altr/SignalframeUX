import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    alias: {
      '@': resolve(__dirname, '.'),
    },
    include: ['lib/**/*.test.ts', 'scripts/**/*.spec.ts'],
    exclude: ['node_modules', '.next', 'tests/**'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['lib/**'],
      exclude: [
        'lib/**/*.test.ts',
        'lib/gsap-*.ts',
        'lib/signal-canvas.tsx',
        'lib/grain.ts',
        'lib/color-resolve.ts',
        'lib/color-stutter.ts',
        'lib/audio-feedback.ts',
        'lib/haptic-feedback.ts',
      ],
    },
  },
});

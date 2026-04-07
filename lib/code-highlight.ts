import 'server-only';
import { createHighlighter } from 'shiki';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

// Custom OKLCH theme — values hardcoded from globals.css --sf-code-* tokens
// MUST be hardcoded strings — shiki runs server-side and cannot resolve CSS vars
const SFUX_THEME = {
  name: 'sfux-dark',
  type: 'dark' as const,
  colors: {
    'editor.background': 'oklch(0.12 0 0)',  // --sf-code-bg
    'editor.foreground': 'oklch(0.85 0 0)',
  },
  tokenColors: [
    {
      scope: ['keyword', 'storage'],
      settings: { foreground: 'oklch(0.7 0.15 25)' },  // --sf-code-keyword
    },
    {
      scope: ['entity.name', 'variable.other.constant'],
      settings: { foreground: 'oklch(0.7 0.18 350)' }, // --sf-code-const
    },
    {
      scope: ['string'],
      settings: { foreground: 'oklch(0.6 0.28 145)' },  // --sf-code-text
    },
    {
      scope: ['comment'],
      settings: { foreground: 'oklch(0.52 0 0)', fontStyle: 'italic' }, // --sf-dim-text
    },
    {
      scope: ['punctuation'],
      settings: { foreground: 'oklch(0.65 0 0)' }, // --sf-muted-text-dark
    },
    {
      scope: ['support.type', 'entity.name.type'],
      settings: { foreground: 'oklch(0.75 0.12 200)' }, // type annotations — cyan-teal
    },
    {
      scope: ['variable', 'meta.object-literal.key'],
      settings: { foreground: 'oklch(0.85 0 0)' }, // foreground — default text
    },
  ],
};

// Singleton — created once per server process, lazy on first highlight() call
let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      langs: ['tsx'],
      themes: [SFUX_THEME],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

/**
 * Highlight a TSX/TypeScript code string using the sfux-dark OKLCH theme.
 * Returns an HTML string with inline styles. Server-only — cannot be called from Client Components.
 */
export async function highlight(code: string): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: 'tsx',
    theme: 'sfux-dark',
  });
}

import type { ComponentDoc } from "./types";

export const CORE_DOCS: Record<string, ComponentDoc> = {
  "createSignalframeUX": {
    "id": "createSignalframeUX",
    "name": "createSignalframeUX",
    "layer": "CORE",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "FACTORY THAT CREATES A TYPED, SSR-SAFE SIGNALFRAMEPROVIDER + USESIGNALFRAME HOOK PAIR. NOTE: THE RETURNED USESIGNALFRAME IS IDENTICAL TO THE STANDALONE EXPORT — BOTH READ FROM THE SHARED SIGNALFRAMECONTEXT SINGLETON. MULTIPLE CREATESIGNALFRAMEUX() CALLS SHARE THE SAME CONTEXT. THE FACTORY RETURN IS FOR DESTRUCTURED CONVENIENCE ONLY.",
    "importPath": "signalframeux",
    "importName": "createSignalframeUX",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "// In app/layout.tsx (module scope — not inside the component):\nconst { SignalframeProvider } = createSignalframeUX({ defaultTheme: 'dark' });"
      }
    ],
    "a11y": [
      "NO DIRECT RENDERING — UTILITY FUNCTION"
    ]
  },
  "cn": {
    "id": "cn",
    "name": "cn",
    "layer": "CORE",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "CLASS NAME UTILITY — MERGES TAILWIND CLASSES WITH CLSX + TAILWIND-MERGE. RESOLVES CLASS CONFLICTS (E.G., P-4 VS P-2) SO THE LAST CLASS WINS.",
    "importPath": "signalframeux",
    "importName": "cn",
    "props": [
      {
        "name": "inputs",
        "type": "any",
        "default": "",
        "desc": "Any number of class values (strings, arrays, objects)"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "cn(\"flex items-center\", isActive && \"bg-foreground text-background\")\ncn(\"border-2 border-foreground\", className)"
      }
    ],
    "a11y": [
      "NO DIRECT RENDERING — UTILITY FUNCTION"
    ]
  },
  "toggleTheme": {
    "id": "toggleTheme",
    "name": "toggleTheme",
    "layer": "CORE",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SHARED THEME TOGGLE — USED BY DARKMODETOGGLE AND COMMANDPALETTE. HARD-CUT SWITCH (DU-STYLE) — INSTANT COLOR INVERSION, NO SMOOTH BLEND.",
    "importPath": "signalframeux",
    "importName": "toggleTheme",
    "props": [
      {
        "name": "currentDark",
        "type": "any",
        "default": "",
        "desc": "Whether dark mode is currently active"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "const [isDark, setIsDark] = useState(false);\n<button onClick={() => setIsDark(toggleTheme(isDark))}>Toggle theme</button>"
      }
    ],
    "a11y": [
      "NO DIRECT RENDERING — UTILITY FUNCTION"
    ]
  },
  "GRAIN_SVG": {
    "id": "GRAIN_SVG",
    "name": "GRAIN_SVG",
    "layer": "CORE",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SHARED GRAIN/NOISE SVG DATA URI — FRACTALNOISE AT 0.65 BASEFREQUENCY. APPLY AS A CSS BACKGROUND-IMAGE OVERLAY FOR THE SIGNAL GRAIN TEXTURE AESTHETIC.",
    "importPath": "signalframeux",
    "importName": "GRAIN_SVG",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<div style={{ backgroundImage: GRAIN_SVG, opacity: 0.08 }} aria-hidden=\"true\" />"
      }
    ],
    "a11y": [
      "NO DIRECT RENDERING — UTILITY FUNCTION"
    ]
  },
  "SESSION_KEYS": {
    "id": "SESSION_KEYS",
    "name": "SESSION_KEYS",
    "layer": "CORE",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "NAMESPACED SESSIONSTORAGE KEYS FOR SIGNALFRAMEUX. CENTRALISED HERE TO PREVENT KEY COLLISIONS ACROSS THE CODEBASE. ALL KEYS USE THE `SFUX.` NAMESPACE PREFIX.",
    "importPath": "signalframeux",
    "importName": "SESSION_KEYS",
    "props": [],
    "usage": [
      {
        "label": "BASIC USAGE",
        "code": "import { SESSION_KEYS } from 'signalframeux'"
      }
    ],
    "a11y": [
      "NO DIRECT RENDERING — UTILITY FUNCTION"
    ]
  }
};

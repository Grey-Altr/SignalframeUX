import type { ComponentDoc } from "./types";

export const HOOK_DOCS: Record<string, ComponentDoc> = {
  "useSignalframe": {
    "id": "useSignalframe",
    "name": "useSignalframe",
    "layer": "HOOK",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "FACTORY THAT CREATES A TYPED, SSR-SAFE SIGNALFRAMEPROVIDER + USESIGNALFRAME HOOK PAIR. NOTE: THE RETURNED USESIGNALFRAME IS IDENTICAL TO THE STANDALONE EXPORT — BOTH READ FROM THE SHARED SIGNALFRAMECONTEXT SINGLETON. MULTIPLE CREATESIGNALFRAMEUX() CALLS SHARE THE SAME CONTEXT. THE FACTORY RETURN IS FOR DESTRUCTURED CONVENIENCE ONLY.",
    "importPath": "signalframeux",
    "importName": "useSignalframe",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "// In app/layout.tsx (module scope — not inside the component):\nconst { SignalframeProvider } = createSignalframeUX({ defaultTheme: 'dark' });"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION WHERE APPLICABLE"
    ]
  },
  "useScrambleText": {
    "id": "useScrambleText",
    "name": "useScrambleText",
    "layer": "HOOK",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SCRAMBLE TEXT ANIMATION HOOK — SIGNAL LAYER TEXT EFFECT USING SHARED RAF LOOP. DISPLAYS RANDOMIZED GLYPHS THAT PROGRESSIVELY RESOLVE TO THE TARGET STRING. RESPECTS PREFERS-REDUCED-MOTION AND SKIPS ANIMATION ON MOBILE (<768PX).",
    "importPath": "signalframeux",
    "importName": "useScrambleText",
    "props": [
      {
        "name": "target",
        "type": "any",
        "default": "",
        "desc": "The final string to reveal after scrambling"
      },
      {
        "name": "delay",
        "type": "any",
        "default": "",
        "desc": "Milliseconds to wait before starting the scramble animation"
      },
      {
        "name": "duration",
        "type": "any",
        "default": "",
        "desc": "Total duration of the scramble effect in milliseconds (default: 600)"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "function Hero() {\n  const text = useScrambleText(\"SIGNALFRAME\", 200, 800);\n  return <h1 className=\"font-mono\">{text}</h1>;\n}"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION WHERE APPLICABLE"
    ]
  },
  "useSessionState": {
    "id": "useSessionState",
    "name": "useSessionState",
    "layer": "HOOK",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SSR-SAFE SESSIONSTORAGE HOOK. MIRRORS THE `USESTATE` API. SSR CONTRACT: - SERVER RENDER: ALWAYS RETURNS `DEFAULTVALUE` (NO BROWSER APIS ACCESSED). - INITIAL CLIENT RENDER: ALSO RETURNS `DEFAULTVALUE` — MATCHES SERVER HTML, NO HYDRATION MISMATCH. - AFTER MOUNT: READS FROM SESSIONSTORAGE AND UPDATES STATE IF A STORED VALUE EXISTS. - ON STATE CHANGE: WRITES THE NEW VALUE TO SESSIONSTORAGE. - HARD RELOAD: SESSIONSTORAGE IS CLEARED BY THE BROWSER AUTOMATICALLY, SO `DEFAULTVALUE` IS USED AGAIN. SESSIONSTORAGE FAILURES (PRIVATE BROWSING, QUOTA EXCEEDED) ARE CAUGHT SILENTLY — STATE STILL UPDATES IN MEMORY SO THE UI REMAINS FUNCTIONAL.",
    "importPath": "signalframeux",
    "importName": "useSessionState",
    "props": [
      {
        "name": "key",
        "type": "any",
        "default": "",
        "desc": "sessionStorage key (use a constant from SESSION_KEYS)"
      },
      {
        "name": "defaultValue",
        "type": "any",
        "default": "",
        "desc": "Value used on server and on first client render"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "const [activeFilter, setActiveFilter] = useSessionState<Category>(\n  SESSION_KEYS.COMPONENTS_FILTER,\n  \"ALL\"\n);"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION WHERE APPLICABLE"
    ]
  },
  "useNavReveal": {
    "id": "useNavReveal",
    "name": "useNavReveal",
    "layer": "HOOK",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "DRIVES NAV REVEAL VIA `DOCUMENT.BODY.DATASET.NAVVISIBLE`. CONTRACT (CONTEXT.MD SECTION VL -- NAV REVEAL PATTERN, LOCKED): - HOMEPAGE: PASS A REF TO THE ENTRY SECTION (`[DATA-ENTRY-SECTION]`). - SUBPAGES: PASS A REF TO THE PAGE <HEADER> ELEMENT (THE ONE WRAPPING THE H1). NAV APPEARS ONCE THE PAGE HEADER SCROLLS OUT OF VIEW. - `TRIGGERREF.CURRENT === NULL` IS A SAFETY FALLBACK ONLY (LOGS A DEV-MODE WARNING) -- SUBPAGES MUST PASS A REAL HEADER. DO NOT RELY ON THE NULL BRANCH. REDUCED MOTION: NAV VISIBLE IMMEDIATELY, NO SCROLLTRIGGER. THE NAV DOM ELEMENT MUST CARRY `SF-NAV-HIDDEN` AS ITS INITIAL CLASSNAME. THE CSS RULE IN APP/GLOBALS.CSS FLIPS VISIBILITY BASED ON `BODY[DATA-NAV-VISIBLE=\"TRUE\"]`.",
    "importPath": "signalframeux/animation",
    "importName": "useNavReveal",
    "props": [
      {
        "name": "triggerRef",
        "type": "any",
        "default": "",
        "desc": "Ref to the element whose scroll-out triggers nav reveal"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "const headerRef = useRef<HTMLElement>(null);\nuseNavReveal(headerRef);\nreturn <header ref={headerRef}><h1>Page Title</h1></header>;"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION WHERE APPLICABLE"
    ]
  },
  "useSignalScene": {
    "id": "useSignalScene",
    "name": "useSignalScene",
    "layer": "HOOK",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "REGISTER A THREE.JS SCENE WITH THE SIGNALCANVAS SINGLETON.",
    "importPath": "signalframeux/webgl",
    "importName": "useSignalScene",
    "props": [
      {
        "name": "elementRef",
        "type": "any",
        "default": "",
        "desc": "Ref to the DOM element that defines the scene's viewport rectangle"
      },
      {
        "name": "buildScene",
        "type": "any",
        "default": "",
        "desc": "Factory function called once on mount to create scene + camera"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "const containerRef = useRef<HTMLDivElement>(null);\nuseSignalScene(containerRef, () => ({\n  scene: new THREE.Scene(),\n  camera: new THREE.PerspectiveCamera(75, 1, 0.1, 100),\n}));\nreturn <div ref={containerRef} className=\"w-full h-64\" />;"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION WHERE APPLICABLE"
    ]
  }
};

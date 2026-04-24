import type { ComponentDoc } from "./types";

export const SIGNAL_DOCS: Record<string, ComponentDoc> = {
  "SFAccordion": {
    "id": "SFAccordion",
    "name": "SFAccordion",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFACCORDION ROOT — SIGNAL LAYER ACCORDION WITH GSAP STAGGER ANIMATION ON EXPAND.",
    "importPath": "signalframeux/animation",
    "importName": "SFAccordion",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAccordion type=\"single\" collapsible><SFAccordionItem value=\"item-1\"><SFAccordionTrigger>Section</SFAccordionTrigger><SFAccordionContent>Content</SFAccordionContent></SFAccordionItem></SFAccordion>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFAccordionItem": {
    "id": "SFAccordionItem",
    "name": "SFAccordionItem",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFACCORDION — INDIVIDUAL ACCORDION PANEL WITH BOTTOM BORDER SEPARATOR.",
    "importPath": "signalframeux/animation",
    "importName": "SFAccordionItem",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAccordionItem value=\"item-1\"><SFAccordionTrigger>Section One</SFAccordionTrigger><SFAccordionContent>Body</SFAccordionContent></SFAccordionItem>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFAccordionTrigger": {
    "id": "SFAccordionTrigger",
    "name": "SFAccordionTrigger",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFACCORDION — TRIGGER BUTTON THAT EXPANDS/COLLAPSES THE ACCORDION ITEM.",
    "importPath": "signalframeux/animation",
    "importName": "SFAccordionTrigger",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAccordionTrigger>Section One</SFAccordionTrigger>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFAccordionContent": {
    "id": "SFAccordionContent",
    "name": "SFAccordionContent",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFACCORDION — CONTENT REGION WITH GSAP STAGGER ANIMATION ON CHILD ELEMENTS.",
    "importPath": "signalframeux/animation",
    "importName": "SFAccordionContent",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFAccordionContent><p>First paragraph</p><p>Second paragraph</p></SFAccordionContent>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFProgress": {
    "id": "SFProgress",
    "name": "SFProgress",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFPROGRESS -- SIGNAL LAYER PROGRESS BAR WITH GSAP FILL TWEEN. WRAPS RADIX PROGRESS DIRECTLY (NOT SHADCN BASE) TO GAIN REF ACCESS ON THE INDICATOR. GSAP IS THE SOLE ANIMATION DRIVER -- NO CSS TRANSITION-ALL. RESPECTS PREFERS-REDUCED-MOTION (INSTANT GSAP.SET).",
    "importPath": "signalframeux/animation",
    "importName": "SFProgress",
    "props": [
      {
        "name": "value",
        "type": "any",
        "default": "",
        "desc": "Progress percentage 0-100"
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Additional classes on root"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFProgress value={60} />\n<SFProgress value={100} className=\"h-2\" />"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFStatusDot": {
    "id": "SFStatusDot",
    "name": "SFStatusDot",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "PRESENCE INDICATOR -- FRAME LAYER STATUS PRIMITIVE. 8PX SQUARE, GSAP PULSE ON ACTIVE STATE. RESPECTS PREFERS-REDUCED-MOTION.",
    "importPath": "signalframeux/animation",
    "importName": "SFStatusDot",
    "props": [
      {
        "name": "status",
        "type": "any",
        "default": "",
        "desc": "Current state: \"active\" (pulsing green), \"idle\" (accent), \"offline\" (muted)"
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Additional classes merged onto the dot element"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFStatusDot status=\"active\" />\n<SFStatusDot status=\"idle\" />\n<SFStatusDot status=\"offline\" />"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFToaster": {
    "id": "SFToaster",
    "name": "SFToaster",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFTOASTER — GLOBAL TOAST CONTAINER POSITIONED BOTTOM-LEFT AT Z-100. PLACE ONCE IN APP/LAYOUT.TSX AS A SIBLING TO {CHILDREN}. USES SONNER IN UNSTYLED MODE FOR FULL DU/TDR CONTROL. TOAST NOTIFICATIONS SLIDE IN FROM THE LEFT VIA GSAP, RESPECTING PREFERS-REDUCED-MOTION.",
    "importPath": "signalframeux/animation",
    "importName": "SFToaster",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "// In app/layout.tsx:\n<SFToaster />\n\n// Trigger from any client component:\nimport { sfToast } from \"@/components/sf\";\nsfToast.success(\"OPERATION COMPLETE\");"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "sfToast": {
    "id": "sfToast",
    "name": "sfToast",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFTOAST — IMPERATIVE TOAST API. TRIGGERS CUSTOM SONNER TOASTS RENDERED WITH SFTOASTCONTENT + GSAP SLIDE.",
    "importPath": "signalframeux/animation",
    "importName": "sfToast",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "sfToast.default(\"SYSTEM NOTICE\", { description: \"All systems nominal\" });\nsfToast.success(\"SAVED\");\nsfToast.error(\"CRITICAL FAILURE\");\nsfToast.warning(\"LOW SIGNAL\");\nsfToast.info(\"UPDATE AVAILABLE\");"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFStepper": {
    "id": "SFStepper",
    "name": "SFStepper",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SFSTEPPER -- SIGNAL LAYER VERTICAL MULTI-STEP FLOW COMPONENT. RENDERS A VERTICAL SEQUENCE OF STEPS WITH SFPROGRESS CONNECTORS BETWEEN THEM. EACH STEP HAS A STATUS INDICATOR (SQUARE, NOT CIRCLE) AND OPTIONAL LABEL/DESCRIPTION. CONNECTORS USE ACTUAL SFPROGRESS INSTANCES FOR GSAP-DRIVEN FILL ANIMATION.",
    "importPath": "signalframeux/animation",
    "importName": "SFStepper",
    "props": [
      {
        "name": "activeStep",
        "type": "any",
        "default": "",
        "desc": "Zero-based index of the current active step"
      },
      {
        "name": "children",
        "type": "any",
        "default": "",
        "desc": "SFStep elements"
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Additional classes on root container"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFStepper activeStep={1}>\n  <SFStep status=\"complete\" label=\"Account\" description=\"Create your account\" />\n  <SFStep status=\"active\" label=\"Profile\" description=\"Set up your profile\" />\n  <SFStep status=\"pending\" label=\"Review\" description=\"Review and submit\" />\n</SFStepper>\n\n<SFStepper activeStep={2}>\n  <SFStep status=\"complete\" label=\"Upload\" />\n  <SFStep status=\"error\" label=\"Validate\" description=\"3 errors found\" />\n  <SFStep status=\"pending\" label=\"Publish\" />\n</SFStepper>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFStep": {
    "id": "SFStep",
    "name": "SFStep",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SUB-COMPONENT OF SFSTEPPER — INDIVIDUAL STEP WITH STATUS INDICATOR, LABEL, AND OPTIONAL DESCRIPTION.",
    "importPath": "signalframeux/animation",
    "importName": "SFStep",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFStep status=\"complete\" label=\"Account\" description=\"Create your account\" />"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SFEmptyState": {
    "id": "SFEmptyState",
    "name": "SFEmptyState",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "DESIGNED EMPTY STATE -- FRAME LAYER PLACEHOLDER WITH DU/TDR TENSION. BAYER DITHER BACKGROUND, MONOSPACE TEXT, OPTIONAL SCRAMBLETEXT SIGNAL TREATMENT.",
    "importPath": "signalframeux/animation",
    "importName": "SFEmptyState",
    "props": [
      {
        "name": "title",
        "type": "any",
        "default": "",
        "desc": "Primary message text displayed in monospace uppercase"
      },
      {
        "name": "scramble",
        "type": "any",
        "default": "",
        "desc": "When true, title renders inside ScrambleText for SIGNAL layer effect"
      },
      {
        "name": "action",
        "type": "any",
        "default": "",
        "desc": "Optional action slot (e.g., a button to retry or navigate)"
      },
      {
        "name": "className",
        "type": "any",
        "default": "",
        "desc": "Additional classes merged onto the outer container"
      },
      {
        "name": "children",
        "type": "any",
        "default": "",
        "desc": "Optional description content rendered below the title"
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "<SFEmptyState title=\"NO DATA FOUND\" scramble>\n  <p>Try adjusting your filters.</p>\n</SFEmptyState>"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "registerSFEasings": {
    "id": "registerSFEasings",
    "name": "registerSFEasings",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "SIGNALFRAMEUX CUSTOM GSAP EASINGS — SINGLE CANONICAL SOURCE. IMPORT FROM ANY GSAP-* ENTRY POINT THAT HAS CUSTOMEASE REGISTERED.",
    "importPath": "signalframeux/animation",
    "importName": "registerSFEasings",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "// Register the SF custom easings once at app init (client-only).\nimport { registerSFEasings } from \"signalframeux/animation\";\nregisterSFEasings();\n// Then reference \"sf-snap\" or \"sf-punch\" in any gsap tween:\n// gsap.to(el, { x: 100, ease: \"sf-snap\", duration: 0.3 });"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "initReducedMotion": {
    "id": "initReducedMotion",
    "name": "initReducedMotion",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "INITIALIZE REDUCED-MOTION HANDLING FOR GSAP. CALL ONCE FROM A CLIENT COMPONENT'S USEEFFECT — NOT AT MODULE SCOPE. RETURNS A CLEANUP FUNCTION THAT REMOVES THE MATCHMEDIA LISTENER.",
    "importPath": "signalframeux/animation",
    "importName": "initReducedMotion",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "// In a top-level client component (layout.tsx, AppShell, etc.)\n\"use client\";\nimport { useEffect } from \"react\";\nimport { initReducedMotion } from \"signalframeux/animation\";\n\nexport function AppShell({ children }) {\n  useEffect(() => initReducedMotion(), []);\n  return <>{children}</>;\n}"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "SignalCanvas": {
    "id": "SignalCanvas",
    "name": "SignalCanvas",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "FULL-VIEWPORT WEBGL CANVAS SINGLETON — SIGNAL LAYER RENDERING SURFACE. MOUNTS A SINGLE SHARED THREE.JS WEBGLRENDERER CANVAS THAT ALL USESIGNALSCENE INSTANCES DRAW INTO. MUST BE MOUNTED ONCE AT APP ROOT (LAYOUT.TSX). LAZY-LOADED VIA SIGNAL-CANVAS-LAZY.TSX.",
    "importPath": "signalframeux/webgl",
    "importName": "SignalCanvas",
    "props": [],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "// In app/layout.tsx:\nimport dynamic from 'next/dynamic';\nconst SignalCanvas = dynamic(() => import('signalframeux/webgl').then(m => ({ default: m.SignalCanvas })), { ssr: false });\n<SignalCanvas />"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  },
  "resolveColorToken": {
    "id": "resolveColorToken",
    "name": "resolveColorToken",
    "layer": "SIGNAL",
    "version": "v1.6.0",
    "status": "STABLE",
    "description": "RESOLVE A CSS CUSTOM PROPERTY (OKLCH OR ANY FORMAT) TO SRGB VALUES. USES 1X1 CANVAS PROBE — ZERO BUNDLE COST, USES BROWSER'S OWN COLOR ENGINE.",
    "importPath": "signalframeux/webgl",
    "importName": "resolveColorToken",
    "props": [
      {
        "name": "cssVar",
        "type": "any",
        "default": "",
        "desc": "CSS custom property name including `--` prefix, e.g. `\"--sfx-primary\"`"
      },
      {
        "name": "options",
        "type": "any",
        "default": "",
        "desc": "Optional cache configuration. Omit to bypass cache (default)."
      }
    ],
    "usage": [
      {
        "label": "EXAMPLE 1",
        "code": "const { r, g, b } = resolveColorToken(\"--sfx-primary\");\nctx.fillStyle = `rgb(${r}, ${g}, ${b})`;"
      }
    ],
    "a11y": [
      "RESPECTS PREFERS-REDUCED-MOTION",
      "ANIMATION SKIPPED WHEN REDUCED MOTION IS ACTIVE"
    ]
  }
};

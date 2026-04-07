/**
 * API documentation data for all SignalframeUX components and utilities.
 * Each entry maps to a nav item in the API Explorer sidebar.
 * The Button entry is rendered via custom JSX (legacy); all others use this data.
 */

export interface PropDef {
  name: string;
  type: string;
  default: string;
  desc: string;
  required?: boolean;
}

export interface UsageExample {
  label: string;
  code: string;
}

export interface PreviewHud {
  lines: string[];
  code: string;
}

export interface ComponentDoc {
  id: string;
  name: string;
  layer: "FRAME" | "SIGNAL" | "CORE" | "TOKEN" | "HOOK";
  version: string;
  status: "STABLE" | "BETA" | "EXPERIMENTAL";
  description: string;
  importPath: string;
  importName: string;
  props: PropDef[];
  usage: UsageExample[];
  a11y: string[];
  preview?: PreviewHud;
}

export const API_DOCS: Record<string, ComponentDoc> = {
  /* ═══════════════════════════════════════
     CORE
     ═══════════════════════════════════════ */
  createSignalframeUX: {
    id: "createSignalframeUX",
    name: "createSignalframeUX",
    layer: "CORE",
    version: "v2.1.0",
    status: "STABLE",
    description:
      "INITIALIZES THE SIGNALFRAME//UX RUNTIME. REGISTERS TOKENS, SETS THE DEFAULT THEME, AND RETURNS A CONFIGURED INSTANCE. CALL ONCE AT APP ROOT — TYPICALLY IN YOUR LAYOUT OR PROVIDER.",
    importPath: "@sfux/core",
    importName: "createSignalframeUX",
    props: [
      { name: "theme", type: "'light' | 'dark' | ThemeConfig", default: "'dark'", desc: "DEFAULT THEME" },
      { name: "tokens", type: "TokenSet", default: "defaultTokens", desc: "DESIGN TOKEN OVERRIDES" },
      { name: "signalLayer", type: "boolean", default: "true", desc: "ENABLE SIGNAL EFFECTS" },
      { name: "reducedMotion", type: "'respect' | 'force' | 'ignore'", default: "'respect'", desc: "MOTION PREFERENCE" },
    ],
    usage: [
      {
        label: "BASIC SETUP",
        code: `import { createSignalframeUX } from '@sfux/core'\n\nconst sfux = createSignalframeUX({\n  theme: 'dark',\n  signalLayer: true,\n})`,
      },
      {
        label: "CUSTOM TOKENS",
        code: `const sfux = createSignalframeUX({\n  tokens: {\n    color: { primary: 'oklch(0.65 0.29 350)' },\n    motion: { duration: { normal: '200ms' } },\n  },\n})`,
      },
    ],
    a11y: [
      "RESPECTS PREFERS-REDUCED-MOTION BY DEFAULT",
      "SIGNAL LAYER CAN BE DISABLED GLOBALLY",
      "THEME SWITCHING PRESERVES FOCUS STATE",
    ],
  },

  useSignalframe: {
    id: "useSignalframe",
    name: "useSignalframe",
    layer: "HOOK",
    version: "v2.1.0",
    status: "STABLE",
    description:
      "REACT HOOK THAT PROVIDES ACCESS TO THE SIGNALFRAME//UX CONTEXT. RETURNS THE CURRENT THEME, TOKEN VALUES, AND RUNTIME CONTROLS. MUST BE CALLED INSIDE AN SFUXPROVIDER.",
    importPath: "@sfux/core",
    importName: "useSignalframe",
    props: [
      { name: "returns.theme", type: "'light' | 'dark'", default: "—", desc: "CURRENT ACTIVE THEME" },
      { name: "returns.tokens", type: "ResolvedTokens", default: "—", desc: "RESOLVED TOKEN VALUES" },
      { name: "returns.setTheme", type: "(theme: string) => void", default: "—", desc: "THEME SWITCHER" },
      { name: "returns.signalEnabled", type: "boolean", default: "—", desc: "SIGNAL LAYER STATE" },
    ],
    usage: [
      {
        label: "READ THEME",
        code: `import { useSignalframe } from '@sfux/core'\n\nfunction MyComponent() {\n  const { theme, tokens } = useSignalframe()\n  return <div style={{ color: tokens.color.primary }}>{theme}</div>\n}`,
      },
    ],
    a11y: ["CONTEXT UPDATES DO NOT CAUSE FOCUS LOSS", "THEME TRANSITIONS RESPECT REDUCED MOTION"],
  },

  SFUXProvider: {
    id: "SFUXProvider",
    name: "SFUXProvider",
    layer: "CORE",
    version: "v2.1.0",
    status: "STABLE",
    description:
      "REACT CONTEXT PROVIDER THAT WRAPS YOUR APPLICATION. SUPPLIES THEME, TOKENS, AND SIGNAL LAYER STATE TO ALL DESCENDANT COMPONENTS. PLACE AT THE ROOT OF YOUR COMPONENT TREE.",
    importPath: "@sfux/core",
    importName: "SFUXProvider",
    props: [
      { name: "instance", type: "SignalframeUX", default: "—", desc: "CONFIGURED SFUX INSTANCE", required: true },
      { name: "children", type: "React.ReactNode", default: "—", desc: "APP CONTENT", required: true },
      { name: "defaultTheme", type: "'light' | 'dark'", default: "'dark'", desc: "INITIAL THEME OVERRIDE" },
    ],
    usage: [
      {
        label: "ROOT LAYOUT",
        code: `import { SFUXProvider, createSignalframeUX } from '@sfux/core'\n\nconst sfux = createSignalframeUX()\n\nexport default function Layout({ children }) {\n  return (\n    <SFUXProvider instance={sfux}>\n      {children}\n    </SFUXProvider>\n  )\n}`,
      },
    ],
    a11y: ["DOES NOT RENDER ANY DOM ELEMENTS", "TRANSPARENT TO ACCESSIBILITY TREE"],
  },

  defineTheme: {
    id: "defineTheme",
    name: "defineTheme",
    layer: "CORE",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "CREATES A CUSTOM THEME CONFIGURATION. EXTENDS THE BASE DARK OR LIGHT THEME WITH YOUR TOKEN OVERRIDES. RETURNS A THEME OBJECT COMPATIBLE WITH CREATESIGNALFRAMEUX.",
    importPath: "@sfux/core",
    importName: "defineTheme",
    props: [
      { name: "base", type: "'light' | 'dark'", default: "'dark'", desc: "THEME TO EXTEND" },
      { name: "overrides", type: "Partial<TokenSet>", default: "{}", desc: "TOKEN OVERRIDES" },
      { name: "name", type: "string", default: "—", desc: "THEME IDENTIFIER", required: true },
    ],
    usage: [
      {
        label: "CUSTOM THEME",
        code: `import { defineTheme } from '@sfux/core'\n\nconst midnight = defineTheme({\n  name: 'midnight',\n  base: 'dark',\n  overrides: {\n    color: { primary: 'oklch(0.55 0.25 270)' },\n    border: { radius: '0px' },\n  },\n})`,
      },
    ],
    a11y: ["CUSTOM THEMES MUST MAINTAIN 4.5:1 CONTRAST RATIO", "PRIMARY COLOR IS VALIDATED AT CREATION TIME"],
  },

  /* ═══════════════════════════════════════
     COMPONENTS
     ═══════════════════════════════════════ */
  input: {
    id: "input",
    name: "Input",
    layer: "FRAME",
    version: "v2.1.0",
    status: "STABLE",
    description:
      "TEXT INPUT WITH INDUSTRIAL STYLING. SUPPORTS PLACEHOLDER SCRAMBLE EFFECT, VALIDATION STATES, AND SIGNAL LAYER GLOW. ZERO BORDER-RADIUS. MONOSPACE PLACEHOLDER TEXT.",
    importPath: "@sfux/components",
    importName: "Input",
    props: [
      { name: "placeholder", type: "string", default: "''", desc: "PLACEHOLDER TEXT" },
      { name: "variant", type: "'frame' | 'signal'", default: "'frame'", desc: "VISUAL STYLE" },
      { name: "error", type: "boolean", default: "false", desc: "ERROR STATE" },
      { name: "errorMessage", type: "string", default: "—", desc: "VALIDATION MESSAGE" },
      { name: "scramblePlaceholder", type: "boolean", default: "false", desc: "ANIMATE PLACEHOLDER ON FOCUS" },
      { name: "disabled", type: "boolean", default: "false", desc: "DISABLE INPUT" },
    ],
    usage: [
      {
        label: "BASIC",
        code: `<Input placeholder="ENTER SIGNAL..." />`,
      },
      {
        label: "WITH VALIDATION",
        code: `<Input\n  placeholder="EMAIL"\n  error={!isValid}\n  errorMessage="INVALID FORMAT"\n/>`,
      },
    ],
    a11y: [
      "NATIVE <INPUT> ELEMENT — FULL BROWSER SUPPORT",
      "ERROR STATE USES ARIA-INVALID + ARIA-DESCRIBEDBY",
      "FOCUS RING: 3PX SOLID PRIMARY, OFFSET 2PX",
      "PLACEHOLDER CONTRAST: 4.5:1 MINIMUM",
    ],
  },

  card: {
    id: "card",
    name: "Card",
    layer: "FRAME",
    version: "v2.1.0",
    status: "STABLE",
    description:
      "MODULAR CONTENT CONTAINER WITH HEADER, CONTENT, AND FOOTER SLOTS. SUPPORTS HOVER ELEVATION, BORDER VARIANTS, AND SIGNAL LAYER NOISE BACKGROUND.",
    importPath: "@sfux/components",
    importName: "Card",
    props: [
      { name: "hoverable", type: "boolean", default: "true", desc: "ENABLE HOVER LIFT EFFECT" },
      { name: "variant", type: "'frame' | 'signal' | 'outline'", default: "'frame'", desc: "VISUAL VARIANT" },
      { name: "padding", type: "'sm' | 'md' | 'lg' | 'none'", default: "'md'", desc: "CONTENT PADDING" },
    ],
    usage: [
      {
        label: "BASIC CARD",
        code: `<Card>\n  <CardHeader>\n    <CardTitle>DEPLOYMENT</CardTitle>\n  </CardHeader>\n  <CardContent>\n    <p>BUILD #4201 — DEPLOYED TO PRODUCTION</p>\n  </CardContent>\n</Card>`,
      },
    ],
    a11y: ["USES SEMANTIC <ARTICLE> ELEMENT", "HOVER EFFECT RESPECTS REDUCED MOTION", "FOCUS-WITHIN RING ON TAB NAVIGATION"],
  },

  modal: {
    id: "modal",
    name: "Modal",
    layer: "FRAME",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "DIALOG OVERLAY WITH FOCUS TRAP AND BACKDROP. ZERO BORDER-RADIUS. INDUSTRIAL CLOSE BUTTON. SUPPORTS STACKED MODALS AND SIGNAL LAYER GLITCH ENTRANCE.",
    importPath: "@sfux/components",
    importName: "Modal",
    props: [
      { name: "open", type: "boolean", default: "false", desc: "CONTROLLED OPEN STATE", required: true },
      { name: "onClose", type: "() => void", default: "—", desc: "CLOSE HANDLER", required: true },
      { name: "title", type: "string", default: "—", desc: "DIALOG TITLE" },
      { name: "size", type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'", desc: "MODAL WIDTH" },
      { name: "closeOnBackdrop", type: "boolean", default: "true", desc: "CLOSE ON BACKDROP CLICK" },
    ],
    usage: [
      {
        label: "CONFIRM DIALOG",
        code: `<Modal open={isOpen} onClose={() => setOpen(false)} title="CONFIRM ACTION">\n  <p>THIS OPERATION CANNOT BE UNDONE.</p>\n  <div className="flex gap-2 mt-4">\n    <Button variant="frame" onClick={onConfirm}>CONFIRM</Button>\n    <Button variant="ghost" onClick={() => setOpen(false)}>CANCEL</Button>\n  </div>\n</Modal>`,
      },
    ],
    a11y: [
      "FOCUS TRAPPED WITHIN MODAL WHEN OPEN",
      "ESC KEY CLOSES MODAL",
      "ARIA-MODAL='TRUE' ON DIALOG ELEMENT",
      "FOCUS RETURNS TO TRIGGER ON CLOSE",
      "BACKDROP ANNOUNCED AS 'DISMISS' TO SCREEN READERS",
    ],
  },

  table: {
    id: "table",
    name: "Table",
    layer: "FRAME",
    version: "v2.1.0",
    status: "STABLE",
    description:
      "DATA TABLE WITH INDUSTRIAL HEADERS, MONOSPACE CELLS, AND OPTIONAL SORT INDICATORS. SUPPORTS STICKY HEADERS, ROW SELECTION, AND SIGNAL LAYER HOVER EFFECTS.",
    importPath: "@sfux/components",
    importName: "Table",
    props: [
      { name: "data", type: "T[]", default: "[]", desc: "ROW DATA ARRAY" },
      { name: "columns", type: "ColumnDef<T>[]", default: "—", desc: "COLUMN DEFINITIONS", required: true },
      { name: "stickyHeader", type: "boolean", default: "false", desc: "FIXED HEADER ON SCROLL" },
      { name: "selectable", type: "boolean", default: "false", desc: "ENABLE ROW SELECTION" },
      { name: "onRowClick", type: "(row: T) => void", default: "—", desc: "ROW CLICK HANDLER" },
    ],
    usage: [
      {
        label: "TOKEN TABLE",
        code: `<Table\n  columns={[\n    { key: 'name', header: 'TOKEN' },\n    { key: 'value', header: 'VALUE' },\n  ]}\n  data={[\n    { name: 'primary', value: '#FF0090' },\n    { name: 'yellow', value: '#E5C800' },\n  ]}\n/>`,
      },
    ],
    a11y: [
      "SEMANTIC <TABLE> WITH <THEAD>/<TBODY>/<TH SCOPE>",
      "SORT INDICATORS USE ARIA-SORT ATTRIBUTE",
      "SELECTED ROWS ANNOUNCED VIA ARIA-SELECTED",
    ],
  },

  tabs: {
    id: "tabs",
    name: "Tabs",
    layer: "FRAME",
    version: "v2.1.0",
    status: "STABLE",
    description:
      "TABBED INTERFACE WITH INDUSTRIAL UNDERLINE INDICATOR. SUPPORTS CONTROLLED AND UNCONTROLLED MODES. SIGNAL LAYER ADDS SCRAMBLE TEXT EFFECT ON TAB SWITCH.",
    importPath: "@sfux/components",
    importName: "Tabs",
    props: [
      { name: "defaultValue", type: "string", default: "—", desc: "INITIAL ACTIVE TAB" },
      { name: "value", type: "string", default: "—", desc: "CONTROLLED ACTIVE TAB" },
      { name: "onValueChange", type: "(value: string) => void", default: "—", desc: "TAB CHANGE HANDLER" },
    ],
    usage: [
      {
        label: "BASIC TABS",
        code: `<Tabs defaultValue="signal">\n  <TabsList>\n    <TabsTrigger value="signal">SIGNAL</TabsTrigger>\n    <TabsTrigger value="frame">FRAME</TabsTrigger>\n  </TabsList>\n  <TabsContent value="signal">SIGNAL CONTENT</TabsContent>\n  <TabsContent value="frame">FRAME CONTENT</TabsContent>\n</Tabs>`,
      },
    ],
    a11y: [
      "ROLE='TABLIST' WITH ROLE='TAB' ON TRIGGERS",
      "ARROW KEY NAVIGATION BETWEEN TABS",
      "ARIA-SELECTED ON ACTIVE TAB",
      "TABPANEL LINKED VIA ARIA-LABELLEDBY",
    ],
  },

  toast: {
    id: "toast",
    name: "Toast",
    layer: "FRAME",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "NOTIFICATION TOAST WITH AUTO-DISMISS. SUPPORTS SUCCESS, ERROR, WARNING, AND INFO VARIANTS. STACKS VERTICALLY. SIGNAL LAYER ADDS GLITCH ENTRANCE ANIMATION.",
    importPath: "@sfux/components",
    importName: "toast",
    props: [
      { name: "title", type: "string", default: "—", desc: "TOAST HEADING", required: true },
      { name: "description", type: "string", default: "—", desc: "TOAST BODY" },
      { name: "variant", type: "'success' | 'error' | 'warning' | 'info'", default: "'info'", desc: "TOAST TYPE" },
      { name: "duration", type: "number", default: "5000", desc: "AUTO-DISMISS MS (0 = PERSISTENT)" },
    ],
    usage: [
      {
        label: "SUCCESS TOAST",
        code: `import { toast } from '@sfux/components'\n\ntoast({\n  title: 'DEPLOYED',\n  description: 'Build #4201 is live',\n  variant: 'success',\n})`,
      },
    ],
    a11y: [
      "ROLE='ALERT' FOR ERROR/WARNING",
      "ROLE='STATUS' FOR SUCCESS/INFO",
      "ARIA-LIVE='POLITE' — DOES NOT INTERRUPT SCREEN READER",
      "DISMISS BUTTON LABELLED 'CLOSE NOTIFICATION'",
    ],
  },

  dropdown: {
    id: "dropdown",
    name: "Dropdown",
    layer: "FRAME",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "DROPDOWN MENU WITH INDUSTRIAL STYLING. ZERO BORDER-RADIUS. SUPPORTS NESTED SUBMENUS, KEYBOARD NAVIGATION, AND SIGNAL LAYER HOVER EFFECTS.",
    importPath: "@sfux/components",
    importName: "Dropdown",
    props: [
      { name: "trigger", type: "React.ReactNode", default: "—", desc: "TRIGGER ELEMENT", required: true },
      { name: "items", type: "DropdownItem[]", default: "[]", desc: "MENU ITEMS" },
      { name: "align", type: "'start' | 'center' | 'end'", default: "'start'", desc: "ALIGNMENT RELATIVE TO TRIGGER" },
    ],
    usage: [
      {
        label: "BASIC DROPDOWN",
        code: `<Dropdown\n  trigger={<Button variant="ghost">OPTIONS ▾</Button>}\n  items={[\n    { label: 'EDIT', onClick: handleEdit },\n    { label: 'DUPLICATE', onClick: handleDupe },\n    { type: 'separator' },\n    { label: 'DELETE', onClick: handleDelete, variant: 'danger' },\n  ]}\n/>`,
      },
    ],
    a11y: [
      "ROLE='MENU' WITH ROLE='MENUITEM' ON ITEMS",
      "ARROW KEY NAVIGATION",
      "ESC CLOSES AND RETURNS FOCUS TO TRIGGER",
      "TYPE-AHEAD SEARCH ON LETTER KEYS",
    ],
  },

  drawer: {
    id: "drawer",
    name: "Drawer",
    layer: "FRAME",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "SLIDE-OUT PANEL FROM ANY EDGE. SUPPORTS LEFT, RIGHT, TOP, AND BOTTOM POSITIONS. FOCUS TRAP AND BACKDROP INCLUDED. SIGNAL LAYER ADDS GLITCH SLIDE ANIMATION.",
    importPath: "@sfux/components",
    importName: "Drawer",
    props: [
      { name: "open", type: "boolean", default: "false", desc: "CONTROLLED OPEN STATE", required: true },
      { name: "onClose", type: "() => void", default: "—", desc: "CLOSE HANDLER", required: true },
      { name: "side", type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", desc: "SLIDE DIRECTION" },
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", desc: "DRAWER WIDTH/HEIGHT" },
    ],
    usage: [
      {
        label: "RIGHT DRAWER",
        code: `<Drawer open={isOpen} onClose={close} side="right">\n  <DrawerHeader>SETTINGS</DrawerHeader>\n  <DrawerContent>\n    {/* ... */}\n  </DrawerContent>\n</Drawer>`,
      },
    ],
    a11y: ["FOCUS TRAPPED WHEN OPEN", "ESC KEY CLOSES DRAWER", "ARIA-MODAL='TRUE'", "SLIDE ANIMATION RESPECTS REDUCED MOTION"],
  },

  badge: {
    id: "badge",
    name: "Badge",
    layer: "FRAME",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "INLINE STATUS LABEL. SUPPORTS PRIMARY, OUTLINE, SIGNAL, AND CUSTOM COLOR VARIANTS. INDUSTRIAL UPPERCASE MONO TEXT. ZERO BORDER-RADIUS.",
    importPath: "@sfux/components",
    importName: "Badge",
    props: [
      { name: "intent", type: "'primary' | 'outline' | 'signal' | 'success' | 'warning' | 'danger'", default: "'primary'", desc: "COLOR VARIANT" },
      { name: "size", type: "'sm' | 'md'", default: "'sm'", desc: "BADGE SIZE" },
    ],
    usage: [
      {
        label: "STATUS BADGES",
        code: `<Badge intent="primary">NEW</Badge>\n<Badge intent="signal">BETA</Badge>\n<Badge intent="success">LIVE</Badge>\n<Badge intent="danger">DEPRECATED</Badge>`,
      },
    ],
    a11y: ["PURELY DECORATIVE — CONTEXT CONVEYED BY SURROUNDING TEXT", "DOES NOT USE ROLE='STATUS' (USE TOAST FOR LIVE UPDATES)"],
  },

  /* ═══════════════════════════════════════
     SIGNAL LAYER
     ═══════════════════════════════════════ */
  noisebg: {
    id: "noisebg",
    name: "NoiseBG",
    layer: "SIGNAL",
    version: "v1.0.0",
    status: "STABLE",
    description:
      "FRACTAL NOISE BACKGROUND TEXTURE. GENERATES SVG-BASED GRAIN PATTERN OVERLAID ON ANY CONTAINER. CONFIGURABLE OPACITY, SCALE, AND ANIMATION SPEED. HIDDEN ON REDUCED MOTION.",
    importPath: "@sfux/signal",
    importName: "NoiseBG",
    props: [
      { name: "opacity", type: "number (0-1)", default: "0.15", desc: "NOISE VISIBILITY" },
      { name: "scale", type: "number", default: "1", desc: "GRAIN SIZE MULTIPLIER" },
      { name: "animate", type: "boolean", default: "true", desc: "ENABLE FLICKER ANIMATION" },
      { name: "speed", type: "number", default: "1", desc: "ANIMATION SPEED MULTIPLIER" },
    ],
    usage: [
      {
        label: "BASIC OVERLAY",
        code: `<div className="relative">\n  <NoiseBG opacity={0.12} />\n  <div className="relative z-10">YOUR CONTENT</div>\n</div>`,
      },
    ],
    a11y: ["ARIA-HIDDEN='TRUE' — PURELY DECORATIVE", "HIDDEN ON PREFERS-REDUCED-MOTION", "DOES NOT AFFECT TEXT READABILITY AT DEFAULT OPACITY"],
  },

  particlemesh: {
    id: "particlemesh",
    name: "ParticleMesh",
    layer: "SIGNAL",
    version: "v1.0.0",
    status: "STABLE",
    description:
      "CANVAS-BASED PARTICLE NETWORK WITH MOUSE REPULSION. RENDERS A GRID OF DOTS CONNECTED BY PROXIMITY LINES. RESPONDS TO CURSOR MOVEMENT. PAUSES WHEN OFFSCREEN VIA INTERSECTIONOBSERVER.",
    importPath: "@sfux/signal",
    importName: "ParticleMesh",
    props: [
      { name: "particleCount", type: "number", default: "80", desc: "NUMBER OF PARTICLES" },
      { name: "color", type: "string", default: "var(--sf-dim-text)", desc: "PARTICLE COLOR" },
      { name: "mouseRadius", type: "number", default: "150", desc: "REPULSION RADIUS (PX)" },
      { name: "mouseForce", type: "number", default: "28", desc: "REPULSION STRENGTH" },
    ],
    usage: [
      {
        label: "HERO BACKGROUND",
        code: `<div className="relative h-screen">\n  <ParticleMesh\n    particleCount={100}\n    mouseRadius={200}\n    mouseForce={35}\n  />\n</div>`,
      },
    ],
    a11y: [
      "ARIA-HIDDEN='TRUE' — PURELY DECORATIVE",
      "CANVAS NOT FOCUSABLE",
      "PAUSES ON REDUCED MOTION",
      "PAUSES OFFSCREEN VIA INTERSECTIONOBSERVER",
    ],
  },

  glitchtext: {
    id: "glitchtext",
    name: "GlitchText",
    layer: "SIGNAL",
    version: "v1.0.0",
    status: "STABLE",
    description:
      "TEXT WITH CHROMATIC ABERRATION GLITCH EFFECT. RENDERS THREE OFFSET LAYERS (PRIMARY, CYAN, YELLOW) WITH CLIP-PATH SLICING. SUPPORTS STATIC AND ANIMATED MODES.",
    importPath: "@sfux/signal",
    importName: "GlitchText",
    props: [
      { name: "text", type: "string", default: "—", desc: "DISPLAY TEXT", required: true },
      { name: "animate", type: "boolean", default: "true", desc: "ENABLE CONTINUOUS GLITCH" },
      { name: "intensity", type: "number (0-1)", default: "0.5", desc: "GLITCH DISPLACEMENT AMOUNT" },
      { name: "interval", type: "number", default: "3000", desc: "MS BETWEEN GLITCH BURSTS" },
    ],
    usage: [
      {
        label: "STATIC GLITCH",
        code: `<GlitchText text="SIGNAL//FRAME" animate={false} />`,
      },
      {
        label: "ANIMATED BURST",
        code: `<GlitchText\n  text="ERROR 404"\n  intensity={0.8}\n  interval={2000}\n/>`,
      },
    ],
    a11y: [
      "ARIA-LABEL SET TO PLAIN TEXT (NO VISUAL ARTIFACTS READ)",
      "ANIMATION HIDDEN ON REDUCED MOTION",
      "ORIGINAL TEXT ALWAYS PRESENT AND READABLE",
    ],
  },

  waveform: {
    id: "waveform",
    name: "Waveform",
    layer: "SIGNAL",
    version: "v1.0.0",
    status: "STABLE",
    description:
      "SVG AUDIO WAVEFORM VISUALIZATION. RENDERS SINE-BASED POLYLINES WITH CONFIGURABLE FREQUENCY, AMPLITUDE, AND HARMONIC OVERLAYS. SUPPORTS REACTIVE MODE THAT RESPONDS TO DATA INPUT.",
    importPath: "@sfux/signal",
    importName: "Waveform",
    props: [
      { name: "frequency", type: "number", default: "5", desc: "WAVE OSCILLATION FREQUENCY" },
      { name: "amplitude", type: "number", default: "18", desc: "WAVE HEIGHT (PX)" },
      { name: "harmonics", type: "number", default: "1", desc: "NUMBER OF HARMONIC OVERLAYS" },
      { name: "color", type: "string", default: "var(--color-primary)", desc: "PRIMARY WAVE COLOR" },
      { name: "data", type: "number[]", default: "—", desc: "REACTIVE DATA POINTS (OVERRIDES SINE)" },
    ],
    usage: [
      {
        label: "STATIC WAVEFORM",
        code: `<Waveform frequency={5} amplitude={20} />`,
      },
      {
        label: "DATA-REACTIVE",
        code: `<Waveform data={audioSamples} color="var(--sf-green)" />`,
      },
    ],
    a11y: ["ARIA-HIDDEN='TRUE' — DECORATIVE VISUALIZATION", "SVG NOT FOCUSABLE", "DESCRIBE DATA IN ADJACENT TEXT IF MEANINGFUL"],
  },

  reactivecanvas: {
    id: "reactivecanvas",
    name: "ReactiveCanvas",
    layer: "SIGNAL",
    version: "v1.0.0",
    status: "EXPERIMENTAL",
    description:
      "GENERAL-PURPOSE CANVAS COMPONENT WITH BUILT-IN RAF LOOP, INTERSECTION OBSERVER PAUSING, AND MOUSE TRACKING. BASE CLASS FOR CUSTOM SIGNAL LAYER EFFECTS.",
    importPath: "@sfux/signal",
    importName: "ReactiveCanvas",
    props: [
      { name: "draw", type: "(ctx: CanvasRenderingContext2D, frame: FrameData) => void", default: "—", desc: "RENDER CALLBACK", required: true },
      { name: "width", type: "number | '100%'", default: "'100%'", desc: "CANVAS WIDTH" },
      { name: "height", type: "number | '100%'", default: "'100%'", desc: "CANVAS HEIGHT" },
      { name: "trackMouse", type: "boolean", default: "true", desc: "PASS MOUSE COORDS TO DRAW" },
    ],
    usage: [
      {
        label: "CUSTOM EFFECT",
        code: `<ReactiveCanvas\n  draw={(ctx, { width, height, mouse, time }) => {\n    ctx.clearRect(0, 0, width, height)\n    // YOUR RENDERING LOGIC\n  }}\n/>`,
      },
    ],
    a11y: ["ARIA-HIDDEN='TRUE' — DECORATIVE CANVAS", "PAUSES OFFSCREEN AND ON REDUCED MOTION", "RAF LOOP CLEANED UP ON UNMOUNT"],
  },

  /* ═══════════════════════════════════════
     TOKENS
     ═══════════════════════════════════════ */
  colors: {
    id: "colors",
    name: "colors",
    layer: "TOKEN",
    version: "v2.1.0",
    status: "STABLE",
    description:
      "OKLCH-BASED COLOR TOKEN SYSTEM. 49 SCALES ACROSS NEUTRAL, PRIMARY, AND SEMANTIC PALETTES. PERCEPTUALLY UNIFORM — CONSISTENT LIGHTNESS ACROSS HUES. DARK MODE OVERRIDES VIA .DARK CLASS.",
    importPath: "@sfux/tokens",
    importName: "colors",
    props: [
      { name: "--color-primary", type: "oklch", default: "oklch(0.65 0.29 350)", desc: "BRAND PRIMARY (MAGENTA)" },
      { name: "--color-background", type: "oklch", default: "oklch(1 0 0)", desc: "PAGE BACKGROUND" },
      { name: "--color-foreground", type: "oklch", default: "oklch(0.145 0 0)", desc: "TEXT COLOR" },
      { name: "--sf-yellow", type: "oklch", default: "oklch(0.86 0.19 95)", desc: "TDR YELLOW ACCENT" },
      { name: "--sf-green", type: "oklch", default: "oklch(0.7 0.2 145)", desc: "SUCCESS / CODE ACCENT" },
    ],
    usage: [
      {
        label: "CSS VARIABLES",
        code: `/* USE DIRECTLY IN CSS */\n.my-element {\n  color: var(--color-primary);\n  background: var(--sf-dark-surface);\n}\n\n/* OR VIA TAILWIND */\n<div className="text-primary bg-foreground" />`,
      },
    ],
    a11y: ["ALL TOKEN PAIRS MEET WCAG 2.1 AA (4.5:1)", "DIM TEXT TOKENS VALIDATED AT 3:1 FOR LARGE TEXT", "DARK MODE PRESERVES CONTRAST RATIOS"],
  },

  spacing: {
    id: "spacing",
    name: "spacing",
    layer: "TOKEN",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "SPACING SCALE BASED ON 4PX GRID. TOKENS FOR PADDING, MARGIN, AND GAP. CLAMP-BASED RESPONSIVE VALUES FOR FLUID SCALING BETWEEN BREAKPOINTS.",
    importPath: "@sfux/tokens",
    importName: "spacing",
    props: [
      { name: "--space-1", type: "length", default: "4px", desc: "BASE UNIT" },
      { name: "--space-2", type: "length", default: "8px", desc: "2X BASE" },
      { name: "--space-4", type: "length", default: "16px", desc: "4X BASE" },
      { name: "--space-8", type: "length", default: "32px", desc: "8X BASE" },
      { name: "--space-16", type: "length", default: "64px", desc: "16X BASE (SECTION)" },
    ],
    usage: [
      {
        label: "FLUID SPACING",
        code: `<section style={{ padding: 'clamp(24px, 5vw, 48px)' }}>\n  <h2 style={{ marginBottom: 'var(--space-4)' }}>TITLE</h2>\n</section>`,
      },
    ],
    a11y: ["SPACING DOES NOT AFFECT ACCESSIBILITY DIRECTLY", "TOUCH TARGETS MAINTAIN 44PX MINIMUM AT ALL SCALES"],
  },

  typography: {
    id: "typography",
    name: "typography",
    layer: "TOKEN",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "THREE-FONT SYSTEM: ANTON (DISPLAY), ELECTROLIZE (BODY/UI), JETBRAINS MONO (CODE). AUGMENTED FOURTH SCALE (1.414 RATIO). ALL FONTS LOAD WITH DISPLAY: SWAP.",
    importPath: "@sfux/tokens",
    importName: "typography",
    props: [
      { name: "--font-display", type: "font-family", default: "Anton, Impact, sans-serif", desc: "DISPLAY HEADLINES" },
      { name: "--font-sans", type: "font-family", default: "Electrolize, sans-serif", desc: "BODY / UI TEXT" },
      { name: "--font-mono", type: "font-family", default: "JetBrains Mono, monospace", desc: "CODE / DATA" },
      { name: "--text-base", type: "length", default: "16px", desc: "BASE FONT SIZE" },
    ],
    usage: [
      {
        label: "UTILITY CLASSES",
        code: `<h1 className="sf-display">HEADLINE</h1>\n<p className="sf-ui-text">BODY TEXT</p>\n<code className="font-mono">CODE BLOCK</code>`,
      },
    ],
    a11y: ["DISPLAY: SWAP ON ALL FONTS — NO INVISIBLE TEXT FLASH", "MINIMUM 16PX BODY TEXT FOR READABILITY", "LINE HEIGHT ≥ 1.5 FOR BODY TEXT"],
  },

  motion: {
    id: "motion",
    name: "motion",
    layer: "TOKEN",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "DURATION AND EASING TOKEN SYSTEM. FIVE DURATION LEVELS FROM INSTANT (100MS) TO GLACIAL (600MS). CUSTOM CUBIC-BEZIER EASINGS TUNED FOR INDUSTRIAL MECHANICAL FEEL.",
    importPath: "@sfux/tokens",
    importName: "motion",
    props: [
      { name: "--duration-instant", type: "time", default: "100ms", desc: "MICRO-INTERACTIONS" },
      { name: "--duration-fast", type: "time", default: "150ms", desc: "HOVER / FOCUS" },
      { name: "--duration-normal", type: "time", default: "250ms", desc: "STANDARD TRANSITIONS" },
      { name: "--duration-slow", type: "time", default: "400ms", desc: "REVEALS / ENTRANCES" },
      { name: "--ease-spring", type: "cubic-bezier", default: "cubic-bezier(0.22, 1, 0.36, 1)", desc: "SPRING OVERSHOOT" },
    ],
    usage: [
      {
        label: "CSS TRANSITIONS",
        code: `.element {\n  transition:\n    transform var(--duration-normal) var(--ease-spring),\n    opacity var(--duration-fast) var(--ease-default);\n}`,
      },
    ],
    a11y: ["ALL ANIMATIONS GATED BY PREFERS-REDUCED-MOTION", "GSAP GLOBAL TIMESCALE SET TO 0 ON REDUCED MOTION", "CSS MEDIA QUERY SETS DURATION TO 0.01MS"],
  },

  elevation: {
    id: "elevation",
    name: "elevation",
    layer: "TOKEN",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "Z-INDEX AND SHADOW SCALE. SEVEN NAMED LAYERS FROM NAV (50) TO SKIP LINK (900). INDUSTRIAL SHADOWS USE DEBOSS EFFECT INSTEAD OF DROP SHADOWS.",
    importPath: "@sfux/tokens",
    importName: "elevation",
    props: [
      { name: "--z-nav", type: "integer", default: "50", desc: "FIXED NAVIGATION" },
      { name: "--z-overlay", type: "integer", default: "100", desc: "MODALS / OVERLAYS" },
      { name: "--z-cursor", type: "integer", default: "500", desc: "CUSTOM CURSOR" },
      { name: "--z-vhs", type: "integer", default: "600", desc: "VHS OVERLAY LAYER" },
      { name: "--z-skip", type: "integer", default: "900", desc: "SKIP-TO-CONTENT LINK" },
    ],
    usage: [
      {
        label: "Z-INDEX TOKENS",
        code: `/* TAILWIND */\n<nav className="z-[var(--z-nav)]">\n\n/* CSS */\n.overlay { z-index: var(--z-overlay); }`,
      },
    ],
    a11y: ["SKIP LINK AT HIGHEST Z-INDEX — ALWAYS REACHABLE", "FOCUS TRAP LAYERS ABOVE BACKDROP LAYERS"],
  },

  /* ═══════════════════════════════════════
     HOOKS
     ═══════════════════════════════════════ */
  useSignalEffect: {
    id: "useSignalEffect",
    name: "useSignalEffect",
    layer: "HOOK",
    version: "v1.0.0",
    status: "STABLE",
    description:
      "HOOK TO APPLY A SIGNAL LAYER EFFECT TO ANY ELEMENT. RETURNS A REF TO ATTACH AND A CLEANUP FUNCTION. AUTOMATICALLY RESPECTS REDUCED MOTION AND SIGNAL LAYER TOGGLE.",
    importPath: "@sfux/hooks",
    importName: "useSignalEffect",
    props: [
      { name: "effect", type: "'shimmer' | 'pulse' | 'glitch' | 'noise' | 'chromatic'", default: "—", desc: "EFFECT TYPE", required: true },
      { name: "intensity", type: "number (0-1)", default: "0.5", desc: "EFFECT STRENGTH" },
      { name: "trigger", type: "'hover' | 'focus' | 'always' | 'scroll'", default: "'hover'", desc: "ACTIVATION MODE" },
    ],
    usage: [
      {
        label: "HOVER GLITCH",
        code: `function MyComponent() {\n  const ref = useSignalEffect('glitch', {\n    intensity: 0.6,\n    trigger: 'hover',\n  })\n  return <div ref={ref}>HOVER ME</div>\n}`,
      },
    ],
    a11y: ["EFFECT DISABLED ON REDUCED MOTION", "DOES NOT AFFECT ELEMENT SEMANTICS", "CLEANUP AUTOMATIC ON UNMOUNT"],
  },

  useToken: {
    id: "useToken",
    name: "useToken",
    layer: "HOOK",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "HOOK TO READ A RESOLVED TOKEN VALUE AT RUNTIME. RETURNS THE COMPUTED CSS CUSTOM PROPERTY VALUE. UPDATES WHEN THEME CHANGES.",
    importPath: "@sfux/hooks",
    importName: "useToken",
    props: [
      { name: "token", type: "string", default: "—", desc: "CSS CUSTOM PROPERTY NAME", required: true },
      { name: "returns", type: "string", default: "—", desc: "COMPUTED VALUE" },
    ],
    usage: [
      {
        label: "READ TOKEN",
        code: `function MyComponent() {\n  const primary = useToken('--color-primary')\n  const duration = useToken('--duration-normal')\n  return <p>Primary: {primary}, Duration: {duration}</p>\n}`,
      },
    ],
    a11y: ["READ-ONLY — NO ACCESSIBILITY IMPLICATIONS"],
  },

  useMotion: {
    id: "useMotion",
    name: "useMotion",
    layer: "HOOK",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "HOOK THAT RETURNS THE USER'S MOTION PREFERENCE AND A BOOLEAN FOR REDUCED MOTION. USE TO CONDITIONALLY SKIP ANIMATIONS IN JAVASCRIPT LOGIC.",
    importPath: "@sfux/hooks",
    importName: "useMotion",
    props: [
      { name: "returns.prefersReduced", type: "boolean", default: "—", desc: "TRUE IF REDUCED MOTION ENABLED" },
      { name: "returns.duration", type: "(token: string) => number", default: "—", desc: "RESOLVED DURATION IN MS (0 IF REDUCED)" },
    ],
    usage: [
      {
        label: "CONDITIONAL ANIMATION",
        code: `function MyComponent() {\n  const { prefersReduced, duration } = useMotion()\n  \n  useEffect(() => {\n    if (prefersReduced) return\n    gsap.to(ref.current, { y: 0, duration: duration('normal') / 1000 })\n  }, [])\n}`,
      },
    ],
    a11y: ["PROVIDES PROGRAMMATIC ACCESS TO MOTION PREFERENCE", "USE TO GATE ALL JAVASCRIPT ANIMATIONS"],
  },

  useBreakpoint: {
    id: "useBreakpoint",
    name: "useBreakpoint",
    layer: "HOOK",
    version: "v2.0.0",
    status: "STABLE",
    description:
      "HOOK THAT RETURNS THE CURRENT ACTIVE BREAKPOINT AND BOOLEAN MATCHERS. USES MATCHMEDIA LISTENERS FOR LIVE UPDATES. SSR-SAFE WITH FALLBACK TO 'MD'.",
    importPath: "@sfux/hooks",
    importName: "useBreakpoint",
    props: [
      { name: "returns.breakpoint", type: "'sm' | 'md' | 'lg' | 'xl' | '2xl'", default: "'md'", desc: "CURRENT BREAKPOINT" },
      { name: "returns.isMobile", type: "boolean", default: "false", desc: "TRUE BELOW MD" },
      { name: "returns.isDesktop", type: "boolean", default: "true", desc: "TRUE AT MD+" },
    ],
    usage: [
      {
        label: "RESPONSIVE LOGIC",
        code: `function MyComponent() {\n  const { isMobile, breakpoint } = useBreakpoint()\n  \n  return isMobile\n    ? <MobileNav />\n    : <DesktopNav columns={breakpoint === '2xl' ? 6 : 4} />\n}`,
      },
    ],
    a11y: ["SSR-SAFE — DEFAULTS TO 'MD' BEFORE HYDRATION", "NO LAYOUT SHIFT ON HYDRATION"],
  },

  /* ═══════════════════════════════════════
     SF COMPONENTS — PHASE 24 EXTENSION
     ═══════════════════════════════════════ */

  /* ── FORMS ─────────────────────────────── */

  sfButton: {
    id: "sfButton",
    name: "SFButton",
    layer: "FRAME",
    version: "v2.1.0",
    status: "STABLE",
    description:
      "PRIMARY ACTION BUTTON. FRAME LAYER INTERACTIVE PRIMITIVE. FONT-MONO, UPPERCASE, 2PX BORDER, ASYMMETRIC HOVER TIMING (100MS IN / 400MS OUT). THREE INTENT VARIANTS: PRIMARY, GHOST, SIGNAL.",
    importPath: "@/components/sf",
    importName: "SFButton",
    props: [
      { name: "intent", type: "'primary' | 'ghost' | 'signal'", default: "'primary'", desc: "VISUAL VARIANT — PRIMARY FILLS, GHOST IS TRANSPARENT, SIGNAL USES PRIMARY BORDER ACCENT" },
      { name: "size", type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", desc: "HEIGHT AND PADDING SCALE" },
      { name: "asChild", type: "boolean", default: "false", desc: "RENDER AS CHILD VIA RADIX SLOT (E.G. WRAPPING <A> TAG)" },
      { name: "className", type: "string", default: "—", desc: "MERGED VIA cn() — APPENDED, NEVER REPLACES BASE" },
    ],
    usage: [
      { label: "PRIMARY", code: `<SFButton intent="primary" size="md">LAUNCH</SFButton>` },
      { label: "GHOST", code: `<SFButton intent="ghost" size="sm" onClick={handleCancel}>CANCEL</SFButton>` },
      { label: "SIGNAL", code: `<SFButton intent="signal" size="lg">DEPLOY</SFButton>` },
    ],
    a11y: [
      "NATIVE <BUTTON> ELEMENT — FULL KEYBOARD AND SCREEN READER SUPPORT",
      "FOCUS RING: 2PX SOLID VIA .SF-FOCUSABLE — ALWAYS VISIBLE",
      "DISABLED STATE USES NATIVE DISABLED ATTRIBUTE — NOT ARIA-DISABLED",
    ],
  },

  sfInput: {
    id: "sfInput",
    name: "SFInput",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "TEXT INPUT FIELD. FRAME LAYER FORM PRIMITIVE. FONT-MONO, UPPERCASE, 2PX FOREGROUND BORDER, SF-FOCUSABLE INDICATOR, AND SF-BORDER-DRAW-FOCUS SIGNAL TREATMENT ON FOCUS.",
    importPath: "@/components/sf",
    importName: "SFInput",
    props: [
      { name: "type", type: "React.HTMLInputTypeAttribute", default: "'text'", desc: "NATIVE INPUT TYPE — TEXT, EMAIL, PASSWORD, NUMBER, ETC." },
      { name: "placeholder", type: "string", default: "—", desc: "PLACEHOLDER TEXT — AUTO-UPPERCASED VIA CSS" },
      { name: "disabled", type: "boolean", default: "false", desc: "DISABLES INPUT AND REDUCES OPACITY" },
      { name: "className", type: "string", default: "—", desc: "MERGED VIA cn() AFTER BASE CLASSES" },
    ],
    usage: [
      { label: "BASIC", code: `<SFInput placeholder="Enter value" />` },
      { label: "EMAIL", code: `<SFInput type="email" placeholder="you@studio.com" />` },
    ],
    a11y: [
      "NATIVE <INPUT> ELEMENT — FULL KEYBOARD NAVIGATION AND AUTOFILL SUPPORT",
      "REQUIRES ASSOCIATED <LABEL> OR ARIA-LABEL FOR SCREEN READER CONTEXT",
    ],
  },

  sfToggle: {
    id: "sfToggle",
    name: "SFToggle",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "PRESSABLE TOGGLE BUTTON. FRAME LAYER BINARY ON/OFF CONTROL. RADIX TOGGLE PRIMITIVE WITH SHARP CORNERS, 2PX BORDER, AND INVERTED FILL ON ACTIVE STATE. USE FOR FILTER CHIPS OR VIEW MODE SWITCHES.",
    importPath: "@/components/sf",
    importName: "SFToggle",
    props: [
      { name: "intent", type: "'default' | 'primary'", default: "'default'", desc: "VISUAL VARIANT — DEFAULT USES FOREGROUND FILL, PRIMARY USES PRIMARY TOKEN" },
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", desc: "HEIGHT AND PADDING SCALE" },
      { name: "pressed", type: "boolean", default: "false", desc: "CONTROLLED PRESSED STATE" },
      { name: "onPressedChange", type: "(pressed: boolean) => void", default: "—", desc: "PRESSED STATE CHANGE HANDLER" },
    ],
    usage: [
      { label: "UNCONTROLLED", code: `<SFToggle intent="default" size="md">GRID</SFToggle>` },
      { label: "CONTROLLED", code: `<SFToggle intent="primary" pressed={isActive} onPressedChange={setIsActive}>ACTIVE</SFToggle>` },
    ],
    a11y: [
      "RADIX TOGGLE — ARIA-PRESSED REFLECTS ON/OFF STATE",
      "KEYBOARD: SPACE OR ENTER TO TOGGLE",
      "FOCUS INDICATOR VIA .SF-FOCUSABLE",
    ],
  },

  sfSlider: {
    id: "sfSlider",
    name: "SFSlider",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "RANGE INPUT SLIDER. FRAME LAYER FORM PRIMITIVE. RADIX SLIDER WITH 3PX SQUARE TRACK, PRIMARY RANGE FILL, AND SQUARE THUMB WITH SF-FOCUSABLE INDICATOR. SUPPORTS SINGLE AND DUAL-THUMB RANGE MODE.",
    importPath: "@/components/sf",
    importName: "SFSlider",
    props: [
      { name: "min", type: "number", default: "0", desc: "MINIMUM ALLOWED VALUE" },
      { name: "max", type: "number", default: "100", desc: "MAXIMUM ALLOWED VALUE" },
      { name: "step", type: "number", default: "1", desc: "INCREMENT STEP SIZE" },
      { name: "defaultValue", type: "number[]", default: "[50]", desc: "UNCONTROLLED DEFAULT VALUE(S)" },
      { name: "value", type: "number[]", default: "—", desc: "CONTROLLED VALUE(S)" },
      { name: "onValueChange", type: "(value: number[]) => void", default: "—", desc: "CHANGE HANDLER" },
    ],
    usage: [
      { label: "SINGLE", code: `<SFSlider defaultValue={[50]} min={0} max={100} step={1} />` },
      { label: "RANGE", code: `<SFSlider defaultValue={[20, 80]} min={0} max={100} />` },
    ],
    a11y: [
      "RADIX SLIDER — ARIA-VALUENOW, ARIA-VALUEMIN, ARIA-VALUEMAX ON EACH THUMB",
      "KEYBOARD: ARROW KEYS TO ADJUST VALUE, HOME/END FOR MIN/MAX",
    ],
  },

  sfToggleGroup: {
    id: "sfToggleGroup",
    name: "SFToggleGroup",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "EXCLUSIVE OR MULTI-SELECT TOGGLE GROUP. FRAME LAYER SELECTION PRIMITIVE. RADIX TOGGLE GROUP WITH EDGE-TO-EDGE LAYOUT (GAP-0), SHARP CORNERS, AND CVA INTENT PROP PROPAGATED TO ALL ITEMS.",
    importPath: "@/components/sf",
    importName: "SFToggleGroup",
    props: [
      { name: "type", type: "'single' | 'multiple'", default: "—", desc: "SELECTION MODE — SINGLE FOR EXCLUSIVE, MULTIPLE FOR MULTI-SELECT", required: true },
      { name: "intent", type: "'ghost' | 'primary'", default: "'ghost'", desc: "VISUAL VARIANT PROPAGATED TO ALL ITEMS" },
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", desc: "HEIGHT AND PADDING SCALE PROPAGATED TO ALL ITEMS" },
      { name: "value", type: "string | string[]", default: "—", desc: "CONTROLLED SELECTION VALUE(S)" },
      { name: "onValueChange", type: "(value: string | string[]) => void", default: "—", desc: "SELECTION CHANGE HANDLER" },
    ],
    usage: [
      { label: "SINGLE SELECT", code: `<SFToggleGroup type="single" intent="ghost" defaultValue="grid">\n  <SFToggleGroupItem value="grid">GRID</SFToggleGroupItem>\n  <SFToggleGroupItem value="list">LIST</SFToggleGroupItem>\n</SFToggleGroup>` },
      { label: "MULTI SELECT", code: `<SFToggleGroup type="multiple" intent="primary" size="sm">\n  <SFToggleGroupItem value="a">A</SFToggleGroupItem>\n  <SFToggleGroupItem value="b">B</SFToggleGroupItem>\n</SFToggleGroup>` },
    ],
    a11y: [
      "RADIX TOGGLE GROUP — ARIA-PRESSED ON EACH ITEM",
      "KEYBOARD: ARROW KEYS MOVE FOCUS WITHIN GROUP, SPACE/ENTER TO SELECT",
    ],
  },

  sfCalendar: {
    id: "sfCalendar",
    name: "SFCalendar",
    layer: "FRAME",
    version: "v1.4.0",
    status: "STABLE",
    description:
      "DATE PICKER CALENDAR. PATTERN B (LAZY, SSR:FALSE). REACT-DAY-PICKER WITH SF STYLING — SHARP CORNERS, 2PX BORDERS, MONOSPACE. IMPORT FROM DIRECT PATH, NOT BARREL.",
    importPath: "@/components/sf/sf-calendar-lazy",
    importName: "SFCalendar",
    props: [
      { name: "mode", type: "'single' | 'multiple' | 'range'", default: "'single'", desc: "SELECTION MODE" },
      { name: "selected", type: "Date | Date[] | DateRange", default: "—", desc: "CONTROLLED SELECTED DATE(S)" },
      { name: "onSelect", type: "(date: Date | undefined) => void", default: "—", desc: "SELECTION CHANGE HANDLER" },
      { name: "disabled", type: "Matcher | Matcher[]", default: "—", desc: "DATES TO DISABLE — ACCEPTS DATE OBJECTS, RANGES, OR FUNCTIONS" },
    ],
    usage: [
      { label: "SINGLE DATE", code: `import { SFCalendar } from '@/components/sf/sf-calendar-lazy'\n\n<SFCalendar mode="single" selected={date} onSelect={setDate} />` },
    ],
    a11y: [
      "REACT-DAY-PICKER — FULL ARIA GRID SEMANTICS (ARIA-SELECTED, ARIA-DISABLED)",
      "KEYBOARD: ARROW KEYS NAVIGATE DAYS, ENTER TO SELECT",
      "PATTERN B — LAZY LOADED, NOT IN BARREL — USE DIRECT IMPORT PATH",
    ],
  },

  sfInputOTP: {
    id: "sfInputOTP",
    name: "SFInputOTP",
    layer: "FRAME",
    version: "v1.4.0",
    status: "STABLE",
    description:
      "ONE-TIME PASSWORD INPUT. FRAME LAYER FORM PRIMITIVE. INDIVIDUAL CHARACTER SLOTS FOR VERIFICATION CODES. KEYBOARD NAVIGABLE, SUPPORTS PASTE AND SMS AUTOFILL. ZERO BORDER-RADIUS ON ALL SLOTS.",
    importPath: "@/components/sf",
    importName: "SFInputOTP",
    props: [
      { name: "maxLength", type: "number", default: "—", desc: "TOTAL NUMBER OF OTP CHARACTERS", required: true },
      { name: "value", type: "string", default: "—", desc: "CONTROLLED VALUE STRING" },
      { name: "onChange", type: "(value: string) => void", default: "—", desc: "VALUE CHANGE HANDLER" },
      { name: "pattern", type: "string | RegExp", default: "—", desc: "INPUT VALIDATION PATTERN (E.G. REGEXP.DIGIT)" },
    ],
    usage: [
      { label: "6-DIGIT CODE", code: `<SFInputOTP maxLength={6}>\n  <SFInputOTPGroup>\n    <SFInputOTPSlot index={0} />\n    <SFInputOTPSlot index={1} />\n    <SFInputOTPSlot index={2} />\n  </SFInputOTPGroup>\n  <SFInputOTPSeparator />\n  <SFInputOTPGroup>\n    <SFInputOTPSlot index={3} />\n    <SFInputOTPSlot index={4} />\n    <SFInputOTPSlot index={5} />\n  </SFInputOTPGroup>\n</SFInputOTP>` },
    ],
    a11y: [
      "INPUT-OTP — AUTO-ADVANCES FOCUS ON CHARACTER ENTRY",
      "SUPPORTS PASTE FROM CLIPBOARD AND SMS AUTOFILL (AUTOCOMPLETE='ONE-TIME-CODE')",
      "ACTIVE SLOT INDICATED BY PRIMARY BORDER AND RING",
    ],
  },

  sfInputGroup: {
    id: "sfInputGroup",
    name: "SFInputGroup",
    layer: "FRAME",
    version: "v1.4.0",
    status: "STABLE",
    description:
      "GROUPED INPUT WITH ADDONS. FRAME LAYER COMPOSITE FORM PRIMITIVE. COMBINES INPUT FIELD WITH INLINE PREFIX/SUFFIX ADDONS, TEXT LABELS, OR ACTION BUTTONS. ZERO BORDER-RADIUS THROUGHOUT.",
    importPath: "@/components/sf",
    importName: "SFInputGroup",
    props: [
      { name: "className", type: "string", default: "—", desc: "MERGED VIA cn() ON ROOT CONTAINER" },
    ],
    usage: [
      { label: "WITH ADDONS", code: `<SFInputGroup>\n  <SFInputGroupAddon align="inline-start">\n    <SFInputGroupText>@</SFInputGroupText>\n  </SFInputGroupAddon>\n  <SFInputGroupInput placeholder="USERNAME" />\n  <SFInputGroupAddon align="inline-end">\n    <SFInputGroupButton>SEND</SFInputGroupButton>\n  </SFInputGroupAddon>\n</SFInputGroup>` },
    ],
    a11y: [
      "COMPOSE WITH VISIBLE LABEL OR ARIA-LABEL ON THE INPUT ELEMENT",
      "ADDON TEXT IS ARIA-HIDDEN BY DEFAULT — LABEL MUST CONVEY FULL FIELD PURPOSE",
    ],
  },

  /* ── LAYOUT ─────────────────────────────── */

  sfCard: {
    id: "sfCard",
    name: "SFCard",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "CONTENT CONTAINER CARD. FRAME LAYER LAYOUT PRIMITIVE. SHARP CORNERS, 2PX FOREGROUND BORDER, NO SHADOW. COMPOSED OF SFCARDHEADER, SFCARDCONTENT, SFCARDFOOTER SLOTS.",
    importPath: "@/components/sf",
    importName: "SFCard",
    props: [
      { name: "className", type: "string", default: "—", desc: "MERGED VIA cn() AFTER BASE CLASSES" },
      { name: "children", type: "React.ReactNode", default: "—", desc: "CARD CONTENT — COMPOSE WITH SFCARDHEADER, SFCARDCONTENT, SFCARDFOOTER" },
    ],
    usage: [
      { label: "BASIC", code: `<SFCard>\n  <SFCardHeader>\n    <SFCardTitle>DEPLOYMENT</SFCardTitle>\n    <SFCardDescription>Build #4201 ready</SFCardDescription>\n  </SFCardHeader>\n  <SFCardContent>Content here</SFCardContent>\n</SFCard>` },
    ],
    a11y: [
      "NO IMPLICIT ROLE — ADD ARIA-LABEL WHEN CARD IS A STANDALONE INTERACTIVE UNIT",
      "SHADOW-DOM-SAFE: ALL STYLE APPLIED VIA CLASS, NOT INLINE",
    ],
  },

  sfDialog: {
    id: "sfDialog",
    name: "SFDialog",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "MODAL DIALOG OVERLAY. FRAME LAYER COMPOSABLE PRIMITIVE. RADIX DIALOG WITH SHARP CORNERS, 2PX BORDER, FOCUS TRAP, AND ESC TO CLOSE. COMPOSE WITH SFDIALOGCONTENT, SFDIALOGHEADER, SFDIALOGFOOTER.",
    importPath: "@/components/sf",
    importName: "SFDialog",
    props: [
      { name: "open", type: "boolean", default: "—", desc: "CONTROLLED OPEN STATE" },
      { name: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "OPEN STATE CHANGE HANDLER" },
      { name: "modal", type: "boolean", default: "true", desc: "MODAL MODE — TRAPS FOCUS WHEN TRUE" },
    ],
    usage: [
      { label: "CONTROLLED", code: `<SFDialog open={isOpen} onOpenChange={setIsOpen}>\n  <SFDialogContent>\n    <SFDialogHeader>\n      <SFDialogTitle>CONFIRM</SFDialogTitle>\n    </SFDialogHeader>\n    <SFDialogFooter>\n      <SFButton onClick={() => setIsOpen(false)}>CLOSE</SFButton>\n    </SFDialogFooter>\n  </SFDialogContent>\n</SFDialog>` },
    ],
    a11y: [
      "RADIX DIALOG — FOCUS TRAP ACTIVE WHEN OPEN, RESTORED ON CLOSE",
      "ESC KEY CLOSES DIALOG — ARIA-MODAL='TRUE' ON CONTENT",
      "SCREEN READER ANNOUNCES DIALOG TITLE VIA ARIA-LABELLEDBY",
    ],
  },

  sfDrawer: {
    id: "sfDrawer",
    name: "SFDrawer",
    layer: "FRAME",
    version: "v1.4.0",
    status: "STABLE",
    description:
      "SLIDE-OUT DRAWER. PATTERN B (LAZY, SSR:FALSE). VAUL DRAWER WITH SHARP CORNERS, 2PX BORDER, AND DIRECTIONAL SLIDE ANIMATION. IMPORT FROM DIRECT PATH, NOT BARREL.",
    importPath: "@/components/sf/sf-drawer-lazy",
    importName: "SFDrawer",
    props: [
      { name: "open", type: "boolean", default: "—", desc: "CONTROLLED OPEN STATE" },
      { name: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "OPEN STATE CHANGE HANDLER" },
      { name: "direction", type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", desc: "SLIDE DIRECTION" },
    ],
    usage: [
      { label: "BOTTOM DRAWER", code: `import { SFDrawer, SFDrawerContent } from '@/components/sf/sf-drawer-lazy'\n\n<SFDrawer open={isOpen} onOpenChange={setIsOpen}>\n  <SFDrawerContent>Content here</SFDrawerContent>\n</SFDrawer>` },
    ],
    a11y: [
      "VAUL DRAWER — FOCUS TRAP ACTIVE WHEN OPEN",
      "ESC KEY CLOSES DRAWER — ARIA-MODAL='TRUE' ON CONTENT",
      "PATTERN B — LAZY LOADED WITH SSR:FALSE — USE DIRECT IMPORT PATH",
    ],
  },

  sfHoverCard: {
    id: "sfHoverCard",
    name: "SFHoverCard",
    layer: "FRAME",
    version: "v1.4.0",
    status: "STABLE",
    description:
      "HOVER/FOCUS PREVIEW PANEL. FRAME LAYER OVERLAY PRIMITIVE. RADIX HOVER CARD WITH SHARP CORNERS, 2PX BORDER, NO SHADOW. OPENS ON POINTER HOVER OR KEYBOARD FOCUS.",
    importPath: "@/components/sf",
    importName: "SFHoverCard",
    props: [
      { name: "openDelay", type: "number", default: "700", desc: "MS BEFORE OPENING ON HOVER" },
      { name: "closeDelay", type: "number", default: "300", desc: "MS BEFORE CLOSING AFTER POINTER LEAVES" },
      { name: "open", type: "boolean", default: "—", desc: "CONTROLLED OPEN STATE" },
      { name: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "OPEN STATE CHANGE HANDLER" },
    ],
    usage: [
      { label: "WITH TRIGGER", code: `<SFHoverCard>\n  <SFHoverCardTrigger asChild>\n    <SFButton intent="ghost">PREVIEW</SFButton>\n  </SFHoverCardTrigger>\n  <SFHoverCardContent>Details here</SFHoverCardContent>\n</SFHoverCard>` },
    ],
    a11y: [
      "RADIX HOVER CARD — OPENS ON KEYBOARD FOCUS AS WELL AS POINTER HOVER",
      "CONTENT IS NOT INTERACTIVE — FOR PREVIEW ONLY, NOT ACTION MENUS",
    ],
  },

  /* ── NAVIGATION ─────────────────────────── */

  sfTabs: {
    id: "sfTabs",
    name: "SFTabs",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "TABBED CONTENT SWITCHER. FRAME LAYER NAVIGATION PRIMITIVE. RADIX TABS WITH SHARP CORNERS, 2PX BORDER ON ACTIVE TRIGGER, AND UPPERCASE MONO LABELS.",
    importPath: "@/components/sf",
    importName: "SFTabs",
    props: [
      { name: "defaultValue", type: "string", default: "—", desc: "UNCONTROLLED DEFAULT ACTIVE TAB KEY" },
      { name: "value", type: "string", default: "—", desc: "CONTROLLED ACTIVE TAB KEY" },
      { name: "onValueChange", type: "(value: string) => void", default: "—", desc: "ACTIVE TAB CHANGE HANDLER" },
      { name: "orientation", type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: "TAB LIST ORIENTATION" },
    ],
    usage: [
      { label: "BASIC", code: `<SFTabs defaultValue="overview">\n  <SFTabsList>\n    <SFTabsTrigger value="overview">OVERVIEW</SFTabsTrigger>\n    <SFTabsTrigger value="props">PROPS</SFTabsTrigger>\n  </SFTabsList>\n  <SFTabsContent value="overview">Overview content</SFTabsContent>\n  <SFTabsContent value="props">Props content</SFTabsContent>\n</SFTabs>` },
    ],
    a11y: [
      "RADIX TABS — ROLE='TABLIST' ON LIST, ROLE='TAB' ON TRIGGERS, ROLE='TABPANEL' ON CONTENT",
      "KEYBOARD: ARROW KEYS MOVE BETWEEN TABS, ENTER/SPACE ACTIVATES",
    ],
  },

  sfPagination: {
    id: "sfPagination",
    name: "SFPagination",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "PAGE NAVIGATION CONTROL. FRAME LAYER SERVER COMPONENT. RENDERS PREVIOUS, NUMBERED PAGES, AND NEXT CONTROLS. NO INTERACTIVE PROPS — COMPOSE WITH SFLABELPAGINATIONLINK FOR ROUTING.",
    importPath: "@/components/sf",
    importName: "SFPagination",
    props: [
      { name: "className", type: "string", default: "—", desc: "ADDITIONAL CLASSES ON ROOT NAV ELEMENT" },
    ],
    usage: [
      { label: "BASIC", code: `<SFPagination>\n  <SFPaginationContent>\n    <SFPaginationItem><SFPaginationPrevious href="/page/1" /></SFPaginationItem>\n    <SFPaginationItem><SFPaginationLink href="/page/2">2</SFPaginationLink></SFPaginationItem>\n    <SFPaginationItem><SFPaginationNext href="/page/3" /></SFPaginationItem>\n  </SFPaginationContent>\n</SFPagination>` },
    ],
    a11y: [
      "ROLE='NAVIGATION' WITH ARIA-LABEL='PAGINATION' ON ROOT",
      "CURRENT PAGE USES ARIA-CURRENT='PAGE' — SCREEN READER ANNOUNCES ACTIVE STATE",
    ],
  },

  sfAvatar: {
    id: "sfAvatar",
    name: "SFAvatar",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "USER IDENTITY AVATAR. FRAME LAYER IDENTITY PRIMITIVE. SQUARE CROP (NOT CIRCLE). RADIX FALLBACK CHAIN: IMAGE → INITIALS → LUCIDE USER ICON. ALL SUB-ELEMENTS ENFORCE ROUNDED-NONE.",
    importPath: "@/components/sf",
    importName: "SFAvatar",
    props: [
      { name: "className", type: "string", default: "—", desc: "ADDITIONAL CLASSES ON ROOT AVATAR CONTAINER" },
    ],
    usage: [
      { label: "WITH IMAGE", code: `<SFAvatar>\n  <SFAvatarImage src="/avatar.png" alt="Jane Doe" />\n  <SFAvatarFallback>JD</SFAvatarFallback>\n</SFAvatar>` },
      { label: "ICON FALLBACK", code: `<SFAvatar>\n  <SFAvatarFallback />\n</SFAvatar>` },
    ],
    a11y: [
      "SFAVATARIMAGE REQUIRES ALT TEXT FOR NON-DECORATIVE AVATARS",
      "FALLBACK RENDERS ARIA-HIDDEN USER ICON WHEN NO CHILDREN PROVIDED",
    ],
  },

  sfBreadcrumb: {
    id: "sfBreadcrumb",
    name: "SFBreadcrumb",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "BREADCRUMB NAVIGATION TRAIL. FRAME LAYER SERVER COMPONENT. COMPOSITION-BASED — SFBREADCRUMBITEMS CONTAIN SFBREADCRUMBLINKS OR SFBREADCRUMBPAGE FOR CURRENT LOCATION.",
    importPath: "@/components/sf",
    importName: "SFBreadcrumb",
    props: [
      { name: "className", type: "string", default: "—", desc: "ADDITIONAL CLASSES ON ROOT NAV ELEMENT" },
    ],
    usage: [
      { label: "BASIC", code: `<SFBreadcrumb>\n  <SFBreadcrumbList>\n    <SFBreadcrumbItem>\n      <SFBreadcrumbLink href="/">HOME</SFBreadcrumbLink>\n    </SFBreadcrumbItem>\n    <SFBreadcrumbSeparator />\n    <SFBreadcrumbItem>\n      <SFBreadcrumbPage>COMPONENTS</SFBreadcrumbPage>\n    </SFBreadcrumbItem>\n  </SFBreadcrumbList>\n</SFBreadcrumb>` },
    ],
    a11y: [
      "ROLE='NAVIGATION' WITH ARIA-LABEL='BREADCRUMB' ON ROOT",
      "CURRENT PAGE USES ARIA-CURRENT='PAGE' ON SFBREADCRUMBPAGE",
    ],
  },

  sfNavigationMenu: {
    id: "sfNavigationMenu",
    name: "SFNavigationMenu",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "SITE NAVIGATION. FRAME LAYER NAVIGATION PRIMITIVE. DESKTOP: RADIX NAVIGATION MENU WITH FLYOUT VIEWPORT PANELS. MOBILE: SFSHEET SLIDE-OUT VIA SFNAVIGATIONMENUMOBILE COMPANION.",
    importPath: "@/components/sf",
    importName: "SFNavigationMenu",
    props: [
      { name: "viewport", type: "boolean", default: "true", desc: "RENDER RADIX VIEWPORT ELEMENT FOR FLYOUT PANELS" },
      { name: "orientation", type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: "MENU ORIENTATION" },
      { name: "className", type: "string", default: "—", desc: "ADDITIONAL CLASSES ON ROOT ELEMENT" },
    ],
    usage: [
      { label: "DESKTOP + MOBILE", code: `<nav>\n  <SFNavigationMenu className="hidden md:flex">\n    <SFNavigationMenuList>\n      <SFNavigationMenuItem>\n        <SFNavigationMenuTrigger>DOCS</SFNavigationMenuTrigger>\n        <SFNavigationMenuContent>\n          <SFNavigationMenuLink href="/docs">INTRO</SFNavigationMenuLink>\n        </SFNavigationMenuContent>\n      </SFNavigationMenuItem>\n    </SFNavigationMenuList>\n  </SFNavigationMenu>\n  <SFNavigationMenuMobile>\n    <a href="/docs">DOCS</a>\n  </SFNavigationMenuMobile>\n</nav>` },
    ],
    a11y: [
      "RADIX NAVIGATION MENU — ARIA-EXPANDED ON TRIGGERS, ARIA-HASPOPUP='TRUE'",
      "KEYBOARD: ARROW KEYS NAVIGATE ITEMS, ENTER/SPACE OPENS FLYOUT, ESC CLOSES",
    ],
  },

  sfMenubar: {
    id: "sfMenubar",
    name: "SFMenubar",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "HORIZONTAL MENU BAR WITH DROPDOWN MENUS. PATTERN B (LAZY, SSR:FALSE). RADIX MENUBAR STYLED WITH SF CONTRACT — SHARP CORNERS, 2PX BORDER. IMPORT FROM DIRECT PATH, NOT BARREL.",
    importPath: "@/components/sf/sf-menubar-lazy",
    importName: "SFMenubar",
    props: [
      { name: "className", type: "string", default: "—", desc: "ADDITIONAL CLASSES ON ROOT MENUBAR ELEMENT" },
    ],
    usage: [
      { label: "FILE MENU", code: `import { SFMenubar, SFMenubarMenu, SFMenubarTrigger, SFMenubarContent, SFMenubarItem } from '@/components/sf/sf-menubar-lazy'\n\n<SFMenubar>\n  <SFMenubarMenu>\n    <SFMenubarTrigger>FILE</SFMenubarTrigger>\n    <SFMenubarContent>\n      <SFMenubarItem>NEW</SFMenubarItem>\n      <SFMenubarItem>OPEN</SFMenubarItem>\n    </SFMenubarContent>\n  </SFMenubarMenu>\n</SFMenubar>` },
    ],
    a11y: [
      "RADIX MENUBAR — ROLE='MENUBAR', ARIA-HASPOPUP ON TRIGGERS",
      "KEYBOARD: HORIZONTAL ARROWS NAVIGATE MENUS, VERTICAL ARROWS NAVIGATE ITEMS",
      "PATTERN B — LAZY LOADED WITH SSR:FALSE — USE DIRECT IMPORT PATH",
    ],
  },

  /* ── FEEDBACK ───────────────────────────── */

  sfBadge: {
    id: "sfBadge",
    name: "SFBadge",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "STATUS OR CATEGORY LABEL BADGE. FRAME LAYER DISPLAY PRIMITIVE. FONT-MONO, UPPERCASE, ZERO BORDER-RADIUS, CONFIGURABLE INTENT VARIANTS FOR SEMANTIC COLORING.",
    importPath: "@/components/sf",
    importName: "SFBadge",
    props: [
      { name: "intent", type: "'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'signal'", default: "'default'", desc: "VISUAL INTENT VARIANT" },
      { name: "className", type: "string", default: "—", desc: "MERGED VIA cn() AFTER VARIANT CLASSES" },
    ],
    usage: [
      { label: "STATUS", code: `<SFBadge intent="primary">NEW</SFBadge>\n<SFBadge intent="signal">BETA</SFBadge>` },
    ],
    a11y: [
      "RENDERED AS <SPAN> — NOT FOCUSABLE BY DEFAULT",
      "ADD ARIA-LABEL TO PARENT IF BADGE CONVEYS CRITICAL STATUS",
    ],
  },

  sfToastFrame: {
    id: "sfToastFrame",
    name: "SFToaster (FRAME)",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "SONNER-BASED TOAST NOTIFICATION SYSTEM. FRAME LAYER VARIANT. POSITIONED BOTTOM-LEFT (Z-100). IMPORT SFTOASTER FOR PROVIDER AND SFTOAST FOR IMPERATIVE TRIGGER.",
    importPath: "@/components/sf",
    importName: "SFToaster",
    props: [
      { name: "position", type: "ToastPosition", default: "'bottom-left'", desc: "SCREEN POSITION FOR TOAST STACK" },
      { name: "richColors", type: "boolean", default: "true", desc: "USE SEMANTIC INTENT COLORS" },
      { name: "closeButton", type: "boolean", default: "false", desc: "SHOW EXPLICIT CLOSE BUTTON ON EACH TOAST" },
    ],
    usage: [
      { label: "SETUP", code: `// In layout.tsx\n<SFToaster />\n\n// In component\nsfToast('DEPLOYED', { description: 'Build #4201 live.' })` },
    ],
    a11y: [
      "SONNER — ROLE='STATUS' OR ROLE='ALERT' DEPENDING ON TYPE",
      "ARIA-LIVE='POLITE' FOR INFO TOASTS, ARIA-LIVE='ASSERTIVE' FOR ERRORS",
    ],
  },

  sfAlert: {
    id: "sfAlert",
    name: "SFAlert",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "INLINE FEEDBACK BANNER. FRAME LAYER NOTIFICATION PRIMITIVE. FOUR INTENTS: INFO (PRIMARY), WARNING (ACCENT), DESTRUCTIVE, SUCCESS. CVA INTENT PROP. 2PX BORDER WITH TOKEN-MAPPED BACKGROUND TINT.",
    importPath: "@/components/sf",
    importName: "SFAlert",
    props: [
      { name: "intent", type: "'info' | 'warning' | 'destructive' | 'success'", default: "'info'", desc: "SEMANTIC INTENT VARIANT — MAPS TO COLOR TOKEN" },
      { name: "className", type: "string", default: "—", desc: "MERGED VIA cn() AFTER VARIANT CLASSES" },
    ],
    usage: [
      { label: "WARNING", code: `<SFAlert intent="warning">\n  <SFAlertTitle>CAUTION</SFAlertTitle>\n  <SFAlertDescription>Check your input before continuing.</SFAlertDescription>\n</SFAlert>` },
    ],
    a11y: [
      "ROLE='ALERT' — SCREEN READER ANNOUNCES CONTENT IMMEDIATELY ON RENDER",
      "ICON SVG IS ARIA-HIDDEN — TEXT CONVEYS INTENT",
    ],
  },

  sfAlertDialog: {
    id: "sfAlertDialog",
    name: "SFAlertDialog",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "CONFIRMATION DIALOG. FRAME LAYER DESTRUCTIVE ACTION GUARD. BLOCKS INTERACTION WITH FOCUS-TRAPPED OVERLAY. SFalertdialogaction SUPPORTS LOADING PROP FOR ASYNC CONFIRM STATE.",
    importPath: "@/components/sf",
    importName: "SFAlertDialog",
    props: [
      { name: "open", type: "boolean", default: "—", desc: "CONTROLLED OPEN STATE" },
      { name: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "OPEN STATE CHANGE HANDLER" },
    ],
    usage: [
      { label: "DESTRUCTIVE", code: `<SFAlertDialog>\n  <SFAlertDialogTrigger asChild><SFButton>DELETE</SFButton></SFAlertDialogTrigger>\n  <SFAlertDialogContent>\n    <SFAlertDialogHeader><SFAlertDialogTitle>CONFIRM DELETE</SFAlertDialogTitle></SFAlertDialogHeader>\n    <SFAlertDialogFooter>\n      <SFAlertDialogCancel>CANCEL</SFAlertDialogCancel>\n      <SFAlertDialogAction loading={isDeleting}>DELETE</SFAlertDialogAction>\n    </SFAlertDialogFooter>\n  </SFAlertDialogContent>\n</SFAlertDialog>` },
    ],
    a11y: [
      "RADIX ALERT DIALOG — ROLE='ALERTDIALOG', ARIA-MODAL='TRUE'",
      "FOCUS TRAP ACTIVE WHEN OPEN — INITIAL FOCUS ON CANCEL BUTTON (DESTRUCTIVE SAFE DEFAULT)",
    ],
  },

  sfCollapsible: {
    id: "sfCollapsible",
    name: "SFCollapsible",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "TOGGLEABLE CONTENT PANEL. FRAME LAYER DISCLOSURE PRIMITIVE. RADIX COLLAPSIBLE ROOT — COMPOSE WITH SFCOLLAPSIBLETRIGGER AND SFCOLLAPSIBLECONTENT.",
    importPath: "@/components/sf",
    importName: "SFCollapsible",
    props: [
      { name: "open", type: "boolean", default: "—", desc: "CONTROLLED OPEN STATE" },
      { name: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "OPEN STATE CHANGE HANDLER" },
      { name: "disabled", type: "boolean", default: "false", desc: "PREVENTS TOGGLE INTERACTION" },
    ],
    usage: [
      { label: "BASIC", code: `<SFCollapsible>\n  <SFCollapsibleTrigger asChild><SFButton>TOGGLE</SFButton></SFCollapsibleTrigger>\n  <SFCollapsibleContent>Hidden content here</SFCollapsibleContent>\n</SFCollapsible>` },
    ],
    a11y: [
      "RADIX COLLAPSIBLE — ARIA-EXPANDED ON TRIGGER REFLECTS OPEN STATE",
      "TRIGGER AND CONTENT LINKED VIA ARIA-CONTROLS",
    ],
  },

  sfEmptyState: {
    id: "sfEmptyState",
    name: "SFEmptyState",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "DESIGNED EMPTY STATE PLACEHOLDER. FRAME LAYER WITH OPTIONAL SIGNAL TREATMENT. BAYER DITHER BACKGROUND, MONOSPACE TEXT. OPTIONAL SCRAMBLETEXT EFFECT VIA SCRAMBLE PROP.",
    importPath: "@/components/sf",
    importName: "SFEmptyState",
    props: [
      { name: "title", type: "string", default: "—", desc: "PRIMARY MESSAGE TEXT — AUTO-UPPERCASED VIA CSS", required: true },
      { name: "scramble", type: "boolean", default: "false", desc: "ENABLE SCRAMBLETEXT SIGNAL EFFECT ON TITLE" },
      { name: "action", type: "React.ReactNode", default: "—", desc: "OPTIONAL ACTION SLOT (E.G. RETRY BUTTON)" },
      { name: "children", type: "React.ReactNode", default: "—", desc: "OPTIONAL DESCRIPTION CONTENT BELOW TITLE" },
    ],
    usage: [
      { label: "BASIC", code: `<SFEmptyState title="NO DATA FOUND">\n  <p>Try adjusting your filters.</p>\n</SFEmptyState>` },
      { label: "WITH SIGNAL", code: `<SFEmptyState title="AWAITING INPUT" scramble>` },
    ],
    a11y: [
      "HEADING TAG USED FOR TITLE — MAINTAINS DOCUMENT OUTLINE",
      "BAYER DITHER BACKGROUND IS ARIA-HIDDEN — PURELY DECORATIVE",
    ],
  },

  sfAccordion: {
    id: "sfAccordion",
    name: "SFAccordion",
    layer: "SIGNAL",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "ACCORDION WITH GSAP STAGGER ON EXPAND, REVERSE ON COLLAPSE. SIGNAL LAYER COMPONENT. REDUCED-MOTION GUARD VIA MATCHMEDIA. RADIX ACCORDION PRIMITIVE BASE.",
    importPath: "@/components/sf",
    importName: "SFAccordion",
    props: [
      { name: "type", type: "'single' | 'multiple'", default: "'single'", desc: "SELECTION MODE — SINGLE ALLOWS ONE OPEN AT A TIME" },
      { name: "collapsible", type: "boolean", default: "false", desc: "ALLOW DESELECTING ACTIVE ITEM (TYPE='SINGLE' ONLY)" },
      { name: "defaultValue", type: "string | string[]", default: "—", desc: "INITIALLY EXPANDED ITEM(S)" },
      { name: "onValueChange", type: "(val: string | string[]) => void", default: "—", desc: "CHANGE HANDLER CALLED ON EXPAND/COLLAPSE" },
    ],
    usage: [
      { label: "SINGLE EXPAND", code: `<SFAccordion type="single" collapsible>\n  <SFAccordionItem value="a">\n    <SFAccordionTrigger>SECTION A</SFAccordionTrigger>\n    <SFAccordionContent>Content</SFAccordionContent>\n  </SFAccordionItem>\n</SFAccordion>` },
    ],
    a11y: [
      "RADIX ACCORDION — FULL KEYBOARD NAVIGATION (SPACE/ENTER TO TOGGLE)",
      "GSAP ANIMATION SKIPPED ON PREFERS-REDUCED-MOTION",
      "ARIA-EXPANDED ON TRIGGER BUTTON REFLECTS OPEN STATE",
    ],
  },

  sfProgress: {
    id: "sfProgress",
    name: "SFProgress",
    layer: "SIGNAL",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "PROGRESS BAR WITH GSAP FILL TWEEN. SIGNAL LAYER COMPONENT. RADIX PROGRESS ROOT WITH GSAP AS SOLE ANIMATION DRIVER. RESPECTS PREFERS-REDUCED-MOTION (INSTANT GSAP.SET).",
    importPath: "@/components/sf",
    importName: "SFProgress",
    props: [
      { name: "value", type: "number", default: "0", desc: "PROGRESS PERCENTAGE 0-100" },
      { name: "className", type: "string", default: "—", desc: "ADDITIONAL CLASSES ON ROOT — USE H-* TO SET BAR HEIGHT" },
    ],
    usage: [
      { label: "BASIC", code: `<SFProgress value={60} />` },
      { label: "CUSTOM HEIGHT", code: `<SFProgress value={100} className="h-2" />` },
    ],
    a11y: [
      "RADIX PROGRESS — ARIA-VALUENOW, ARIA-VALUEMIN='0', ARIA-VALUEMAX='100'",
      "GSAP ANIMATION USES INSTANT GSAP.SET ON PREFERS-REDUCED-MOTION",
    ],
  },

  sfToastSignal: {
    id: "sfToastSignal",
    name: "SFToaster (SIGNAL)",
    layer: "SIGNAL",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "SONNER-BASED TOAST NOTIFICATION SYSTEM. SIGNAL LAYER VARIANT. SAME SFTOASTER/SFTOAST API AS FRAME VARIANT BUT CATEGORIZED AS SIGNAL FOR DISPLAY NAME DISTINCTION.",
    importPath: "@/components/sf",
    importName: "SFToaster",
    props: [
      { name: "position", type: "ToastPosition", default: "'bottom-left'", desc: "SCREEN POSITION FOR TOAST STACK" },
      { name: "theme", type: "'light' | 'dark' | 'system'", default: "'system'", desc: "TOAST APPEARANCE THEME" },
      { name: "expand", type: "boolean", default: "false", desc: "EXPAND ALL TOASTS BY DEFAULT" },
    ],
    usage: [
      { label: "SIGNAL TOAST", code: `sfToast('SIGNAL DEPLOYED', {\n  description: 'Effect active.',\n  duration: 4000,\n})` },
    ],
    a11y: [
      "SONNER — ROLE='STATUS' OR ROLE='ALERT' DEPENDING ON TOAST TYPE",
      "TOASTS AUTO-DISMISSED — DO NOT USE FOR CRITICAL INFORMATION REQUIRING ACTION",
    ],
  },

  sfStepper: {
    id: "sfStepper",
    name: "SFStepper",
    layer: "SIGNAL",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "VERTICAL MULTI-STEP FLOW COMPONENT. SIGNAL LAYER. USES SFPROGRESS CONNECTORS BETWEEN STEPS FOR GSAP-DRIVEN FILL ANIMATION. SQUARE INDICATORS, NOT CIRCLES.",
    importPath: "@/components/sf",
    importName: "SFStepper",
    props: [
      { name: "activeStep", type: "number", default: "0", desc: "ZERO-BASED INDEX OF THE CURRENT ACTIVE STEP", required: true },
      { name: "children", type: "React.ReactNode", default: "—", desc: "SFSTEP ELEMENTS", required: true },
      { name: "className", type: "string", default: "—", desc: "ADDITIONAL CLASSES ON ROOT CONTAINER" },
    ],
    usage: [
      { label: "THREE-STEP FLOW", code: `<SFStepper activeStep={1}>\n  <SFStep status="complete" label="ACCOUNT" description="Create your account" />\n  <SFStep status="active" label="PROFILE" description="Set up your profile" />\n  <SFStep status="pending" label="REVIEW" description="Review and submit" />\n</SFStepper>` },
    ],
    a11y: [
      "ROLE='GROUP' WITH ARIA-LABEL='PROGRESS STEPS' ON ROOT",
      "EACH SFSTEP HAS ROLE='LISTITEM' AND DATA-STATUS FOR STATE QUERY",
      "CONNECTORS USE SFPROGRESS WITH ARIA-VALUENOW REFLECTING STEP COMPLETION",
    ],
  },

  /* ── DATA DISPLAY ───────────────────────── */

  sfTable: {
    id: "sfTable",
    name: "SFTable",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "DATA TABLE PRIMITIVE. FRAME LAYER SERVER COMPONENT. COMPOSITION-BASED — SFTABLEHEADER, SFTABLEBODY, SFTABLEROW, SFTABLEHEAD, SFTABLECELL. FULL-WIDTH, MONOSPACE, UPPERCASE HEADERS.",
    importPath: "@/components/sf",
    importName: "SFTable",
    props: [
      { name: "className", type: "string", default: "—", desc: "ADDITIONAL CLASSES ON ROOT TABLE ELEMENT" },
    ],
    usage: [
      { label: "BASIC", code: `<SFTable>\n  <SFTableHeader>\n    <SFTableRow>\n      <SFTableHead>NAME</SFTableHead>\n      <SFTableHead>STATUS</SFTableHead>\n    </SFTableRow>\n  </SFTableHeader>\n  <SFTableBody>\n    <SFTableRow>\n      <SFTableCell>Signal</SFTableCell>\n      <SFTableCell>Active</SFTableCell>\n    </SFTableRow>\n  </SFTableBody>\n</SFTable>` },
    ],
    a11y: [
      "NATIVE <TABLE> ELEMENT — FULL SCREEN READER TABLE NAVIGATION",
      "SFTABLEHEAD RENDERS <TH> WITH SCOPE='COL' FOR COLUMN ASSOCIATION",
    ],
  },

  sfStatusDot: {
    id: "sfStatusDot",
    name: "SFStatusDot",
    layer: "SIGNAL",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "PRESENCE INDICATOR DOT. SIGNAL LAYER STATUS PRIMITIVE. 8PX SQUARE. GSAP PULSE ON ACTIVE STATE. RESPECTS PREFERS-REDUCED-MOTION. THREE STATES: ACTIVE (PULSING SUCCESS GREEN), IDLE (ACCENT), OFFLINE (MUTED).",
    importPath: "@/components/sf",
    importName: "SFStatusDot",
    props: [
      { name: "status", type: "'active' | 'idle' | 'offline'", default: "'idle'", desc: "PRESENCE STATE — ACTIVE TRIGGERS GSAP PULSE ANIMATION" },
      { name: "className", type: "string", default: "—", desc: "ADDITIONAL CLASSES ON ROOT DIV" },
    ],
    usage: [
      { label: "ALL STATES", code: `<SFStatusDot status="active" />\n<SFStatusDot status="idle" />\n<SFStatusDot status="offline" />` },
    ],
    a11y: [
      "ROLE='STATUS' AND ARIA-LABEL SET TO CURRENT STATUS STRING",
      "GSAP PULSE ANIMATION SKIPPED ON PREFERS-REDUCED-MOTION",
    ],
  },

  /* ── GENERATIVE ─────────────────────────── */

  noiseBg: {
    id: "noiseBg",
    name: "NoiseBg",
    layer: "SIGNAL",
    version: "v1.0.0",
    status: "STABLE",
    description:
      "SVG GRAIN NOISE TEXTURE OVERLAY. SIGNAL LAYER GENERATIVE COMPONENT. FRAC-TURB FILTER WITH OPTIONAL FLICKER ANIMATION. ALWAYS DECORATIVE — ARIA-HIDDEN.",
    importPath: "@/components/animation/noise-bg",
    importName: "NoiseBg",
    props: [
      { name: "opacity", type: "number", default: "0.15", desc: "NOISE LAYER OPACITY (0-1)" },
      { name: "animate", type: "boolean", default: "false", desc: "ENABLE FLICKER ANIMATION" },
      { name: "speed", type: "number", default: "1", desc: "ANIMATION SPEED MULTIPLIER" },
    ],
    usage: [
      { label: "STATIC GRAIN", code: `<div className="relative">\n  <NoiseBg opacity={0.12} />\n</div>` },
      { label: "ANIMATED", code: `<NoiseBg opacity={0.12} animate speed={1.5} />` },
    ],
    a11y: [
      "ARIA-HIDDEN='TRUE' — PURELY DECORATIVE, NEVER CONVEYS INFORMATION",
      "POINTER-EVENTS-NONE — DOES NOT INTERCEPT INTERACTIONS",
    ],
  },

  waveformSignal: {
    id: "waveformSignal",
    name: "Waveform",
    layer: "SIGNAL",
    version: "v1.0.0",
    status: "STABLE",
    description:
      "SVG AUDIO WAVEFORM VISUALIZATION. SIGNAL LAYER GENERATIVE COMPONENT. SINE-BASED POLYLINES WITH CONFIGURABLE FREQUENCY, AMPLITUDE, AND HARMONIC OVERLAYS.",
    importPath: "@/components/animation/waveform",
    importName: "Waveform",
    props: [
      { name: "frequency", type: "number", default: "5", desc: "WAVE OSCILLATION FREQUENCY" },
      { name: "amplitude", type: "number", default: "18", desc: "WAVE HEIGHT IN PIXELS" },
      { name: "color", type: "string", default: "var(--color-primary)", desc: "PRIMARY WAVE COLOR" },
    ],
    usage: [
      { label: "STATIC", code: `<Waveform frequency={5} amplitude={20} />` },
    ],
    a11y: [
      "ARIA-HIDDEN='TRUE' — DECORATIVE VISUALIZATION",
      "DESCRIBE DATA IN ADJACENT TEXT IF WAVEFORM CONVEYS MEANINGFUL INFORMATION",
    ],
  },

  glitchTextSignal: {
    id: "glitchTextSignal",
    name: "GlitchText",
    layer: "SIGNAL",
    version: "v1.0.0",
    status: "STABLE",
    description:
      "TEXT WITH CHROMATIC ABERRATION GLITCH EFFECT. SIGNAL LAYER GENERATIVE COMPONENT. THREE OFFSET LAYERS (PRIMARY, CYAN, YELLOW) WITH CLIP-PATH SLICING.",
    importPath: "@/components/animation/glitch-text",
    importName: "GlitchText",
    props: [
      { name: "text", type: "string", default: "—", desc: "DISPLAY TEXT STRING", required: true },
      { name: "intensity", type: "number", default: "0.5", desc: "GLITCH DISPLACEMENT AMOUNT (0-1)" },
      { name: "interval", type: "number", default: "3000", desc: "MILLISECONDS BETWEEN GLITCH BURSTS" },
    ],
    usage: [
      { label: "ANIMATED", code: `<GlitchText text="ERROR 404" intensity={0.8} interval={2000} />` },
    ],
    a11y: [
      "ARIA-LABEL SET TO PLAIN TEXT — SCREEN READERS SEE CLEAN STRING, NOT GLITCH ARTIFACTS",
      "ANIMATION DISABLED ON PREFERS-REDUCED-MOTION",
    ],
  },

  particleMesh: {
    id: "particleMesh",
    name: "ParticleMesh",
    layer: "SIGNAL",
    version: "v1.0.0",
    status: "STABLE",
    description:
      "CANVAS PARTICLE MESH WITH MOUSE REPULSION. SIGNAL LAYER GENERATIVE COMPONENT. PARTICLES CONNECTED BY PROXIMITY LINES, PUSHED BY CURSOR. PAUSES OFFSCREEN VIA INTERSECTIONOBSERVER.",
    importPath: "@/components/animation/particle-mesh",
    importName: "ParticleMesh",
    props: [
      { name: "particleCount", type: "number", default: "80", desc: "NUMBER OF PARTICLES IN MESH" },
      { name: "mouseRadius", type: "number", default: "150", desc: "MOUSE REPULSION RADIUS IN PIXELS" },
      { name: "mouseForce", type: "number", default: "28", desc: "REPULSION STRENGTH MULTIPLIER" },
    ],
    usage: [
      { label: "HERO BACKGROUND", code: `<div className="relative h-screen">\n  <ParticleMesh particleCount={100} mouseRadius={200} mouseForce={35} />\n</div>` },
    ],
    a11y: [
      "ARIA-HIDDEN='TRUE' — PURELY DECORATIVE CANVAS",
      "RAF LOOP PAUSED OFFSCREEN VIA INTERSECTIONOBSERVER AND CLEANED UP ON UNMOUNT",
    ],
  },

  /* ── LAYOUT PRIMITIVES ──────────────────── */

  sfContainer: {
    id: "sfContainer",
    name: "SFContainer",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "RESPONSIVE PAGE CONTAINER. FRAME LAYER LAYOUT PRIMITIVE. ENFORCES MAX-WIDTH TOKENS AND RESPONSIVE GUTTERS FROM GLOBALS.CSS. DEFAULT WIDTH IS 'WIDE' FOR MOST PAGE SECTIONS.",
    importPath: "@/components/sf",
    importName: "SFContainer",
    props: [
      { name: "width", type: "'wide' | 'content' | 'full'", default: "'wide'", desc: "MAX-WIDTH VARIANT — MAPS TO --MAX-W-WIDE, --MAX-W-CONTENT, --MAX-W-FULL TOKENS" },
      { name: "className", type: "string", default: "—", desc: "MERGED VIA cn() AFTER VARIANT CLASSES" },
    ],
    usage: [
      { label: "WIDE SECTION", code: `<SFContainer width="wide"><SFGrid cols="3">...</SFGrid></SFContainer>` },
      { label: "PROSE COLUMN", code: `<SFContainer width="content"><SFText variant="body">Readable text</SFText></SFContainer>` },
    ],
    a11y: [
      "RENDERS AS <DIV> — NO IMPLICIT ROLE",
      "GUTTER PADDING ENSURES CONTENT NEVER TOUCHES VIEWPORT EDGES ON MOBILE",
    ],
  },

  sfSection: {
    id: "sfSection",
    name: "SFSection",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "SEMANTIC PAGE SECTION. FRAME LAYER LAYOUT PRIMITIVE. RENDERS <SECTION> WITH DATA-SECTION ALWAYS PRESENT. SUPPORTS DATA-BG-SHIFT FOR GSAP SCROLL-TRIGGERED BACKGROUND TOGGLE.",
    importPath: "@/components/sf",
    importName: "SFSection",
    props: [
      { name: "label", type: "string", default: "—", desc: "SECTION LABEL — APPLIED AS DATA-SECTION-LABEL ATTRIBUTE FOR CSS ::BEFORE CONTENT" },
      { name: "bgShift", type: "'white' | 'black'", default: "—", desc: "BACKGROUND SHIFT VALUE — GSAP SCROLL TARGET FOR BG-SHIFT PLUGIN" },
      { name: "spacing", type: "'8' | '12' | '16' | '24'", default: "'16'", desc: "VERTICAL PADDING FROM BLESSED SPACING STOPS" },
    ],
    usage: [
      { label: "WITH LABEL", code: `<SFSection label="Work" spacing="24" bgShift="white">\n  <SFContainer>Content here</SFContainer>\n</SFSection>` },
    ],
    a11y: [
      "RENDERS AS NATIVE <SECTION> — LANDMARK REGION FOR SCREEN READER NAVIGATION",
      "LABEL PROP SHOULD MATCH A VISIBLE HEADING — DO NOT USE AS ARIA-LABEL SUBSTITUTE",
    ],
  },

  sfGrid: {
    id: "sfGrid",
    name: "SFGrid",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "RESPONSIVE COLUMN GRID. FRAME LAYER LAYOUT PRIMITIVE. CSS GRID CONTAINER WITH MOBILE-FIRST COLUMN PROGRESSION BUILT INTO THE COLS VARIANT.",
    importPath: "@/components/sf",
    importName: "SFGrid",
    props: [
      { name: "cols", type: "'1' | '2' | '3' | '4' | 'auto'", default: "'3'", desc: "COLUMN COUNT — EACH VALUE ENCODES MOBILE-FIRST RESPONSIVE PROGRESSION" },
      { name: "gap", type: "'4' | '6' | '8'", default: "'6'", desc: "GRID GAP FROM BLESSED SPACING STOPS" },
      { name: "className", type: "string", default: "—", desc: "MERGED VIA cn() AFTER VARIANT CLASSES" },
    ],
    usage: [
      { label: "3-COLUMN", code: `<SFGrid cols="3" gap="6">\n  <SFCard>Item 1</SFCard>\n  <SFCard>Item 2</SFCard>\n  <SFCard>Item 3</SFCard>\n</SFGrid>` },
    ],
    a11y: [
      "RENDERS AS <DIV> — NO IMPLICIT ROLE",
      "RESPONSIVE COLUMNS ARE LAYOUT ONLY — READING ORDER FOLLOWS DOM ORDER",
    ],
  },

  sfStack: {
    id: "sfStack",
    name: "SFStack",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "VERTICAL RHYTHM CONTAINER. FRAME LAYER LAYOUT PRIMITIVE. FLEX CONTAINER WITH GAP VARIANTS MAPPED TO BLESSED SPACING STOPS. DEFAULTS TO VERTICAL COLUMN WITH STRETCH ALIGNMENT.",
    importPath: "@/components/sf",
    importName: "SFStack",
    props: [
      { name: "direction", type: "'vertical' | 'horizontal'", default: "'vertical'", desc: "FLEX DIRECTION" },
      { name: "gap", type: "'1' | '2' | '3' | '4' | '6' | '8' | '12' | '16' | '24'", default: "'4'", desc: "GAP BETWEEN CHILDREN — MAPS TO BLESSED SPACING STOPS" },
      { name: "align", type: "'start' | 'center' | 'end' | 'stretch'", default: "'stretch'", desc: "FLEX CROSS-AXIS ALIGNMENT" },
    ],
    usage: [
      { label: "VERTICAL STACK", code: `<SFStack gap="8" align="start">\n  <SFText variant="heading-2">TITLE</SFText>\n  <SFText variant="body">Description text.</SFText>\n</SFStack>` },
    ],
    a11y: [
      "RENDERS AS <DIV> — NO IMPLICIT ROLE",
      "READING ORDER MATCHES VISUAL ORDER — MATCHES DOM SEQUENCE",
    ],
  },

  sfText: {
    id: "sfText",
    name: "SFText",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "SEMANTIC TEXT PRIMITIVE. FRAME LAYER TYPOGRAPHY ENFORCER. MAPS SEMANTIC VARIANTS TO TYPOGRAPHY ALIAS CLASSES FROM GLOBALS.CSS. POLYMORPHIC VIA AS PROP.",
    importPath: "@/components/sf",
    importName: "SFText",
    props: [
      { name: "variant", type: "'heading-1' | 'heading-2' | 'heading-3' | 'body' | 'small'", default: "—", desc: "SEMANTIC TEXT STYLE — MAPS TO TEXT-HEADING-*, TEXT-BODY, TEXT-SMALL ALIASES", required: true },
      { name: "as", type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label'", default: "—", desc: "OVERRIDE RENDERED HTML ELEMENT — DEFAULTS: H1/H2/H3/P/SPAN PER VARIANT" },
      { name: "className", type: "string", default: "—", desc: "MERGED VIA cn() AFTER VARIANT CLASS" },
    ],
    usage: [
      { label: "HEADING", code: `<SFText variant="heading-1">SIGNAL FRAME</SFText>` },
      { label: "BODY", code: `<SFText variant="body" as="span">Inline body text.</SFText>` },
    ],
    a11y: [
      "RENDERS SEMANTIC HTML ELEMENT BY DEFAULT — HEADING HIERARCHY IS PRESERVED",
      "AS PROP ALLOWS VISUAL STYLE AND SEMANTIC ELEMENT TO BE DECOUPLED",
    ],
  },

  /* ── NON-GRID UTILITY COMPONENTS ────────── */

  sfSeparator: {
    id: "sfSeparator",
    name: "SFSeparator",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "VISUAL DIVIDER. FRAME LAYER STRUCTURAL PRIMITIVE. RADIX SEPARATOR — 1PX FOREGROUND LINE, HORIZONTAL OR VERTICAL ORIENTATION.",
    importPath: "@/components/sf",
    importName: "SFSeparator",
    props: [
      { name: "orientation", type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: "DIVIDER DIRECTION" },
      { name: "decorative", type: "boolean", default: "false", desc: "WHEN TRUE, ARIA-HIDDEN='TRUE' — NO SEMANTIC ROLE" },
    ],
    usage: [
      { label: "HORIZONTAL", code: `<SFSeparator orientation="horizontal" />` },
    ],
    a11y: [
      "RADIX SEPARATOR — ROLE='SEPARATOR' BY DEFAULT",
      "SET DECORATIVE=TRUE WHEN SEPARATOR IS PURELY VISUAL AND ADDS NO STRUCTURE",
    ],
  },

  sfTooltip: {
    id: "sfTooltip",
    name: "SFTooltip",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "HOVER/FOCUS TOOLTIP. FRAME LAYER CONTEXTUAL HELP PRIMITIVE. RADIX TOOLTIP WITH SHARP CORNERS, NO SHADOW. TRIGGERED BY HOVER OR KEYBOARD FOCUS ON TRIGGER ELEMENT.",
    importPath: "@/components/sf",
    importName: "SFTooltip",
    props: [
      { name: "delayDuration", type: "number", default: "700", desc: "MS BEFORE TOOLTIP OPENS ON HOVER" },
      { name: "side", type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", desc: "PREFERRED PLACEMENT RELATIVE TO TRIGGER" },
    ],
    usage: [
      { label: "BASIC", code: `<SFTooltip>\n  <SFTooltipTrigger asChild>\n    <SFButton intent="ghost">INFO</SFButton>\n  </SFTooltipTrigger>\n  <SFTooltipContent>Additional context</SFTooltipContent>\n</SFTooltip>` },
    ],
    a11y: [
      "RADIX TOOLTIP — ROLE='TOOLTIP', LINKED VIA ARIA-DESCRIBEDBY ON TRIGGER",
      "OPENS ON KEYBOARD FOCUS — NOT HOVER-ONLY",
    ],
  },

  sfSheet: {
    id: "sfSheet",
    name: "SFSheet",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "SIDE PANEL SHEET. FRAME LAYER OVERLAY PRIMITIVE. RADIX DIALOG VARIANT THAT SLIDES IN FROM A SCREEN EDGE. FOCUS TRAP ACTIVE WHEN OPEN.",
    importPath: "@/components/sf",
    importName: "SFSheet",
    props: [
      { name: "open", type: "boolean", default: "—", desc: "CONTROLLED OPEN STATE" },
      { name: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "OPEN STATE CHANGE HANDLER" },
      { name: "side", type: "'top' | 'right' | 'bottom' | 'left'", default: "'right'", desc: "EDGE THE SHEET SLIDES IN FROM" },
    ],
    usage: [
      { label: "RIGHT PANEL", code: `<SFSheet>\n  <SFSheetTrigger asChild><SFButton>OPEN</SFButton></SFSheetTrigger>\n  <SFSheetContent side="right">\n    <SFSheetHeader><SFSheetTitle>SETTINGS</SFSheetTitle></SFSheetHeader>\n  </SFSheetContent>\n</SFSheet>` },
    ],
    a11y: [
      "RADIX DIALOG — FOCUS TRAP ACTIVE, ARIA-MODAL='TRUE'",
      "ESC KEY CLOSES SHEET — FOCUS RETURNS TO TRIGGER ELEMENT",
    ],
  },

  sfDropdownMenu: {
    id: "sfDropdownMenu",
    name: "SFDropdownMenu",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "CONTEXTUAL DROPDOWN MENU. FRAME LAYER NAVIGATION PRIMITIVE. RADIX DROPDOWN WITH SHARP CORNERS, 2PX BORDER. SUPPORTS KEYBOARD TYPE-AHEAD AND NESTED SUBMENUS.",
    importPath: "@/components/sf",
    importName: "SFDropdownMenu",
    props: [
      { name: "open", type: "boolean", default: "—", desc: "CONTROLLED OPEN STATE" },
      { name: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "OPEN STATE CHANGE HANDLER" },
    ],
    usage: [
      { label: "BASIC", code: `<SFDropdownMenu>\n  <SFDropdownMenuTrigger asChild><SFButton>OPTIONS</SFButton></SFDropdownMenuTrigger>\n  <SFDropdownMenuContent>\n    <SFDropdownMenuItem>EDIT</SFDropdownMenuItem>\n    <SFDropdownMenuItem>DELETE</SFDropdownMenuItem>\n  </SFDropdownMenuContent>\n</SFDropdownMenu>` },
    ],
    a11y: [
      "RADIX DROPDOWN — ROLE='MENU', ARIA-HASPOPUP='MENU' ON TRIGGER",
      "KEYBOARD: ARROW KEYS NAVIGATE ITEMS, TYPE-AHEAD SEARCH SUPPORTED",
    ],
  },

  sfCommand: {
    id: "sfCommand",
    name: "SFCommand",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "COMMAND PALETTE COMPONENT. FRAME LAYER SEARCH AND ACTION PRIMITIVE. CMDK-BASED WITH SF STYLING — SEARCH INPUT, GROUPED RESULTS, KEYBOARD NAVIGATION.",
    importPath: "@/components/sf",
    importName: "SFCommand",
    props: [
      { name: "filter", type: "(value: string, search: string) => number", default: "—", desc: "CUSTOM ITEM FILTER FUNCTION — RETURN 0 TO HIDE, 1 TO SHOW" },
      { name: "loop", type: "boolean", default: "false", desc: "KEYBOARD NAVIGATION LOOPS FROM LAST ITEM TO FIRST" },
    ],
    usage: [
      { label: "INLINE PALETTE", code: `<SFCommand>\n  <SFCommandInput placeholder="SEARCH COMMANDS..." />\n  <SFCommandList>\n    <SFCommandGroup heading="Actions">\n      <SFCommandItem>DEPLOY</SFCommandItem>\n    </SFCommandGroup>\n  </SFCommandList>\n</SFCommand>` },
    ],
    a11y: [
      "CMDK — COMBOBOX ROLE, ARIA-EXPANDED, ARIA-ACTIVEDESCENDANT",
      "RESULTS LIST ANNOUNCED VIA ARIA-LIVE='POLITE' AS SEARCH CHANGES",
    ],
  },

  sfSkeleton: {
    id: "sfSkeleton",
    name: "SFSkeleton",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "LOADING SKELETON PLACEHOLDER. FRAME LAYER LOADING PRIMITIVE. ANIMATED SHIMMER PULSE WITH MUTED BACKGROUND. ZERO BORDER-RADIUS.",
    importPath: "@/components/sf",
    importName: "SFSkeleton",
    props: [
      { name: "className", type: "string", default: "—", desc: "REQUIRED — SET H-* AND W-* TO MATCH CONTENT SIZE" },
    ],
    usage: [
      { label: "TEXT PLACEHOLDER", code: `<SFSkeleton className="h-4 w-48" />\n<SFSkeleton className="h-4 w-32 mt-2" />` },
    ],
    a11y: [
      "ARIA-BUSY='TRUE' ON PARENT CONTAINER WHILE LOADING",
      "SKELETON IS ARIA-HIDDEN — SCREEN READER SEES LOADING STATE FROM PARENT ARIA-BUSY",
    ],
  },

  sfPopover: {
    id: "sfPopover",
    name: "SFPopover",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "FLOATING CONTENT POPOVER. FRAME LAYER OVERLAY PRIMITIVE. RADIX POPOVER WITH SHARP CORNERS, 2PX BORDER. INTERACTIVE CONTENT, UNLIKE SFTOOLTIP.",
    importPath: "@/components/sf",
    importName: "SFPopover",
    props: [
      { name: "open", type: "boolean", default: "—", desc: "CONTROLLED OPEN STATE" },
      { name: "onOpenChange", type: "(open: boolean) => void", default: "—", desc: "OPEN STATE CHANGE HANDLER" },
      { name: "align", type: "'start' | 'center' | 'end'", default: "'center'", desc: "ALIGNMENT RELATIVE TO TRIGGER" },
    ],
    usage: [
      { label: "FILTER PANEL", code: `<SFPopover>\n  <SFPopoverTrigger asChild><SFButton>FILTER</SFButton></SFPopoverTrigger>\n  <SFPopoverContent>\n    <SFPopoverTitle>FILTER BY</SFPopoverTitle>\n    <SFPopoverDescription>Select criteria</SFPopoverDescription>\n  </SFPopoverContent>\n</SFPopover>` },
    ],
    a11y: [
      "RADIX POPOVER — FOCUS MOVES INTO CONTENT ON OPEN",
      "ESC KEY CLOSES AND RETURNS FOCUS TO TRIGGER",
    ],
  },

  sfScrollArea: {
    id: "sfScrollArea",
    name: "SFScrollArea",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "CUSTOM SCROLLBAR CONTAINER. FRAME LAYER OVERFLOW PRIMITIVE. RADIX SCROLL AREA WITH STYLED SCROLLBARS THAT MATCH THE SF TOKEN SYSTEM.",
    importPath: "@/components/sf",
    importName: "SFScrollArea",
    props: [
      { name: "orientation", type: "'horizontal' | 'vertical' | 'both'", default: "'vertical'", desc: "SCROLL DIRECTION(S)" },
      { name: "type", type: "'auto' | 'always' | 'scroll' | 'hover'", default: "'hover'", desc: "SCROLLBAR VISIBILITY BEHAVIOR" },
    ],
    usage: [
      { label: "VERTICAL LIST", code: `<SFScrollArea className="h-72">\n  {items.map(item => <div key={item.id}>{item.name}</div>)}\n  <SFScrollBar orientation="vertical" />\n</SFScrollArea>` },
    ],
    a11y: [
      "RADIX SCROLL AREA — REGION ARIA-ROLE SUPPORTS SCREEN READER VIRTUAL SCROLLING",
      "CUSTOM SCROLLBAR IS ARIA-HIDDEN — NATIVE SCROLL BEHAVIOR PRESERVED",
    ],
  },

  sfLabel: {
    id: "sfLabel",
    name: "SFLabel",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "FORM INPUT LABEL. FRAME LAYER FORM PRIMITIVE. RADIX LABEL WITH MONOSPACE, UPPERCASE, WIDER TRACKING. PROGRAMMATICALLY ASSOCIATES WITH INPUT VIA HTMLFOR.",
    importPath: "@/components/sf",
    importName: "SFLabel",
    props: [
      { name: "htmlFor", type: "string", default: "—", desc: "ID OF THE ASSOCIATED INPUT ELEMENT" },
      { name: "className", type: "string", default: "—", desc: "ADDITIONAL CLASSES MERGED VIA cn()" },
    ],
    usage: [
      { label: "WITH INPUT", code: `<div>\n  <SFLabel htmlFor="username">USERNAME</SFLabel>\n  <SFInput id="username" placeholder="Enter name" />\n</div>` },
    ],
    a11y: [
      "RADIX LABEL — PREVENTS DEFAULT PREVENTS ACCIDENTAL FORM SUBMISSION ON DOUBLE-CLICK",
      "HTMLFOR CREATES EXPLICIT LABEL-INPUT ASSOCIATION — REQUIRED FOR SCREEN READER CONTEXT",
    ],
  },

  sfSelect: {
    id: "sfSelect",
    name: "SFSelect",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "SELECT DROPDOWN. FRAME LAYER FORM PRIMITIVE. RADIX SELECT WITH SHARP CORNERS, 2PX BORDER, KEYBOARD NAVIGATION AND TYPE-AHEAD.",
    importPath: "@/components/sf",
    importName: "SFSelect",
    props: [
      { name: "value", type: "string", default: "—", desc: "CONTROLLED SELECTED VALUE" },
      { name: "onValueChange", type: "(value: string) => void", default: "—", desc: "VALUE CHANGE HANDLER" },
      { name: "placeholder", type: "string", default: "—", desc: "PLACEHOLDER TEXT WHEN NO VALUE SELECTED" },
      { name: "disabled", type: "boolean", default: "false", desc: "DISABLES THE SELECT CONTROL" },
    ],
    usage: [
      { label: "BASIC", code: `<SFSelect value={env} onValueChange={setEnv}>\n  <SFSelectTrigger><SFSelectValue placeholder="SELECT ENV" /></SFSelectTrigger>\n  <SFSelectContent>\n    <SFSelectItem value="prod">PRODUCTION</SFSelectItem>\n    <SFSelectItem value="staging">STAGING</SFSelectItem>\n  </SFSelectContent>\n</SFSelect>` },
    ],
    a11y: [
      "RADIX SELECT — COMBOBOX ROLE, ARIA-EXPANDED ON TRIGGER",
      "KEYBOARD: ARROW KEYS NAVIGATE OPTIONS, TYPE-AHEAD SELECTS BY FIRST LETTER",
    ],
  },

  sfCheckbox: {
    id: "sfCheckbox",
    name: "SFCheckbox",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "CHECKBOX INPUT. FRAME LAYER FORM PRIMITIVE. RADIX CHECKBOX WITH SHARP CORNERS, 2PX FOREGROUND BORDER. CHECKMARK USES PRIMARY COLOR WHEN CHECKED.",
    importPath: "@/components/sf",
    importName: "SFCheckbox",
    props: [
      { name: "checked", type: "boolean | 'indeterminate'", default: "false", desc: "CONTROLLED CHECKED STATE" },
      { name: "onCheckedChange", type: "(checked: boolean | 'indeterminate') => void", default: "—", desc: "CHECKED STATE CHANGE HANDLER" },
      { name: "disabled", type: "boolean", default: "false", desc: "DISABLES INTERACTION AND REDUCES OPACITY" },
    ],
    usage: [
      { label: "WITH LABEL", code: `<div className="flex items-center gap-2">\n  <SFCheckbox id="terms" checked={agreed} onCheckedChange={setAgreed} />\n  <SFLabel htmlFor="terms">AGREE TO TERMS</SFLabel>\n</div>` },
    ],
    a11y: [
      "RADIX CHECKBOX — ARIA-CHECKED REFLECTS CHECKED/UNCHECKED/INDETERMINATE STATE",
      "KEYBOARD: SPACE TOGGLES STATE",
    ],
  },

  sfRadioGroup: {
    id: "sfRadioGroup",
    name: "SFRadioGroup",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "RADIO BUTTON GROUP. FRAME LAYER FORM PRIMITIVE. RADIX RADIO GROUP WITH SQUARE INDICATORS (NOT CIRCLES). SINGLE-SELECTION EXCLUSIVE CHOICE.",
    importPath: "@/components/sf",
    importName: "SFRadioGroup",
    props: [
      { name: "value", type: "string", default: "—", desc: "CONTROLLED SELECTED VALUE" },
      { name: "onValueChange", type: "(value: string) => void", default: "—", desc: "VALUE CHANGE HANDLER" },
      { name: "orientation", type: "'horizontal' | 'vertical'", default: "'vertical'", desc: "GROUP LAYOUT DIRECTION" },
    ],
    usage: [
      { label: "BASIC", code: `<SFRadioGroup value={tier} onValueChange={setTier}>\n  <SFRadioGroupItem value="free" id="free" />\n  <SFLabel htmlFor="free">FREE</SFLabel>\n  <SFRadioGroupItem value="pro" id="pro" />\n  <SFLabel htmlFor="pro">PRO</SFLabel>\n</SFRadioGroup>` },
    ],
    a11y: [
      "RADIX RADIO GROUP — ROLE='RADIOGROUP', ARIA-CHECKED ON EACH ITEM",
      "KEYBOARD: ARROW KEYS MOVE SELECTION WITHIN GROUP",
    ],
  },

  sfSwitch: {
    id: "sfSwitch",
    name: "SFSwitch",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "TOGGLE SWITCH CONTROL. FRAME LAYER BOOLEAN INPUT. RADIX SWITCH WITH SQUARE THUMB (NOT PILL-SHAPED). CHECKED STATE USES PRIMARY COLOR TRACK.",
    importPath: "@/components/sf",
    importName: "SFSwitch",
    props: [
      { name: "checked", type: "boolean", default: "false", desc: "CONTROLLED CHECKED STATE" },
      { name: "onCheckedChange", type: "(checked: boolean) => void", default: "—", desc: "CHECKED STATE CHANGE HANDLER" },
      { name: "disabled", type: "boolean", default: "false", desc: "DISABLES INTERACTION" },
    ],
    usage: [
      { label: "WITH LABEL", code: `<div className="flex items-center gap-2">\n  <SFSwitch id="signal" checked={enabled} onCheckedChange={setEnabled} />\n  <SFLabel htmlFor="signal">SIGNAL LAYER</SFLabel>\n</div>` },
    ],
    a11y: [
      "RADIX SWITCH — ROLE='SWITCH', ARIA-CHECKED REFLECTS ON/OFF STATE",
      "KEYBOARD: SPACE TOGGLES STATE",
    ],
  },

  sfTextarea: {
    id: "sfTextarea",
    name: "SFTextarea",
    layer: "FRAME",
    version: "v1.3.0",
    status: "STABLE",
    description:
      "MULTILINE TEXT INPUT. FRAME LAYER FORM PRIMITIVE. ZERO BORDER-RADIUS, 2PX FOREGROUND BORDER, MONOSPACE FONT. INHERITS NATIVE TEXTAREA ATTRIBUTES.",
    importPath: "@/components/sf",
    importName: "SFTextarea",
    props: [
      { name: "placeholder", type: "string", default: "—", desc: "PLACEHOLDER TEXT — AUTO-UPPERCASED VIA CSS" },
      { name: "rows", type: "number", default: "4", desc: "INITIAL VISIBLE ROW COUNT" },
      { name: "disabled", type: "boolean", default: "false", desc: "DISABLES INPUT AND REDUCES OPACITY" },
    ],
    usage: [
      { label: "BASIC", code: `<SFTextarea placeholder="Enter description..." rows={4} />` },
    ],
    a11y: [
      "NATIVE <TEXTAREA> — REQUIRES ASSOCIATED <LABEL> OR ARIA-LABEL FOR SCREEN READER CONTEXT",
      "SUPPORTS RESIZE HANDLE — MINIMUM HEIGHT PRESERVED VIA MIN-H-*",
    ],
  },
};

/** Preview HUD data for the right panel — keyed by doc ID */
const PREVIEW_DATA: Record<string, PreviewHud> = {
  createSignalframeUX: {
    lines: ["SF//UX::CORE::INIT", "THEME: DARK | TOKENS: DEFAULT", "SIGNAL LAYER: ENABLED", "REDUCED MOTION: RESPECT"],
    code: `const sfux = createSignalframeUX({\n  theme: 'dark',\n  signalLayer: true,\n})`,
  },
  useSignalframe: {
    lines: ["SF//UX::HOOK::CONTEXT", "RETURNS: THEME, TOKENS, CONTROLS", "REACTIVE: YES | SSR: SAFE"],
    code: `const { theme, tokens, setTheme }\n  = useSignalframe()`,
  },
  SFUXProvider: {
    lines: ["SF//UX::CORE::PROVIDER", "WRAPS: APP ROOT", "SUPPLIES: THEME + TOKENS + SIGNAL"],
    code: `<SFUXProvider instance={sfux}>\n  {children}\n</SFUXProvider>`,
  },
  defineTheme: {
    lines: ["SF//UX::CORE::THEME", "BASE: DARK | EXTENDS: OKLCH TOKENS", "CONTRAST: VALIDATED AT BUILD"],
    code: `const midnight = defineTheme({\n  name: 'midnight',\n  base: 'dark',\n})`,
  },
  input: {
    lines: ["SF//UX::INPUT::RENDER", "VARIANT: FRAME | SIGNAL", "SCRAMBLE: ENABLED ON FOCUS", "VALIDATION: ARIA-INVALID"],
    code: `<Input\n  variant="frame"\n  placeholder="ENTER SIGNAL..."\n  scramblePlaceholder\n/>`,
  },
  card: {
    lines: ["SF//UX::CARD::RENDER", "VARIANT: FRAME | SIGNAL | OUTLINE", "HOVER: LIFT EFFECT", "SLOTS: HEADER + CONTENT + FOOTER"],
    code: `<Card hoverable>\n  <CardHeader>\n    <CardTitle>DEPLOYMENT</CardTitle>\n  </CardHeader>\n</Card>`,
  },
  modal: {
    lines: ["SF//UX::MODAL::RENDER", "SIZE: MD | FOCUS TRAP: ACTIVE", "BACKDROP: BLUR | ESC: CLOSE", "SIGNAL: GLITCH ENTRANCE"],
    code: `<Modal\n  open={isOpen}\n  onClose={close}\n  title="CONFIRM"\n/>`,
  },
  table: {
    lines: ["SF//UX::TABLE::RENDER", "COLUMNS: 4 | ROWS: DYNAMIC", "STICKY HEADER: OFF", "SORT: ARIA-SORT ATTRIBUTE"],
    code: `<Table\n  columns={columns}\n  data={rows}\n  stickyHeader\n/>`,
  },
  tabs: {
    lines: ["SF//UX::TABS::RENDER", "ACTIVE: SIGNAL | KEYBOARD: ARROWS", "INDICATOR: UNDERLINE SLIDE", "SCRAMBLE: ON SWITCH"],
    code: `<Tabs defaultValue="signal">\n  <TabsList>\n    <TabsTrigger value="signal">\n      SIGNAL\n    </TabsTrigger>\n  </TabsList>\n</Tabs>`,
  },
  toast: {
    lines: ["SF//UX::TOAST::RENDER", "VARIANT: SUCCESS | DURATION: 5000MS", "STACK: VERTICAL | DISMISS: AUTO", "SIGNAL: GLITCH ENTRANCE"],
    code: `toast({\n  title: 'DEPLOYED',\n  description: 'Build #4201 live',\n  variant: 'success',\n})`,
  },
  dropdown: {
    lines: ["SF//UX::DROPDOWN::RENDER", "ITEMS: 4 | ALIGN: START", "KEYBOARD: ARROWS + TYPE-AHEAD", "NESTED: SUBMENUS SUPPORTED"],
    code: `<Dropdown\n  trigger={<Button>OPTIONS ▾</Button>}\n  items={menuItems}\n/>`,
  },
  drawer: {
    lines: ["SF//UX::DRAWER::RENDER", "SIDE: RIGHT | SIZE: MD", "FOCUS TRAP: ACTIVE", "SIGNAL: GLITCH SLIDE"],
    code: `<Drawer\n  open={isOpen}\n  onClose={close}\n  side="right"\n/>`,
  },
  badge: {
    lines: ["SF//UX::BADGE::RENDER", "INTENT: PRIMARY | SIZE: SM", "MONO: UPPERCASE + 0.15EM", "RADIUS: 0PX"],
    code: `<Badge intent="primary">NEW</Badge>\n<Badge intent="signal">BETA</Badge>`,
  },
  noisebg: {
    lines: ["SF//UX::SIGNAL::NOISE", "OPACITY: 0.15 | SCALE: 1X", "ANIMATE: FLICKER | SPEED: 1X", "SVG GRAIN: FRACTAL TURB."],
    code: `<NoiseBG\n  opacity={0.12}\n  animate\n  speed={1.5}\n/>`,
  },
  particlemesh: {
    lines: ["SF//UX::SIGNAL::MESH", "PARTICLES: 80 | RADIUS: 150PX", "MOUSE FORCE: 28 | OPACITY: 0.45", "OBSERVER: PAUSE OFFSCREEN"],
    code: `<ParticleMesh\n  particleCount={100}\n  mouseRadius={200}\n  mouseForce={35}\n/>`,
  },
  glitchtext: {
    lines: ["SF//UX::SIGNAL::GLITCH", "LAYERS: 3 (PRIMARY/CYAN/YELLOW)", "INTENSITY: 0.5 | INTERVAL: 3000MS", "CLIP-PATH: INSET SLICING"],
    code: `<GlitchText\n  text="ERROR 404"\n  intensity={0.8}\n  interval={2000}\n/>`,
  },
  waveform: {
    lines: ["SF//UX::SIGNAL::WAVE", "FREQ: 5 | AMP: 18PX", "HARMONICS: 1 | REACTIVE: OFF", "SVG POLYLINE: SINE BASIS"],
    code: `<Waveform\n  frequency={5}\n  amplitude={20}\n  color="var(--color-primary)"\n/>`,
  },
  reactivecanvas: {
    lines: ["SF//UX::SIGNAL::CANVAS", "RAF LOOP: ACTIVE | OBSERVER: YES", "MOUSE TRACKING: ENABLED", "DRAW: USER CALLBACK"],
    code: `<ReactiveCanvas\n  draw={(ctx, frame) => {\n    // CUSTOM RENDER\n  }}\n/>`,
  },
  colors: {
    lines: ["SF//UX::TOKEN::COLOR", "SPACE: OKLCH | SCALES: 49", "PRIMARY: oklch(0.65 0.29 350)", "MODES: LIGHT + DARK"],
    code: `/* CSS */\ncolor: var(--color-primary);\nbackground: var(--sf-dark-surface);\n\n/* TAILWIND */\nclassName="text-primary bg-foreground"`,
  },
  spacing: {
    lines: ["SF//UX::TOKEN::SPACING", "GRID: 4PX BASE | STEPS: 8", "FLUID: CLAMP() BETWEEN BP", "TOUCH: 44PX MIN TARGET"],
    code: `padding: var(--space-4);\nmargin: clamp(24px, 5vw, 48px);\ngap: var(--space-2);`,
  },
  typography: {
    lines: ["SF//UX::TOKEN::TYPE", "DISPLAY: ANTON | BODY: ELECTROLIZE", "CODE: JETBRAINS MONO", "SCALE: 1.414 AUG. FOURTH"],
    code: `<h1 className="sf-display">HEADLINE</h1>\n<p className="sf-ui-text">BODY</p>\n<code className="font-mono">CODE</code>`,
  },
  motion: {
    lines: ["SF//UX::TOKEN::MOTION", "INSTANT: 100MS | FAST: 150MS", "NORMAL: 250MS | SLOW: 400MS", "EASE: SF-SNAP + SF-PUNCH"],
    code: `transition:\n  transform var(--duration-normal)\n    var(--ease-spring),\n  opacity var(--duration-fast)\n    var(--ease-default);`,
  },
  elevation: {
    lines: ["SF//UX::TOKEN::ELEVATION", "LAYERS: 7 (NAV→SKIP)", "SHADOWS: DEBOSS STYLE", "STACK: ORDERED BY FUNCTION"],
    code: `z-index: var(--z-nav);     /* 50  */\nz-index: var(--z-overlay);  /* 100 */\nz-index: var(--z-cursor);   /* 500 */`,
  },
  useSignalEffect: {
    lines: ["SF//UX::HOOK::SIGNAL", "EFFECT: GLITCH | TRIGGER: HOVER", "INTENSITY: 0.6 | MOTION: GATED", "CLEANUP: AUTOMATIC"],
    code: `const ref = useSignalEffect(\n  'glitch',\n  { intensity: 0.6, trigger: 'hover' }\n)`,
  },
  useToken: {
    lines: ["SF//UX::HOOK::TOKEN", "READ: CSS CUSTOM PROPERTY", "REACTIVE: THEME-AWARE", "TYPE: STRING RETURN"],
    code: `const primary = useToken('--color-primary')\n// => "oklch(0.65 0.29 350)"`,
  },
  useMotion: {
    lines: ["SF//UX::HOOK::MOTION", "REDUCED: BOOLEAN | DURATION: FN", "GATES: ALL JS ANIMATIONS", "MATCHMEDIA: LIVE LISTENER"],
    code: `const { prefersReduced, duration }\n  = useMotion()\n\nif (prefersReduced) return`,
  },
  useBreakpoint: {
    lines: ["SF//UX::HOOK::BREAKPOINT", "CURRENT: MD | MOBILE: FALSE", "DESKTOP: TRUE | SSR: SAFE", "LISTENER: MATCHMEDIA"],
    code: `const { isMobile, breakpoint }\n  = useBreakpoint()\n\n// breakpoint: 'sm'|'md'|'lg'|'xl'|'2xl'`,
  },
};

// Merge preview data into docs
for (const [id, preview] of Object.entries(PREVIEW_DATA)) {
  if (API_DOCS[id]) API_DOCS[id].preview = preview;
}

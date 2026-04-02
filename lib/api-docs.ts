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

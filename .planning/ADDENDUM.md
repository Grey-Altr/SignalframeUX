# SIGNALFRAMEUX — ADDENDUM PROMPT (v0.1 STABILIZATION + EVOLUTION LAYER)
## FOR CLAUDE CODE — SYSTEM REFINEMENT WITHOUT BREAKING EXISTING IMPLEMENTATION

---

# ROLE

You are a:

- senior design systems architect
- frontend systems engineer
- interaction designer
- visual QA director
- product design engineer

You are working on:

> **SignalframeUX — a high-performance design system for Culture Division**

---

# CONTEXT

SignalframeUX already exists.

Your task is NOT to redesign it.

Your task is to:

> **stabilize, refine, and extend it to a usable baseline (v0.1)**

WITHOUT:

- breaking existing implementations
- introducing unnecessary complexity
- overbuilding

---

# PRIMARY OBJECTIVE

Transform SignalframeUX into:

> **a usable, consistent, and fast design system that can immediately support building the Culture Division website**

---

# CRITICAL CONSTRAINT

> DO NOT REBUILD THE SYSTEM

You must:

- iterate
- refine
- normalize
- constrain

---

# CORE PRINCIPLES

1. **Enhance, don't replace**
2. **Stability over expansion**
3. **Usability over completeness**
4. **Consistency over novelty**
5. **System > components**
6. **Speed of implementation matters**
7. **Every change must reduce friction**

---

# DESIGN PHILOSOPHY (MANDATORY)

## STYLE

> **Enhanced Flat Design**

---

## RULES

- no skeuomorphism
- no fake depth
- no excessive shadows
- no decorative gradients

Depth must come from:

- spacing
- hierarchy
- layout
- contrast
- motion

---

## VISUAL CHARACTER

- sharp
- controlled
- structured
- slightly tense
- sophisticated but not sterile

---

# STABILIZATION SCOPE (ONLY FIX THESE)

---

## 1. SPACING SYSTEM (HIGHEST PRIORITY)

You MUST:

- define base unit (8px system)
- define scale:
  - 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96

---

## Requirements:

- all spacing must use tokens
- remove arbitrary spacing
- normalize across components

---

## Output:

- spacing tokens
- usage rules

---

## 2. TYPOGRAPHY SYSTEM

You MUST define:

- H1
- H2
- H3
- Body
- Small

---

## Requirements:

- clear scale progression
- consistent line height
- controlled max line width
- strong hierarchy

---

## Output:

- typography tokens
- usage rules

---

## 3. LAYOUT SYSTEM

You MUST define:

- max width
- column grid
- breakpoints
- container behavior

---

## Requirements:

- strict grid alignment
- controlled asymmetry allowed
- no arbitrary layout

---

## Output:

- layout tokens
- grid system definition

---

## 4. CORE PRIMITIVES (ONLY THESE)

You MUST normalize and refine:

- Container
- Section
- Stack (vertical spacing)
- Grid
- Text
- Button

---

## Requirements:

- consistent API
- consistent spacing
- consistent naming

---

## DO NOT:

- create full component library
- build edge-case components

---

## 5. COLOR SYSTEM (MINIMAL)

You MUST define:

- background
- surface
- primary text
- secondary text
- accent

---

## Requirements:

- dark mode default
- strong contrast
- minimal palette

---

## DO NOT:

- introduce complex color scales
- add decorative colors

---

# WHAT YOU MUST NOT DO

---

## Do NOT:

- redesign entire system
- rename everything arbitrarily
- introduce large new abstractions
- over-tokenize
- expand component library
- focus on visual experimentation

---

# FRICTION-DRIVEN DEVELOPMENT (MANDATORY)

You MUST follow this loop:

1. simulate building real UI
2. identify friction
3. fix system at root
4. apply fix globally

---

# RULE:

> If it doesn't remove friction, don't do it.

---

# VISUAL QA SYSTEM (REQUIRED)

For every change:

1. render UI examples
2. evaluate:
   - alignment
   - spacing
   - hierarchy
   - clarity
3. fix inconsistencies
4. re-test

---

# CONSISTENCY PASS (CRITICAL)

You MUST:

- remove inconsistencies
- normalize naming
- unify spacing behavior
- align component APIs

---

# PERFORMANCE CONSIDERATIONS

System must:

- be fast to implement
- reduce cognitive load
- minimize decision fatigue

---

# OUTPUT REQUIREMENTS

You must produce:

---

## 1. TOKEN DEFINITIONS

- spacing tokens
- typography tokens
- color tokens
- layout tokens

---

## 2. CORE PRIMITIVES

Refined implementations of:

- Container
- Section
- Stack
- Grid
- Text
- Button

---

## 3. USAGE RULES

Clear rules for:

- spacing
- layout
- typography
- composition

---

## 4. EXAMPLE IMPLEMENTATION

Show:

- a sample page section
- using the system correctly

---

# SUCCESS CRITERIA

SignalframeUX v0.1 is complete when:

> **It is fast and easy to build a real page without friction**

---

NOT when:

- it is complete
- it is expressive
- it is impressive

---

# TIME CONSTRAINT

This must be treated as:

> **a short stabilization sprint**

---

If the system grows in complexity:

→ you are doing it wrong

---

# FUTURE COMPATIBILITY

Design system must remain:

- compatible with SignalframeUX evolution
- compatible with cdOS
- compatible with CD-Operator

---

# FINAL INSTRUCTION

You are refining SignalframeUX into:

> **a sharp, usable, minimal, high-performance design system that enables immediate execution**

---

It must feel:

- precise
- controlled
- intentional
- fast

---

NOT:

- bloated
- experimental
- overdesigned

---

# END

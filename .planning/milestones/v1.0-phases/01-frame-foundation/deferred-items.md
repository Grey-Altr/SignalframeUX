# Deferred Items — Phase 01 Frame Foundation

## Pre-Existing Issues Found (Out of Scope)

### DI-01: TypeScript error in color-cycle-frame.tsx
- **File:** `components/animation/color-cycle-frame.tsx` line 79
- **Error:** `useRef<ReturnType<typeof setTimeout>>()` — Expected 1 argument but got 0
- **Discovered during:** Plan 01-01, Task 1 build verification
- **Confirmed pre-existing:** Yes (error present before any Plan 01-01 changes)
- **Impact:** Blocks `npx next build` TypeScript type check; CSS compilation passes (3.9s)
- **Action needed:** Fix `useRef<ReturnType<typeof setTimeout>>(undefined)` or `useRef<ReturnType<typeof setTimeout> | null>(null)`
- **Recommend addressing in:** Plan 01-02 (component sweep) or as standalone fix before

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-04-10

### Added
- Initial public release of SignalframeUX design system
- Core entry point (`signalframeux`): 49 SF components, layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText), hooks (useSignalframe), utilities (cn, createSignalframeUX)
- Animation entry point (`signalframeux/animation`): GSAP-dependent components (SFAccordion, SFProgress, SFStepper, SFEmptyState, SFToaster)
- WebGL entry point (`signalframeux/webgl`): Three.js-dependent modules (SignalCanvas, useSignalScene, resolveColorToken)
- Token CSS (`signalframeux/signalframeux.css`): OKLCH design token stylesheet with spacing, typography, color, animation, and layout tokens
- FRAME/SIGNAL dual-layer architecture with full TypeScript declarations (ESM + CJS)
- Migration guide (MIGRATION.md) with 60+ import path mappings

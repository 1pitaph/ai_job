---
name: project stack and structure
description: Tech stack and file structure conventions for this project
type: project
---

This project is built entirely with **React**. File structure follows modern UI design standards with clear, well-organized categorization. All pages must be adapted for mobile screens.

**Icon library:** All icons must use **lucide-react**. Never use inline SVG or emoji for icons — always import from `lucide-react`.

**Directory separation:** Landing page and canvas app must stay completely separate.
- `src/landing/` — all landing page components, layouts, sections, assets
- `src/canvas/` — all canvas pages, components, and resources (never import from `src/landing/`)
- `src/index.css` and `src/App.jsx` / `src/main.jsx` are the only shared root-level files

**Why:** Ensures all code suggestions, components, and tooling choices align with React conventions and a clean modern project layout.

**How to apply:** Always use React (functional components, hooks, etc.) for any code generation. Propose file structures that are semantically organized by feature or layer, consistent with modern frontend best practices. Every component must include responsive styles — breakpoints: tablet ≤ 1024px (2-col grids), mobile ≤ 640px (single col, reduced padding). Navbar hides links on mobile. Use CSS Modules for all styles.

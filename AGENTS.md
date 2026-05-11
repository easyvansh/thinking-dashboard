# AGENTS.md

## Agent Role

You are building Thinking Studio, a Chrome new-tab extension for a personal intellectual reading hub.

Prioritize:
- clean React components
- beautiful UI
- simple state management
- local-first architecture
- future RSS/AI extensibility

## Rules

- Do not add backend code unless explicitly asked.
- Do not add authentication.
- Do not use TypeScript yet.
- Do not use external UI libraries unless asked.
- Use Tailwind CSS.
- Keep components small and readable.
- Make sure every feature works after refresh.
- Prefer clear file structure over clever abstractions.

## Design Principles

The app should feel like:
- a studio
- a bookshelf
- a thinking environment
- an artistic new-tab page

It should not feel like:
- a corporate admin dashboard
- a generic SaaS homepage
- a plain bookmark manager

## Development Order

1. ✓ Scaffold Vite + React + Tailwind
2. ✓ Add Manifest V3 new-tab config
3. ✓ Create data files
4. ✓ Build layout
5. ✓ Build bookshelf
6. ✓ Build article feed
7. ✓ Build cognitive modes
8. ✓ Build add source modal
9. ✓ Add localStorage persistence
10. ✓ Add saved article archive
11. In progress: Polish UI
12. Next: Test production build

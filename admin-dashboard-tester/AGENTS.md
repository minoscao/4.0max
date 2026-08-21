# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Confirmed Product Decisions

- Use the V4 administrator dashboard mockup in `../交付文档/MVP管理员端PC-Dashboard-Mockup-v4-List-Detail.png` as the visual source of truth.
- The primary workspace is a compact List → Detail experience: current tasks on the left, selected task detail and action on the right.
- Current tasks must be clearly separated from summary metrics and supporting analytics.
- Keep the interface simple, multilingual-ready, icon-led, responsive, and suitable for Malaysian advanced-manufacturing teams.

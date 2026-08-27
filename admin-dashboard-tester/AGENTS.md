# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Confirmed Product Decisions

- Use `../交付文档/M4-维修异常中心-优化概念图-v1.png` as the current visual source of truth for the administrator landing view. The older V4 dashboard remains the source for the general work-order view.
- The primary workspace is a compact List → Detail experience: current tasks on the left, selected task detail and action on the right.
- Current tasks must be clearly separated from summary metrics and supporting analytics.
- The administrator should land in an exception center that prioritizes unclaimed, repair-overdue, acceptance-overdue, and suspected-repeat faults.
- Visible evidence, SLA state, correct pending-step language, and recent equipment maintenance history are higher priority than adding more dashboard charts.
- Keep the interface simple, multilingual-ready, icon-led, responsive, and suitable for Malaysian advanced-manufacturing teams.
- Store uploaded photos and other large files in dedicated object storage. Work-order records must contain only file URLs and lightweight metadata, never Base64 or other embedded file payloads.
- Operator acceptance, operator rework, and technician repair completion are protected actions that require a second confirmation. Rework requires a new photo and description, and every repair/rework round remains visible in the work-order history.
- Operator and technician List → Detail pages must start with no selected task; task details and task-specific actions appear only after the worker deliberately selects a work order. The technician page must not reserve or render a visible empty detail pane before selection, including immediately after claiming a job or entering Current Orders.

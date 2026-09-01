# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Confirmed Product Decisions

- After every requested project change, verify it, commit it, and push it directly to `origin/main` unless the user explicitly asks not to sync that change.

- Use `../交付文档/M4-维修异常中心-优化概念图-v1.png` as the current visual source of truth for the administrator landing view. The older V4 dashboard remains the source for the general work-order view.
- The primary workspace is a compact List → Detail experience: current tasks on the left, selected task detail and action on the right.
- Current tasks must be clearly separated from summary metrics and supporting analytics.
- The administrator should land in an exception center that prioritizes unclaimed, repair-overdue, acceptance-overdue, and suspected-repeat faults.
- Visible evidence, SLA state, correct pending-step language, and recent equipment maintenance history are higher priority than adding more dashboard charts.
- Keep the interface simple, multilingual-ready, icon-led, responsive, and suitable for Malaysian advanced-manufacturing teams.
- Store uploaded photos and other large files in dedicated object storage. Work-order records must contain only file URLs and lightweight metadata, never Base64 or other embedded file payloads.
- Operator acceptance, operator rework, and technician repair completion are protected actions that require a second confirmation. Rework requires a new photo and description, and every repair/rework round remains visible in the work-order history.
- Operator and technician List → Detail pages must start with no selected task; task details and task-specific actions appear only after the worker deliberately selects a work order. Current and history pages render the work-order list only—never an inline detail pane, side-by-side detail, or reserved empty detail area. Clicking a row opens a separate second-level sheet from the bottom at every breakpoint, and closing it clears the selection.
- Keep the technician desktop current-order and history-order screens on the same list workspace skeleton, heading hierarchy, update-time placement, and density. Current-order repair controls belong only in the selected order's bottom drawer and persistent action bar.
- Administrator current-order and history-order screens also start list-only with no preselected task or inline detail pane. Selecting a row opens the full record in a bottom sheet; administrator fallback assignment remains available inside that sheet when applicable.
- The administrator exception center follows the same list-only pattern: filters and exception rows are visible first, while SLA evidence, intervention actions, and machine history appear only in a bottom detail sheet after selection.
- Reporting a handling issue from a current work order is a protected form flow for operators and technicians. Require an issue description and a photo captured by camera or selected from the device, then preserve both in the work-order activity record; cancellation writes nothing.
- Technician transfer is a protected second-level flow. Require both a receiving technician and a written transfer reason before confirmation; cancellation writes nothing, while confirmed transfers preserve the sender, receiver, timestamp, and reason in the work-order history.
- Operator acceptance actions must follow a pending-acceptance work order into every operator entry point, including the "My reports" list on the report screen. Opening the same work order must always expose "still faulty" and "confirm working" actions and their protected dialogs.

# Design QA

## Comparison target

- Source visual truth: `E:\codex\4.0工厂\交付文档\M4-维修异常中心-优化概念图-v1.png`
- Desktop implementation: `E:\codex\4.0工厂\admin-dashboard-tester\qa-exception-desktop-final.png`
- Side-by-side comparison: `E:\codex\4.0工厂\admin-dashboard-tester\qa-comparison-exception-final.png`
- Mobile implementation: `E:\codex\4.0工厂\admin-dashboard-tester\qa-exception-mobile.png`
- Desktop viewport: 1487 × 1058 CSS px. Mobile viewport: 390 × 844 CSS px.
- State: administrator → exception center → all exceptions → M-12 selected.

## Visual fidelity

- Hierarchy matches the selected concept: navy portal navigation, quiet utility header, four intervention metrics, left exception queue, and right decision detail.
- The M-12 detail keeps the reference anatomy: exception/SLA context, machine facts, two evidence images, correct progress timeline, intervention warning, primary fallback assignment, secondary equipment record, and two recent maintenance records.
- Existing project typography, colors, spacing tokens, Phosphor icon family, and responsive patterns were retained. No placeholder boxes, emoji, CSS-drawn icons, or screenshot crops are used as product assets.
- At 1487 × 1058 the primary actions remain visible without horizontal overflow. At 390 × 844 the metrics become a 2 × 2 grid, the exception queue stacks above detail, and role navigation stays available as the bottom bar.

## Interaction verification

- Exception metrics show 4 total, 1 unclaimed, 2 repair-overdue, and 1 acceptance-overdue.
- Repair-overdue filtering returns two matching work orders.
- Administrator fallback assignment expands three real technician choices.
- Technician M-12 flow verified: claim → start repair → enter cause and repair note → hand over for acceptance.
- Operator current-work view exposes both “still has a problem” and “machine works” actions; accepting closes the order.
- Reset restores the four seeded exceptions and final preview state.
- Sites packaging tests: 4 passed, 0 failed.

## Iteration history

### Pass 1

- P0: an incomplete acceptance step was described as completed. Fixed timeline copy so the first missing step reads “等待接单 / 当前”.
- P0: operator acceptance controls existed only on the quick-report landing page. Added them to the operator current-work detail so the main workflow can close.
- P1: the first implementation stacked evidence and history vertically, pushing intervention actions below the desktop fold. Rebuilt the detail as evidence/timeline plus a compact recent-history column.
- P1: seeded exception metrics did not match the selected concept. Added an overlapping repeat-fault/repair-overdue case so the metric strip reads 4 / 1 / 2 / 1 while the queue still identifies the repeat fault.
- P2: the selected metric used a heavy filled state not present in the concept. Replaced it with a quiet porcelain state and orange underline.

### Pass 2

- Side-by-side comparison confirms the final desktop implementation preserves the source layout, density, hierarchy, and visible actions.
- Mobile scan confirms `document.body.scrollWidth` stays within the viewport and the critical bottom navigation remains fixed.
- No remaining P0, P1, or P2 findings.

final result: passed

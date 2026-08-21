# Design QA

## Comparison Target

- Source visual truth: `E:\codex\4.0工厂\交付文档\MVP管理员端PC-Dashboard-Mockup-v4-List-Detail.png`
- Desktop implementation capture: `E:\codex\4.0工厂\admin-dashboard-tester\qa-desktop.png`
- Mobile implementation capture: `E:\codex\4.0工厂\admin-dashboard-tester\qa-mobile.png`
- Full-view comparison: `E:\codex\4.0工厂\admin-dashboard-tester\qa-comparison-full.png`
- Focused task-workspace comparison: `E:\codex\4.0工厂\admin-dashboard-tester\qa-comparison-task-workspace.png`
- Desktop viewport and captures: 1536 × 1024 CSS px, device scale factor 1, source and implementation both compared at 1536 × 1024 pixels.
- Mobile viewport: 390 × 844 CSS px, device scale factor 1; full-page capture is 390 × 1883 pixels.
- State: administrator dashboard, “全部” filter active, M-12 selected, no assignment panel open.

## Full-View Comparison Evidence

The implementation preserves the source hierarchy and composition: mineral-navy navigation, compact shift header, continuous metric strip, dominant current-task List → Detail workspace, and quieter supporting analytics. The implementation intentionally uses slightly tighter typography and vertical spacing so the working page remains compact at 1440–1536px widths. The live tester exposes four loaded mock tasks, so its current-task count is 4 rather than the broader source concept count of 6.

## Focused Comparison Evidence

The focused comparison confirms the master list remains the left-hand scanning surface and the selected M-12 detail remains the right-hand decision surface. Selection tint, urgency orange, equipment/fault metadata, four-step progress, and the single dominant “指派工程师” action match the source anatomy. Icons come from one Phosphor outline family and technician avatars are project-local raster assets.

## Required Fidelity Surfaces

- Fonts and typography: Aptos / Segoe UI Variable with Chinese-capable fallbacks. Weight, hierarchy, tabular numerals, truncation and line height remain legible at desktop and mobile. No actionable mismatch.
- Spacing and layout rhythm: 12px operational surface radius, continuous dividers, compact 8/12/16/24px rhythm, and clear primary/secondary separation. Desktop and mobile have no horizontal viewport overflow.
- Colors and visual tokens: mineral navy, porcelain canvas, graphite text, restrained burnt orange, green and operational blue map consistently to the source.
- Image quality and asset fidelity: three generated technician headshots are saved locally and rendered with correct circular crops. No placeholder, emoji, handcrafted SVG or CSS-drawn icon assets are used.
- Copy and content: the source workflow labels and task details are preserved. Loaded task counts truthfully reflect the interactive mock dataset.

## Interaction Verification

- Selecting M-03 updates the detail heading to “M-03 电机故障”.
- Filtering to “维修中” reduces the list to one item and automatically keeps detail selection synchronized with M-03.
- Opening “指派工程师” shows the assignment choices.
- Assigning M-12 to Mei Ling updates the current owner and shows the success status “已将 M-12 指派给 Mei Ling”.
- Desktop and mobile navigation states render; the mobile bottom navigation is visible at 390px.
- Browser console errors and warnings: none.

## Comparison History

### Pass 1

- P2: Chinese language selector wrapped vertically at 1440px. Fixed with a no-wrap language group.
- P2: task filters were cramped inside the master pane. Fixed by moving the current-task toolbar across the full List → Detail workspace.
- P2: filtering could hide the selected list item while leaving its old detail visible. Fixed by synchronizing selection to the first visible filtered task and adding a no-results detail state.

### Pass 2

- Post-fix desktop and mobile captures show no horizontal overflow, no clipped controls and no remaining P0/P1/P2 findings.
- Mechanical design scan: clean, with no reported findings.

## Follow-up Polish

- P3: The exact Chinese glyph rendering can vary slightly by operating-system font availability; this does not alter hierarchy or layout.

final result: passed

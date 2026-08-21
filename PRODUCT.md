# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Open decision. The current phase is visual mockup exploration before implementation.

## Users

- Administrators and factory maintenance managers who monitor machine health, repair performance, staffing, and weekly trends.
- Machine operators who report faults and confirm that repaired machines can return to production.
- Maintenance engineers who receive calls, accept jobs, record arrival and repair times, diagnose faults, and hand machines back for acceptance.
- The product is used in Malaysian factories. Operator-facing experiences must work for people with limited formal education and low digital literacy.

## Product Purpose

Provide one traceable equipment-maintenance workflow from operator fault report through technician response, repair, operator acceptance, and management analysis. Success means managers can identify equipment, response, repair-quality, and staffing problems from reliable transaction data rather than guesswork.

## Positioning

The system turns every maintenance call into a signed, time-stamped transaction linking a machine, operator, technician, fault, response time, repair time, acceptance, and possible repeat failure.

## Operating Context

- Twelve-hour factory shifts with mixed lighting and multilingual teams.
- Operators create repair calls from mobile devices or equipment-side interfaces.
- Repair calls may broadcast to multiple technicians; the first acceptance assigns the job.
- Operators confirm handover after repair.
- Managers primarily use a desktop dashboard but every surface must adapt to tablet and mobile.
- Weekly management analysis includes fault frequency, waiting time, repair time, downtime, repeat faults, technician workload, and production impact.

## Capabilities and Constraints

- Three role-specific experiences: administrator, operator, and maintenance engineer.
- Role switching is available for reviewing the different interfaces.
- Core workflow: report, broadcast, accept, arrive, repair, classify fault, hand over, accept, close, analyze.
- Waiting time, repair time, and total downtime are distinct metrics.
- A new failure within approximately 15 minutes can be flagged as a suspected repeat repair.
- Administrator MVP menus: overview, work orders, machines, technicians, shifts and workload, analytics, fault categories, and settings.
- All layouts must be responsive across desktop, tablet, and mobile.
- Multilingual entry must support BM, Chinese, and English.

## Brand Commitments

- The experience must feel contemporary, premium, and internationally credible rather than like a traditional government-enterprise dashboard.
- Malaysian cultural cues must be subtle and respectful, never stereotypical.
- Worker-facing interfaces must use plain language, large touch targets, strong recognition, and minimal cognitive load.

## Evidence on Hand

- Requirements minutes: `交付文档/工业4.0工厂设备维修管理需求沟通纪要.docx`
- Process infographic: `交付文档/工业4.0设备维修管理闭环流程图.png`
- Operator mockup: `交付文档/MVP操作工端Mockup-马来西亚风格.png`
- Rejected administrator mockup retained as an anti-reference: `交付文档/MVP管理员端PC-Dashboard-Mockup.png`
- No confirmed company name, logo, customers, benchmarks, or production integration source is available; future work must not invent them.

## Product Principles

- Make urgent operational exceptions visible before aggregate reporting.
- Prefer recognition and direct action over dense navigation or analytical complexity.
- Preserve accountability through explicit identity, timestamps, state changes, and operator acceptance.
- Use the same underlying transaction across all three roles while presenting only the information each role needs.
- Design responsively from a shared information hierarchy rather than producing separate disconnected products.

## Accessibility & Inclusion

- Use plain language and recognizable icons for low-literacy and low-digital-literacy users.
- Maintain strong contrast, large touch targets, keyboard access on desktop, and non-hover alternatives.
- Do not rely on color alone to communicate status.
- Accommodate multilingual text expansion across BM, Chinese, and English.

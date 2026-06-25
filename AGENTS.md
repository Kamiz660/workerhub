# AGENTS.md

# Project Instructions
Database password in.env.local do not remove this or edit, you can add below it.

Do not run screenshot tests, visual regression tests, or image comparison tests unless explicitly requested.

Before performing any task:
Prefer existing library solutions over custom implementations.

1. Read AGENTS.md
2. Read DESIGN.md
3. Read SKILLS.md
4. Follow all applicable guidance.

If instructions conflict:

AGENTS.md > DESIGN.md > SKILLS.md

---

## Hard Safety Rules (NEW)

These rules override everything except explicit user instructions.

### 1. No Silent Scope Expansion
Do NOT:
- Refactor unrelated code
- “Improve architecture”
- Rename system-wide variables
- Optimize areas not touched by the task

Reason: AI tends to “help too much” and accidentally rewrites systems.

---

### 2. File Change Limit
Default maximum:
- 3 files per task

Exception:
Only if explicitly justified in the plan.

Reason: Multi-file edits are the main source of unintended breakage.

---

### 3. Execution Gate (IMPORTANT)
For any change affecting:
- Authentication
- Database
- Routing
- State management
- Payments
- Multi-feature flows

You MUST first output:
- Goal
- Affected files
- Implementation plan
- Testing approach
- Rollback plan

Then STOP and wait for confirmation.

---

### 4. Trivial Change Auto-Execute Rule
If change is:
- Text
- Styling
- Minor UI adjustment
- Single file, <20 lines impact

You may execute directly without planning.

Reason: Planning overhead is wasteful for micro-changes.

---

## Project State System

PROJECT_STATE.md

What exists right now
After every task:

1. Read relevant project files
2. Understand current system state
3. Update PROJECT_STATE.md to reflect current truth
4. Overwrite file completely (no append)

PROJECT_STATE.md is the ONLY runtime memory of the system.

It must always be accurate before task completion.

---

## Project Purpose

This project is an MVP marketplace for connecting users with local contract workers.

Objective: validation, not scale.

Success metric:
Users understand the product, browse workers, and attempt to contact them.

Failure metric:
Spending months building infrastructure before validating demand.

---

## Technology Stack

- Next.js (latest App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Framer Motion

Future (DO NOT IMPLEMENT YET):
- Supabase
- Payments
- Messaging

Reason: premature backend work kills MVP speed.

---

## Development Philosophy

Prefer:
- Simplicity
- Speed
- Readability
- Reuse of existing components
- Minimal abstraction

Avoid:
- Premature optimization
- Microservices
- Enterprise architecture patterns
- Over-engineering
- Parallel implementations of same feature

---

## Code Standards

- TypeScript strict mode
- Strong typing where meaningful, not ceremonial
- Small focused components
- Clear naming
- Avoid deep nesting
- Prefer composition over abstraction

---

## Layout Standards

- Mobile-first design
- Consistent spacing system
- Consistent typography system
- Reusable card and list patterns

Do not create new design systems if existing patterns already solve the problem.

---

## AI Implementation Rules

Before implementing:
1. Check existing codebase patterns
2. Reuse existing components
3. Identify minimal change set

During implementation:
- Do not expand scope
- Do not introduce unrelated improvements
- Do not refactor unless required

After implementation:
- List changed files
- Briefly explain decisions
- Note technical debt only if directly introduced

Never rewrite large sections of the application without explicit justification.

---

## PRODUCT REALITY CHECK

This is a validation MVP.

Not:
- A scalable system
- A perfect architecture
- An enterprise platform

If a decision does not help validate user demand faster, it is unnecessary.

---

## FINAL RULE

If uncertain:
Prefer doing less, not more.

AI failure mode is over-action, not under-action.
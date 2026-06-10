# AGENTS.md
# Project Instructions

Before performing any task:

1. Read AGENTS.md
2. Read DESIGN.md
3. Read SKILLS.md
4. Follow all applicable guidance.

If instructions conflict:

AGENTS.md > DESIGN.md > SKILLS.md

PROJECT_STATE.md
What exists right now
After every task:

1. Read relevant project files
2. Understand current system state
3. Update PROJECT_STATE.md to reflect the current truth of the project
4. Ensure PROJECT_STATE.md is a compressed, accurate snapshot of:

   * current features
   * current UI structure
   * current constraints
   * current assumptions
5. Overwrite PROJECT_STATE.md completely (do NOT append)

PROJECT_STATE.md is the ONLY file that represents runtime understanding of the project.

It must always be up to date before finishing a task.

## Project Purpose

This project is an MVP marketplace for connecting users with local contract workers.

The objective is validation, not scale.

Success metric:
Users understand the product, browse workers, and attempt to contact them.

Failure metric:
Spending months building infrastructure before validating demand.

---

## Technology Stack

* Next.js (latest App Router)
* TypeScript
* Tailwind CSS
* Shadcn/ui
* Framer Motion

Future:

* Supabase
* Payments
* Messaging

Do not implement future infrastructure unless explicitly requested.

---

## Development Philosophy

Prefer:

* Simplicity
* Speed
* Readability
* Reuse

Avoid:

* Premature optimization
* Microservices
* Complex architecture
* Over-engineering
* Enterprise patterns

---

## UI Philosophy

The product should feel:

* Professional
* Modern
* Trustworthy
* Fast

Use existing design patterns from successful marketplaces.

Avoid unusual navigation or experimental interactions.

---

## Code Standards

* TypeScript strict mode.
* Strong typing.
* Small focused components.
* Clear naming.
* Avoid deeply nested components.
* Favor composition over complexity.

---

## Layout Standards

* Mobile-first.
* Responsive.
* Consistent spacing.
* Consistent typography.
* Consistent card designs.

Use design tokens and reusable components whenever possible.

---

## AI Implementation Rules

Before implementing:

1. Analyze existing code.
2. Reuse existing patterns.
3. Explain reasoning.

After implementing:

1. List changed files.
2. Explain decisions.
3. Identify future technical debt.

Never rewrite large sections of the application without justification.

Always prefer modifying existing structures over creating parallel systems.

---

## Product Reminder

We are validating an idea.

The goal is not perfect architecture.

The goal is learning whether users want the product.

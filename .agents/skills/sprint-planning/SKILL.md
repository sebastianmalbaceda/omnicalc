---
name: sprint-planning
description: |
  Trigger when: starting a new sprint, reviewing sprint progress,
  or updating PLANNING.md with new tasks.
  Do NOT trigger for: individual task implementation (use BUILD phase),
  code review, or documentation updates.
---

# Sprint Planning — OmniCalc

## Process

### 1. Assess Current State

```bash
# Read current progress
cat PLANNING.md

# Read the roadmap for the current phase
cat ROADMAP.md
```

### 2. Identify Next Tasks

- Check `ROADMAP.md` for the current phase deliverables
- Check `PLANNING.md` for completed and remaining items
- Identify the next logical set of tasks
- Respect dependency order (what must be built first)

### 3. Task Decomposition Rules

Each task in `PLANNING.md` must be:

- **Specific:** Clear what file(s) to create/modify
- **Self-contained:** Completable in one coding session (1-4 hours)
- **No decisions:** Should not require architectural decisions
- **Testable:** Clear criteria for "done"
- **Independent:** Minimal dependencies on other in-progress tasks

### 4. Update PLANNING.md

```markdown
## Sprint N: [Name] (Phase X)

### Backlog

- [ ] Task description — specific file/package affected

### In Progress

- [/] Task being worked on now

### Completed

- [x] Task that is done

### Blocked

- Description of blocker

### Open Questions

- Questions that need human decision
```

### 5. Task Priority Order

Within a sprint, order tasks by:

1. **Foundation first** — configs before code
2. **Dependencies** — shared packages before apps
3. **Core before features** — engine before UI
4. **Tests alongside code** — not deferred to later

## Sprint Size Guide

| Sprint Type            | Tasks       | Duration     |
| ---------------------- | ----------- | ------------ |
| Small (single feature) | 3-5 tasks   | 1-2 sessions |
| Medium (component set) | 5-10 tasks  | 3-5 sessions |
| Large (full phase)     | 10-20 tasks | 1-2 weeks    |

## Handoff Checklist

Before handing off to BUILD phase:

- [ ] `PLANNING.md` updated with new tasks
- [ ] Each task is actionable without design decisions
- [ ] Dependencies between tasks clearly noted
- [ ] Related `SPEC.md` requirement IDs referenced
- [ ] Human approval obtained on plan

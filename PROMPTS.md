# OmniCalc — Reusable Prompts

> Standardized prompt templates for recurring AI-assisted tasks.
> Use these to maintain consistency across the development workflow.

---

## Code Review

```
Review this code change for OmniCalc. Check against:

1. **ARCHITECTURE.md compliance** — Does it follow the monorepo structure?
2. **TypeScript strictness** — No `any`, no `@ts-ignore`, explicit return types
3. **Math safety** — Is decimal.js used for all arithmetic? No native JS operators?
4. **Security** — Input validation (Zod), no secrets in code, auth middleware
5. **Testing** — Are tests included? Do they cover edge cases?
6. **Styling** — NativeWind design tokens used? No hardcoded values?
7. **Performance** — Unnecessary re-renders? N+1 queries?
8. **Naming** — Follows project conventions (PascalCase components, kebab-case files)?

Provide specific line references and suggested fixes.
```

---

## Test Generation

```
Generate Vitest unit tests for the following code from OmniCalc's `packages/core-math`.

Requirements:
- Use `describe` / `it` blocks with clear, descriptive names
- Cover: happy path, edge cases, error conditions
- Test precision: verify 0.1 + 0.2 === 0.3 via decimal.js
- Test division by zero returns structured error
- Test overflow triggers scientific notation
- Test all mathematical constants (π, e) to 15+ decimal places
- Do NOT use native JS arithmetic in test assertions — use decimal.js
- Target: 100% branch coverage
```

---

## PR Description

```
## Summary
[One-line description of the change]

## Changes
- [List of specific changes made]

## Motivation
[Why this change was needed — link to SPEC.md requirement ID if applicable]

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated (if UI change)
- [ ] Manual testing performed on: [platforms]

## Screenshots
[If UI change — before/after screenshots]

## Breaking Changes
[None / Description of breaking changes]

## Related
- Closes #[issue]
- Refs: SPEC.md [requirement ID]
```

---

## Commit Message

```
<type>(<scope>): <imperative description>

Types: feat, fix, docs, style, refactor, test, chore, perf
Scopes: core-math, ui, db, web, mobile, desktop

Examples:
- feat(core-math): add expression parser with precedence support
- fix(ui): correct display truncation at 16 digits
- test(core-math): add edge cases for factorial of negative numbers
- chore(db): update Prisma to v6.5 and regenerate client
```

---

## Documentation Update

```
Update the documentation for OmniCalc based on the following change:

Context:
- Change: [describe what changed]
- Affected packages: [list packages]

Update these files as needed:
1. SPEC.md — if requirements changed
2. ARCHITECTURE.md — if architecture changed
3. docs/api.md — if API endpoints changed
4. CHANGELOG.md — add entry under [Unreleased]
5. PLANNING.md — mark relevant task as complete

Follow the existing format and style of each document.
```

---

## Component Creation

```
Create a new shared UI component for OmniCalc in `packages/ui/src/`.

Requirements:
- Use NativeWind for styling (Tailwind CSS classes)
- Follow Gluestack UI patterns
- Must work on: Web, iOS, Android (React Native)
- Use design tokens from docs/design-system.md
- Follow the glassmorphism aesthetic (Editorial Precision design)
- Export as named export from `packages/ui/src/index.ts`
- Include TypeScript interface for all props
- Do NOT use platform-specific code unless absolutely necessary

Component: [name]
Purpose: [description]
Props: [list expected props]
```

---

## Bug Investigation

```
Investigate the following bug in OmniCalc:

Symptoms: [describe the bug]
Expected behavior: [what should happen]
Actual behavior: [what actually happens]
Platform: [web/ios/android/desktop]
Steps to reproduce: [numbered steps]

Investigate by:
1. Check SPEC.md for expected behavior
2. Trace the data flow through the relevant stores and API
3. Check edge cases in docs/math-engine.md if math-related
4. Identify root cause with specific file and line references
5. Propose fix with code changes
6. Include regression test to prevent recurrence
```

---

## Sprint Planning

```
Plan the next sprint for OmniCalc.

Context:
- Current phase: [Phase number from ROADMAP.md]
- Completed so far: [reference PLANNING.md completed items]
- Time available: [estimated hours/days]

Tasks:
1. Read ROADMAP.md for the current phase deliverables
2. Read PLANNING.md for the current state
3. Break down the next set of deliverables into specific, actionable tasks
4. Each task should be completable in one coding session
5. Each task should not require architecture decisions (escalate those)
6. Order tasks by dependency (what must be built first)
7. Update PLANNING.md with the new sprint backlog
```

---

_Document version: 0.1.0_

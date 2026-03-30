---
name: code-review
description: |
  Trigger when: reviewing pull requests, auditing code changes,
  or performing security reviews on OmniCalc code.
  Do NOT trigger for: writing new code, generating tests,
  or documentation-only changes.
---

# Code Review — OmniCalc

## Review Checklist

### 1. Architecture Compliance

- [ ] Changes follow `ARCHITECTURE.md` module boundaries
- [ ] Shared components in `packages/ui/` (not in `apps/`)
- [ ] Math logic in `packages/core-math/` only
- [ ] No server-only imports in client bundles
- [ ] API routes in `apps/web/src/routes/` only

### 2. TypeScript Strictness

- [ ] No `any` types
- [ ] No `@ts-ignore` or `@ts-nocheck`
- [ ] No unnecessary `as` type assertions
- [ ] Explicit return types on all exported functions
- [ ] Interfaces used for object shapes (not `type`)

### 3. Math Safety (packages/core-math)

- [ ] `decimal.js` used for ALL arithmetic operations
- [ ] No native JS operators (`+`, `-`, `*`, `/`) for float math
- [ ] All functions are pure (no side effects)
- [ ] Division by zero handled gracefully
- [ ] Overflow handled (scientific notation for 16+ digits)

### 4. Security

- [ ] No secrets, API keys, or credentials in code
- [ ] All API inputs validated with Zod schemas
- [ ] Auth middleware on protected routes
- [ ] Pro plan check on gated features (server-side)
- [ ] Webhook signatures verified (Stripe, RevenueCat)
- [ ] No raw SQL queries (Prisma only)
- [ ] CORS configured correctly
- [ ] Rate limiting considered

### 5. Testing

- [ ] New code has corresponding tests
- [ ] Edge cases covered (zero, negative, overflow, empty)
- [ ] Tests pass locally (`pnpm test`)
- [ ] Coverage targets met (100% core-math, 80% others)

### 6. Styling & UI

- [ ] NativeWind classes used (no inline styles)
- [ ] Design tokens from `docs/design-system.md` used
- [ ] No hardcoded colors, spacing, or font sizes
- [ ] Responsive behavior verified
- [ ] Accessibility (a11y) attributes present

### 7. Performance

- [ ] No unnecessary re-renders in React components
- [ ] No N+1 database queries
- [ ] Expensive operations memoized appropriately
- [ ] Bundle size impact considered
- [ ] TanStack Query cache strategy appropriate

### 8. Code Quality

- [ ] Naming follows conventions (PascalCase components, kebab-case files)
- [ ] No `console.log` in production code
- [ ] No commented-out code committed
- [ ] Conventional commit message format
- [ ] CHANGELOG.md updated if notable change

## Review Output Format

```markdown
## Review Summary

[Overall assessment: Approve / Request Changes / Comment]

### Issues Found

1. **[severity]** file:line — description
   - Suggested fix: ...

### Positive Notes

- [What was done well]

### Recommendations

- [Optional improvements]
```

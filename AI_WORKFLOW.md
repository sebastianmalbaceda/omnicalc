# OmniCalc — AI Development Workflow

> **Version:** 0.2.0
> **Last Updated:** 2026-03-30

This document defines how AI models collaborate across the development pipeline
for OmniCalc. Each phase has a clear responsibility, assigned model, and
handoff protocol. All development is AI-assisted with human supervision.

---

## Model Assignment by Phase

| Phase       | Role              | Model                                  | Justification                                             |
| ----------- | ----------------- | -------------------------------------- | --------------------------------------------------------- |
| **PLAN**    | Planner           | _Claude Opus 4.6_                      | Análisis, diseño arquitectónico y subdivisión de tareas.  |
| **BUILD**   | Builder           | _MiniMax M2.7_ / _GLM 5.1_             | Escritura de código, tests unitarios, UI/UX (NativeWind). |
| **REVIEW**  | Reviewer          | _Gemini 3.1 Pro_ / _Claude Sonnet 4.6_ | Revisión de seguridad (API keys), arquitectura y tipado.  |
| **TEST**    | Reviewer / Tester | _Gemini 3.1 Pro_ / _Claude Sonnet 4.6_ | Ejecución de tests E2E y flujos de integración.           |
| **ITERATE** | Builder           | _MiniMax M2.7_ / _GLM 5.1_             | Correcciones rápidas de bugs o ajustes post-auditoría.    |

> [!IMPORTANT]
> **Regla clave:** PLAN, REVIEW y TEST son puntos de control de calidad — usar siempre el modelo correspondiente.
> BUILD e ITERATE son el motor de producción — usar MiniMax M2.7 o GLM 5.1 para máximo throughput.

---

## Cómo usar este documento

Para cada sesión de desarrollo, el agente debe:

1. Leer `PLANNING.md` y localizar la tarea activa del sprint actual.
2. Ejecutar la fase del ciclo correspondiente.
3. Actualizar `PLANNING.md` al terminar (marcar tarea `[x]`).
4. Esperar checkpoint humano antes de continuar a la siguiente fase.

---

## El Ciclo Completo

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  PLAN    │───▶│  BUILD   │───▶│  REVIEW  │───▶│  TEST    │───▶│ ITERATE  │
│ (Diseño) │    │ (Código) │    │(Auditoría│    │ (Calidad)│    │(Correc.) │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
      ▲                                                               │
      └───────────────────────────────────────────────────────────────┘
                          (siguiente sprint)
```

---

## Phase 1: PLAN

**Assigned Model:** Claude Opus 4.6

### Responsibilities

- Read `SPEC.md` for requirements
- Read `ARCHITECTURE.md` for system constraints
- Read `ROADMAP.md` for current phase
- Read `PLANNING.md` for existing progress
- Design implementation approach in detail
- Break down deliverables into specific, actionable tasks
- Update `PLANNING.md` with unambiguous tasks
- Validate plan against architecture decisions (`docs/adr/`)
- Flag ambiguities before coding begins

### Output

An updated `PLANNING.md` with clear tasks that a builder can execute
without needing to make design decisions.

### Handoff Gate

- [ ] `PLANNING.md` updated with new sprint tasks
- [ ] Each task is specific and self-contained
- [ ] No unresolved architectural questions
- [ ] Human approval obtained on plan

---

## Phase 2: BUILD

**Assigned Model:** MiniMax M2.7 / GLM 5.1

### Responsibilities

- Implement tasks from `PLANNING.md` one at a time
- Follow coding conventions from `AGENTS.md`
- Follow the design from `SPEC.md` and `ARCHITECTURE.md`
- Load relevant skills from `.agents/skills/` as needed
- Use `decimal.js` for all math in `packages/core-math`
- Create components in `packages/ui/` (never in `apps/`)
- Mark tasks complete in `PLANNING.md` after implementation
- **Never make architectural decisions** — escalate to planner

### Output

Working code committed to a feature branch.

### Handoff Gate

- [ ] Code compiles (`pnpm type-check`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Basic tests pass (`pnpm test`)
- [ ] Task marked complete in `PLANNING.md`

---

## Phase 3: REVIEW

**Assigned Model:** Gemini 3.1 Pro / Claude Sonnet 4.6

### Responsibilities

- Audit all new code from the build phase
- Use the `code-review` skill (`.agents/skills/code-review/`)
- Check against `ARCHITECTURE.md` and `SPEC.md`
- Verify security (see `SECURITY.md`)
  - Input validation with Zod
  - No secrets in code
  - Auth middleware on protected routes
  - Webhook signature verification
- Verify math safety (`decimal.js` used, no native operators)
- Check for performance issues (N+1 queries, unnecessary re-renders)
- Suggest specific improvements with code references

### Output

Review comments with specific file/line references and suggested fixes.

### Handoff Gate

- [ ] All critical issues resolved
- [ ] No security vulnerabilities identified
- [ ] Math safety verified (decimal.js only)
- [ ] Architecture compliance confirmed

---

## Phase 4: TEST

**Assigned Model:** Gemini 3.1 Pro / Claude Sonnet 4.6

### Responsibilities

- Use the `generate-tests` skill (`.agents/skills/generate-tests/`)
- Generate unit tests (Vitest) for new code
- Generate E2E tests (Playwright) for new user flows
- Validate behavior matches `SPEC.md` requirements
- Run existing test suite and report failures
- Identify untested code paths
- Target coverage: 100% for `core-math`, 80% for other packages

### Output

Test files committed and passing.

### Handoff Gate

- [ ] All tests pass (`pnpm test`)
- [ ] Coverage targets met
- [ ] E2E flows validated
- [ ] No regressions introduced

---

## Phase 5: ITERATE

**Assigned Model:** MiniMax M2.7 / GLM 5.1

### Responsibilities

- Fix all issues found in review and testing
- Rerun full test suite to confirm fixes
- Update `PLANNING.md` (mark completed, add new tasks from review)
- Update `CHANGELOG.md` with notable changes
- Continue to the next development cycle

### Handoff Gate

- [ ] All review issues addressed
- [ ] Full test suite passes
- [ ] `CHANGELOG.md` updated
- [ ] Ready for next sprint cycle

---

## Human Oversight Checkpoints

| Checkpoint     | When                | What                                          |
| -------------- | ------------------- | --------------------------------------------- |
| Plan Approval  | After PLAN phase    | Review `PLANNING.md` diff before build starts |
| PR Review      | After BUILD phase   | Review code changes before merge              |
| Security Audit | After REVIEW phase  | Sign off on security-sensitive changes        |
| Release Gate   | After ITERATE phase | Approve version bump and deployment           |

---

## Quick Reference

```
# Start a new development cycle:
1. Read PLANNING.md → identify next task
2. Read relevant SPEC.md sections
3. Load relevant .agents/skills/ if needed
4. Implement the task
5. Run: pnpm lint && pnpm test && pnpm type-check
6. Mark task complete in PLANNING.md
7. Commit with conventional commit format
8. Wait for human checkpoint before next phase
```

---

_Document version: 0.2.0_

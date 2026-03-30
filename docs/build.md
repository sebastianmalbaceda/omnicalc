# OmniCalc — Build System

> **Monorepo tool:** Turborepo
> **Package manager:** pnpm 9+
> **Node.js:** 22 LTS

---

## Turborepo Pipeline

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "__tests__/**"]
    },
    "lint": {},
    "type-check": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### Build Order

Turborepo resolves the dependency graph automatically:

```
packages/tsconfig (no deps)
  └→ packages/core-math (depends on tsconfig)
  └→ packages/db (depends on tsconfig)
  └→ packages/ui (depends on tsconfig, core-math)
       └→ apps/mobile (depends on ui, core-math)
       └→ apps/desktop (depends on ui, core-math)
       └→ apps/web (depends on db, core-math)
```

---

## pnpm Workspace

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Package Naming

| Package              | Name                  |
| -------------------- | --------------------- |
| `packages/core-math` | `@omnicalc/core-math` |
| `packages/ui`        | `@omnicalc/ui`        |
| `packages/db`        | `@omnicalc/db`        |
| `packages/tsconfig`  | `@omnicalc/tsconfig`  |
| `apps/web`           | `@omnicalc/web`       |
| `apps/mobile`        | `@omnicalc/mobile`    |
| `apps/desktop`       | `@omnicalc/desktop`   |

---

## Scripts

### Root package.json

```json
{
  "scripts": {
    "dev": "turbo dev",
    "dev:web": "turbo dev --filter=@omnicalc/web",
    "dev:mobile": "turbo dev --filter=@omnicalc/mobile",
    "dev:desktop": "turbo dev --filter=@omnicalc/desktop",
    "build": "turbo build",
    "test": "turbo test",
    "test:e2e": "turbo test:e2e",
    "lint": "eslint . && prettier --check .",
    "lint:fix": "eslint --fix . && prettier --write .",
    "type-check": "turbo type-check",
    "db:generate": "pnpm --filter @omnicalc/db exec prisma generate",
    "db:migrate": "pnpm --filter @omnicalc/db exec prisma migrate dev",
    "db:studio": "pnpm --filter @omnicalc/db exec prisma studio",
    "clean": "turbo clean && rm -rf node_modules"
  }
}
```

---

## ESLint Configuration

### eslint.config.js

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    ignores: ['node_modules', 'dist', 'build', '.turbo', '.expo', 'coverage'],
  },
);
```

### .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## Git Hooks (Husky + lint-staged)

### Setup

```bash
# .husky/pre-commit
pnpm lint-staged
```

### lint-staged config (package.json)

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

---

## TypeScript Configuration

### packages/tsconfig/base.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

---

_Document version: 0.1.0_

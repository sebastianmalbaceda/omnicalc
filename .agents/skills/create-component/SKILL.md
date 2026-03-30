---
name: create-component
description: |
  Trigger when: creating or modifying shared UI components in packages/ui/src/,
  building calculator interface elements, or implementing design system tokens.
  Do NOT trigger for: platform-specific layouts in apps/, API routes,
  or math engine changes.
---

# Create Component — OmniCalc

## Location & Conventions

- **All shared components** → `packages/ui/src/<ComponentName>/`
- **One component per file** → `ComponentName.tsx`
- **Named exports only** — no default exports
- **Re-export** from `packages/ui/src/index.ts`

## Directory Structure

```
packages/ui/src/
├── Button/
│   ├── Button.tsx
│   └── index.ts          # Re-exports Button
├── Display/
│   ├── Display.tsx
│   └── index.ts
├── Keypad/
│   ├── NumericKeypad.tsx
│   ├── OperatorKeypad.tsx
│   ├── ScientificKeypad.tsx
│   └── index.ts
├── HistoryPanel/
│   ├── HistoryPanel.tsx
│   ├── HistoryEntry.tsx
│   └── index.ts
└── index.ts              # Root barrel export
```

## Component Template

```tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'operator' | 'scientific';
  disabled?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'secondary',
  disabled = false,
}: ButtonProps): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`
        items-center justify-center rounded-2xl p-4
        ${variant === 'primary' ? 'bg-primary-500' : ''}
        ${variant === 'operator' ? 'bg-violet-100' : ''}
        ${variant === 'secondary' ? 'bg-surface-container-low' : ''}
        ${variant === 'scientific' ? 'bg-emerald-50' : ''}
        ${disabled ? 'opacity-40' : 'active:scale-95'}
      `}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text
        className={`
        text-lg font-semibold
        ${variant === 'primary' ? 'text-white' : 'text-on-surface'}
      `}
      >
        {label}
      </Text>
    </Pressable>
  );
}
```

## Design System Reference

Read `docs/design-system.md` for:

- Color palette (Primary `#4648D4`, Secondary `#505F76`, Tertiary `#006C49`)
- Typography (Manrope for headings, Inter for body/UI)
- Spacing scale (8, 12, 16, 20, 24)
- Corner radius (sm: 0.5rem, DEFAULT: 1rem, md: 1.5rem, full: 9999px)
- Glassmorphism rules (backdrop-blur, opacity)
- "No-Line" rule — no 1px borders for section dividers

## Checklist

- [ ] Component in `packages/ui/src/` (not in `apps/`)
- [ ] TypeScript interface for all props
- [ ] Named export (no default exports)
- [ ] NativeWind classes only (no inline styles)
- [ ] Design tokens used (no hardcoded colors/spacing)
- [ ] Works on: Web, iOS, Android (React Native compatible)
- [ ] Accessibility attributes (`accessibilityRole`, `accessibilityLabel`)
- [ ] Re-exported from `packages/ui/src/index.ts`
- [ ] No platform-specific code (unless wrapped in Platform.select)

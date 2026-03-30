import React from 'react';
import { Pressable, Text } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'operator' | 'memory' | 'function';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
}

const variantClasses: Record<ButtonVariant, { base: string; text: string }> = {
  primary: {
    base: 'bg-primary-500 active:bg-primary-600',
    text: 'text-white',
  },
  secondary: {
    base: 'bg-surface-container-low dark:bg-surface',
    text: 'text-on-surface dark:text-white',
  },
  operator: {
    base: 'bg-primary-50 dark:bg-primary-900/30 active:bg-primary-100 dark:active:bg-primary-900/50',
    text: 'text-primary-500 dark:text-primary-400',
  },
  memory: {
    base: 'bg-secondary-500/10 dark:bg-secondary-400/10',
    text: 'text-secondary-500 dark:text-secondary-400',
  },
  function: {
    base: 'bg-tertiary-500/10 dark:bg-tertiary-400/10',
    text: 'text-tertiary-500 dark:text-tertiary-400',
  },
};

export function Button({
  label,
  onPress,
  variant = 'secondary',
  disabled = false,
  className = '',
}: ButtonProps): React.ReactElement {
  const { base, text } = variantClasses[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`
        flex-1 items-center justify-center rounded-2xl p-4
        transition-all duration-150 ease-out
        active:scale-95
        ${base}
        ${disabled ? 'opacity-40' : ''}
        ${className}
      `}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Text
        className={`
          text-body-lg font-semibold
          ${text}
        `}
      >
        {label}
      </Text>
    </Pressable>
  );
}

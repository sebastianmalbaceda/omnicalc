import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from '../ThemeProvider/ThemeProvider';

export type ButtonVariant = 'primary' | 'secondary' | 'operator' | 'memory' | 'function';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
}

export function Button({
  label,
  onPress,
  variant = 'secondary',
  disabled = false,
  className = '',
}: ButtonProps): React.ReactElement {
  const { isDark } = useTheme();

  const getVariantClasses = (): { base: string; text: string } => {
    switch (variant) {
      case 'primary':
        return {
          base: 'bg-[#392cc1]',
          text: 'text-white',
        };
      case 'secondary':
        return {
          base: isDark ? 'bg-[#1e1e32]' : 'bg-[#e6e8ea]',
          text: isDark ? 'text-[#e8e8f0]' : 'text-[#191c1e]',
        };
      case 'operator':
        return {
          base: 'bg-gradient-to-br from-[#392cc1] to-[#534ad9]',
          text: 'text-white',
        };
      case 'memory':
        return {
          base: isDark ? 'bg-[#252540]' : 'bg-[#e0e3e5]',
          text: isDark ? 'text-[#e8e8f0]' : 'text-[#191c1e]',
        };
      case 'function':
        return {
          base: isDark ? 'bg-[#141420]' : 'bg-[#ffffff]',
          text: isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]',
        };
      default:
        return {
          base: isDark ? 'bg-[#1e1e32]' : 'bg-[#e6e8ea]',
          text: isDark ? 'text-[#e8e8f0]' : 'text-[#191c1e]',
        };
    }
  };

  const { base, text } = getVariantClasses();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`
        flex-1 items-center justify-center rounded-xl p-4
        active:scale-95 transition-all
        ${variant === 'operator' || variant === 'primary' ? 'shadow-lg shadow-primary/30' : ''}
        ${disabled ? 'opacity-40' : ''}
        ${base}
        ${className}
      `}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Text
        className={`
          ${variant === 'operator' || variant === 'primary' ? 'text-[24px] font-bold' : variant === 'function' ? 'text-[14px] font-semibold' : 'text-[20px] font-semibold'}
          ${text}
        `}
      >
        {label}
      </Text>
    </Pressable>
  );
}

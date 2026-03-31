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

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return {
          base: isDark ? 'bg-[#6366F1]' : 'bg-[#4648D4]',
          text: 'text-white',
          active: isDark ? 'active:bg-[#8084F4]' : 'active:bg-[#3730A3]',
        };
      case 'secondary':
        return {
          base: isDark ? 'bg-[#0A0A0F]' : 'bg-[#FAFAFA]',
          text: isDark ? 'text-white' : 'text-[#1A1A2A]',
          active: '',
        };
      case 'operator':
        return {
          base: isDark ? 'bg-[#2f2ebe]/30' : 'bg-[#EEF2FF]',
          text: isDark ? 'text-[#C0C1FF]' : 'text-[#4648D4]',
          active: isDark ? 'active:bg-[#2f2ebe]/50' : 'active:bg-[#EEF2FF]',
        };
      case 'memory':
        return {
          base: isDark ? 'bg-[#64748B]/10' : 'bg-[#505F76]/10',
          text: isDark ? 'text-[#64748B]' : 'text-[#505F76]',
          active: '',
        };
      case 'function':
        return {
          base: isDark ? 'bg-[#10B981]/10' : 'bg-[#006C49]/10',
          text: isDark ? 'text-[#10B981]' : 'text-[#006C49]',
          active: '',
        };
      default:
        return {
          base: isDark ? 'bg-[#0A0A0F]' : 'bg-[#FAFAFA]',
          text: isDark ? 'text-white' : 'text-[#1A1A2A]',
          active: '',
        };
    }
  };

  const { base, text, active } = getVariantClasses();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`
        flex-1 items-center justify-center rounded-2xl p-4
        transition-all duration-150 ease-out
        active:scale-95
        ${base}
        ${active}
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

import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../ThemeProvider/ThemeProvider';

interface DisplayProps {
  value: string;
  expression?: string;
  isError?: boolean;
  className?: string;
}

export function Display({
  value,
  expression = '',
  isError = false,
  className = '',
}: DisplayProps): React.ReactElement {
  const { isDark } = useTheme();

  return (
    <View
      className={`
        flex-col justify-end items-end p-8 pb-10
        ${isDark ? 'bg-[#f7f9fb]' : 'bg-[#f7f9fb]'}
        rounded-3xl
        ${className}
      `}
    >
      {expression ? (
        <Text
          className={`
            text-[14px] tracking-wide mb-2
            ${isDark ? 'text-[#a0a0b8]' : 'text-[#464555]'}
            opacity-60
          `}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {expression}
        </Text>
      ) : null}
      <Text
        className={`
          text-[60px] font-extrabold tracking-tighter
          ${isError ? 'text-[#DC2626]' : isDark ? 'text-[#e8e8f0]' : 'text-[#191c1e]'}
        `}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {isError ? 'Error' : value}
      </Text>
    </View>
  );
}

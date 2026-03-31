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
        flex-col justify-end items-end p-6
        ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FAFAFA]'}
        rounded-3xl
        ${className}
      `}
    >
      {expression ? (
        <Text
          className={`
            text-body-md mb-2 font-mono
            ${isDark ? 'text-[#A0A0B8]' : 'text-[#505F76]'}
          `}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {expression}
        </Text>
      ) : null}
      <Text
        className={`
          text-display-xl font-light font-display
          ${isError ? 'text-[#DC2626]' : isDark ? 'text-white' : 'text-[#1A1A2A]'}
        `}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {isError ? 'Error' : value}
      </Text>
    </View>
  );
}

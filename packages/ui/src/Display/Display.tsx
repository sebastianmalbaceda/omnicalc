import React from 'react';
import { View, Text } from 'react-native';

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
  return (
    <View
      className={`
        flex-col justify-end items-end p-6
        bg-surface-container-low dark:bg-surface
        rounded-3xl
        ${className}
      `}
    >
      {expression ? (
        <Text
          className="text-body-md text-on-surface-variant dark:text-white/60 mb-2 font-mono"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {expression}
        </Text>
      ) : null}
      <Text
        className={`
          text-display-xl font-light font-display
          ${isError ? 'text-error' : 'text-on-surface dark:text-white'}
        `}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {isError ? 'Error' : value}
      </Text>
    </View>
  );
}

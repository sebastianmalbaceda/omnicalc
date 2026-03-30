import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import type { HistoryEntry } from '@omnicalc/core-math';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onSelectEntry?: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
  isPro?: boolean;
  className?: string;
}

export function HistoryPanel({
  entries,
  onSelectEntry,
  onClearHistory,
  isPro = false,
  className = '',
}: HistoryPanelProps): React.ReactElement {
  if (!isPro) {
    return (
      <View className={`bg-surface-container rounded-2xl p-4 ${className}`}>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-heading-md font-heading text-on-surface">History</Text>
          <View className="bg-primary-500/10 rounded-full px-3 py-1">
            <Text className="text-label text-primary-500">Pro</Text>
          </View>
        </View>
        <View className="bg-surface rounded-xl p-4 items-center">
          <Text className="text-body-md text-on-surface-variant mb-2">Cloud Tape</Text>
          <Pressable className="bg-primary-500 rounded-full px-4 py-2">
            <Text className="text-button text-white">Upgrade to Pro</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className={`bg-surface-container rounded-2xl p-4 ${className}`}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-heading-md font-heading text-on-surface">History</Text>
        {entries.length > 0 && (
          <Pressable onPress={onClearHistory} className="px-3 py-1">
            <Text className="text-label text-error">Clear</Text>
          </Pressable>
        )}
      </View>
      <ScrollView className="max-h-64" showsVerticalScrollIndicator={false}>
        {entries.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-body-md text-on-surface-variant">No calculations yet</Text>
          </View>
        ) : (
          entries.map((entry, _index) => (
            <Pressable
              key={entry.timestamp}
              onPress={() => onSelectEntry?.(entry)}
              className="flex-row justify-between items-center py-3 border-b border-outline/20"
            >
              <View className="flex-1">
                <Text className="text-body-md text-on-surface-variant font-mono" numberOfLines={1}>
                  {entry.expression}
                </Text>
                <Text className="text-body-lg font-semibold text-on-surface">= {entry.result}</Text>
              </View>
              <Text className="text-label text-on-surface-variant ml-4">
                {new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import type { HistoryEntry } from '@omnicalc/core-math';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onSelectEntry?: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
  onUpgradeToPro?: () => void;
  isPro?: boolean;
  className?: string;
}

export function HistoryPanel({
  entries,
  onSelectEntry,
  onClearHistory,
  onUpgradeToPro,
  isPro = false,
  className = '',
}: HistoryPanelProps): React.ReactElement {
  const { isDark } = useTheme();

  if (!isPro) {
    return (
      <View className={`${isDark ? 'bg-[#141420]' : 'bg-[#F5F5FA]'} rounded-2xl p-4 ${className}`}>
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className={`text-heading-md font-heading ${isDark ? 'text-white' : 'text-[#1A1A2A]'}`}
          >
            History
          </Text>
          <View className="bg-[#4648D4]/10 rounded-full px-3 py-1">
            <Text className="text-label text-[#4648D4]">Pro</Text>
          </View>
        </View>
        <View className={`${isDark ? 'bg-[#0A0A0F]' : 'bg-white'} rounded-xl p-4 items-center`}>
          <Text className={`text-body-md ${isDark ? 'text-[#A0A0B8]' : 'text-[#505F76]'} mb-2`}>
            Cloud Tape
          </Text>
          <Pressable
            onPress={onUpgradeToPro}
            className={`${isDark ? 'bg-[#6366F1]' : 'bg-[#4648D4]'} rounded-full px-4 py-2 active:scale-95 transition-all`}
          >
            <Text className="text-button text-white uppercase tracking-widest font-heading">
              Upgrade to Pro
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className={`${isDark ? 'bg-[#141420]' : 'bg-[#F5F5FA]'} rounded-2xl p-4 ${className}`}>
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className={`text-heading-md font-heading ${isDark ? 'text-white' : 'text-[#1A1A2A]'}`}
        >
          History
        </Text>
        {entries.length > 0 && (
          <Pressable onPress={onClearHistory} className="px-3 py-1">
            <Text className="text-label text-[#DC2626]">Clear</Text>
          </Pressable>
        )}
      </View>
      <ScrollView className="max-h-64" showsVerticalScrollIndicator={false}>
        {entries.length === 0 ? (
          <View className="items-center py-8">
            <Text className={`text-body-md ${isDark ? 'text-[#A0A0B8]' : 'text-[#505F76]'}`}>
              No calculations yet
            </Text>
          </View>
        ) : (
          entries.map((entry, _index) => (
            <Pressable
              key={entry.timestamp}
              onPress={() => onSelectEntry?.(entry)}
              className={`flex-row justify-between items-center py-3 ${isDark ? 'border-white/10' : 'border-[#D4D4E0]/20'}`}
            >
              <View className="flex-1">
                <Text
                  className={`text-body-md font-mono ${isDark ? 'text-[#A0A0B8]' : 'text-[#505F76]'}`}
                  numberOfLines={1}
                >
                  {entry.expression}
                </Text>
                <Text
                  className={`text-body-lg font-semibold ${isDark ? 'text-white' : 'text-[#1A1A2A]'}`}
                >
                  = {entry.result}
                </Text>
              </View>
              <Text className={`text-label ${isDark ? 'text-[#A0A0B8]' : 'text-[#505F76]'} ml-4`}>
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

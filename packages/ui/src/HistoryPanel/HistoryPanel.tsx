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
      <View className={`${isDark ? 'bg-[#141420]' : 'bg-[#f2f4f6]'} rounded-2xl p-4 ${className}`}>
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'}`}
          >
            Cloud Tape History
          </Text>
          <View className="bg-[#4648d4]/10 rounded-full px-3 py-1">
            <Text className="text-[10px] font-bold text-[#4648d4] uppercase tracking-wider">
              Pro
            </Text>
          </View>
        </View>
        <View className={`${isDark ? 'bg-[#1a1a2e]' : 'bg-[#ffffff]'} rounded-xl p-4 items-center`}>
          <Text className={`text-[14px] ${isDark ? 'text-[#a0a0b8]' : 'text-[#464555]'} mb-3`}>
            Upgrade to unlock Cloud Tape
          </Text>
          <Pressable
            onPress={onUpgradeToPro}
            className="bg-gradient-to-br from-[#392cc1] to-[#534ad9] rounded-xl px-6 py-3 active:scale-95 transition-all shadow-lg shadow-primary/30"
          >
            <Text className="text-white font-bold uppercase tracking-wider text-[12px]">
              Upgrade to Pro
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className={`${isDark ? 'bg-[#141420]' : 'bg-[#f2f4f6]'} rounded-2xl p-4 ${className}`}>
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'}`}
        >
          Cloud Tape History
        </Text>
        {entries.length > 0 && (
          <Pressable onPress={onClearHistory} className="px-3 py-1">
            <Text className="text-[12px] font-semibold text-[#ba1a1a]">Clear</Text>
          </Pressable>
        )}
      </View>
      <ScrollView className="max-h-64" showsVerticalScrollIndicator={false}>
        {entries.length === 0 ? (
          <View className="items-center py-8">
            <Text className={`text-[14px] ${isDark ? 'text-[#a0a0b8]' : 'text-[#464555]'}`}>
              No calculations yet
            </Text>
          </View>
        ) : (
          entries.map((entry, index) => (
            <Pressable
              key={entry.timestamp}
              onPress={() => onSelectEntry?.(entry)}
              className={`py-3 px-3 rounded-xl ${index % 2 === 0 ? (isDark ? 'bg-[#1a1a2e]' : 'bg-[#f7f9fb]') : ''}`}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1 items-end">
                  <Text
                    className={`text-[12px] tracking-tight ${isDark ? 'text-[#a0a0b8]' : 'text-[#464555]'}`}
                    numberOfLines={1}
                  >
                    {entry.expression}
                  </Text>
                  <Text
                    className={`text-[16px] font-bold ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'}`}
                  >
                    {entry.result}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

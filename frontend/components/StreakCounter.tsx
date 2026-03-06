import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface StreakCounterProps {
  streak: number;
  totalEntries: number;
}

export default function StreakCounter({ streak, totalEntries }: StreakCounterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text style={styles.statEmoji}>🔥</Text>
        <Text style={styles.statValue}>{streak}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statEmoji}>📝</Text>
        <Text style={styles.statValue}>{totalEntries}</Text>
        <Text style={styles.statLabel}>Entries</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
});

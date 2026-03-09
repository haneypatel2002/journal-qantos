import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

interface StreakCounterProps {
  streak: number;
  totalEntries: number;
}

export default function StreakCounter({ streak, totalEntries }: StreakCounterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: COLORS.warning + '20' }]}>
          <Ionicons name="flame" size={22} color={COLORS.warning} />
        </View>
        <Text style={styles.statValue}>{streak}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
      <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '20' }]}>
          <Ionicons name="book" size={22} color={COLORS.primary} />
        </View>
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
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    // Add subtle shadow for depth
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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

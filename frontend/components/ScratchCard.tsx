import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../utils/constants';

interface ScratchCardProps {
  day: number;
  task: string;
  completed: boolean;
  scratched: boolean;
  unlocked: boolean;
  onScratch: () => void;
  onComplete: () => void;
}

export default function ScratchCard({
  day,
  task,
  completed,
  scratched,
  unlocked,
  onScratch,
  onComplete,
}: ScratchCardProps) {
  const [isRevealed, setIsRevealed] = useState(scratched);

  const handleScratch = () => {
    if (!unlocked || isRevealed) return;
    setIsRevealed(true);
    onScratch();
  };

  if (!unlocked) {
    return (
      <View style={[styles.card, styles.locked]}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.dayLabel}>Day {day}</Text>
      </View>
    );
  }

  if (!isRevealed) {
    return (
      <TouchableOpacity
        style={[styles.card, styles.scratchable]}
        onPress={handleScratch}
        activeOpacity={0.8}
      >
        <Text style={styles.scratchIcon}>✨</Text>
        <Text style={styles.dayLabel}>Day {day}</Text>
        <Text style={styles.scratchHint}>Tap to reveal</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, styles.revealed, completed && styles.completedCard]}>
      <Text style={styles.dayLabel}>Day {day}</Text>
      <Text style={styles.taskText}>{task}</Text>
      <TouchableOpacity
        style={[styles.completeBtn, completed && styles.completedBtn]}
        onPress={onComplete}
        disabled={completed}
        activeOpacity={0.7}
      >
        <Text style={[styles.completeBtnText, completed && styles.completedBtnText]}>
          {completed ? '✅ Done' : 'Mark Complete'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  locked: {
    backgroundColor: COLORS.surface,
    opacity: 0.5,
    flexDirection: 'row',
    gap: 10,
  },
  scratchable: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primary,
  },
  revealed: {
    backgroundColor: COLORS.surface,
  },
  completedCard: {
    borderColor: COLORS.success + '50',
    backgroundColor: COLORS.success + '10',
  },
  lockIcon: {
    fontSize: 20,
  },
  scratchIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  scratchHint: {
    fontSize: 12,
    color: COLORS.primaryLight,
    marginTop: 4,
  },
  taskText: {
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
    marginTop: 6,
  },
  completeBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  completedBtn: {
    backgroundColor: COLORS.success + '20',
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  completedBtnText: {
    color: COLORS.success,
  },
});

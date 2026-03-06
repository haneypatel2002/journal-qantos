import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CHALLENGE_CATEGORIES, COLORS } from '../utils/constants';

interface ChallengeCardProps {
  category: string;
  title: string;
  description: string;
  priority?: string;
  onPress: () => void;
}

export default function ChallengeCard({ category, title, description, priority, onPress }: ChallengeCardProps) {
  const cat = CHALLENGE_CATEGORIES.find((c) => c.key === category);
  const bgColor = cat?.color || COLORS.primary;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>{cat?.emoji || '✨'}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {priority === 'high' && (
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>Recommended</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.footer}>
        <Text style={styles.duration}>21 days</Text>
        <Text style={styles.startText}>Start → </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  priorityBadge: {
    backgroundColor: COLORS.accent + '30',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  startText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MoodGraph from '../../components/MoodGraph';
import { fetchMoodData } from '../../store/journalSlice';
import { MOOD_MAP, COLORS, MoodKey } from '../../utils/constants';
import type { AppDispatch, RootState } from '../../store/store';

export default function MoodGraphScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { id: userId } = useSelector((state: RootState) => state.user);
  const { moodData, entries } = useSelector((state: RootState) => state.journal);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMoodData({ userId, months: 4 }));
    }
  }, [userId, entries.length]);

  // Calculate mood distribution from entries
  const moodCounts: Record<string, number> = {};
  entries.forEach((e) => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });

  const totalEntries = entries.length;
  const sortedMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Mood Overview</Text>
          <Text style={styles.subtitle}>Your emotional patterns</Text>
        </View>

        <MoodGraph data={moodData} />

        {/* Mood Distribution */}
        <View style={styles.distributionContainer}>
          <Text style={styles.sectionTitle}>Mood Distribution</Text>
          {sortedMoods.length > 0 ? (
            sortedMoods.map(([mood, count]) => {
              const m = MOOD_MAP[mood as MoodKey];
              const percentage = totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;

              return (
                <View key={mood} style={styles.moodRow}>
                  <View style={styles.moodInfo}>
                    <Text style={styles.moodEmoji}>{m?.emoji || '?'}</Text>
                    <Text style={styles.moodLabel}>{m?.label || mood}</Text>
                  </View>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        { width: `${percentage}%`, backgroundColor: m?.graphColor || COLORS.primary },
                      ]}
                    />
                  </View>
                  <Text style={styles.moodCount}>{percentage}%</Text>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📊</Text>
              <Text style={styles.emptyText}>Start journaling to see your mood distribution</Text>
            </View>
          )}
        </View>

        {/* Monthly Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>
              {sortedMoods.length > 0 ? MOOD_MAP[sortedMoods[0][0] as MoodKey]?.emoji || '😊' : '📝'}
            </Text>
            <View style={styles.insightText}>
              <Text style={styles.insightTitle}>
                {sortedMoods.length > 0
                  ? `You feel ${sortedMoods[0][0]} most often`
                  : 'No data yet'}
              </Text>
              <Text style={styles.insightDesc}>
                {sortedMoods.length > 0
                  ? `${sortedMoods[0][0]} appeared in ${Math.round((sortedMoods[0][1] / totalEntries) * 100)}% of your entries`
                  : 'Add journal entries to see insights'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  distributionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 14,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  moodLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  moodCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    width: 40,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryContainer: {
    paddingHorizontal: 16,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  insightEmoji: {
    fontSize: 36,
    marginRight: 14,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  insightDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

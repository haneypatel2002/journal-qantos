import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import ChallengeCard from '../../components/ChallengeCard';
import ChallengeProgressGraph from '../../components/ChallengeProgressGraph';
import { fetchSuggestions, startChallenge, fetchChallenges } from '../../store/challengeSlice';
import { COLORS } from '../../utils/constants';
import type { AppDispatch, RootState } from '../../store/store';

export default function ChallengesScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id: userId } = useSelector((state: RootState) => state.user);
  const { suggestions, activeChallenge, loading } = useSelector((state: RootState) => state.challenge);

  useEffect(() => {
    if (userId) {
      dispatch(fetchSuggestions(userId));
      dispatch(fetchChallenges(userId));
    }
  }, [userId]);

  const handleStartChallenge = (category: string) => {
    if (!userId) return;

    if (activeChallenge) {
      Alert.alert(
        'Active Challenge',
        'You already have an active challenge. Complete it first!',
        [
          { text: 'View Challenge', onPress: () => router.push(`/challenge/${activeChallenge._id}`) },
          { text: 'OK', style: 'cancel' },
        ]
      );
      return;
    }

    Alert.alert(
      'Start Challenge?',
      'This will begin a 21-day challenge. Are you ready?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start!',
          onPress: () => {
            dispatch(startChallenge({ userId, category })).then((action: any) => {
              if (action.payload?._id) {
                router.push(`/challenge/${action.payload._id}`);
              }
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Challenges</Text>
          <Text style={styles.subtitle}>21-day self-improvement journeys</Text>
        </View>

        {/* Active Challenge */}
        {activeChallenge && (
          <View style={styles.activeSection}>
            <Text style={styles.sectionTitle}>Active Challenge</Text>
            <ChallengeCard
              category={activeChallenge.category}
              title={activeChallenge.title}
              description={activeChallenge.description}
              onPress={() => router.push(`/challenge/${activeChallenge._id}`)}
            />
            <ChallengeProgressGraph
              progress={activeChallenge.progress}
              completedDays={activeChallenge.completedDays}
            />
          </View>
        )}

        {/* Suggestions */}
        <View style={styles.suggestionsSection}>
          <Text style={styles.sectionTitle}>
            {activeChallenge ? 'More Challenges' : 'Suggested For You'}
          </Text>
          <Text style={styles.sectionDesc}>Based on your recent mood patterns</Text>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <ChallengeCard
                key={i}
                category={s.category}
                title={s.title}
                description={s.description}
                priority={s.priority}
                onPress={() => handleStartChallenge(s.category)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🎯</Text>
              <Text style={styles.emptyText}>
                Add journal entries to get personalized challenge suggestions
              </Text>
            </View>
          )}
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
  activeSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  suggestionsSection: {
    marginTop: 8,
  },
  sectionDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    marginHorizontal: 16,
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
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

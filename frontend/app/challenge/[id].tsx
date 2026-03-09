import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import ScratchCard from '../../components/ScratchCard';
import ChallengeProgressGraph from '../../components/ChallengeProgressGraph';
import { fetchUser } from '../../store/userSlice';
import { completeDay, fetchChallenges } from '../../store/challengeSlice';
import { CHALLENGE_CATEGORIES, COLORS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import type { AppDispatch, RootState } from '../../store/store';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { id: userId } = useSelector((state: RootState) => state.user);
  const { challenges } = useSelector((state: RootState) => state.challenge);

  const challenge = challenges.find((c) => c._id === id);

  useEffect(() => {
    if (userId && !challenge) {
      dispatch(fetchChallenges(userId));
    }
  }, [userId, id]);

  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Fix: Calculate days since start using consistent date formatting to avoid timezone offsets
  const startDate = new Date(challenge.startDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const cat = CHALLENGE_CATEGORIES.find((c) => c.key === challenge.category);

  const handleScratchAndComplete = (dayNum: number, note?: string) => {
    dispatch(completeDay({ challengeId: challenge._id, day: dayNum, note })).then((action: any) => {
      // Refresh user to update entry counts/streaks since a journal entry was created
      dispatch(fetchUser(userId!));
      if (action.payload?.completedDays === 21) {
        Alert.alert('🎉 Congratulations!', 'You completed the 21-day challenge! Amazing work!');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Challenge Header */}
        <View style={styles.challengeHeader}>
          <View style={[styles.mainIconBg, { backgroundColor: (cat?.color || COLORS.primary) + '20' }]}>
            <Ionicons name={cat?.icon as any || 'star'} size={40} color={cat?.color || COLORS.primary} />
          </View>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeDesc}>{challenge.description}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {challenge.status === 'active' ? '🟢 Active' : challenge.status === 'completed' ? '✅ Completed' : '⏹ Ended'}
            </Text>
          </View>
        </View>

        {/* Progress Graph */}
        <ChallengeProgressGraph
          progress={challenge.progress}
          completedDays={challenge.completedDays}
        />

        {/* Scratch Cards */}
        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>Daily Tasks</Text>
          {challenge.progress.map((day) => {
            const isUnlocked = day.day <= daysSinceStart + 1;
            return (
              <ScratchCard
                key={day.day}
                day={day.day}
                task={day.task}
                completed={day.completed}
                scratched={day.scratched}
                unlocked={isUnlocked}
                onScratch={() => {}}
                onComplete={() => handleScratchAndComplete(day.day)}
              />
            );
          })}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  challengeHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  mainIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  challengeDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  statusBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
});

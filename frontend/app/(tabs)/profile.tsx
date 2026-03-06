import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SubscriptionModal from '../../components/SubscriptionModal';
import { fetchUser, clearUser } from '../../store/userSlice';
import { MOOD_MAP, COLORS, MoodKey } from '../../utils/constants';
import type { AppDispatch, RootState } from '../../store/store';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id: userId, name, streakCount, entryCount, moodDistribution } = useSelector(
    (state: RootState) => state.user
  );
  const { challenges } = useSelector((state: RootState) => state.challenge);
  const [showSubscription, setShowSubscription] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId));
    }
  }, [userId]);

  const completedChallenges = challenges.filter((c) => c.status === 'completed').length;

  const handleLogout = () => {
    Alert.alert('Log Out', 'This will clear your local profile. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          dispatch(clearUser());
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name?.charAt(0)?.toUpperCase() || '?'}</Text>
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.memberSince}>Journal Qantos Member</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{streakCount}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📝</Text>
            <Text style={styles.statValue}>{entryCount}</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>{completedChallenges}</Text>
            <Text style={styles.statLabel}>Challenges</Text>
          </View>
        </View>

        {/* Mood Breakdown */}
        {moodDistribution.length > 0 && (
          <View style={styles.moodSection}>
            <Text style={styles.sectionTitle}>Your Moods</Text>
            {moodDistribution.map((item) => {
              const m = MOOD_MAP[item._id as MoodKey];
              return (
                <View key={item._id} style={styles.moodRow}>
                  <Text style={styles.moodEmoji}>{m?.emoji || '?'}</Text>
                  <Text style={styles.moodLabel}>{m?.label || item._id}</Text>
                  <Text style={styles.moodCount}>{item.count}x</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Premium */}
        <TouchableOpacity
          style={styles.premiumCard}
          onPress={() => setShowSubscription(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.premiumEmoji}>👑</Text>
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
            <Text style={styles.premiumDesc}>Unlock AI insights, unlimited challenges & more</Text>
          </View>
          <Text style={styles.premiumArrow}>→</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      <SubscriptionModal
        visible={showSubscription}
        onClose={() => setShowSubscription(false)}
      />
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
  userCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  memberSince: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  moodSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moodEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  moodLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  moodCount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: COLORS.primaryDark + '30',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.primary + '50',
    marginBottom: 16,
  },
  premiumEmoji: {
    fontSize: 30,
    marginRight: 14,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  premiumDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  premiumArrow: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '700',
  },
  logoutBtn: {
    marginHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.error + '40',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.error,
  },
});

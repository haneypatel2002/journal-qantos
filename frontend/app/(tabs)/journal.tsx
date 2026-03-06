import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CalendarSlider from '../../components/CalendarSlider';
import MoodSelector from '../../components/MoodSelector';
import JournalEditor from '../../components/JournalEditor';
import StreakCounter from '../../components/StreakCounter';
import { saveEntry, fetchEntryByDate, fetchEntries, setSelectedDate } from '../../store/journalSlice';
import { fetchUser } from '../../store/userSlice';
import { COLORS, MoodKey } from '../../utils/constants';
import type { AppDispatch, RootState } from '../../store/store';

export default function JournalScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { id: userId, name, streakCount, entryCount } = useSelector((state: RootState) => state.user);
  const { selectedDate, currentEntry, entries, saving } = useSelector((state: RootState) => state.journal);

  const [mood, setMood] = useState<MoodKey | null>(null);
  const [content, setContent] = useState('');
  const [loaded, setLoaded] = useState(false);

  const entryDates = entries.map((e) => e.date);

  useEffect(() => {
    if (userId) {
      dispatch(fetchEntries(userId));
      dispatch(fetchUser(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (userId && selectedDate) {
      dispatch(fetchEntryByDate({ userId, date: selectedDate }));
    }
  }, [userId, selectedDate]);

  useEffect(() => {
    if (currentEntry) {
      setMood(currentEntry.mood as MoodKey);
      setContent(currentEntry.content);
    } else {
      setMood(null);
      setContent('');
    }
    setLoaded(true);
  }, [currentEntry]);

  const handleDateSelect = useCallback((date: string) => {
    dispatch(setSelectedDate(date));
    setLoaded(false);
  }, [dispatch]);

  const handleSave = () => {
    if (!userId || !mood) {
      Alert.alert('Missing Info', 'Please select a mood before saving.');
      return;
    }

    dispatch(saveEntry({ userId, date: selectedDate, mood, content })).then(() => {
      dispatch(fetchUser(userId));
      Alert.alert('Saved! ✨', 'Your journal entry has been saved.');
    });
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {name} 👋</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>

        {/* Stats */}
        <StreakCounter streak={streakCount} totalEntries={entryCount} />

        {/* Calendar */}
        <CalendarSlider
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          entryDates={entryDates}
        />

        {/* Mood */}
        <View style={styles.section}>
          <MoodSelector selectedMood={mood} onMoodSelect={setMood} />
        </View>

        {/* Editor */}
        <JournalEditor
          content={content}
          onContentChange={setContent}
          placeholder={isToday ? "How's your day going?" : `What happened on ${formattedDate}?`}
        />

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={[styles.saveBtn, !mood && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving || !mood}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveBtnText}>
                {currentEntry ? '💾 Update Entry' : '✨ Save Entry'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
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
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: 16,
  },
  saveContainer: {
    paddingHorizontal: 16,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

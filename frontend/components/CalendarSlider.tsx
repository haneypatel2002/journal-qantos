import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

const { width } = Dimensions.get('window');
const DAY_WIDTH = 60;
const VISIBLE_DAYS = 30;

interface CalendarSliderProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  entryDates?: string[];
}

function getDays(count: number): { date: string; dayName: string; dayNum: number; month: string }[] {
  const days = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('en', { month: 'short' });
    days.push({ date: dateStr, dayName, dayNum, month });
  }
  return days;
}

export default function CalendarSlider({ selectedDate, onDateSelect, entryDates = [] }: CalendarSliderProps) {
  const scrollRef = useRef<ScrollView>(null);
  const days = getDays(VISIBLE_DAYS);

  useEffect(() => {
    const index = days.findIndex((d) => d.date === selectedDate);
    if (index >= 0 && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: Math.max(0, index * DAY_WIDTH - width / 2 + DAY_WIDTH / 2),
          animated: true,
        });
      }, 100);
    }
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((day) => {
          const isSelected = day.date === selectedDate;
          const hasEntry = entryDates.includes(day.date);
          const isToday = day.date === new Date().toISOString().split('T')[0];

          return (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.dayItem,
                isSelected && styles.dayItemSelected,
                isToday && !isSelected && styles.dayItemToday,
              ]}
              onPress={() => onDateSelect(day.date)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                {day.dayName}
              </Text>
              <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>
                {day.dayNum}
              </Text>
              <Text style={[styles.month, isSelected && styles.monthSelected]}>
                {day.month}
              </Text>
              {hasEntry && <View style={[styles.dot, isSelected && styles.dotSelected]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  dayItem: {
    width: DAY_WIDTH + 20,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    
  },
  dayItemSelected: {
    backgroundColor: COLORS.primary,
  },
  dayItemToday: {
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  dayName: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNameSelected: {
    color: '#FFFFFF',
  },
  dayNum: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  dayNumSelected: {
    color: '#FFFFFF',
  },
  month: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  monthSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginTop: 4,
  },
  dotSelected: {
    backgroundColor: '#FFFFFF',
  },
});

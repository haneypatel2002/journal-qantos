import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { MOOD_MAP, COLORS, MoodKey } from '../utils/constants';

const { width } = Dimensions.get('window');
const CELL_SIZE = 14;
const CELL_GAP = 3;
const WEEKS_TO_SHOW = 16;
const DAYS_IN_WEEK = 7;

interface MoodDataPoint {
  date: string;
  mood: string;
}

interface MoodGraphProps {
  data: MoodDataPoint[];
}

function getMoodColor(mood: string | undefined): string {
  if (!mood) return COLORS.surface;
  const m = MOOD_MAP[mood as MoodKey];
  return m ? m.graphColor : COLORS.surface;
}

function getWeeksData(data: MoodDataPoint[]): (MoodDataPoint | null)[][] {
  const moodMap = new Map(data.map((d) => [d.date, d]));
  const weeks: (MoodDataPoint | null)[][] = [];
  const today = new Date();

  // Start from WEEKS_TO_SHOW weeks ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (WEEKS_TO_SHOW * 7 - 1));

  // Align to Sunday
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  let currentWeek: (MoodDataPoint | null)[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const entry = moodMap.get(dateStr) || null;
    currentWeek.push(entry);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

export default function MoodGraph({ data }: MoodGraphProps) {
  const weeks = getWeeksData(data);
  const svgWidth = weeks.length * (CELL_SIZE + CELL_GAP) + 30;
  const svgHeight = DAYS_IN_WEEK * (CELL_SIZE + CELL_GAP) + 20;
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Graph</Text>
      <View style={styles.graphContainer}>
        <Svg width={Math.min(svgWidth, width - 40)} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Day labels */}
          {dayLabels.map((label, i) =>
            label ? (
              <SvgText
                key={`label-${i}`}
                x={0}
                y={i * (CELL_SIZE + CELL_GAP) + CELL_SIZE + 10}
                fontSize={9}
                fill={COLORS.textMuted}
              >
                {label}
              </SvgText>
            ) : null
          )}

          {/* Grid cells */}
          {weeks.map((week, weekIdx) =>
            week.map((day, dayIdx) => (
              <Rect
                key={`${weekIdx}-${dayIdx}`}
                x={weekIdx * (CELL_SIZE + CELL_GAP) + 28}
                y={dayIdx * (CELL_SIZE + CELL_GAP) + 5}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={3}
                ry={3}
                fill={day ? getMoodColor(day.mood) : COLORS.surface}
                opacity={day ? 0.9 : 0.3}
              />
            ))
          )}
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {Object.values(MOOD_MAP).map((mood) => (
          <View key={mood.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: mood.graphColor }]} />
            <Text style={styles.legendLabel}>{mood.emoji}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  graphContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 14,
  },
});

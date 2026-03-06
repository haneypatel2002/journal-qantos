import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { COLORS } from '../utils/constants';

interface DayProgress {
  day: number;
  completed: boolean;
}

interface ChallengeProgressGraphProps {
  progress: DayProgress[];
  completedDays: number;
}

const CELL_SIZE = 30;
const CELL_GAP = 4;
const COLS = 7;
const ROWS = 3;

export default function ChallengeProgressGraph({ progress, completedDays }: ChallengeProgressGraphProps) {
  const svgWidth = COLS * (CELL_SIZE + CELL_GAP);
  const svgHeight = ROWS * (CELL_SIZE + CELL_GAP);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenge Progress</Text>
        <Text style={styles.count}>
          {completedDays}/21 <Text style={styles.countLabel}>days</Text>
        </Text>
      </View>
      <View style={styles.graphContainer}>
        <Svg width={svgWidth} height={svgHeight}>
          {progress.map((day, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <Rect
                key={i}
                x={col * (CELL_SIZE + CELL_GAP)}
                y={row * (CELL_SIZE + CELL_GAP)}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={6}
                ry={6}
                fill={day.completed ? COLORS.success : COLORS.surface}
                opacity={day.completed ? 0.9 : 0.4}
              />
            );
          })}
        </Svg>
      </View>
      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${(completedDays / 21) * 100}%` }]} />
      </View>
      <Text style={styles.percentage}>{Math.round((completedDays / 21) * 100)}% Complete</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  count: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.success,
  },
  countLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  graphContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  percentage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
});

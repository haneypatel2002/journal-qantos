export const MOODS = [
  { key: 'happy', label: 'Happy', emoji: '😊', color: '#FFD93D', graphColor: '#4CAF50' },
  { key: 'calm', label: 'Calm', emoji: '😌', color: '#74C0FC', graphColor: '#2196F3' },
  { key: 'neutral', label: 'Neutral', emoji: '😐', color: '#B8C4CE', graphColor: '#9E9E9E' },
  { key: 'sad', label: 'Sad', emoji: '😢', color: '#A78BFA', graphColor: '#7C4DFF' },
  { key: 'angry', label: 'Angry', emoji: '😡', color: '#FF6B6B', graphColor: '#F44336' },
  { key: 'anxious', label: 'Anxious', emoji: '😰', color: '#FDAA48', graphColor: '#FF9800' },
] as const;

export type MoodKey = (typeof MOODS)[number]['key'];

export const MOOD_MAP = Object.fromEntries(
  MOODS.map((m) => [m.key, m])
) as Record<MoodKey, (typeof MOODS)[number]>;

export const CHALLENGE_CATEGORIES = [
  { key: 'feel_better', label: 'Feel Better', emoji: '💛', color: '#FFD93D', gradient: ['#FFE066', '#FFD93D'] },
  { key: 'focus', label: 'Focus', emoji: '🎯', color: '#74C0FC', gradient: ['#89D4F5', '#74C0FC'] },
  { key: 'self_improvement', label: 'Self Improvement', emoji: '🚀', color: '#A78BFA', gradient: ['#C4B5FD', '#A78BFA'] },
  { key: 'meditation', label: 'Meditation', emoji: '🧘', color: '#6EE7B7', gradient: ['#86EFAC', '#6EE7B7'] },
  { key: 'productivity', label: 'Productivity', emoji: '⚡', color: '#FDAA48', gradient: ['#FCD34D', '#FDAA48'] },
] as const;

export const COLORS = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#5A4BD1',
  secondary: '#00CEC9',
  background: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceLight: '#252540',
  card: '#20203A',
  text: '#FFFFFF',
  textSecondary: '#8B8BA7',
  textMuted: '#5A5A7A',
  accent: '#FF6B9D',
  success: '#00E676',
  warning: '#FFD93D',
  error: '#FF5252',
  border: '#2D2D4A',
};

export const FONTS = {
  regular: 'SpaceMono',
};

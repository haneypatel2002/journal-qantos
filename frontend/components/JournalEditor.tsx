import React, { useMemo } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface JournalEditorProps {
  content: string;
  onContentChange: (text: string) => void;
  placeholder?: string;
}

export default function JournalEditor({ content, onContentChange, placeholder }: JournalEditorProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.editor}
        multiline
        placeholder={placeholder || "Write about your day..."}
        placeholderTextColor={colors.textMuted}
        value={content}
        onChangeText={onContentChange}
        textAlignVertical="top"
        scrollEnabled
      />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    marginBottom: 16,
  },
  editor: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 180,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

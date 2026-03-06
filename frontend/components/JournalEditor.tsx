import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface JournalEditorProps {
  content: string;
  onContentChange: (text: string) => void;
  placeholder?: string;
}

export default function JournalEditor({ content, onContentChange, placeholder }: JournalEditorProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.editor}
        multiline
        placeholder={placeholder || "Write about your day..."}
        placeholderTextColor={COLORS.textMuted}
        value={content}
        onChangeText={onContentChange}
        textAlignVertical="top"
        scrollEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    marginBottom: 16,
  },
  editor: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 180,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

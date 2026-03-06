import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { createUser, loadStoredUser } from '../store/userSlice';
import { COLORS } from '../utils/constants';
import type { AppDispatch, RootState } from '../store/store';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, isOnboarded, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(loadStoredUser());
  }, []);

  useEffect(() => {
    if (isOnboarded) {
      router.replace('/(tabs)/journal');
    }
  }, [isOnboarded]);

  const handleContinue = () => {
    if (name.trim().length < 2) return;
    dispatch(createUser(name.trim()));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>📓</Text>
          <Text style={styles.appName}>Journal Qantos</Text>
          <Text style={styles.tagline}>Your AI-Powered Journaling Companion</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.welcomeText}>What should we call you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            maxLength={30}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity
            style={[styles.button, name.trim().length < 2 && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading || name.trim().length < 2}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Start Journaling →</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📝</Text>
            <Text style={styles.featureText}>Daily Journal</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📊</Text>
            <Text style={styles.featureText}>Mood Tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🎯</Text>
            <Text style={styles.featureText}>21-Day Challenges</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  form: {
    marginBottom: 48,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    fontSize: 17,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});

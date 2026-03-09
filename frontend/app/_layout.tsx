import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from '../store/store';
import { useTheme } from '../hooks/useTheme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const isOnboarded = useSelector((state: RootState) => state.user.isOnboarded);
  const router = useRouter();
  const segments = useSegments();

  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (isOnboarded) {
      const inAuthGroup = segments[0] === '(tabs)';
      if (!inAuthGroup) {
        router.replace('/(tabs)/journal');
      }
    }
  }, [isOnboarded]);

  return (
    <>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="challenge/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#0F0F1A' },
            headerTintColor: '#FFFFFF',
            headerTitle: 'Challenge',
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootLayoutNav />
      </Provider>
    </SafeAreaProvider>
  );
}

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
        screenOptions={{ headerShown: false }}
        initialRouteName="GetStarted"
      >
        <Stack.Screen 
          name="GetStarted" 
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }} 
          initialParams={{ initial: true }}
        />
        <Stack.Screen 
          name="Login" 
          options={{ 
            headerShown: false,
            gestureEnabled: true,
          }} 
        />
        <Stack.Screen 
          name="Register" 
          options={{ 
            headerShown: false,
            gestureEnabled: true,
          }} 
        />
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            gestureEnabled: false,
            // Prevent going back to login/register
            gestureDirection: 'horizontal',
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

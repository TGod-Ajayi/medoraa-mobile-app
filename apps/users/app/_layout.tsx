import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
  } from '@react-navigation/native';
  import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  } from '@expo-google-fonts/poppins';
  import { useColorScheme } from '@repo/ui/hooks';
  import { useFonts } from 'expo-font';
  import { Stack } from 'expo-router';
  import { StatusBar } from 'expo-status-bar';
  import { useEffect } from 'react';
  import { Text, TextInput } from 'react-native';
  
  export const unstable_settings = {
    anchor: '(tabs)',
  };
  
  const FONT_REGULAR = 'Poppins_400Regular';
  
  const AppDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#0F172A',
      card: '#0F172A',
    },
  };
  
  export default function RootLayout() {
    const colorScheme = useColorScheme();
  
    const [fontsLoaded] = useFonts({
      Poppins_400Regular,
      Poppins_500Medium,
      Poppins_600SemiBold,
      Poppins_700Bold,
    });
  
    useEffect(() => {
      if (!fontsLoaded) return;
      const defaultStyle = { fontFamily: FONT_REGULAR };
      (Text as unknown as { defaultProps?: { style?: object } }).defaultProps = {
        ...(Text as unknown as { defaultProps?: object }).defaultProps,
        style: defaultStyle,
      };
      (TextInput as unknown as { defaultProps?: { style?: object } }).defaultProps = {
        ...(TextInput as unknown as { defaultProps?: object }).defaultProps,
        style: defaultStyle,
      };
    }, [fontsLoaded]);
  
    if (!fontsLoaded) {
      return null;
    }
  
    return (
      <ThemeProvider value={colorScheme === 'dark' ? AppDarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='(auth)' options={{ headerShown: false }} />
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
        <StatusBar style='auto' />
      </ThemeProvider>
    );
  }
import { ApolloProvider } from '@apollo/client/react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { gqlClientConnect } from '@repo/ui/graphql';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * Root stack. On Expo Go, `react-native-screens` JS must match SDK bundled native (~4.16);
 * newer JS (e.g. 4.19) + older native → Fabric boolean/string crash on `<Stack>`.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ApolloProvider client={gqlClientConnect()}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <ThemeProvider
              value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }} />
              <StatusBar style='auto' />
            </ThemeProvider>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
}

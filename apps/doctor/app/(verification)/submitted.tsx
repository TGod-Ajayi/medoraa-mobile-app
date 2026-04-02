import { useTheme } from '@/config/theme';
import { useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubmittedScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  const confettiColors = useMemo(
    () => [
      theme.accent,
      theme.accentFocus,
      '#FDE047',
      '#A78BFA',
      '#FB7185',
      '#38BDF8',
    ],
    [theme.accent, theme.accentFocus]
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <View style={[styles.logo, { backgroundColor: theme.accent }]}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text
            style={[
              styles.title,
              { color: colorScheme === 'dark' ? '#ffffff' : '#0F172A' },
            ]}>
            Your submission is under review
          </Text>
          <Text style={[styles.sub, { color: '#64748B' }]}>
            Your personal information is being reviewed, this usually takes between
            24 - 36 hours
          </Text>
        </View>
      </SafeAreaView>
      <View style={styles.confettiLayer} pointerEvents="none">
        <ConfettiCannon
          count={180}
          origin={{ x: width / 2, y: -16 }}
          fadeOut
          fallSpeed={3500}
          explosionSpeed={400}
          colors={confettiColors}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    pointerEvents: 'none',
  },
  safe: {
    flex: 1,
    zIndex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 40,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
});

import { Button } from '@/components';
import { checkMark } from '@/config/svg';
import { useTheme } from '@/config/theme';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

export default function AccountCreatedScreen() {
  const theme = useTheme();
  const router = useRouter();
  const outerPulse = useSharedValue(0);
  const middlePulse = useSharedValue(0);

  useEffect(() => {
    outerPulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
    middlePulse.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
  }, [outerPulse, middlePulse]);

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + outerPulse.value * 0.05 }],
    opacity: 0.55 + outerPulse.value * 0.45,
  }));

  const middleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + middlePulse.value * 0.06 }],
    opacity: 0.65 + middlePulse.value * 0.35,
  }));

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <View style={styles.rippleWrap}>
            <Animated.View
              style={[styles.outerCircle, { backgroundColor: '#22C55E0D' }, outerStyle]}
            />
            <Animated.View
              style={[styles.middleCircle, { backgroundColor: '#22C55E1A' }, middleStyle]}
            />
            <View style={[styles.iconCircle, { backgroundColor: "#02BC7D"}]}>
              <SvgXml xml={checkMark} width={38} height={38} />
            </View>
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Account created!</Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>
          You have successfully created your doctor account on Medoraa. Now, complete your KYC to to begin consultation.
          </Text>
        </View>
        <Button
        style={{borderRadius: 30, backgroundColor: "#20BEB8"}}
          theme={theme}
          label="Proceed to KYC"
          onPress={() => router.replace('/(verification)')}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  rippleWrap: {
    width: 210,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  outerCircle: {
    position: 'absolute',
    width: 156,
    height: 156,
    borderRadius: 78,
  },
  middleCircle: {
    position: 'absolute',
    width: 117,
    height: 117,
    borderRadius: 58.5,
  },
  iconCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    justifyContent: 'center',
    alignItems: 'center',
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
});

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

/**
 * Waving hand — uses RN `Animated` only so `@repo/ui/components` does not force
 * `react-native-reanimated` / Worklets resolution (avoids JS vs native Worklets mismatch in monorepo).
 */
export function HelloWave() {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]),
      { iterations: 4 },
    );
    loop.start();
    return () => loop.stop();
  }, [rotate]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '25deg'],
  });

  return (
    <Animated.Text style={[styles.text, { transform: [{ rotate: spin }] }]}>👋</Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});

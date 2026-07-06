import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type Props = {
  currentStep: number;
  totalSteps?: number;
};

const FILL_DURATION = 450;
const FILL_EASING = Easing.out(Easing.cubic);

function Segment({ active }: { active: boolean }) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: FILL_DURATION,
      easing: FILL_EASING,
    });
  }, [active]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

export function AuthStepper({ currentStep, totalSteps = 3 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <Segment key={i} active={i + 1 <= currentStep} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#CBD5E1',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#20BEB8',
  },
});

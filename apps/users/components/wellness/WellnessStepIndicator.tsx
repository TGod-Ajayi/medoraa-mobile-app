import { useState } from 'react';
import StepIndicator from 'react-native-step-indicator';
import { StyleSheet, View } from 'react-native';

import type { WellnessTheme } from './constants';
import { TOTAL_STEPS } from './constants';

type Props = {
  currentStep: number;
  colors: WellnessTheme;
};

const SEGMENT_GAP = 10;
const BAR_HEIGHT = 6;

export function WellnessStepIndicator({ currentStep, colors }: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const segmentSize =
    trackWidth > 0
      ? (trackWidth - SEGMENT_GAP * (TOTAL_STEPS - 1)) / TOTAL_STEPS
      : 72;

  const stepIndicatorStyles = {
    stepStrokeWidth: 0,
    currentStepStrokeWidth: 0,
    separatorStrokeWidth: SEGMENT_GAP,
    separatorFinishedColor: colors.background,
    separatorUnFinishedColor: colors.background,
    stepIndicatorFinishedColor: colors.accent,
    stepIndicatorUnFinishedColor: colors.stepTrack,
    stepIndicatorCurrentColor: colors.accent,
    labelSize: 0,
    labelColor: 'transparent',
    currentStepLabelColor: 'transparent',
  };

  return (
    <View
      style={styles.wrap}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}>
      <View style={styles.clip}>
        <StepIndicator
          customStyles={{
            ...stepIndicatorStyles,
            stepIndicatorSize: segmentSize,
            currentStepIndicatorSize: segmentSize,
          }}
          currentPosition={currentStep}
          stepCount={TOTAL_STEPS}
          renderStepIndicator={() => null}
          renderLabel={() => null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  clip: {
    height: BAR_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'center',
  },
});

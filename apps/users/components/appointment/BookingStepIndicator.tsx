import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

export type BookingStep = 'schedule' | 'patient' | 'confirm';

const STEPS: { id: BookingStep; label: string }[] = [
  { id: 'schedule', label: 'Schedule' },
  { id: 'patient', label: 'Patient' },
  { id: 'confirm', label: 'Confirm' },
];

type Props = {
  current: BookingStep;
};

export function BookingStepIndicator({ current }: Props) {
  const theme = useTheme();
  const currentIndex = STEPS.findIndex((step) => step.id === current);

  return (
    <View style={styles.row} accessibilityRole='progressbar'>
      {STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        const connectorDone = index < currentIndex;

        return (
          <View key={step.id} style={styles.stepWrap}>
            <View style={styles.stepContent}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: done || active ? theme.accent : theme.surfaceMuted,
                    borderColor: done || active ? theme.accent : theme.divider,
                  },
                ]}>
                <Text
                  style={[
                    styles.dotText,
                    {
                      color: done || active ? '#FFFFFF' : theme.textMuted,
                      fontFamily: fonts.semiBold,
                    },
                  ]}>
                  {index + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: active ? theme.textPrimary : theme.textSecondary,
                    fontFamily: active ? fonts.semiBold : fonts.regular,
                  },
                ]}>
                {step.label}
              </Text>
            </View>
            {index < STEPS.length - 1 ? (
              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor: connectorDone ? theme.accent : theme.divider,
                  },
                ]}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepContent: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  dotText: {
    fontSize: 13,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
  connector: {
    height: 2,
    flex: 1,
    marginTop: 13,
    marginHorizontal: 4,
    borderRadius: 1,
  },
});

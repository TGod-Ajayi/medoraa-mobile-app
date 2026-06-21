import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { fonts } from '../../config/fonts';
import type { WellnessTheme } from './constants';

type BackButtonProps = {
  colors: WellnessTheme;
  onPress: () => void;
};

export function BackButton({ colors, onPress }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.backBtn, { backgroundColor: colors.card }]}
      accessibilityRole="button"
      accessibilityLabel="Go back">
      <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
    </Pressable>
  );
}

type ContinueButtonProps = {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  colors: WellnessTheme;
};

export function ContinueButton({
  label = 'Continue',
  onPress,
  disabled = false,
  colors,
}: ContinueButtonProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.continueBtn,
        {
          backgroundColor: colors.accent,
          opacity: disabled ? 0.45 : pressed ? 0.92 : 1,
        },
      ]}>
      <Text style={[styles.continueLabel, { fontFamily: fonts.semiBold }]}>{label}</Text>
    </Pressable>
  );
}

type StepHeaderProps = {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  colors: WellnessTheme;
};

export function StepHeader({ step, totalSteps, title, subtitle, colors }: StepHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={[styles.stepLabel, { fontFamily: fonts.medium, color: colors.accent }]}>
        Step {step} of {totalSteps}
      </Text>
      <Text style={[styles.title, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
        {subtitle}
      </Text>
    </View>
  );
}

type SelectableGoalCardProps = {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  colors: WellnessTheme;
};

export function SelectableGoalCard({
  icon,
  title,
  description,
  selected,
  onPress,
  colors,
}: SelectableGoalCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.goalCard,
        {
          backgroundColor: colors.card,
          borderColor: selected ? colors.cardSelectedBorder : colors.cardBorder,
        },
      ]}>
      <View style={styles.cardIcon}>
        <SvgXml xml={icon} width={24} height={24} />
      </View>
      <Text style={[styles.goalTitle, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.goalDescription, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
        {description}
      </Text>
    </Pressable>
  );
}

type SelectableChipCardProps = {
  icon: string;
  title: string;
  selected: boolean;
  onPress: () => void;
  colors: WellnessTheme;
};

export function SelectableChipCard({ icon, title, selected, onPress, colors }: SelectableChipCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chipCard,
        {
          backgroundColor: colors.card,
          borderColor: selected ? colors.cardSelectedBorder : colors.cardBorder,
        },
      ]}>
      <View style={styles.chipIcon}>
        <SvgXml xml={icon} width={22} height={22} />
      </View>
      <Text
        style={[styles.chipTitle, { fontFamily: fonts.medium, color: colors.textPrimary }]}
        numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}

type WeightControlProps = {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  colors: WellnessTheme;
};

export function WeightControl({ label, value, onDecrease, onIncrease, colors }: WeightControlProps) {
  return (
    <View style={[styles.weightCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Text style={[styles.weightLabel, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
        {label}
      </Text>
      <View style={styles.weightRow}>
        <Pressable onPress={onDecrease} style={[styles.weightBtn, { backgroundColor: colors.accent }]}>
          <Text style={[styles.weightBtnText, { fontFamily: fonts.semiBold }]}>−</Text>
        </Pressable>
        <View style={styles.weightValueWrap}>
          <Text style={[styles.weightValue, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
            {value}
          </Text>
          <Text style={[styles.weightUnit, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
            kg
          </Text>
        </View>
        <Pressable onPress={onIncrease} style={[styles.weightBtn, { backgroundColor: colors.accent }]}>
          <Text style={[styles.weightBtnText, { fontFamily: fonts.semiBold }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  header: {
    marginBottom: 24,
  },
  stepLabel: {
    fontSize: 13,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  continueBtn: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  goalCard: {
    width: '48%',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    minHeight: 132,
  },
  cardIcon: {
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 12,
    lineHeight: 17,
  },
  chipCard: {
    width: '48%',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chipIcon: {
    width: 22,
    height: 22,
  },
  chipTitle: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
  weightCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  weightLabel: {
    fontSize: 13,
    marginBottom: 14,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weightBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightBtnText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 24,
  },
  weightValueWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  weightValue: {
    fontSize: 40,
    lineHeight: 44,
  },
  weightUnit: {
    fontSize: 16,
    marginBottom: 6,
  },
});

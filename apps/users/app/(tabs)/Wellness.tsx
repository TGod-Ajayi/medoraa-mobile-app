import { useUser } from '@repo/ui/graphql';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BackButton,
  ContinueButton,
  SelectableChipCard,
  SelectableGoalCard,
  StepHeader,
  WeightControl,
} from '../../components/wellness/WellnessUi';
import { WellnessDashboard } from '../../components/wellness/WellnessDashboard';
import { WellnessStepIndicator } from '../../components/wellness/WellnessStepIndicator';
import {
  getWellnessTheme,
  TOTAL_STEPS,
  WELLNESS_GOALS,
  WELLNESS_HABITS,
  WELLNESS_INTERESTS,
} from '../../components/wellness/constants';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

const medorraLogo = require('../../assets/images/medorra.png');
const WELLNESS_DASHBOARD_KEY = 'wellness_dashboard_entered';

function toggleSelection<T extends string>(selected: T[], id: T): T[] {
  return selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
}

function estimateWeeks(weightDelta: number) {
  const minWeeks = Math.max(8, Math.round(weightDelta * 1.2));
  const maxWeeks = Math.max(minWeeks + 4, Math.round(weightDelta * 1.6));
  return `${minWeeks}-${maxWeeks}`;
}

export default function WellnessScreen() {
  const theme = useTheme();
  const colors = getWellnessTheme(theme);
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [hasEnteredDashboard, setHasEnteredDashboard] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['lose-weight', 'get-fit']);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [currentWeight, setCurrentWeight] = useState(80);
  const [targetWeight, setTargetWeight] = useState(70);

  const firstName = user?.firstName?.trim() || 'there';
  const weightDelta = Math.max(0, currentWeight - targetWeight);
  const showBack = completed || step > 0;

  const canContinue = useMemo(() => {
    if (step === 0) return selectedGoals.length > 0;
    if (step === 1) return currentWeight > 0 && targetWeight > 0 && currentWeight !== targetWeight;
    if (step === 2) return selectedHabits.length > 0;
    if (step === 3) return selectedInterests.length > 0;
    return true;
  }, [step, selectedGoals, selectedHabits, selectedInterests, currentWeight, targetWeight]);

  useEffect(() => {
    SecureStore.getItemAsync(WELLNESS_DASHBOARD_KEY).then((value) => {
      if (value === 'true') {
        setHasEnteredDashboard(true);
      }
    });
  }, []);

  const handleEnterMedoraa = async () => {
    await SecureStore.setItemAsync(WELLNESS_DASHBOARD_KEY, 'true');
    setHasEnteredDashboard(true);
    setCompleted(false);
  };

  const handleContinue = () => {
    setDirection('forward');
    if (step < TOTAL_STEPS - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    setCompleted(true);
  };

  const handleBack = () => {
    setDirection('back');
    if (completed) {
      setCompleted(false);
      setStep(TOTAL_STEPS - 1);
      return;
    }
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const stepEntering =
    direction === 'forward'
      ? SlideInRight.duration(320)
      : SlideInLeft.duration(320);
  const stepExiting =
    direction === 'forward'
      ? SlideOutLeft.duration(240)
      : SlideOutRight.duration(240);

  if (hasEnteredDashboard) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.container}>
          <WellnessDashboard
            colors={colors}
            selectedHabits={selectedHabits}
            weightDelta={weightDelta}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (completed) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.container}>
          <BackButton colors={colors} onPress={handleBack} />
          <Animated.View entering={SlideInRight.duration(350)} style={styles.completeWrap}>
            <Image source={medorraLogo} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.completeTitle, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
              You&apos;re ready,{' '}
              <Text style={{ color: colors.accent }}>{firstName}!</Text>
            </Text>
            <Text style={[styles.completeSubtitle, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
              Your personalized wellness plan is ready. Your journey to a healthier, stronger you starts now.
            </Text>

            <View style={styles.statsRow}>
              <View style={[styles.statCard, { borderColor: colors.cardBorder, backgroundColor: colors.card }]}>
                <Text style={[styles.statValue, { fontFamily: fonts.semiBold, color: colors.accent }]}>
                  {weightDelta > 0 ? `${weightDelta}kg` : `${currentWeight}kg`}
                </Text>
                <Text style={[styles.statLabel, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
                  Goal
                </Text>
              </View>
              <View style={[styles.statCard, { borderColor: colors.cardBorder, backgroundColor: colors.card }]}>
                <Text style={[styles.statValue, { fontFamily: fonts.semiBold, color: colors.accent }]}>
                  {selectedHabits.length}
                </Text>
                <Text style={[styles.statLabel, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
                  Habits
                </Text>
              </View>
              <View style={[styles.statCard, { borderColor: colors.cardBorder, backgroundColor: colors.card }]}>
                <Text style={[styles.statValue, { fontFamily: fonts.semiBold, color: colors.accent }]}>
                  {selectedGoals.length}
                </Text>
                <Text style={[styles.statLabel, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
                  Goals
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleEnterMedoraa}
              style={({ pressed }) => [
                styles.enterBtn,
                {
                  backgroundColor: colors.accent,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}>
              <Text style={[styles.enterLabel, { fontFamily: fonts.semiBold }]}>Enter Medoraa</Text>
              <Text style={styles.enterArrow}>→</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.container}>
        {showBack ? <BackButton colors={colors} onPress={handleBack} /> : null}
        <WellnessStepIndicator currentStep={step} colors={colors} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Animated.View key={step} entering={stepEntering} exiting={stepExiting}>
            {step === 0 ? (
              <>
                <StepHeader
                  step={1}
                  totalSteps={TOTAL_STEPS}
                  title="What's your main goal?"
                  subtitle="Pick all that apply to you."
                  colors={colors}
                />
                <View style={styles.grid}>
                  {WELLNESS_GOALS.map((goal) => (
                    <SelectableGoalCard
                      key={goal.id}
                      icon={goal.icon}
                      title={goal.title}
                      description={goal.description}
                      selected={selectedGoals.includes(goal.id)}
                      onPress={() => setSelectedGoals((prev) => toggleSelection(prev, goal.id))}
                      colors={colors}
                    />
                  ))}
                </View>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <StepHeader
                  step={2}
                  totalSteps={TOTAL_STEPS}
                  title="Your weight journey"
                  subtitle="Set your starting point and goal."
                  colors={colors}
                />
                <WeightControl
                  label="Current Weight (kg)"
                  value={currentWeight}
                  onDecrease={() => setCurrentWeight((prev) => Math.max(40, prev - 1))}
                  onIncrease={() => setCurrentWeight((prev) => Math.min(200, prev + 1))}
                  colors={colors}
                />
                <WeightControl
                  label="Target Weight (kg)"
                  value={targetWeight}
                  onDecrease={() => setTargetWeight((prev) => Math.max(40, prev - 1))}
                  onIncrease={() => setTargetWeight((prev) => Math.min(200, prev + 1))}
                  colors={colors}
                />
                {weightDelta > 0 ? (
                  <View
                    style={[
                      styles.summaryCard,
                      {
                        borderColor: colors.summaryBorder,
                        backgroundColor: colors.summaryBg,
                      },
                    ]}>
                    <Text style={styles.summaryEmoji}>🎯</Text>
                    <View style={styles.summaryCopy}>
                      <Text
                        style={[
                          styles.summaryTitle,
                          { fontFamily: fonts.semiBold, color: colors.textPrimary },
                        ]}>
                        Lose {weightDelta}kg
                      </Text>
                      <Text
                        style={[
                          styles.summarySubtitle,
                          { fontFamily: fonts.regular, color: colors.textSecondary },
                        ]}>
                        Estimated {estimateWeeks(weightDelta)} weeks with Medoraa
                      </Text>
                    </View>
                  </View>
                ) : null}
              </>
            ) : null}

            {step === 2 ? (
              <>
                <StepHeader
                  step={3}
                  totalSteps={TOTAL_STEPS}
                  title="Which habits matter most?"
                  subtitle="We'll help you build them daily."
                  colors={colors}
                />
                <View style={styles.grid}>
                  {WELLNESS_HABITS.map((habit) => (
                    <SelectableChipCard
                      key={habit.id}
                      icon={habit.icon}
                      title={habit.title}
                      selected={selectedHabits.includes(habit.id)}
                      onPress={() => setSelectedHabits((prev) => toggleSelection(prev, habit.id))}
                      colors={colors}
                    />
                  ))}
                </View>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <StepHeader
                  step={4}
                  totalSteps={TOTAL_STEPS}
                  title="What interests you most?"
                  subtitle="Personalize your feed and coaching."
                  colors={colors}
                />
                <View style={styles.interestGrid}>
                  {WELLNESS_INTERESTS.map((interest) => (
                    <SelectableChipCard
                      key={interest.id}
                      icon={interest.icon}
                      title={interest.title}
                      selected={selectedInterests.includes(interest.id)}
                      onPress={() => setSelectedInterests((prev) => toggleSelection(prev, interest.id))}
                      colors={colors}
                    />
                  ))}
                </View>
              </>
            ) : null}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <ContinueButton onPress={handleContinue} disabled={!canContinue} colors={colors} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  summaryEmoji: {
    fontSize: 24,
  },
  summaryCopy: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  completeWrap: {
    flex: 1,
    paddingTop: 24,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 48,
    marginBottom: 36,
  },
  completeTitle: {
    fontSize: 30,
    lineHeight: 38,
    textAlign: 'center',
    marginBottom: 12,
  },
  completeSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  enterBtn: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  enterLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  enterArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: -1,
  },
});

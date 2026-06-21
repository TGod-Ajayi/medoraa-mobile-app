import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';

import { fonts } from '../../config/fonts';
import type { WellnessTheme } from './constants';
import { WELLNESS_HABITS } from './constants';

const PROGRESS_ORANGE = '#F59E0B';
const PROGRESS_PURPLE = '#A855F7';
const AI_PURPLE = '#7C3AED';
const CHALLENGE_GOLD = '#D97706';

const morningBurn = require('../../assets/images/doctorone.png');
const cardioWorkout = require('../../assets/images/doctortwo.png');
const lunchMeal = require('../../assets/images/cat2.png');

type DashboardGoal = {
  id: string;
  label: string;
  done: boolean;
};

type QuickAction = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: number;
};

type Props = {
  colors: WellnessTheme;
  selectedHabits: string[];
  weightDelta: number;
};

function getDayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

function buildGoals(selectedHabitIds: string[]): DashboardGoal[] {
  const defaults: DashboardGoal[] = [
    { id: 'water', label: 'Drink Water (5/8 cups)', done: true },
    { id: 'steps', label: 'Walk 7,000 Steps', done: true },
    { id: 'exercise', label: '15-min Workout', done: false },
    { id: 'eating', label: 'Healthy Lunch', done: false },
  ];

  if (selectedHabitIds.length === 0) {
    return defaults;
  }

  const habitMap = new Map(WELLNESS_HABITS.map((habit) => [habit.id, habit.title]));
  return selectedHabitIds.slice(0, 4).map((id, index) => ({
    id,
    label: habitMap.get(id) ?? 'Daily habit',
    done: index < 2,
  }));
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'morning-burn',
    title: 'Morning Burn',
    subtitle: '20 min · 180 cal',
    cta: 'Join Challenge',
    image: morningBurn,
  },
  {
    id: 'cardio',
    title: 'Hypertension-safe Cardio',
    subtitle: '15 min · 80 cal',
    cta: 'Start Workout',
    image: cardioWorkout,
  },
  {
    id: 'lunch',
    title: 'Lunch Plan',
    subtitle: '450 cal · High protein',
    cta: 'View Meal',
    image: lunchMeal,
  },
];

function ProgressRings() {
  const size = 112;
  const stroke = 9;
  const center = size / 2;

  const rings = [
    { radius: 46, progress: 0.72, color: PROGRESS_ORANGE },
    { radius: 36, progress: 0.58, color: '#2DC2B1' },
    { radius: 26, progress: 0.81, color: PROGRESS_PURPLE },
  ];

  return (
    <View style={styles.ringsWrap}>
      <Svg width={size} height={size}>
        {rings.map((ring) => (
          <Circle
            key={ring.radius}
            cx={center}
            cy={center}
            r={ring.radius}
            stroke="rgba(148,163,184,0.2)"
            strokeWidth={stroke}
            fill="none"
          />
        ))}
        {rings.map((ring) => {
          const circumference = 2 * Math.PI * ring.radius;
          const dash = circumference * ring.progress;

          return (
            <Circle
              key={`${ring.radius}-progress`}
              cx={center}
              cy={center}
              r={ring.radius}
              stroke={ring.color}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeLinecap="round"
              rotation="-90"
              origin={`${center}, ${center}`}
            />
          );
        })}
      </Svg>
      <View style={styles.ringsCenter}>
        <Ionicons name="flash" size={22} color="#FFFFFF" />
      </View>
    </View>
  );
}

function WeightChart({ accent }: { accent: string }) {
  const points = '4,42 28,36 52,30 76,24 100,18 124,14 148,10';
  const fillPoints = `${points} 148,56 4,56`;

  return (
    <Svg width="100%" height={64} viewBox="0 0 152 56">
      <Path d={`M ${fillPoints} Z`} fill={`${accent}33`} />
      <Polyline points={points} fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function WellnessDashboard({ colors, selectedHabits, weightDelta }: Props) {
  const goals = buildGoals(selectedHabits);
  const dayLabel = getDayLabel();
  const weightChange = weightDelta > 0 ? `-${Math.min(weightDelta, 1.8).toFixed(1)} kg` : '-1.8 kg';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.screenTitle, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
        Your Wellness Dashboard
      </Text>

      <View style={[styles.streakCard, { borderColor: colors.accent, backgroundColor: colors.card }]}>
        <View style={{display:"flex", flexDirection:"row", alignItems:"center", gap:4}}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <Text style={[styles.streakTitle, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
          21 Day Streak
        </Text>
        </View>
        <Text style={[styles.streakScore, { fontFamily: fonts.medium, color: colors.accent }]}>
          Health Score: 84%
        </Text>
        <Text style={[styles.streakSubtitle, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
          You&apos;re doing better than last week.
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
          Today&apos;s Goals
        </Text>
        <Text style={[styles.sectionMeta, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
          {dayLabel}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        {goals.map((goal, index) => (
          <View
            key={goal.id}
            style={[styles.goalRow, index < goals.length - 1 && { borderBottomColor: colors.cardBorder, borderBottomWidth: StyleSheet.hairlineWidth }]}>
            <View
              style={[
                styles.goalCheck,
                goal.done
                  ? { backgroundColor: colors.accent, borderColor: colors.accent }
                  : { borderColor: colors.textMuted },
              ]}>
              {goal.done ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
            </View>
            <Text
              style={[
                styles.goalLabel,
                { fontFamily: fonts.regular, color: colors.textPrimary },
                goal.done && styles.goalLabelDone,
              ]}>
              {goal.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
          Today&apos;s Progress
        </Text>
        <Text style={[styles.sectionMeta, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
          {dayLabel}
        </Text>
      </View>

      <View style={[styles.card, styles.progressCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <ProgressRings />
        <View style={styles.progressLegend}>
          <ProgressLegendRow color={PROGRESS_ORANGE} label="Calories" value="1,440 cal" colors={colors} />
          <ProgressLegendRow color={colors.accent} label="Exercise" value="42 min" colors={colors} />
          <ProgressLegendRow color={PROGRESS_PURPLE} label="Steps" value="7,240" colors={colors} />
        </View>
      </View>

      <Text style={[styles.sectionTitle, styles.sectionTitleSpaced, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
        Quick Actions
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsRow}>
        {QUICK_ACTIONS.map((action) => (
          <View key={action.id} style={[styles.quickActionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Image source={action.image} style={styles.quickActionImage} resizeMode="cover" />
            <Text style={[styles.quickActionTitle, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
              {action.title}
            </Text>
            <Text style={[styles.quickActionSubtitle, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
              {action.subtitle}
            </Text>
            <Pressable style={[styles.quickActionBtn, { backgroundColor: colors.accent }]}>
              <Text style={[styles.quickActionBtnLabel, { fontFamily: fonts.semiBold }]}>{action.cta}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <Pressable style={[styles.aiBanner, { backgroundColor: AI_PURPLE }]}>
        <View style={styles.aiIconWrap}>
          <Ionicons name="sparkles" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.aiCopy}>
          <Text style={[styles.aiTitle, { fontFamily: fonts.semiBold }]}>AI Coach Insight</Text>
          <Text style={[styles.aiSubtitle, { fontFamily: fonts.regular }]}>
            You&apos;re close to your weekly goal.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
      </Pressable>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.weightHeader}>
          <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
            Weight Progress
          </Text>
          <View>
            <Text style={[styles.weightDelta, { fontFamily: fonts.semiBold, color: colors.accent }]}>{weightChange}</Text>
            <Text style={[styles.weightDeltaMeta, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
              This week
            </Text>
          </View>
        </View>
        <WeightChart accent={colors.accent} />
      </View>

      <View style={[styles.challengeCard, { backgroundColor: colors.card, borderColor: CHALLENGE_GOLD }]}>
        <View style={styles.challengeTop}>
          <View style={[styles.challengeIcon, { backgroundColor: `${CHALLENGE_GOLD}33` }]}>
            <Text style={styles.challengeEmoji}>🏆</Text>
          </View>
          <View style={styles.challengeCopy}>
            <Text style={[styles.challengeTitle, { fontFamily: fonts.semiBold, color: colors.textPrimary }]}>
              30-day Weight Loss
            </Text>
            <Text style={[styles.challengeMeta, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
              Day 21 of 30 · 2,847 participants
            </Text>
          </View>
          <Text style={[styles.challengePercent, { fontFamily: fonts.semiBold, color: CHALLENGE_GOLD }]}>70%</Text>
        </View>
        <View style={[styles.challengeTrack, { backgroundColor: colors.stepTrack }]}>
          <View style={[styles.challengeFill, { width: '70%' }]} />
        </View>
      </View>

      <View style={[styles.reminderCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={styles.reminderEmoji}>💪</Text>
        <Text style={[styles.reminderQuote, { fontFamily: fonts.regular, color: colors.textSecondary }]}>
          &ldquo;Every drop of sweat is a coin in your health bank.&rdquo;
        </Text>
        <Text style={[styles.reminderMeta, { fontFamily: fonts.regular, color: colors.textMuted }]}>
          — Medoraa Daily Reminder
        </Text>
      </View>
    </ScrollView>
  );
}

function ProgressLegendRow({
  color,
  label,
  value,
  colors,
}: {
  color: string;
  label: string;
  value: string;
  colors: WellnessTheme;
}) {
  return (
    <View style={styles.legendRow}>
      <View style={styles.legendLabelWrap}>
        <View style={[styles.legendDot, { backgroundColor: color }]} />
        <Text style={[styles.legendLabel, { fontFamily: fonts.regular, color: colors.textSecondary }]}>{label}</Text>
      </View>
      <View style={[styles.legendBarTrack, { backgroundColor: colors.stepTrack }]}>
        <View style={[styles.legendBarFill, { backgroundColor: color, width: label === 'Steps' ? '81%' : label === 'Calories' ? '72%' : '58%' }]} />
      </View>
      <Text style={[styles.legendValue, { fontFamily: fonts.medium, color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  streakCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 18,
    alignItems: 'start',
    marginBottom: 24,
  },
  streakEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  streakTitle: {
    fontSize: 20,
    marginBottom: 4,
  },
  streakScore: {
    fontSize: 15,
    marginBottom: 4,
  },
  streakSubtitle: {
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
  },
  sectionTitleSpaced: {
    marginBottom: 12,
  },
  sectionMeta: {
    fontSize: 13,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  goalCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalLabel: {
    flex: 1,
    fontSize: 15,
  },
  goalLabelDone: {
    textDecorationLine: 'line-through',
    opacity: 0.55,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ringsWrap: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringsCenter: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15,23,42,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLegend: {
    flex: 1,
    gap: 10,
  },
  legendRow: {
    gap: 4,
  },
  legendLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
  },
  legendBarTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  legendBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  legendValue: {
    fontSize: 13,
  },
  quickActionsRow: {
    gap: 12,
    paddingBottom: 24,
  },
  quickActionCard: {
    width: 168,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  quickActionImage: {
    width: '100%',
    height: 88,
  },
  quickActionTitle: {
    fontSize: 14,
    marginTop: 10,
    marginHorizontal: 12,
  },
  quickActionSubtitle: {
    fontSize: 12,
    marginTop: 2,
    marginHorizontal: 12,
    marginBottom: 10,
  },
  quickActionBtn: {
    marginHorizontal: 12,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: 'center',
  },
  quickActionBtnLabel: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  aiBanner: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  aiIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCopy: {
    flex: 1,
  },
  aiTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 2,
  },
  aiSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  weightDelta: {
    fontSize: 16,
    textAlign: 'right',
  },
  weightDeltaMeta: {
    fontSize: 11,
    textAlign: 'right',
  },
  challengeCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  challengeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  challengeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeEmoji: {
    fontSize: 22,
  },
  challengeCopy: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 15,
    marginBottom: 2,
  },
  challengeMeta: {
    fontSize: 12,
  },
  challengePercent: {
    fontSize: 18,
  },
  challengeTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  challengeFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: CHALLENGE_GOLD,
  },
  reminderCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  reminderEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  reminderQuote: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 6,
  },
  reminderMeta: {
    fontSize: 12,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

const GREEN = '#22C55E';

export type ConsultationCompleteViewProps = {
  /** Main heading (e.g. "Consultation Complete!") */
  title: string;
  /** Supporting line below the title */
  subtitle: string;
  /** Left / secondary action — outlined pill */
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  /** Right / primary action — filled teal */
  primaryLabel?: string;
  onPrimaryPress?: () => void;
  /** Optional: hide secondary button */
  showSecondary?: boolean;
};

/**
 * Reusable success / completion layout: ripple check icon, title, subtitle, two CTAs.
 * Use inside a screen with SafeAreaView; does not include navigation.
 */
export function ConsultationCompleteView({
  title,
  subtitle,
  secondaryLabel = 'Back to Home',
  primaryLabel = 'View Reports',
  onSecondaryPress,
  onPrimaryPress,
  showSecondary = true,
}: ConsultationCompleteViewProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.topBlock}>
        <View style={styles.iconSection}>
          {/* Ripple / halo rings */}
          <View style={[styles.ringOuter, { backgroundColor: `${GREEN}18` }]} />
          <View style={[styles.ringMid, { backgroundColor: `${GREEN}33` }]} />
          <View style={[styles.checkCircle, { backgroundColor: GREEN }]}>
            <Ionicons name='checkmark' size={40} color='#FFFFFF' />
          </View>
        </View>

        <Text
          style={[styles.title, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}
          accessibilityRole='header'>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      </View>

      <View style={styles.actions}>
        {showSecondary ? (
          <Pressable
            onPress={onSecondaryPress}
            style={({ pressed }) => [
              styles.outlineBtn,
              {
                borderColor: theme.accent,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole='button'
            accessibilityLabel={secondaryLabel}>
            <Text style={[styles.outlineLabel, { color: theme.accent, fontFamily: fonts.semiBold }]}>
              {secondaryLabel}
            </Text>
          </Pressable>
        ) : null}
        <Pressable
          onPress={onPrimaryPress}
          style={({ pressed }) => [
            styles.primaryBtn,
            !showSecondary && styles.primaryBtnFull,
            { backgroundColor: theme.accent, opacity: pressed ? 0.92 : 1 },
          ]}
          accessibilityRole='button'
          accessibilityLabel={primaryLabel}>
          <Text style={[styles.primaryLabel, { fontFamily: fonts.semiBold }]}>{primaryLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const RING_OUTER = 132;
const RING_MID = 104;
const CHECK = 76;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 24,
    paddingBottom: 16,
  },
  iconSection: {
    width: RING_OUTER,
    height: RING_OUTER,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  ringOuter: {
    position: 'absolute',
    width: RING_OUTER,
    height: RING_OUTER,
    borderRadius: RING_OUTER / 2,
  },
  ringMid: {
    position: 'absolute',
    width: RING_MID,
    height: RING_MID,
    borderRadius: RING_MID / 2,
  },
  checkCircle: {
    width: CHECK,
    height: CHECK,
    borderRadius: CHECK / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingBottom: 8,
  },
  outlineBtn: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineLabel: {
    fontSize: 15,
  },
  primaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnFull: {
    flex: undefined,
    width: '100%',
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});

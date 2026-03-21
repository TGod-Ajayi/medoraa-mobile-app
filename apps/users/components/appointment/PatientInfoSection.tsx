import type { ImageSourcePropType } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

export type PatientChoice = 'self' | 'other';

type Props = {
  selected: PatientChoice;
  onSelect: (choice: PatientChoice) => void;
  patientName: string;
  patientMeta: string;
  avatar: ImageSourcePropType;
};

export function PatientInfoSection({
  selected,
  onSelect,
  patientName,
  patientMeta,
  avatar,
}: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.divider }]}>
      <Text style={[styles.heading, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
        Patient information
      </Text>

      <Pressable
        style={styles.option}
        onPress={() => onSelect('self')}
        accessibilityRole='radio'
        accessibilityState={{ selected: selected === 'self' }}>
        <View style={styles.optionLeft}>
          <View
            style={[
              styles.radioOuter,
              {
                borderColor: selected === 'self' ? theme.accent : theme.divider,
              },
            ]}>
            {selected === 'self' ? (
              <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />
            ) : null}
          </View>
          <Image source={avatar} style={styles.avatar} />
          <View style={styles.textCol}>
            <Text style={[styles.name, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
              {patientName}
            </Text>
            <Text style={[styles.meta, { color: theme.textSecondary }]}>{patientMeta}</Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        style={styles.option}
        onPress={() => onSelect('other')}
        accessibilityRole='radio'
        accessibilityState={{ selected: selected === 'other' }}>
        <View style={styles.optionLeft}>
          <View
            style={[
              styles.radioOuter,
              {
                borderColor: selected === 'other' ? theme.accent : theme.divider,
              },
            ]}>
            {selected === 'other' ? (
              <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />
            ) : null}
          </View>
          <View style={styles.avatarSpacer} />
          <Text style={[styles.someoneElse, { color: theme.textPrimary }]}>Someone else</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  textCol: {
    flex: 1,
  },
  name: {
    fontSize: 15,
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
  },
  /** Matches avatar width so "Someone else" aligns with patient name */
  avatarSpacer: {
    width: 44,
  },
  someoneElse: {
    fontSize: 15,
    flex: 1,
  },
});

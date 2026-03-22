import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '../../components/doctor';
import { fonts } from '../../config/fonts';
import { useTheme, type AppTheme } from '../../config/theme';

type LangId =
  | 'en-US'
  | 'en-GB'
  | 'hi'
  | 'es'
  | 'fr'
  | 'ar'
  | 'bn'
  | 'ru'
  | 'id'
  | 'zh'
  | 'ur'
  | 'as';

const SUGGESTED: { id: LangId; label: string }[] = [
  { id: 'en-US', label: 'English (US)' },
  { id: 'en-GB', label: 'English (UK)' },
];

const MORE_LANGUAGES: { id: LangId; label: string }[] = [
  { id: 'hi', label: 'Hindi' },
  { id: 'es', label: 'Spanish' },
  { id: 'fr', label: 'French' },
  { id: 'ar', label: 'Arabik' },
  { id: 'bn', label: 'Bengali' },
  { id: 'ru', label: 'Russian' },
  { id: 'id', label: 'Indonesian' },
  { id: 'zh', label: 'Mandarin' },
  { id: 'ur', label: 'Urdu' },
  { id: 'as', label: 'Asamia' },
  { id: 'en-GB', label: 'English (UK)' },
];

function LanguageRow({
  label,
  selected,
  onSelect,
  theme,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  theme: AppTheme;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole='radio'
      accessibilityState={{ selected }}
      accessibilityLabel={label}>
      <Text style={[styles.rowLabel, { color: theme.textPrimary, fontFamily: fonts.regular }]}>{label}</Text>
      <View
        style={[
          styles.radioOuter,
          {
            borderColor: selected ? theme.accent : theme.textMuted,
            borderWidth: 2,
            backgroundColor: 'transparent',
          },
        ]}>
        {selected ? <View style={[styles.radioInner, { backgroundColor: theme.accent }]} /> : null}
      </View>
    </Pressable>
  );
}

/**
 * Language selection — single-select list with Suggested + full list (matches design).
 */
export default function LanguageScreen() {
  const theme = useTheme();
  const [selectedId, setSelectedId] = useState<LangId>('en-US');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps='handled'>
        <ScreenHeader title='Language' />

        <Text style={[styles.sectionTitle, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>Suggested</Text>
        {SUGGESTED.map((item) => (
          <LanguageRow
            key={`suggested-${item.id}`}
            label={item.label}
            selected={selectedId === item.id}
            onSelect={() => setSelectedId(item.id)}
            theme={theme}
          />
        ))}

        <View style={[styles.sectionDivider, { backgroundColor: theme.divider }]} />

        <Text style={[styles.sectionTitle, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>Language</Text>
        {MORE_LANGUAGES.map((item, index) => (
          <LanguageRow
            key={`more-${item.id}-${index}`}
            label={item.label}
            selected={selectedId === item.id}
            onSelect={() => setSelectedId(item.id)}
            theme={theme}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    minHeight: 48,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    marginRight: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

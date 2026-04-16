import { ScreenHeader } from '../../../components/doctor';
import { useTheme } from '../../../config/theme';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { DOCTOR_AUTH_FLOW } from './flow';

const ID_TYPES = [
  { key: 'national_id', label: 'National ID' },
  { key: 'passport', label: 'International passport' },
  { key: 'license', label: "Driver's license" },
] as const;

/** Choose ID document type */
export default function IdSelectionScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }]}>
      <ScreenHeader title='ID verification' />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.lead, { color: theme.textSecondary }]}>
          Select the document you will upload.
        </Text>
        {ID_TYPES.map((item) => (
          <Pressable
            key={item.key}
            onPress={() =>
              router.push(`${DOCTOR_AUTH_FLOW.idDetails}?idType=${encodeURIComponent(item.key)}`)
            }
            style={({ pressed }) => [
              styles.row,
              {
                borderColor: theme.divider,
                backgroundColor: theme.card,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole='button'
            accessibilityLabel={item.label}>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>{item.label}</Text>
            <Ionicons name='chevron-forward' size={20} color={theme.textMuted} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  lead: { fontSize: 14, marginBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  rowLabel: { fontSize: 16 },
});

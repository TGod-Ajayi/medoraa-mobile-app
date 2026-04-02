import { Button } from '../../../components';
import { ScreenHeader } from '../../../components/doctor';
import { useTheme } from '../../../config/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DOCTOR_AUTH_FLOW } from './flow';

/** Profile photo — before/after upload states (wire ImagePicker later) */
export default function UploadPhotoScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [uri, setUri] = useState<string | null>(null);

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }]}>
      <ScreenHeader title='Profile photo' />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.lead, { color: theme.textSecondary }]}>
          Add a clear photo of yourself. You can change it later.
        </Text>

        <Pressable
          onPress={() => setUri(uri ? null : 'placeholder')}
          style={[styles.photoWrap, { borderColor: theme.divider, backgroundColor: theme.card }]}>
          {uri ? (
            <Text style={{ color: theme.textSecondary }}>Photo preview</Text>
          ) : (
            <Text style={{ color: theme.textMuted }}>Tap to upload</Text>
          )}
        </Pressable>

        <Button
          label='Save and continue'
          onPress={() => router.push(DOCTOR_AUTH_FLOW.setPassword)}
          variant='primary'
          style={[styles.cta, { backgroundColor: theme.accent }]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  lead: { fontSize: 14, marginBottom: 20 },
  photoWrap: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  cta: { marginTop: 8 },
});

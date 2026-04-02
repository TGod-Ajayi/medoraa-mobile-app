import { Button } from '@/components';
import { ScreenHeader } from '@/components/screen-header';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UploadPhotoScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe}>
        <ScreenHeader theme={theme} title="Upload your picture" />
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          A clear photo helps patients recognize you.
        </Text>

        <View style={styles.avatarWrap}>
          <View
            style={[
              styles.avatarPlaceholder,
              {
                borderColor: theme.inputBorder,
                backgroundColor: theme.surfaceMuted,
              },
            ]}>
            <Ionicons name="person" size={56} color={theme.textMuted} />
          </View>
        </View>

        <Button
          theme={theme}
          label="Upload picture"
          variant="secondary"
          onPress={() => {}}
        />
        <View style={styles.spacer} />
        <Button
          theme={theme}
          label="Save and continue"
          onPress={() => router.push('/(auth)/create-password')}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 32,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    height: 12,
  },
});

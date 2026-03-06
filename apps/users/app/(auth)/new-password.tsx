import { useTheme } from '../../config/theme';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function NewPasswordScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Create New Password</Text>
      <Pressable
        style={[styles.button, { backgroundColor: theme.accent }]}
        onPress={() => router.replace('/(auth)/reset-success')}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

import { Button, Input } from '@/components';
import { ScreenHeader } from '@/components/screen-header';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePasswordScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <ScreenHeader theme={theme} title="Create a password" />
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Use at least 8 characters with a mix of letters and numbers.
          </Text>

          <Input
            theme={theme}
            label="Password"
            placeholder="Create password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!visible}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} />}
            rightContent={
              <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={visible ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={theme.textMuted}
                />
              </Pressable>
            }
          />
          <Input
            theme={theme}
            label="Confirm password"
            placeholder="Confirm password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!confirmVisible}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} />}
            rightContent={
              <Pressable onPress={() => setConfirmVisible((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={confirmVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={theme.textMuted}
                />
              </Pressable>
            }
          />

          <Button
            theme={theme}
            label="Continue"
            onPress={() => router.push('/(auth)/account-created')}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  scroll: {
    paddingBottom: 32,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 16,
  },
});

import { Button, Input } from '../../../components';
import { ScreenHeader } from '../../../components/doctor';
import { useTheme } from '../../../config/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { eyeOff, eyeOn, lock } from '@/config/svg';

import { DOCTOR_AUTH_FLOW } from './flow';

/** Create password + confirm */
export default function SetPasswordScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title='Create password' />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}>
        <Input
          theme={theme}
          label='Password'
          placeholder='Create password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!visible}
          leftIcon={<SvgXml xml={lock} />}
          rightContent={
            <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
              <SvgXml xml={visible ? eyeOn : eyeOff} />
            </Pressable>
          }
        />
        <Input
          theme={theme}
          label='Confirm password'
          placeholder='Confirm password'
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!visible2}
          leftIcon={<SvgXml xml={lock} />}
          rightContent={
            <Pressable onPress={() => setVisible2((v) => !v)} hitSlop={8}>
              <SvgXml xml={visible2 ? eyeOn : eyeOff} />
            </Pressable>
          }
        />
        <Button
          label='Set password'
          onPress={() => router.push(DOCTOR_AUTH_FLOW.accountCreated)}
          variant='primary'
          style={[styles.cta, { backgroundColor: theme.accent }]}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  cta: { marginTop: 8 },
});

import { Button, Input } from '@/components';
import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useChangePassword } from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';

const ACCENT = '#20BEB8';

export default function ChangePasswordScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { changePassword, loading } = useChangePassword();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldVisible, setOldVisible] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const canSubmit =
    oldPassword.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    !loading;

  const handleSubmit = async () => {
    if (!oldPassword.trim()) {
      showMessage({ message: 'Old password is required', type: 'danger', duration: 4000 });
      return;
    }
    if (!newPassword.trim()) {
      showMessage({ message: 'New password is required', type: 'danger', duration: 4000 });
      return;
    }
    if (oldPassword === newPassword) {
      showMessage({
        message: 'New password must be different from old password',
        type: 'danger',
        duration: 4000,
      });
      return;
    }

    try {
      const { data } = await changePassword(oldPassword, newPassword);

      console.log(
        '[doctor-change-password] changePassword response:\n' +
          JSON.stringify(
            {
              oldPassword: '***',
              newPassword: '***',
              result: data?.changePassword ?? null,
            },
            null,
            2,
          ),
      );

      showMessage({
        message: 'Password changed successfully',
        type: 'success',
        duration: 4000,
      });
      router.back();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Could not change password';
      showMessage({ message, type: 'danger', duration: 4000 });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <Ionicons name="chevron-back" size={22} color="#667085" />
        </Pressable>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Change Password</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Input
            theme={theme}
            label="Old Password"
            placeholder="Enter old password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={!oldVisible}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#667085" />}
            rightContent={
              <Pressable onPress={() => setOldVisible((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={oldVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#667085"
                />
              </Pressable>
            }
          />

          <Input
            theme={theme}
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!newVisible}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#667085" />}
            rightContent={
              <Pressable onPress={() => setNewVisible((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={newVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#667085"
                />
              </Pressable>
            }
          />

          {/* <Input
            theme={theme}
            label="Confirm Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmVisible}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#667085" />}
            rightContent={
              <View style={styles.rightIcons}>
                {confirmPassword.length > 0 ? (
                  <Pressable onPress={() => setConfirmPassword('')} hitSlop={8}>
                    <Ionicons name="close" size={20} color="#667085" />
                  </Pressable>
                ) : null}
                <Pressable onPress={() => setConfirmVisible((v) => !v)} hitSlop={8}>
                  <Ionicons
                    name={confirmVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#667085"
                  />
                </Pressable>
              </View>
            }
          /> */}
        </ScrollView>

        <View style={[styles.footerWrap, { backgroundColor: theme.background }]}>
          <Button
            theme={theme}
            label={loading ? 'Changing...' : 'Change Password'}
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={{
              backgroundColor: ACCENT,
              borderColor: ACCENT,
              borderRadius: 30,
              marginBottom: Platform.OS == "android" ? 42: 0
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
});

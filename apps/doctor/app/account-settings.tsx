import { Button, Input } from '@/components';
import { DatePickerBottomSheet } from '@/components/DatePickerBottomSheet';
import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { Types, useDoctor, useDoctorUser, useUpdateUser } from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type FieldProps = {
  label: string;
  value: string;
  rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
};

function formatDateOfBirth(value?: string | null) {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '—';
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDatePickerValue(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function formatGender(gender?: Types.GenderTypes | null) {
  switch (gender) {
    case Types.GenderTypes.Male:
      return 'Male';
    case Types.GenderTypes.Female:
      return 'Female';
    default:
      return '—';
  }
}

function formatSpecialization(
  specialties?: { specialty?: { name?: string | null } | null }[] | null,
) {
  const names = (specialties ?? [])
    .map((item) => item.specialty?.name?.trim())
    .filter(Boolean);
  return names.length > 0 ? names.join(', ') : '—';
}

function splitName(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: '', lastName: '' };
  const [firstName, ...rest] = trimmed.split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
}

function ReadOnlyField({ label, value, rightIcon }: FieldProps) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldBox}>
        <Text style={styles.fieldValue}>{value}</Text>
        {rightIcon ? <Ionicons name={rightIcon} size={20} color="#667085" /> : null}
      </View>
    </View>
  );
}

export default function AccountSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading: userLoading, error: userError, refetch: refetchUser } = useDoctorUser();
  const { doctor, loading: doctorLoading, error: doctorError } = useDoctor();
  const { updateUser, loading: saving } = useUpdateUser();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  const loading = userLoading || doctorLoading;
  const error = userError ?? doctorError;

  const displayName = useMemo(() => {
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
    return fullName || '—';
  }, [user?.firstName, user?.lastName]);

  const specialization = useMemo(
    () => formatSpecialization(doctor?.doctorsSpecialties),
    [doctor?.doctorsSpecialties],
  );

  const hydrateForm = useCallback(() => {
    if (!user) return;
    setName([user.firstName, user.lastName].filter(Boolean).join(' '));
    setEmail(user.email ?? '');

    if (user.dateOfBirth) {
      const parsed = new Date(String(user.dateOfBirth));
      if (!Number.isNaN(parsed.getTime())) {
        setDob(parsed);
      }
    }
    setHasHydrated(true);
  }, [user]);

  useEffect(() => {
    if (!user || hasHydrated) return;
    hydrateForm();
  }, [hasHydrated, hydrateForm, user]);

  useEffect(() => {
    console.log(
      '[doctor-account-settings] getUser response:\n' +
        JSON.stringify(
          {
            role: Types.UserRoles.Doctor,
            user,
            doctor,
            loading,
            error: error?.message ?? null,
          },
          null,
          2,
        ),
    );
  }, [user, doctor, loading, error]);

  const handleCancelEdit = () => {
    hydrateForm();
    setIsEditing(false);
    setCalendarOpen(false);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      showMessage({ message: 'Name is required', type: 'danger', duration: 4000 });
      return;
    }
    if (!trimmedEmail) {
      showMessage({ message: 'Email is required', type: 'danger', duration: 4000 });
      return;
    }

    const { firstName, lastName } = splitName(trimmedName);

    try {
      const { data } = await updateUser({
        firstName,
        lastName: lastName || firstName,
        email: trimmedEmail,
        dateOfBirth: dob.toISOString(),
        role: Types.UserRoles.Doctor,
      });

      console.log(
        '[doctor-account-settings] updateUser response:\n' +
          JSON.stringify(
            {
              role: Types.UserRoles.Doctor,
              user: data?.updateUser ?? null,
            },
            null,
            2,
          ),
      );

      await refetchUser();
      setIsEditing(false);
      showMessage({
        message: 'Account settings saved',
        type: 'success',
        duration: 4000,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Could not save changes';
      showMessage({ message, type: 'danger', duration: 4000 });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => (isEditing ? handleCancelEdit() : router.back())}
          style={[styles.headerBtn, { backgroundColor: theme.card }]}>
          <Ionicons name="chevron-back" size={22} color="#667085" />
        </Pressable>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Account Settings</Text>
        {!loading && !error ? (
          <Pressable
            onPress={() => (isEditing ? handleCancelEdit() : setIsEditing(true))}
            style={[styles.headerBtn, { backgroundColor: theme.card }]}>
            <Text style={styles.editText}>{isEditing ? 'Cancel' : 'Edit'}</Text>
          </Pressable>
        ) : (
          <View style={styles.headerBtn} />
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#20BEB8" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: theme.textPrimary }]}>
            Unable to load account settings. Please try again.
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {isEditing ? (
              <>
                <Input
                  theme={theme}
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                <Input
                  theme={theme}
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={styles.fieldBlock}>
                  <Text style={styles.fieldLabel}>Date of Birth</Text>
                  <Pressable
                    onPress={() => setCalendarOpen(true)}
                    style={styles.fieldBox}>
                    <Text style={styles.fieldValue}>{formatDatePickerValue(dob)}</Text>
                    <Ionicons name="calendar-outline" size={20} color="#667085" />
                  </Pressable>
                </View>
                <ReadOnlyField label="Country" value="—" rightIcon="chevron-down-outline" />
                <ReadOnlyField label="Contact Number" value={user?.phoneNumber ?? '—'} />
                <ReadOnlyField
                  label="Gender"
                  value={formatGender(user?.gender)}
                  rightIcon="chevron-down-outline"
                />
                <ReadOnlyField label="Specialization" value={specialization} />
              </>
            ) : (
              <>
                <ReadOnlyField label="Name" value={displayName} />
                <ReadOnlyField label="Email" value={user?.email ?? '—'} />
                <ReadOnlyField
                  label="Date of Birth"
                  value={formatDateOfBirth(user?.dateOfBirth)}
                  rightIcon="calendar-outline"
                />
                <ReadOnlyField
                  label="Country"
                  value="—"
                  rightIcon="chevron-down-outline"
                />
                <ReadOnlyField label="Contact Number" value={user?.phoneNumber ?? '—'} />
                <ReadOnlyField
                  label="Gender"
                  value={formatGender(user?.gender)}
                  rightIcon="chevron-down-outline"
                />
                <ReadOnlyField
                  label="Specialization"
                  value={specialization}
                  rightIcon="chevron-down-outline"
                />
              </>
            )}
          </ScrollView>

          {isEditing ? (
            <View style={[styles.footerWrap, { backgroundColor: theme.background }]}>
              <Button
                theme={theme}
                label={saving ? 'Saving...' : 'Save Changes'}
                onPress={handleSave}
                disabled={saving}
                style={{
                  backgroundColor: '#20BEB8',
                  borderColor: '#20BEB8',
                  borderRadius: 30,
                }}
              />
            </View>
          ) : null}
        </KeyboardAvoidingView>
      )}

      <DatePickerBottomSheet
        visible={calendarOpen}
        selected={dob}
        onConfirm={(date) => {
          setDob(date);
          setCalendarOpen(false);
        }}
        onClose={() => setCalendarOpen(false)}
      />
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    minWidth: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  editText: {
    color: '#20BEB8',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
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
    paddingBottom: 20,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: '#475467',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
    marginBottom: 8,
  },
  fieldBox: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  fieldValue: {
    color: '#101828',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.regular,
  },
  footerWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
});

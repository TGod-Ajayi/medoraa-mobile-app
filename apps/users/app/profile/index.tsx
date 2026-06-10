import { Ionicons } from '@expo/vector-icons';
import { useApolloClient } from '@apollo/client/react';
import {
  createProfilePictureFormData,
  Types,
  uploadProfilePicture,
  useUpdateUser,
  useUser,
} from '@repo/ui/graphql';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';

import { DatePickerBottomSheet } from '../../components/appointment';
import { ScreenHeader } from '../../components/doctor';
import {
  CountryPickerBottomSheet,
  COUNTRIES,
  LogoutButton,
  ProfileMenuItem,
  type Country,
} from '../../components/profile';
import { fonts } from '../../config/fonts';
import { useTheme, type AppTheme } from '../../config/theme';

const AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type IonName = ComponentProps<typeof Ionicons>['name'];

const MENU: { id: string; label: string; icon: IonName }[] = [
  { id: 'favourites', label: 'Favourites', icon: 'heart-outline' },
  { id: 'address', label: 'Address book', icon: 'location-outline' },
  { id: 'payments', label: 'Payments', icon: 'wallet-outline' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
  { id: 'security', label: 'Security', icon: 'shield-checkmark-outline' },
  { id: 'language', label: 'Language', icon: 'language-outline' },
  { id: 'help', label: 'Help Center', icon: 'help-circle-outline' },
  { id: 'invite', label: 'Invite Friends', icon: 'people-outline' },
];

function formatDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function flagEmoji(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('');
}

function splitName(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: '', lastName: '' };
  const [firstName, ...rest] = trimmed.split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
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

function filenameFromUri(uri: string, mimeType: string): string {
  const segment = uri.split('/').pop()?.split('?')[0];
  if (segment && /\.[a-z0-9]+$/i.test(segment)) return segment.slice(0, 120);
  if (mimeType.includes('png')) return 'profile.png';
  return 'profile.jpg';
}

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const client = useApolloClient();
  const { user, refetch: refetchUser } = useUser();
  const { updateUser, loading: savingProfile } = useUpdateUser();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [country, setCountry] = useState<Country>(
    COUNTRIES.find((c) => c.code === 'BD') ?? COUNTRIES[0],
  );
  const [countryOpen, setCountryOpen] = useState(false);
  const [contact, setContact] = useState('');
  const [gender, setGender] = useState('');
  const [avatarPreviewUri, setAvatarPreviewUri] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const hydrateForm = useCallback(() => {
    if (!user) return;

    setName([user.firstName, user.lastName].filter(Boolean).join(' '));
    setEmail(user.email ?? '');
    setContact(user.phoneNumber ?? '');
    setAvatarPreviewUri(null);

    if (user.gender === 'MALE') setGender('Male');
    else if (user.gender === 'FEMALE') setGender('Female');
    else setGender('');

    if (user.dateOfBirth) {
      const parsedDob = new Date(String(user.dateOfBirth));
      if (!Number.isNaN(parsedDob.getTime())) {
        setDob(parsedDob);
      }
    }
  }, [user]);

  useEffect(() => {
    hydrateForm();
  }, [hydrateForm]);

  const displayName = useMemo(() => {
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
    return fullName || 'Patient';
  }, [user?.firstName, user?.lastName]);

  const avatarSource = avatarPreviewUri
    ? { uri: avatarPreviewUri }
    : user?.profilePhoto
      ? { uri: user.profilePhoto }
      : { uri: AVATAR };

  const handleCancelEdit = () => {
    hydrateForm();
    setIsEditing(false);
    setCalendarOpen(false);
    setCountryOpen(false);
  };

  const handlePickProfilePhoto = async () => {
    if (!isEditing || uploadingPhoto) return;

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showMessage({
        message: 'Photo library access is needed to upload a profile picture.',
        type: 'danger',
        duration: 4000,
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const uri = asset.uri;
    const mimeType = asset.mimeType ?? 'image/jpeg';
    const filename = asset.fileName ?? filenameFromUri(uri, mimeType);
    const uploadParams = { uri, mimeType, filename };

    setAvatarPreviewUri(uri);
    setUploadingPhoto(true);

    try {
      const formData = createProfilePictureFormData(uploadParams);
      console.log(
        '[user-profile] profile photo FormData prepared:\n' +
          JSON.stringify({ filename, mimeType, hasFormData: !!formData }, null, 2),
      );

      await uploadProfilePicture(client, uploadParams);
      await refetchUser();

      showMessage({
        message: 'Profile photo updated',
        type: 'success',
        duration: 3000,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Could not upload profile photo';
      showMessage({ message, type: 'danger', duration: 4000 });
      setAvatarPreviewUri(null);
    } finally {
      setUploadingPhoto(false);
    }
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
        role: Types.UserRoles.Patient,
      });

      console.log(
        '[user-profile] updateUser response:\n' +
          JSON.stringify({ user: data?.updateUser ?? null }, null, 2),
      );

      await refetchUser();
      setIsEditing(false);
      showMessage({
        message: 'Profile updated successfully',
        type: 'success',
        duration: 4000,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Could not save profile';
      showMessage({ message, type: 'danger', duration: 4000 });
    }
  };

  const saving = savingProfile || uploadingPhoto;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            isEditing && { paddingBottom: Math.max(insets.bottom, 16) + 72 },
          ]}
          keyboardShouldPersistTaps='handled'>
          <ScreenHeader
            title='Profile'
            rightSlot={
              isEditing ? (
                <Pressable onPress={handleCancelEdit} hitSlop={8}>
                  <Text style={[styles.headerAction, { color: theme.textSecondary }]}>
                    Cancel
                  </Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => setIsEditing(true)} hitSlop={8}>
                  <Text style={[styles.headerAction, { color: theme.accent, fontFamily: fonts.semiBold }]}>
                    Edit
                  </Text>
                </Pressable>
              )
            }
          />

          <View style={styles.avatarBlock}>
            <Pressable
              onPress={isEditing ? handlePickProfilePhoto : undefined}
              disabled={!isEditing || uploadingPhoto}
              style={styles.avatarWrap}>
              <Image source={avatarSource} style={styles.avatarLarge} />
              {isEditing ? (
                <View
                  style={[
                    styles.editPhotoBtn,
                    { backgroundColor: theme.accent, borderColor: theme.background },
                  ]}>
                  {uploadingPhoto ? (
                    <ActivityIndicator size='small' color='#FFFFFF' />
                  ) : (
                    <Ionicons name='camera' size={16} color='#FFFFFF' />
                  )}
                </View>
              ) : null}
            </Pressable>

            {!isEditing ? (
              <>
                <Text style={[styles.displayName, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
                  {displayName}
                </Text>
                <Text style={[styles.email, { color: theme.textSecondary }]}>
                  {user?.email ?? ''}
                </Text>
              </>
            ) : null}
          </View>

          {isEditing ? (
            <View style={styles.formSection}>
              <Field label='Name' theme={theme}>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.card }]}
                  autoCapitalize='words'
                  autoCorrect={false}
                />
              </Field>

              <Field label='Email' theme={theme}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor={theme.textMuted}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.card }]}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoCorrect={false}
                />
              </Field>

              <Field label='Date of Birth' theme={theme}>
                <Pressable onPress={() => setCalendarOpen(true)}>
                  <View style={[styles.inputRow, { borderColor: theme.divider, backgroundColor: theme.card }]}>
                    <Text style={[styles.inputRowText, { color: theme.textPrimary }]}>
                      {formatDate(dob)}
                    </Text>
                    <Ionicons name='calendar-outline' size={20} color={theme.textSecondary} />
                  </View>
                </Pressable>
              </Field>

              <Field label='Country' theme={theme}>
                <Pressable onPress={() => setCountryOpen(true)}>
                  <View style={[styles.inputRow, { borderColor: theme.divider, backgroundColor: theme.card }]}>
                    <Text style={styles.flag}>{flagEmoji(country.code)}</Text>
                    <Text style={[styles.inputRowText, { color: theme.textPrimary }]}>
                      {country.name}
                    </Text>
                    <Ionicons name='chevron-down' size={20} color={theme.textSecondary} />
                  </View>
                </Pressable>
              </Field>

              <Field label='Contact Number' theme={theme}>
                <TextInput
                  value={contact}
                  editable={false}
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.input,
                    styles.readOnlyInput,
                    { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.card },
                  ]}
                />
              </Field>

              <Field label='Gender' theme={theme}>
                <View style={[styles.inputRow, styles.readOnlyInput, { borderColor: theme.divider, backgroundColor: theme.card }]}>
                  <Text style={[styles.inputRowText, { color: theme.textPrimary }]}>
                    {gender || formatGender(user?.gender)}
                  </Text>
                </View>
              </Field>
            </View>
          ) : null}

          {!isEditing ? (
            <>
              <View style={[styles.sectionDivider, { backgroundColor: theme.divider }]} />

              <View style={styles.menu}>
                {MENU.map((item, index) => (
                  <ProfileMenuItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    isLast={index === MENU.length - 1}
                    onPress={() => {
                      if (item.id === 'favourites') router.push('/profile/favourites');
                      if (item.id === 'payments') router.push('/profile/payments');
                      if (item.id === 'language') router.push('/profile/language');
                      if (item.id === 'help') router.push('/profile/help');
                    }}
                  />
                ))}
              </View>

              <LogoutButton />
            </>
          ) : null}
        </ScrollView>

        {isEditing ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: theme.background }]}>
            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: theme.accent },
                (pressed || saving) && styles.savePressed,
                saving && styles.saveDisabled,
              ]}>
              {savingProfile ? (
                <ActivityIndicator color='#FFFFFF' />
              ) : (
                <Text style={[styles.saveText, { fontFamily: fonts.semiBold }]}>Save Changes</Text>
              )}
            </Pressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>

      <DatePickerBottomSheet
        visible={calendarOpen}
        selected={dob}
        onConfirm={(date) => {
          setDob(date);
          setCalendarOpen(false);
        }}
        onClose={() => setCalendarOpen(false)}
      />

      <CountryPickerBottomSheet
        visible={countryOpen}
        selected={country}
        onSelect={(c) => {
          setCountry(c);
          setCountryOpen(false);
        }}
        onClose={() => setCountryOpen(false)}
      />
    </SafeAreaView>
  );
}

function Field({
  label,
  theme,
  children,
}: {
  label: string;
  theme: AppTheme;
  children: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>{label}</Text>
      {children}
    </View>
  );
}

const AVATAR_SIZE = 112;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headerAction: {
    fontSize: 14,
    lineHeight: 20,
  },
  avatarBlock: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarLarge: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E2E8F0',
  },
  editPhotoBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  displayName: {
    fontSize: 20,
    marginBottom: 6,
  },
  email: {
    fontSize: 14,
  },
  formSection: {
    marginBottom: 8,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: fonts.regular,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 14, default: 12 }),
    fontSize: 15,
  },
  readOnlyInput: {
    opacity: 0.72,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 14, default: 12 }),
    minHeight: 48,
  },
  inputRowText: {
    flex: 1,
    fontSize: 15,
    marginRight: 8,
  },
  flag: {
    fontSize: 22,
    lineHeight: 26,
    marginRight: 4,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  menu: {
    paddingTop: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  saveBtn: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savePressed: {
    opacity: 0.92,
  },
  saveDisabled: {
    opacity: 0.7,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

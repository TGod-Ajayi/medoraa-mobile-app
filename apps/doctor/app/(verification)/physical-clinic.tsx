import { Button, Input } from '@/components';
import { ScreenHeader } from '@/components/screen-header';
import { useVerificationProgress } from '@/context/verification-progress';
import { useTheme } from '@/config/theme';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  Dimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Hooks } from '@repo/ui/graphql';


const { height } = Dimensions.get('window');

const ROLE_OPTIONS = [
  'CONSULTANT',
  'JUNIOR_RESIDENT',
  'MEDICAL_OFFICER',
  'SENIOR_RESIDENT',
] as const;

/** Used until `getSpecialties` returns, or if the API returns an empty list. */
const FALLBACK_SPECIALIZATION_LABELS: string[] = [
  'General practice',
  'Internal medicine',
  'Pediatrics',
  'Surgery',
  'Obstetrics & Gynecology',
  'Psychiatry',
  'Dermatology',
  'Cardiology',
  'Orthopedic surgery',
  'Emergency medicine',
  'Anesthesiology',
  'Radiology',
];

export default function PhysicalClinicScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { markComplete } = useVerificationProgress();
  const [clinicName, setClinicName] = useState('');
  const [role, setRole] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [specialization, setSpecialization] = useState('');

  const roleSheetRef = useRef<BottomSheet>(null);
  const specializationSheetRef = useRef<BottomSheet>(null);
  const [updateDoctor, { loading: updateDoctorLoading }] =
    Hooks.useUpdateDoctorMutation();
  const { data: specialtiesData } = Hooks.useGetSpecialtiesQuery();
  const { medicalSchool, graduationYear, medicalCertificate } =
    useLocalSearchParams<{
      medicalSchool?: string;
      graduationYear?: string;
      medicalCertificate?: string;
    }>();
  const snapPoints = useMemo(() => ['38%', '48%'], []);
  const specializationSnapPoints = useMemo(() => ['45%', '62%'], []);

  useEffect(() => {
console.log("response from the specialization ", specialtiesData);
  }, [specialtiesData]);

  const specializationLabels = useMemo((): string[] => {
    const fromApi =
      specialtiesData?.getSpecialties
        ?.map((s) => s.name)
        .filter((n): n is string => Boolean(n)) ?? [];
    return fromApi.length > 0 ? fromApi : [...FALLBACK_SPECIALIZATION_LABELS];
  }, [specialtiesData]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
      />
    ),
    []
  );

  const openRoleSheet = useCallback(() => {
    roleSheetRef.current?.expand();
  }, []);

  const openSpecializationSheet = useCallback(() => {
    specializationSheetRef.current?.expand();
  }, []);

  return (
    <>
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <SafeAreaView style={styles.safe}>
          <ScreenHeader theme={theme} title="Clinic Detail" />
          <View style={styles.fields}>
            <Input
              theme={theme}
              label="Clinic Name"
              placeholder="Enter clinic name"
              value={clinicName}
              onChangeText={setClinicName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Pressable
              onPress={openRoleSheet}
              accessibilityRole="button"
              style={styles.fieldPress}>
              <Input
                theme={theme}
                label="Level"
                placeholder="Select Level"
                value={role}
                editable={false}
                showSoftInputOnFocus={false}
                pointerEvents="none"
                rightContent={
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={theme.textMuted}
                  />
                }
              />
            </Pressable>

            <Input
              theme={theme}
              label="Clinic Address"
              placeholder="Enter address"
              value={clinicAddress}
              onChangeText={setClinicAddress}
              autoCapitalize="words"
              autoCorrect={false}
            />
            <Pressable
              onPress={openSpecializationSheet}
              accessibilityRole="button"
              style={styles.fieldPress}>
              <Input
                theme={theme}
                label="Specialization"
                placeholder="Select specialization"
                value={specialization}
                editable={false}
                showSoftInputOnFocus={false}
                pointerEvents="none"
                rightContent={
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={theme.textMuted}
                  />
                }
              />
            </Pressable>
          </View>
         
            <Button
              theme={theme}
              label="Submit KYC"
             
              style={{ borderRadius: 30, position:"fixed", bottom: height/100 * -30,}}
              onPress={() => {
                void markComplete('physical-clinic');
                // TODO: call updateDoctor with clinic + params from prior steps
                void updateDoctor;
                void medicalSchool;
                void graduationYear;
                void medicalCertificate;
                void updateDoctorLoading;
                router.push("/(verification)");
              }}
             
            />
          
        </SafeAreaView>
      </View>

      <BottomSheet
        ref={roleSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.card }}
        handleIndicatorStyle={{ backgroundColor: theme.divider }}>
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>
            Select Level
          </Text>
        </View>
        <BottomSheetScrollView
          contentContainerStyle={styles.roleList}
          showsVerticalScrollIndicator={false}>
          {ROLE_OPTIONS.map((label) => {
            const selected = role === label;
            return (
              <Pressable
                key={label}
                onPress={() => {
                  setRole(label);
                  roleSheetRef.current?.close();
                }}
                style={({ pressed }) => [
                  styles.roleRow,
                  {
                    borderBottomColor: theme.divider,
                    backgroundColor: pressed
                      ? theme.surfaceMuted
                      : 'transparent',
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}>
                <Text
                  style={[
                    styles.roleLabel,
                    {
                      color: selected ? theme.accent : theme.textPrimary,
                      fontWeight: selected ? '600' : '500',
                    },
                  ]}>
                  {label.toLocaleLowerCase().replace("_", " ")}
                </Text>
                {selected ? (
                  <Ionicons name="checkmark" size={22} color={theme.accent} />
                ) : null}
              </Pressable>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheet>

      <BottomSheet
        ref={specializationSheetRef}
        index={-1}
        snapPoints={specializationSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.card }}
        handleIndicatorStyle={{ backgroundColor: theme.divider }}>
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>
            Select specialization
          </Text>
        </View>
        <BottomSheetScrollView
          contentContainerStyle={styles.roleList}
          showsVerticalScrollIndicator>
          {specializationLabels.map((label) => {
            const selected = specialization === label;
            return (
              <Pressable
                key={label}
                onPress={() => {
                  setSpecialization(label);
                  specializationSheetRef.current?.close();
                }}
                style={({ pressed }) => [
                  styles.roleRow,
                  {
                    borderBottomColor: theme.divider,
                    backgroundColor: pressed
                      ? theme.surfaceMuted
                      : 'transparent',
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}>
                <Text
                  style={[
                    styles.roleLabel,
                    {
                      color: selected ? theme.accent : theme.textPrimary,
                      fontWeight: selected ? '600' : '500',
                    },
                  ]}>
                  {label}
                </Text>
                {selected ? (
                  <Ionicons name="checkmark" size={22} color={theme.accent} />
                ) : null}
              </Pressable>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 16,
  },
  fields: {
    flexDirection: 'column',
    gap: 8,
  },
  fieldPress: {
    alignSelf: 'stretch',
  },
  footer: {
   
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  roleList: {
    paddingBottom: 28,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  roleLabel: {
    fontSize: 16,
    flex: 1,
    paddingRight: 12,
  },
});

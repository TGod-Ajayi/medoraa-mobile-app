import { Ionicons } from '@expo/vector-icons';
import { useDoctorDetails, Types } from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState, type ComponentProps } from 'react';
import type { ImageSourcePropType } from 'react-native';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryCtaButton } from '../appointment';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

const DEFAULT_DOCTOR_IMAGE = require('../../assets/images/user.png');
const BIO_PREVIEW_LENGTH = 140;
const HEADER_HEIGHT = 168;
const PROFILE_IMAGE_WIDTH = 168;
const PROFILE_IMAGE_HEIGHT = 208;
const CARD_TOP_RADIUS = 28;

const LEVEL_LABELS: Record<Types.DoctorLevel, string> = {
  CONSULTANT: 'Consultant',
  JUNIOR_RESIDENT: 'Junior Resident',
  MEDICAL_OFFICER: 'Medical Officer',
  SENIOR_RESIDENT: 'Senior Resident',
};

type Props = {
  doctorId: string;
};

function formatCurrency(value?: number | null) {
  if (typeof value !== 'number') return '—';
  return `$${Math.round(value)}`;
}

function formatExperience(years?: number | null) {
  if (typeof years !== 'number' || Number.isNaN(years)) return '—';
  return `${Math.round(years)}+ Years`;
}

function formatReviews(totalReviews?: number | null) {
  if (typeof totalReviews !== 'number' || Number.isNaN(totalReviews)) return '—';
  if (totalReviews >= 1000) {
    const compact = totalReviews / 1000;
    const formatted =
      compact >= 10 ? `${Math.round(compact)}K` : `${compact.toFixed(1)}K`;
    return `${formatted}+`;
  }
  return `${Math.round(totalReviews)}+`;
}

function getQualifications(doctor: NonNullable<ReturnType<typeof useDoctorDetails>['doctor']>) {
  const specialty =
    doctor.doctorsSpecialties
      ?.map((entry) => entry.specialty.name)
      .filter(Boolean)[0] ?? null;

  const parts: string[] = [];

  if (doctor.medicalSchool?.trim()) {
    parts.push(doctor.medicalSchool.trim());
  } else if (doctor.level) {
    parts.push(LEVEL_LABELS[doctor.level] ?? doctor.level);
  }

  if (specialty) {
    return parts.length > 0 ? `${parts.join(', ')} (${specialty})` : specialty;
  }

  return parts.join(', ') || 'Medical professional';
}

function getLocation(doctor: NonNullable<ReturnType<typeof useDoctorDetails>['doctor']>) {
  const parts = [doctor.clinicName, doctor.clinicAddress]
    .map((value) => value?.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : 'Location unavailable';
}

function getFollowUpFee(doctor: NonNullable<ReturnType<typeof useDoctorDetails>['doctor']>) {
  if (doctor.instantConsultationEnabled && doctor.instantConsultationFee > 0) {
    return doctor.instantConsultationFee;
  }

  if (doctor.consultationFee > 0) {
    return Math.round(doctor.consultationFee * 0.5);
  }

  return null;
}

export function DoctorDetailsView({ doctorId }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const [bioExpanded, setBioExpanded] = useState(false);
  const { doctor, loading, error } = useDoctorDetails(doctorId);

  useEffect(() => {
    console.log(
      'getDoctorDetails response\n' +
        JSON.stringify(
          {
            doctor,
            doctorId,
            error,
            loading,
          },
          null,
          2
        )
    );
  }, [doctor, doctorId, error, loading]);

  const specialtyLabel = useMemo(
    () =>
      doctor?.doctorsSpecialties
        ?.map((entry) => entry.specialty.name)
        .filter(Boolean)
        .join(', ') || 'General practice',
    [doctor]
  );

  const doctorName = useMemo(() => {
    const fullName = [doctor?.user.firstName, doctor?.user.lastName]
      .filter((value): value is string => Boolean(value?.trim()))
      .join(' ');

    return fullName ? `Dr. ${fullName}` : 'Doctor';
  }, [doctor]);

  const imageSource: ImageSourcePropType = doctor?.user.profilePhoto
    ? { uri: doctor.user.profilePhoto }
    : DEFAULT_DOCTOR_IMAGE;

  const bio = doctor?.bio?.trim() || '';
  const shouldTruncateBio = bio.length > BIO_PREVIEW_LENGTH;
  const displayedBio =
    bioExpanded || !shouldTruncateBio
      ? bio || 'No bio available yet.'
      : `${bio.slice(0, BIO_PREVIEW_LENGTH).trim()}…`;

  return (
    <View style={[styles.root, { backgroundColor: theme.card }]}>
      <View style={[styles.hero, { backgroundColor: theme.accent }]}>
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole='button'
            accessibilityLabel='Go back'>
            <Ionicons name='chevron-back' size={22} color={theme.textPrimary} />
          </Pressable>
        </SafeAreaView>

        <Image source={imageSource} style={styles.profileImage} resizeMode='cover' />
      </View>

      <View style={styles.body}>
        {loading ? (
          <View style={styles.statusBlock}>
            <ActivityIndicator size='large' color={theme.accent} />
          </View>
        ) : error || !doctor ? (
          <View style={styles.statusBlock}>
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              Unable to load doctor details right now.
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}>
              <View style={[styles.contentCard, { backgroundColor: theme.card }]}>
                <Text
                  style={[
                    styles.name,
                    { color: theme.textPrimary, fontFamily: fonts.semiBold },
                  ]}>
                  {doctorName}
                </Text>
                <Text
                  style={[
                    styles.specialty,
                    { color: theme.textPrimary, fontFamily: fonts.medium },
                  ]}>
                  {specialtyLabel}
                </Text>
                <Text style={[styles.qualifications, { color: theme.textSecondary }]}>
                  {getQualifications(doctor)}
                </Text>
                <Text style={[styles.location, { color: theme.textMuted }]}>
                  {getLocation(doctor)}
                </Text>

                <View style={styles.statsRow}>
                  <StatItem
                    icon='people-outline'
                    value='—'
                    label='Patients'
                    theme={theme}
                  />
                  <StatItem
                    icon='briefcase-outline'
                    value={formatExperience(doctor.yearsOfExperience)}
                    label='Experience'
                    theme={theme}
                  />
                  <StatItem
                    icon='star-outline'
                    value={doctor.averageRating.toFixed(1)}
                    label='Rating'
                    theme={theme}
                  />
                  <StatItem
                    icon='chatbubble-outline'
                    value={formatReviews(doctor.totalReviews)}
                    label='Reviews'
                    theme={theme}
                  />
                </View>

                <View
                  style={[
                    styles.feesCard,
                    { borderColor: theme.divider, backgroundColor: theme.background },
                  ]}>
                  <View style={styles.feeColumn}>
                    <Text style={[styles.feeLabel, { color: theme.textSecondary }]}>
                      Consultation fee
                    </Text>
                    <View style={styles.feeValueRow}>
                      <Text
                        style={[
                          styles.feeValue,
                          { color: theme.textPrimary, fontFamily: fonts.semiBold },
                        ]}>
                        {formatCurrency(doctor.consultationFee)}
                      </Text>
                      <Text style={[styles.feeSuffix, { color: theme.textMuted }]}>
                        / consultation
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.feeDivider, { backgroundColor: theme.divider }]} />

                  <View style={styles.feeColumn}>
                    <Text style={[styles.feeLabel, { color: theme.textSecondary }]}>
                      Follow-up fee
                    </Text>
                    <View style={styles.feeValueRow}>
                      <Text
                        style={[
                          styles.feeValue,
                          { color: theme.textPrimary, fontFamily: fonts.semiBold },
                        ]}>
                        {formatCurrency(getFollowUpFee(doctor))}
                      </Text>
                      <Text style={[styles.feeSuffix, { color: theme.textMuted }]}>
                        (within 15 Days)
                      </Text>
                    </View>
                  </View>
                </View>

                <Text
                  style={[
                    styles.aboutTitle,
                    { color: theme.textPrimary, fontFamily: fonts.semiBold },
                  ]}>
                  About Doctor
                </Text>
                <Text style={[styles.aboutBody, { color: theme.textSecondary }]}>
                  {displayedBio}
                  {shouldTruncateBio && !bioExpanded ? (
                    <>
                      {' '}
                      <Text
                        onPress={() => setBioExpanded(true)}
                        style={[styles.readMore, { color: theme.accent }]}>
                        Read More
                      </Text>
                    </>
                  ) : null}
                </Text>
              </View>
            </ScrollView>

            <SafeAreaView
              edges={['bottom']}
              style={[styles.footer, { backgroundColor: theme.card }]}>
              <PrimaryCtaButton
                label='Make Appointments'
                onPress={() =>
                  router.push({
                    pathname: '/select-appointment-slot',
                    params: { doctorId: doctor.id },
                  })
                }
              />
            </SafeAreaView>
          </>
        )}
      </View>
    </View>
  );
}

function StatItem({
  icon,
  label,
  theme,
  value,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  theme: ReturnType<typeof useTheme>;
  value: string;
}) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIconWrap, { backgroundColor: theme.surfaceMuted }]}>
        <Ionicons name={icon} size={18} color={theme.textSecondary} />
      </View>
      <Text
        style={[
          styles.statValue,
          { color: theme.textPrimary, fontFamily: fonts.semiBold },
        ]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  hero: {
    height: HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    zIndex: 1,
  },
  heroSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  profileImage: {
    width: PROFILE_IMAGE_WIDTH,
    height: PROFILE_IMAGE_HEIGHT,
    borderRadius: 12,
    marginBottom: -(PROFILE_IMAGE_HEIGHT * 0.42),
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  contentCard: {
    borderTopLeftRadius: CARD_TOP_RADIUS,
    borderTopRightRadius: CARD_TOP_RADIUS,
    paddingHorizontal: 20,
    paddingTop: PROFILE_IMAGE_HEIGHT * 0.48,
    minHeight: 320,
  },
  name: {
    fontSize: 22,
    textAlign: 'center',
  },
  specialty: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 6,
  },
  qualifications: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 13,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  feesCard: {
    marginTop: 24,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  feeColumn: {
    flex: 1,
    gap: 8,
  },
  feeDivider: {
    width: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
  },
  feeLabel: {
    fontSize: 13,
  },
  feeValueRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 4,
  },
  feeValue: {
    fontSize: 22,
  },
  feeSuffix: {
    fontSize: 12,
  },
  aboutTitle: {
    fontSize: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  aboutBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  readMore: {
    fontFamily: fonts.semiBold,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  statusBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

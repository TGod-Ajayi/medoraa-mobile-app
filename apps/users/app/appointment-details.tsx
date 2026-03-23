import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryCtaButton } from '../components/appointment';
import { ScreenHeader } from '../components/doctor';
import { fonts } from '../config/fonts';
import type { AppTheme } from '../config/theme';
import { useTheme } from '../config/theme';

const DOCTOR = {
  name: 'Dr. Alex Zender',
  specialty: 'Cardiology',
  qualifications: 'MBBS, FCPS(Cardiology)',
  photo:
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
};

const INSTRUCTIONS = [
  'Start meeting with a stable internet connection',
  'Avoid low light rooms for better observation',
  'Talk to Doctor loud and clear',
];

const DEFAULT_PROBLEM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

function safeDecode(s: string | undefined, fallback: string) {
  if (!s) return fallback;
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export default function AppointmentDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{
    patientName?: string;
    age?: string;
    gender?: string;
    problem?: string;
  }>();

  const patientName = safeDecode(params.patientName, 'Akash basak');
  const age = params.age ?? '26';
  const gender = safeDecode(params.gender, 'Male');
  const problemRaw = params.problem ? safeDecode(params.problem, '') : '';
  const problem = problemRaw.trim() || DEFAULT_PROBLEM;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <View style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <ScreenHeader title='Appointment Details' />

          {/* Doctor card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.divider,
              },
            ]}>
            <View style={styles.doctorRow}>
              <Image
                source={{ uri: DOCTOR.photo }}
                style={[styles.doctorPhoto, { backgroundColor: theme.accent }]}
              />
              <View style={styles.doctorText}>
                <Text
                  style={[styles.doctorName, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
                  {DOCTOR.name}
                </Text>
                <Text style={[styles.doctorSpec, { color: theme.textSecondary }]}>
                  {DOCTOR.specialty}
                </Text>
                <Text style={[styles.doctorQual, { color: theme.textMuted }]}>
                  {DOCTOR.qualifications}
                </Text>
              </View>
            </View>
          </View>

          {/* Patient details */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.divider,
              },
            ]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
              Patient Details
            </Text>
            <DetailRow label='Name' value={patientName} theme={theme} />
            <DetailRow label='Age' value={`${age} years`} theme={theme} />
            <DetailRow label='Gender' value={gender} theme={theme} />
            <View style={styles.problemBlock}>
              <View style={styles.detailRow}>
                <Text style={[styles.labelCol, { color: theme.textSecondary }]}>Problem</Text>
                <Text style={[styles.colon, { color: theme.textSecondary }]}>:</Text>
                <Text style={[styles.valueCol, { color: theme.textPrimary, flex: 1 }]}>
                  {problem}
                </Text>
              </View>
            </View>
          </View>

          {/* General instructions */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.divider,
              },
            ]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
              General Instructions
            </Text>
            {INSTRUCTIONS.map((line) => (
              <View key={line} style={styles.instructionRow}>
                <Ionicons name='checkmark-circle' size={22} color='#22C55E' />
                <Text style={[styles.instructionText, { color: theme.textPrimary }]}>
                  {line}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ height: 8 }} />
        </ScrollView>

        <SafeAreaView
          edges={['bottom']}
          style={[styles.footer, { backgroundColor: theme.background }]}>
          <PrimaryCtaButton
            label='Connect to Doctor'
            onPress={() => router.push('/consultation-complete')}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: AppTheme;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.labelCol, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.colon, { color: theme.textSecondary }]}>:</Text>
      <Text style={[styles.valueCol, { color: theme.textPrimary, flex: 1 }]}>{value}</Text>
    </View>
  );
}

const LABEL_WIDTH = 72;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 4,
  },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 14,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  doctorPhoto: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  doctorText: {
    flex: 1,
    minWidth: 0,
  },
  doctorName: {
    fontSize: 17,
  },
  doctorSpec: {
    fontSize: 15,
    marginTop: 4,
  },
  doctorQual: {
    fontSize: 13,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  labelCol: {
    width: LABEL_WIDTH,
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  colon: {
    width: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  valueCol: {
    fontSize: 14,
    lineHeight: 20,
  },
  problemBlock: {
    marginTop: 2,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});

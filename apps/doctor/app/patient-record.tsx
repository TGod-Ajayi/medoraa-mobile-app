import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { info } from '@/config/svg';

const ACCENT = '#20BEB8';
const PAGE_BG = '#F8FAFC';
const SCREEN_W = Dimensions.get('window').width;
const VITAL_CELL_W = (SCREEN_W - 16 * 2 - 10) / 2;

const VITALS = [
  { label: 'Blood pressure', value: '120/80' },
  { label: 'Heart rate', value: '78 bpm' },
  { label: 'Temperature', value: '37°C' },
  { label: 'BMI', value: '24.5' },
  { label: 'Weight', value: '79.38 kg' },
  { label: 'Height', value: "5'10\"" },
] as const;

const MEDICATIONS = [
  { name: 'Aspirin', dose: '10mg • Once daily', since: 'Since 12-05-2024' },
  { name: 'Metformin', dose: '500mg • Twice daily', since: 'Since 12-05-2024' },
] as const;

const ALLERGIES = [
  { name: 'Penicillin', type: 'Drug', severity: 'High', severityTone: 'high' as const },
  { name: 'Peanuts', type: 'Food', severity: 'Moderate', severityTone: 'moderate' as const },
] as const;

const AVATAR_BY_ID: Record<string, string> = {
  p1: 'https://randomuser.me/api/portraits/women/43.jpg',
  p2: 'https://randomuser.me/api/portraits/men/32.jpg',
  p3: 'https://randomuser.me/api/portraits/women/65.jpg',
  p4: 'https://randomuser.me/api/portraits/women/43.jpg',
};

export default function PatientRecordScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; name?: string; condition?: string }>();

  const patientName = params.name ?? 'John Smith';
  const condition = params.condition ?? 'Type 2 Diabetes';
  const recordId = params.id ?? 'p1';
  const avatarUri = AVATAR_BY_ID[recordId] ?? 'https://randomuser.me/api/portraits/men/29.jpg';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor:"#F8FAFC"}]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.headerIconBtn, { backgroundColor: '#FFFFFF' }]}>
          <Ionicons name="chevron-back" size={20} color="#667085" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Patient record</Text>
        <Pressable style={[styles.headerIconBtn, { backgroundColor: '#FFFFFF' }]}>
          <Ionicons name="ellipsis-vertical" size={18} color="#667085" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
          <View style={styles.profileRow}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View style={styles.profileText}>
              <Text style={[styles.patientName, { color: theme.textPrimary }]}>{patientName}</Text>
              <Text style={styles.profileMeta}>Male • Age: 35</Text>

              <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 12}}>
              <Text style={styles.profileMeta}>ID: MR-2024-009</Text>
              <Text style={styles.profileMeta}>D.O.B: 15-06-1985</Text>
              </View> 
            </View>
          </View>
        </View>
        <View style={styles.alertBanner}>
            <SvgXml xml={info} />
            <Text style={styles.alertText}>
              Active condition requiring regular monitoring:{' '}
              <Text style={styles.alertCondition}>{condition}</Text>
            </Text>
          </View>

        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Vitals</Text>
        <View style={styles.vitalsGrid}>
          {VITALS.map((v) => (
            <View
              key={v.label}
              style={[styles.vitalCell, { backgroundColor: '#F1F5F9', width: VITAL_CELL_W }]}>
              <Text style={styles.vitalLabel}>{v.label}</Text>
              <Text style={[styles.vitalValue, { color: theme.textPrimary }]}>{v.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionRow}>
          <Text style={[styles.sectionHeading, { color: theme.textPrimary, marginBottom: 0 }]}>
            Current medications
          </Text>
          <Pressable>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
        <View style={{ gap: 10 }}>
          {MEDICATIONS.map((m) => (
            <View key={m.name} style={[styles.medCard, { backgroundColor: '#F8FAFB' }]}>
              <View>
                <Text style={[styles.medName, { color: theme.textPrimary }]}>{m.name}</Text>
                <Text style={styles.medDose}>{m.dose}</Text>
              </View>
              <Text style={styles.medSince}>{m.since}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.sectionRow, { marginTop: 4 }]}>
          <Text style={[styles.sectionHeading, { color: theme.textPrimary, marginBottom: 0 }]}>
            Latest Consultation
          </Text>
          <Pressable>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
        <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
          <Text style={styles.consultBody}>
            Patient reports improved glucose control. A1C decreased from 7.2 to 6.8. Maintaining current medication
            regimen. Encouraged continued dietary compliance and regular exercise.
          </Text>
          <View style={styles.consultFooter}>
            <Ionicons name="calendar-outline" size={14} color="#1492FF" />
            <Text style={styles.consultDate}>2024-11-28</Text>
          </View>
        </View>

        <View style={styles.allergyHeadingRow}>
          <Text style={[styles.sectionHeading, { color: theme.textPrimary, marginBottom: 0 }]}>Allergies</Text>
         <SvgXml xml={info} />
        </View>
        <View style={{ gap: 10 }}>
          {ALLERGIES.map((a) => (
            <View key={a.name} style={styles.allergyCard}>
              <View>
                <Text style={[styles.allergyName, { color: theme.textPrimary }]}>{a.name}</Text>
                <Text style={styles.allergyType}>{a.type}</Text>
              </View>
              <View
                style={[
                  styles.severityBadge,
                  a.severityTone === 'high' ? styles.severityHigh : styles.severityModerate,
                ]}>
                <Text
                  style={[
                    styles.severityText,
                    a.severityTone === 'high' ? styles.severityTextHigh : styles.severityTextModerate,
                  ]}>
                  {a.severity}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "500",
    fontFamily: fonts.semiBold,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    borderRadius: 12,
    padding: 14,
  },
  profileRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileText: { flex: 1 },
  patientName: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fonts.semiBold,
    marginBottom: 4,
  },
  profileMeta: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    fontFamily: fonts.regular,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 10,
  },
  alertText: {
    flex: 1,
    color: '#475569',
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
    fontFamily: fonts.regular,
  },
  alertCondition: {
    color: '#DC2626',
    fontFamily: fonts.semiBold,
  },
  sectionHeading: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.semiBold,
    marginBottom: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  seeAll: {
    color: ACCENT,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  
    gap: 10,
  },
  vitalCell: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    display: "flex", 
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center"
  },
  vitalLabel: {
    color: '#64748B',
    fontSize: 12,
  
    fontWeight: "400",
    fontFamily: fonts.regular,
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
  },
  medCard: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medName: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
  },
  medDose: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  medSince: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
    fontFamily: fonts.regular,
  },
  consultBody: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: fonts.regular,
    marginBottom: 12,
  },
  consultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  consultDate: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
  allergyHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  allergyCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  allergyName: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
  },
  allergyType: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  severityBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  severityHigh: {
    backgroundColor: '#FEE2E2',
  },
  severityModerate: {
    backgroundColor: '#FEF3C7',
  },
  severityText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.semiBold,
  },
  severityTextHigh: {
    color: '#DC2626',
  },
  severityTextModerate: {
    color: '#D97706',
  },
});

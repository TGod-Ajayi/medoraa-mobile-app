import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { pdf } from '@/config/svg';

export default function ConsultationRecordScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    patient?: string;
    condition?: string;
    date?: string;
    avatar?: string;
  }>();

  const patient = params.patient ?? 'John Smith';
  const condition = params.condition ?? 'Type 2 Diabetes';
  const date = params.date ?? '2024-11-28';
  const avatar =
    params.avatar ?? 'https://randomuser.me/api/portraits/men/29.jpg';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <Ionicons name="chevron-back" size={20} color="#667085" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Consultation Record</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.profileTextWrap}>
            <Text style={[styles.name, { color: theme.textPrimary }]}>{patient}</Text>
            <Text style={styles.condition}>{condition}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color="#1492FF" />
              <Text style={styles.dateText}>{date}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Note</Text>
        <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.noteHeading, { color: theme.textPrimary }]}>Getting better</Text>
          <Text style={styles.noteBody}>
            Patient reports improved glucose control, A1C decreased from 7.2 to 6.8. Maintaining current medication regimen.
            Encouraged continued dietary compliance and regular exercise.
          </Text>
          <Pressable style={styles.viewNoteBtn}>
            <Text style={styles.viewNoteText}>View Full Note</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Prescriptions</Text>
        <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
          <View style={styles.rxItem}>
            <View>
              <Text style={[styles.rxName, { color: theme.textPrimary }]}>Aspirin</Text>
              <Text style={styles.rxDose}>10mg • Once daily</Text>
            </View>
            <Text style={styles.rxDate}>12-05-2024</Text>
          </View>
          <View style={styles.rxItem}>
            <View>
              <Text style={[styles.rxName, { color: theme.textPrimary }]}>Metformin</Text>
              <Text style={styles.rxDose}>500mg • Twice daily</Text>
            </View>
            <Text style={styles.rxDate}>12-05-2024</Text>
          </View>
          <View style={styles.pdfCard}>
            {/* <View style={styles.pdfBadge}>
              <Text style={styles.pdfBadgeText}>PDF</Text>
            </View> */}
            <View style={styles.pdfBadge}>
              <SvgXml xml={pdf} />
            </View>
            <View style={styles.pdfMetaWrap}>
              <Text style={styles.pdfName}>Rx. Akash basak</Text>
              <Text style={styles.pdfMeta}>PDF   1.5 MB</Text>
            </View>
            <Pressable style={styles.downloadBtn}>
              <Ionicons name="arrow-down" size={18} color="#20BEB8" />
            </Pressable>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Plan</Text>
        <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
          <Text style={styles.noteBody}>
            2 hours of cardio exercises every day for the next 3 months while staying strictly of veggie diets.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recorded video</Text>
        <View style={styles.videoCard}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg' }}
            style={styles.videoImage}
          />
          <View style={styles.videoOverlayTop}>
            <Ionicons name="closed-captioning-outline" size={18} color="#FFFFFF" />
            <Ionicons name="settings-outline" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.videoOverlayCenter}>
            <Ionicons name="play-circle" size={54} color="#FFFFFF" />
          </View>
          <View style={styles.videoBottomRow}>
            <Text style={styles.videoTime}>05:30</Text>
            <View style={styles.videoProgressTrack}>
              <View style={styles.videoProgressDot} />
            </View>
            <Text style={styles.videoTime}>35:30</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 , backgroundColor: 'white'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    marginBottom: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 32,
    fontFamily: fonts.semiBold,
  },
  headerSpacer: { width: 32 },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 24,
    gap: 12,
  },
  profileCard: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  profileTextWrap: { flex: 1 },
  name: { fontSize: 16, lineHeight: 22, fontFamily: fonts.semiBold },
  condition: { color: '#64748B', fontSize: 14, lineHeight: 20, marginTop: 2 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dateText: { color: '#94A3B8', fontSize: 14, lineHeight: 18 },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.semiBold,
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: 8,
    padding: 10,
  },
  noteHeading: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fonts.semiBold,
    marginBottom: 8,
  },
  noteBody: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 22,
  },
  viewNoteBtn: {
    marginTop: 10,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#20BEB8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewNoteText: {
    color: '#20BEB8',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },
  rxItem: {
    
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rxName: { fontSize: 16, lineHeight: 22, fontFamily: fonts.semiBold },
  rxDose: { color: '#475467', fontSize: 14, lineHeight: 20 },
  rxDate: { color: '#94A3B8', fontSize: 12, lineHeight: 16 },
  pdfCard: {
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pdfBadge: {
    width: 28,
    height: 20,
    borderRadius: 3,
    backgroundColor: '#F97066',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfBadgeText: { color: '#FFFFFF', fontSize: 10, fontFamily: fonts.semiBold },
  pdfMetaWrap: { flex: 1 },
  pdfName: { color: '#1E293B', fontSize: 14, lineHeight: 18, fontFamily: fonts.medium },
  pdfMeta: { color: '#64748B', fontSize: 12, lineHeight: 16 },
  downloadBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EFF4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoCard: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
    height: 200,
    position: 'relative',
  },
  videoImage: { width: '100%', height: '100%' },
  videoOverlayTop: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 10,
  },
  videoOverlayCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBottomRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoTime: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.medium,
  },
  videoProgressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
  },
  videoProgressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#20BEB8',
    marginLeft: '30%',
  },
});

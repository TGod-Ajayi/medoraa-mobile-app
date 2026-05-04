import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const ACCENT = '#20BEB8';

type RecordTag = 'Consultation notes' | 'Prescription History';
type PatientRecord = {
  id: string;
  name: string;
  condition: string;
  tags: RecordTag[];
  createdAt: string;
  updatedAt: string;
};

const patientRecords: PatientRecord[] = [
  {
    id: 'p1',
    name: 'Jane Doe',
    condition: 'Type 2 Diabetes',
    tags: ['Consultation notes'],
    createdAt: '01-12-2024',
    updatedAt: '01-12-2024',
  },
  {
    id: 'p2',
    name: 'Michael Chang',
    condition: 'Hypertension',
    tags: ['Prescription History'],
    createdAt: '01-12-2024',
    updatedAt: '01-12-2024',
  },
  {
    id: 'p3',
    name: 'Emily Parker',
    condition: 'Dysentery',
    tags: ['Prescription History', 'Consultation notes'],
    createdAt: '01-12-2024',
    updatedAt: '01-12-2024',
  },
  {
    id: 'p4',
    name: 'Jane Doe',
    condition: 'Type 2 Diabetes',
    tags: ['Consultation notes'],
    createdAt: '01-12-2024',
    updatedAt: '01-12-2024',
  },
];

export default function PatientRecordsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const filterSheetRef = useRef<BottomSheetModal>(null);
  const filterSnapPoints = useMemo(() => ['62%'], []);

  const [filterConsultationNotes, setFilterConsultationNotes] = useState(true);
  const [filterPrescriptionHistory, setFilterPrescriptionHistory] = useState(true);
  /** Placeholder until date pickers are wired */
  const periodFrom = '01-12-2024';
  const periodTo = '01-12-2024';

  const renderFilterBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.45}
        pressBehavior="close"
      />
    ),
    []
  );

  const openFilterSheet = useCallback(() => {
    filterSheetRef.current?.present();
  }, []);

  const closeFilterSheet = useCallback(() => {
    filterSheetRef.current?.dismiss();
  }, []);

  const onApplyFilter = useCallback(() => {
    filterSheetRef.current?.dismiss();
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <Ionicons name="chevron-back" size={20} color="#667085" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Patient Records</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.searchBar, { borderColor: '#B7C6DA' }]}>
        <Ionicons name="search-outline" size={22} color="#64748B" />
        <Text style={styles.searchText}>Search by patient, condition</Text>
        <Pressable
          onPress={openFilterSheet}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Filter records">
          <Ionicons name="options-outline" size={22} color="#64748B" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {patientRecords.map((item) => (
          <Pressable
            key={item.id}
            onPress={() =>
              router.push({
                pathname: '/patient-record',
                params: {
                  id: item.id,
                  name: item.name,
                  condition: item.condition,
                },
              } as never)
            }
            style={[styles.card, { backgroundColor: theme.card }]}
            accessibilityRole="button"
            accessibilityLabel={`Open patient record for ${item.name}`}>
            <View style={styles.rowTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A" }]}>{item.name}</Text>
                <Text style={[styles.condition , { color: colorScheme === "dark" ? "#ffffff" : "#475569" }]}>{item.condition}</Text>
              </View>
              <View style={styles.chevronBtn}>
                <Ionicons name="chevron-forward" size={18} color="#23C5CF" />
              </View>
            </View>

            <View style={styles.tagsRow}>
              {item.tags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tagPill,
                    {
                      backgroundColor:
                        colorScheme === 'dark' ? '#1E293B' : '#F8FAFC',
                      borderColor: colorScheme === 'dark' ? '#475569' : '#64748B',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color: colorScheme === 'dark' ? '#E2E8F0' : '#475467',
                      },
                    ]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.metaStrip}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color="#1492FF" />
                <Text style={styles.metaText}>Created: {item.createdAt}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color="#22C55E" />
                <Text style={styles.metaText}>Updated: {item.updatedAt}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <BottomSheetModal
        ref={filterSheetRef}
        snapPoints={filterSnapPoints}
        enablePanDownToClose
        backdropComponent={renderFilterBackdrop}
        handleIndicatorStyle={styles.sheetHandle}
        backgroundStyle={[styles.sheetBg, { backgroundColor: theme.card }]}
        bottomInset={Math.max(insets.bottom, 12)}>
        <BottomSheetView
          style={[styles.sheetInner, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>Filter records</Text>
            <Pressable
              onPress={closeFilterSheet}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close filter">
              <Ionicons name="close" size={24} color="#64748B" />
            </Pressable>
          </View>

          <Text style={styles.sheetSectionLabel}>Record type</Text>
          <Pressable
            style={styles.checkRow}
            onPress={() => setFilterConsultationNotes((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: filterConsultationNotes }}>
            <View
              style={[
                styles.checkbox,
                filterConsultationNotes && styles.checkboxChecked,
              ]}>
              {filterConsultationNotes ? (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              ) : null}
            </View>
            <Text style={[styles.checkLabel, { color: theme.textPrimary }]}>Consultation notes</Text>
          </Pressable>
          <Pressable
            style={styles.checkRow}
            onPress={() => setFilterPrescriptionHistory((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: filterPrescriptionHistory }}>
            <View
              style={[
                styles.checkbox,
                filterPrescriptionHistory && styles.checkboxChecked,
              ]}>
              {filterPrescriptionHistory ? (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              ) : null}
            </View>
            <Text style={[styles.checkLabel, { color: theme.textPrimary }]}>
              Prescription history
            </Text>
          </Pressable>

          <Text style={[styles.sheetSectionLabel, styles.periodLabel]}>Period</Text>
          <Text style={[styles.dateFieldLabel, { color: theme.textSecondary }]}>From</Text>
          <Pressable style={[styles.dateField, { borderColor: '#CBD5E1' }]}>
            <Text style={[styles.dateFieldText, { color: theme.textPrimary }]}>{periodFrom}</Text>
            <Ionicons name="calendar-outline" size={20} color="#64748B" />
          </Pressable>
          <Text style={[styles.dateFieldLabel, { color: theme.textSecondary }]}>To</Text>
          <Pressable style={[styles.dateField, { borderColor: '#CBD5E1' }]}>
            <Text style={[styles.dateFieldText, { color: theme.textPrimary }]}>{periodTo}</Text>
            <Ionicons name="calendar-outline" size={20} color="#64748B" />
          </Pressable>

          <Pressable style={styles.applyBtn} onPress={onApplyFilter}>
            <Text style={styles.applyBtnText}>Apply Filter</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    marginBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 26,
    color: "#0F172A",
    fontFamily: fonts.semiBold,
  },
  headerSpacer: { width: 40 },
  searchBar: {
    marginHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchText: {
    flex: 1,
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.regular,
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: fonts.semiBold,
    marginBottom: 4,
  },
  condition: {
    
    fontSize: 14,
    fontWeight: "400",
    fontFamily: fonts.regular,
  },
  chevronBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tagPill: {
    borderColor: '#64748B',
    borderWidth: 0.6,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: 'transparent',
  },
  tagText: {
    color: '#475467',
    fontSize: 10,
    fontWeight: "500",
    fontFamily: fonts.medium,
  },
  metaStrip: {
    borderRadius: 8,
    backgroundColor: '#F2F5F8',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#475467',
    fontSize: 12,
    fontWeight: "400",
    fontFamily: fonts.regular,
  },
  sheetHandle: {
    backgroundColor: '#CBD5E1',
    width: 40,
  },
  sheetBg: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  sheetInner: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: fonts.semiBold,
  },
  sheetSectionLabel: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
    marginBottom: 10,
  },
  periodLabel: {
    marginTop: 18,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  checkLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.regular,
  },
  dateFieldLabel: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
    fontFamily: fonts.medium,
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 48,
    marginBottom: 12,
  },
  dateFieldText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.regular,
  },
  applyBtn: {
    backgroundColor: ACCENT,
    borderRadius: 24,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
  },
});

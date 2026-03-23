import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppointmentListCard,
  type AppointmentListStatus,
} from '../../components/appointment';
import { ScreenHeader } from '../../components/doctor';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type TabKey = AppointmentListStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

type Row = {
  id: string;
  doctorName: string;
  specialty: string;
  qualifications: string;
  dateTimeLabel: string;
  photoUri: string;
  status: AppointmentListStatus;
};

const MOCK: Row[] = [
  {
    id: '1',
    doctorName: 'Dr. Akash basak',
    specialty: 'Cardiology',
    qualifications: 'MBBS, FCPS(Cardiology)',
    dateTimeLabel: '15 Oct 2023 | 09:30 PM',
    photoUri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop',
    status: 'upcoming',
  },
  {
    id: '2',
    doctorName: 'Dr. Mizanur',
    specialty: 'Cardiology',
    qualifications: 'MBBS, FCPS(Cardiology)',
    dateTimeLabel: '23 Sept 2023 | 12:30 AM',
    photoUri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop',
    status: 'upcoming',
  },
  {
    id: '3',
    doctorName: 'Dr. Alex Zender',
    specialty: 'Cardiology',
    qualifications: 'MBBS, FCPS(Cardiology)',
    dateTimeLabel: '20 Sept 2023 | 02:30 PM',
    photoUri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
    status: 'upcoming',
  },
  {
    id: '4',
    doctorName: 'Dr. Sarah Chen',
    specialty: 'Neurology',
    qualifications: 'MBBS, MD(Neurology)',
    dateTimeLabel: '10 Aug 2023 | 04:00 PM',
    photoUri: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop',
    status: 'completed',
  },
  {
    id: '5',
    doctorName: 'Dr. James Wilson',
    specialty: 'Dermatology',
    qualifications: 'MBBS, DDVL',
    dateTimeLabel: '02 Aug 2023 | 11:00 AM',
    photoUri: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop',
    status: 'cancelled',
  },
];

export default function AppointmentTabScreen() {
  const theme = useTheme();
  const [tab, setTab] = useState<TabKey>('upcoming');

  const rows = useMemo(() => MOCK.filter((r) => r.status === tab), [tab]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps='handled'>
        <ScreenHeader title='Appointments' />

        {/* Segment tabs */}
        <View style={styles.segmentOuter}>
          <View style={styles.segmentRow}>
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <Pressable
                  key={t.key}
                  style={styles.tabPress}
                  onPress={() => setTab(t.key)}
                  accessibilityRole='tab'
                  accessibilityState={{ selected: active }}>
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: active ? theme.accent : theme.textSecondary,
                        fontFamily: active ? fonts.semiBold : fonts.regular,
                      },
                    ]}>
                    {t.label}
                  </Text>
                  <View
                    style={[
                      styles.tabIndicator,
                      { backgroundColor: active ? theme.accent : 'transparent' },
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>
          <View style={[styles.tabBaseline, { backgroundColor: theme.divider }]} />
        </View>

        <View style={styles.list}>
          {rows.length === 0 ? (
            <Text style={[styles.empty, { color: theme.textSecondary }]}>
              No {tab} appointments.
            </Text>
          ) : (
            rows.map((row) => (
              <AppointmentListCard
                key={row.id}
                doctorName={row.doctorName}
                specialty={row.specialty}
                qualifications={row.qualifications}
                dateTimeLabel={row.dateTimeLabel}
                photoUri={row.photoUri}
                status={row.status}
                onCancel={row.status === 'upcoming' ? () => {} : undefined}
                onReschedule={row.status === 'upcoming' ? () => {} : undefined}
                onSecondaryAction={
                  row.status !== 'upcoming' ? () => {} : undefined
                }
                secondaryLabel={
                  row.status === 'completed'
                    ? 'View details'
                    : row.status === 'cancelled'
                      ? 'Book again'
                      : undefined
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 4,
  },
  segmentOuter: {
    marginBottom: 16,
  },
  segmentRow: {
    flexDirection: 'row',
  },
  tabPress: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 10,
  },
  tabLabel: {
    fontSize: 15,
  },
  tabIndicator: {
    marginTop: 4,
    height: 3,
    width: '70%',
    borderRadius: 2,
  },
  tabBaseline: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  list: {
    paddingTop: 4,
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 32,
  },
});

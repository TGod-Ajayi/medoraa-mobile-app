import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ConsultationItem = {
  id: string;
  name: string;
  condition: string;
  dateTime: string;
  avatar: string;
};

const consultations: ConsultationItem[] = [
  {
    id: 'c1',
    name: 'Jane Doe',
    condition: 'Type 2 Diabetes',
    dateTime: '01-12-2024, 09:00',
    avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
  },
  {
    id: 'c2',
    name: 'Michael Chang',
    condition: 'Hypertension',
    dateTime: '01-12-2024, 10:00',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'c3',
    name: 'Emily Parker',
    condition: 'Dysentery',
    dateTime: '01-12-2024, 10:00',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 'c4',
    name: 'Ronald Richards',
    condition: 'Type 2 Diabetes',
    dateTime: '01-12-2024, 09:00',
    avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
  },
  {
    id: 'c5',
    name: 'Courtney Henry',
    condition: 'Hypertension',
    dateTime: '01-12-2024, 10:00',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
];

export default function ConsultationHistoryScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <Ionicons name="chevron-back" size={20} color="#667085" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Consultation History
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {consultations.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              router.push({
                pathname: '/consultation-record',
                params: {
                  patient: item.name,
                  condition: item.condition,
                  date: item.dateTime.split(',')[0] ?? item.dateTime,
                  avatar: item.avatar,
                },
              } as never)
            }
            style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.rowTop}>
              <View style={styles.patientWrap}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View>
                  <Text style={[styles.name, { color: theme.textPrimary }]}>{item.name}</Text>
                  <Text style={styles.condition}>{item.condition}</Text>
                </View>
              </View>
              <Pressable style={styles.chevronBtn}>
                <Ionicons name="chevron-forward" size={18} color="#23C5CF" />
              </Pressable>
            </View>

            <View style={styles.dateStrip}>
              <Ionicons name="calendar-outline" size={14} color="#1492FF" />
              <Text style={styles.dateText}>{item.dateTime}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
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
  headerSpacer: {
    width: 32,
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 10,
  },
  card: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  patientWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 6,
  },
  name: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
  },
  condition: {
    color: '#667085',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
  },
  chevronBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateStrip: {
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    minHeight: 34,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: '#667085',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
  },
});

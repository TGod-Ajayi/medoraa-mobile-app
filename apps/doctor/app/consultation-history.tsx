import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import {
  ConsultationHistoryFilter,
  useConsultationHistory,
  type ConsultationHistoryItem,
} from '@repo/ui/graphql';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_AVATAR = require('../assets/images/medical1.png');
const EMPTY_HISTORY_IMAGE = require('../assets/images/emptyDept.png');

type ConsultationRow = {
  id: string;
  name: string;
  condition: string;
  dateTime: string;
  avatar: ImageSourcePropType;
};

function getPatientName(patient: ConsultationHistoryItem['patient']) {
  const { firstName, lastName } = patient.user;
  return [firstName, lastName].filter(Boolean).join(' ').trim() || 'Patient';
}

function getPatientAvatar(profilePhoto?: string | null): ImageSourcePropType {
  return profilePhoto ? { uri: profilePhoto } : DEFAULT_AVATAR;
}

function getConditionLabel(appointment: ConsultationHistoryItem) {
  const notes = appointment.notes?.trim();
  if (notes) return notes;

  return appointment.type.replace(/_/g, ' ') || 'Consultation';
}

function formatConsultationDateTime(startDate: string) {
  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) return '—';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const timePart = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${day}-${month}-${year}, ${timePart}`;
}

function mapConsultation(appointment: ConsultationHistoryItem): ConsultationRow {
  return {
    id: appointment.id,
    name: getPatientName(appointment.patient),
    condition: getConditionLabel(appointment),
    dateTime: formatConsultationDateTime(appointment.startDate),
    avatar: getPatientAvatar(appointment.patient.user.profilePhoto),
  };
}

export default function ConsultationHistoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { consultations, loading, error, refetch } = useConsultationHistory({
    filter: ConsultationHistoryFilter.Completed,
  });

  const rows = useMemo(
    () => consultations.map(mapConsultation),
    [consultations],
  );

  useEffect(() => {
    console.log(
      'consultationHistory response\n' +
        JSON.stringify(
          {
            filter: ConsultationHistoryFilter.Completed,
            consultations,
            loading,
            error: error?.message ?? null,
          },
          null,
          2,
        ),
    );
  }, [consultations, error, loading]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
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

      {loading && rows.length === 0 ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : error ? (
        <View style={styles.centeredState}>
          <Text style={[styles.stateText, { color: theme.textSecondary }]}>
            Could not load consultation history.
          </Text>
          <Pressable
            onPress={() => void refetch()}
            style={[styles.retryBtn, { borderColor: theme.accent }]}>
            <Text style={[styles.retryText, { color: theme.accent }]}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.contentContainer,
            rows.length === 0 && styles.contentContainerEmpty,
          ]}>
          {rows.length === 0 ? (
            <View style={styles.emptyState}>
              <Image
                source={EMPTY_HISTORY_IMAGE}
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                No consultation history yet
              </Text>
              <Text style={[styles.stateText, { color: theme.textSecondary }]}>
                Completed consultations will appear here.
              </Text>
            </View>
          ) : (
            rows.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: '/consultation-record',
                    params: {
                      id: item.id,
                      patient: item.name,
                      condition: item.condition,
                      date: item.dateTime.split(',')[0] ?? item.dateTime,
                      avatar:
                        typeof item.avatar === 'object' &&
                        item.avatar !== null &&
                        'uri' in item.avatar &&
                        item.avatar.uri
                          ? String(item.avatar.uri)
                          : '',
                    },
                  } as never)
                }
                style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.rowTop}>
                  <View style={styles.patientWrap}>
                    <Image source={item.avatar} style={styles.avatar} />
                    <View style={styles.patientText}>
                      <Text
                        style={[styles.name, { color: theme.textPrimary }]}
                        numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.condition} numberOfLines={2}>
                        {item.condition}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.chevronBtn}>
                    <Ionicons name="chevron-forward" size={18} color="#23C5CF" />
                  </View>
                </View>

                <View style={styles.dateStrip}>
                  <Ionicons name="calendar-outline" size={14} color="#1492FF" />
                  <Text style={styles.dateText}>{item.dateTime}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
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
  contentContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 8,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  stateText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
  retryBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retryText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  patientText: {
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
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
    marginLeft: 8,
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

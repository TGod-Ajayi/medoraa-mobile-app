import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const recordItems = [
  {
    id: 'consultation-history',
    title: 'Consultation history',
    subtitle: 'Record of all past consultations',
  },
  {
    id: 'patient-records',
    title: 'Patient records',
    subtitle: 'Available medical history of all your patients',
  },
] as const;

const Records = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Records</Text>

        <View style={styles.listWrap}>
          {recordItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                if (item.id === 'consultation-history') {
                  router.push('/consultation-history' as never);
                }
                if (item.id === 'patient-records') {
                  router.push('/patient-records' as never);
                }
              }}
              style={[styles.card, { backgroundColor: theme.card }]}
              accessibilityRole="button">
              <View style={styles.textWrap}>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.cardSubtitle, { color: '#64748B' }]}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Records;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 32,
    fontFamily: fonts.semiBold,
    marginBottom: 18,
  },
  listWrap: {
    gap: 10,
  },
  card: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textWrap: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
  },
});
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { ScreenHeader } from '../components/doctor';
import { google } from '../config/svg';
import { fonts } from '../config/fonts';
import { useTheme } from '../config/theme';
import { PrimaryCtaButton } from '../components/appointment';

type PaymentMethod = 'paypal' | 'google' | 'apple';

const METHODS: {
  id: PaymentMethod;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'paypal',
    label: 'Paypal',
    icon: <FontAwesome5 name='paypal' size={28} color='#003087' />,
  },
  {
    id: 'google',
    label: 'Google pay',
    icon: <SvgXml xml={google} width={28} height={28} />,
  },
  {
    id: 'apple',
    label: 'Apple Pay',
    icon: <MaterialCommunityIcons name='apple' size={30} color='#000000' />,
  },
];

export default function PaymentsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selected, setSelected] = useState<PaymentMethod>('paypal');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.flex}>
        <View style={styles.content}>
          <ScreenHeader title='Payments' />

          <Text style={[styles.subtitle, { color: theme.textPrimary }]}>
            Select the payment method want to use
          </Text>

          <View style={styles.methodList}>
            {METHODS.map((m) => {
              const isSelected = selected === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setSelected(m.id)}
                  accessibilityRole='radio'
                  accessibilityState={{ selected: isSelected }}
                  style={[
                    styles.methodCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.divider,
                    },
                  ]}>
                  <View style={styles.methodLeft}>
                    <View style={styles.iconWrap}>{m.icon}</View>
                    <Text
                      style={[
                        styles.methodLabel,
                        { color: theme.textPrimary, fontFamily: fonts.semiBold },
                      ]}>
                      {m.label}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: isSelected ? theme.accent : theme.divider },
                    ]}>
                    {isSelected ? (
                      <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={[styles.addNew, { borderColor: theme.accent }]}
            accessibilityRole='button'>
            <Text style={[styles.addNewLabel, { color: theme.accent, fontFamily: fonts.semiBold }]}>
              Add New
            </Text>
          </Pressable>
        </View>

        <SafeAreaView
          edges={['bottom']}
          style={[styles.footer, { backgroundColor: theme.background }]}>
          <PrimaryCtaButton label='Pay Now' onPress={() => router.push('/patient-details')} />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 4,
  },
  methodList: {
    gap: 14,
    marginBottom: 20,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    minWidth: 0,
  },
  iconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodLabel: {
    fontSize: 16,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  addNew: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addNewLabel: {
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});

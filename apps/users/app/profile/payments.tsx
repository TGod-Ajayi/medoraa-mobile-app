import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '../../components/doctor';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type PaymentMethodId = 'paypal' | 'googlepay' | 'applepay';

const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  faName: 'paypal' | 'google' | 'apple';
  /** Brand color, or 'adaptive' for Apple (follows theme text) */
  iconColor: string | 'adaptive';
}[] = [
  { id: 'paypal', label: 'Paypal', faName: 'paypal', iconColor: '#0070BA' },
  { id: 'googlepay', label: 'Google pay', faName: 'google', iconColor: '#4285F4' },
  { id: 'applepay', label: 'Apple Pay', faName: 'apple', iconColor: 'adaptive' },
];

/**
 * Payments — select default payment method (PayPal, Google Pay, Apple Pay) + Add New.
 */
export default function PaymentsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selected, setSelected] = useState<PaymentMethodId>('paypal');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps='handled'>
          <ScreenHeader title='Payments' />

          <Text style={[styles.hint, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
            Select the payment method you want to use
          </Text>

          <View style={styles.list}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selected === method.id;
              return (
                <Pressable
                  key={method.id}
                  onPress={() => setSelected(method.id)}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.divider,
                      shadowColor: '#000',
                    },
                    pressed && styles.cardPressed,
                  ]}
                  accessibilityRole='radio'
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={method.label}>
                  <FontAwesome5
                    name={method.faName}
                    brand
                    size={32}
                    color={method.iconColor === 'adaptive' ? theme.textPrimary : method.iconColor}
                    style={styles.brandIcon}
                  />
                  <Text
                    style={[
                      styles.cardLabel,
                      { color: theme.textPrimary, fontFamily: fonts.medium },
                    ]}
                    numberOfLines={1}>
                    {method.label}
                  </Text>
                  <View
                    style={[
                      styles.radioOuter,
                      {
                        borderColor: theme.accent,
                        borderWidth: 2,
                        backgroundColor: 'transparent',
                      },
                    ]}>
                    {isSelected ? <View style={[styles.radioInner, { backgroundColor: theme.accent }]} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={[styles.footer, { backgroundColor: theme.background }]}>
          <Pressable
            onPress={() => router.push('/profile/add-payment')}
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: theme.accent },
              pressed && styles.addBtnPressed,
            ]}
            accessibilityRole='button'
            accessibilityLabel='Add new payment method'>
            <Text style={[styles.addBtnText, { fontFamily: fonts.semiBold }]}>Add New</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 4,
  },
  hint: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    marginTop: 4,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 64,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.94,
  },
  brandIcon: {
    width: 36,
    textAlign: 'center',
    marginRight: 12,
  },
  cardLabel: {
    flex: 1,
    fontSize: 16,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  addBtn: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnPressed: {
    opacity: 0.92,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

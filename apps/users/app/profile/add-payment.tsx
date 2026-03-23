import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Input } from '../../components';
import { ScreenHeader } from '../../components/doctor';
import { PrimaryCtaButton } from '../../components/appointment';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type CardNetworkId = 'mastercard' | 'visa' | 'skrill';

const CARD_NETWORKS: { id: CardNetworkId }[] = [
  { id: 'mastercard' },
  { id: 'visa' },
  { id: 'skrill' },
];

function SkrillMark() {
  return (
    <View style={styles.skrillBadge}>
      <Text style={styles.skrillText}>Skrill</Text>
    </View>
  );
}

/**
 * Add card / wallet — network chips + card form + Next.
 */
export default function AddPaymentMethodScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [network, setNetwork] = useState<CardNetworkId>('mastercard');
  const [cardHolder, setCardHolder] = useState('AKASH BASAK');
  const [cardNumber, setCardNumber] = useState('1245 9821 6418 3214');
  const [expiry, setExpiry] = useState('09 / 07 / 25');
  const [cvv, setCvv] = useState('352');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps='handled'>
          <ScreenHeader title='Add Payment Method' />

          <Text style={[styles.hint, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
            Select the payment method you want to use
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
            style={styles.chipScroll}>
            {CARD_NETWORKS.map((n) => {
              const selected = network === n.id;
              return (
                <Pressable
                  key={n.id}
                  onPress={() => setNetwork(n.id)}
                  style={[
                    styles.chipOuter,
                    {
                      borderColor: selected ? theme.accent : 'transparent',
                      backgroundColor: theme.card,
                      shadowColor: '#000',
                    },
                  ]}
                  accessibilityRole='radio'
                  accessibilityState={{ selected }}
                  accessibilityLabel={
                    n.id === 'mastercard' ? 'Mastercard' : n.id === 'visa' ? 'Visa' : 'Skrill'
                  }>
                  <View style={styles.chipInner}>
                    {n.id === 'mastercard' ? (
                      <FontAwesome5 name='cc-mastercard' brand size={36} color='#EB001B' />
                    ) : null}
                    {n.id === 'visa' ? (
                      <FontAwesome5 name='cc-visa' brand size={36} color='#1A1F71' />
                    ) : null}
                    {n.id === 'skrill' ? <SkrillMark /> : null}
                  </View>
                  <Text
                    style={[
                      styles.chipCaption,
                      { color: theme.textSecondary, fontFamily: fonts.regular },
                    ]}
                    numberOfLines={1}>
                    {n.id === 'mastercard' ? 'mastercard' : n.id === 'visa' ? 'VISA' : 'Skrill'}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Input
            theme={theme}
            label='Card Holder Name'
            value={cardHolder}
            onChangeText={setCardHolder}
            autoCapitalize='characters'
            autoCorrect={false}
          />

          <Input
            theme={theme}
            label='Card Number'
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType='number-pad'
            maxLength={19}
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Input
                theme={theme}
                label='Expiry Date'
                value={expiry}
                onChangeText={setExpiry}
                containerStyle={styles.flex1}
                rightContent={<Ionicons name='calendar-outline' size={20} color={theme.textSecondary} />}
              />
            </View>
            <View style={[styles.rowItem, styles.cvvCol]}>
              <Input
                theme={theme}
                label='CVV'
                value={cvv}
                onChangeText={setCvv}
                keyboardType='number-pad'
                maxLength={4}
                containerStyle={styles.flex1}
              />
            </View>
          </View>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={[styles.footer, { backgroundColor: theme.background }]}>
          <PrimaryCtaButton label='Next' onPress={() => router.back()} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const CHIP = 100;

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
  chipScroll: {
    marginBottom: 24,
    marginHorizontal: -4,
  },
  chipRow: {
    paddingHorizontal: 4,
    gap: 16,
    paddingBottom: 4,
  },
  chipOuter: {
    width: CHIP,
    alignItems: 'center',
    borderRadius: CHIP / 2,
    borderWidth: 2,
    paddingTop: 14,
    paddingBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chipInner: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCaption: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  skrillBadge: {
    backgroundColor: '#6B2D90',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  skrillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: fonts.semiBold,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  rowItem: {
    flex: 1,
    minWidth: 0,
  },
  cvvCol: {
    flex: 0,
    minWidth: 110,
    maxWidth: 130,
  },
  flex1: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
});

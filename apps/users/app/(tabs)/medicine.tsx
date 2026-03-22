import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryCard, ProductCard, SectionHeader } from '../../components/home';
import { ScreenHeader } from '../../components/doctor';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

const CARD_WIDTH = 168;
const CATEGORY_WIDTH = 168;

const CATEGORIES: {
  id: string;
  label: string;
  bg: string;
  image: { uri: string };
}[] = [
  {
    id: 'rx',
    label: 'Prescribed Medicine',
    bg: '#FFE4D6',
    image: {
      uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop',
    },
  },
  {
    id: 'herbal',
    label: 'Herbal Medicine',
    bg: '#D1FAE5',
    image: {
      uri: 'https://images.unsplash.com/photo-1471864196181-132ddf8b2d48?w=300&h=300&fit=crop',
    },
  },
  {
    id: 'equip',
    label: 'Equipments',
    bg: '#E9D5FF',
    image: {
      uri: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&h=300&fit=crop',
    },
  },
  {
    id: 'wellness',
    label: 'Sexual Wellness',
    bg: '#FBCFE8',
    image: {
      uri: 'https://images.unsplash.com/photo-1550572017-edd951aa8f14?w=300&h=300&fit=crop',
    },
  },
];

const PRESCRIBED_PRODUCTS: {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  discountLabel?: string;
  image: { uri: string };
}[] = [
  {
    id: 'pantonix',
    title: 'Pantonix Tablet 20mg',
    subtitle: '10 tablets',
    price: '$8.55',
    originalPrice: '$10.99',
    discountLabel: '-22%',
    image: {
      uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    },
  },
  {
    id: 'trupan',
    title: 'Trupan Tablet 20mg',
    subtitle: '10 tablets',
    price: '$5.00',
    image: {
      uri: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
    },
  },
];

const SKIN_HAIR_PRODUCTS: {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  image: { uri: string };
}[] = [
  {
    id: 'beardo',
    title: 'BEARDO Beard oil',
    subtitle: '250gm',
    price: '$15.55',
    image: {
      uri: 'https://images.unsplash.com/photo-1621607512214-7f929e049731?w=400&h=400&fit=crop',
    },
  },
  {
    id: 'ultimate',
    title: 'ULTIMATE facewash',
    subtitle: '180gm',
    price: '$8.55',
    image: {
      uri: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    },
  },
];

/** Medicine shop — pharmacy catalog (reuses home cards + shared header). */
export default function MedicineTabScreen() {
  const theme = useTheme();
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title='Medicine shop'
          rightSlot={
            <Pressable
              style={[styles.headerIconBtn, { backgroundColor: theme.card }]}
              accessibilityRole='button'
              accessibilityLabel='Shopping cart'>
              <Ionicons name='cart-outline' size={22} color={theme.textSecondary} />
            </Pressable>
          }
        />

        {/* Promo banner */}
        <View
          style={[
            styles.promo,
            { backgroundColor: theme.promoBannerBg, borderColor: theme.divider },
          ]}>
          <View style={styles.promoLeft}>
            <Text style={[styles.promoTitle, { color: theme.promoBannerText, fontFamily: fonts.semiBold }]}>
              Get 20% OFF
            </Text>
            <Text style={[styles.promoSub, { color: theme.promoBannerText }]}>
              On all items on first order
            </Text>
            <Pressable
              style={[styles.promoBtn, { backgroundColor: theme.accent }]}
              accessibilityRole='button'>
              <Text style={[styles.promoBtnText, { fontFamily: fonts.semiBold }]}>Order Now</Text>
            </Pressable>
          </View>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
            }}
            style={styles.promoImage}
            resizeMode='contain'
          />
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchWrap,
            { backgroundColor: theme.surfaceMuted, borderColor: theme.inputBorder },
          ]}>
          <Ionicons name='search' size={20} color={theme.textMuted} />
          <TextInput
            placeholder='Search by Product name or Category'
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
        </View>

        {/* Categories */}
        <SectionHeader title='Categories' onPressSeeAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hRow}
          style={styles.hScroll}>
          {CATEGORIES.map((c) => (
            <CategoryCard
              key={c.id}
              label={c.label}
              backgroundColor={c.bg}
              image={c.image}
              wrapStyle={{ width: CATEGORY_WIDTH, marginBottom: 0 }}
              onPress={() => {}}
            />
          ))}
        </ScrollView>

        {/* Prescribed Medicine */}
        <SectionHeader title='Prescribed Medicine' onPressSeeAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hRow}
          style={styles.hScroll}>
          {PRESCRIBED_PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              title={p.title}
              subtitle={p.subtitle}
              price={p.price}
              originalPrice={p.originalPrice}
              discountLabel={p.discountLabel}
              image={p.image}
              cardStyle={{ width: CARD_WIDTH, marginBottom: 0 }}
              wishlisted={!!wishlist[p.id]}
              onWishlistPress={() =>
                setWishlist((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
              }
              onAddPress={() => {}}
            />
          ))}
        </ScrollView>

        {/* Skin & Hair care */}
        <SectionHeader title='Skin & Hair care' onPressSeeAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hRow}
          style={styles.hScroll}>
          {SKIN_HAIR_PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              title={p.title}
              subtitle={p.subtitle}
              price={p.price}
              originalPrice={p.originalPrice}
              image={p.image}
              cardStyle={{ width: CARD_WIDTH, marginBottom: 0 }}
              wishlisted={!!wishlist[p.id]}
              onWishlistPress={() =>
                setWishlist((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
              }
              onAddPress={() => {}}
            />
          ))}
        </ScrollView>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 4,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  promoLeft: {
    flex: 1,
    paddingRight: 8,
  },
  promoTitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  promoSub: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.85,
  },
  promoBtn: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  promoBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  promoImage: {
    width: 100,
    height: 100,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  hScroll: {
    marginHorizontal: -20,
    marginBottom: 8,
  },
  hRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingRight: 8,
  },
});

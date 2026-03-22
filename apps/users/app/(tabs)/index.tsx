import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import type { AppTheme } from '../../config/theme';
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
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

const AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop';

const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=280&fit=crop',
];

const DOCTOR_PHOTOS = [
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
];

const services = [
  { title: 'Instant Consultation', subtitle: 'Start from $50' },
  { title: 'Book a Specialist', subtitle: 'Start from $100' },
  { title: 'Order Medicine', subtitle: 'Delivery in 1 hour' },
];

const departments: { name: string; icon: string; bg: string }[] = [
  { name: 'Neurology', icon: 'brain', bg: '#1E4D3F' },
  { name: 'Cardiology', icon: 'heart-pulse', bg: '#4A1E2E' },
  { name: 'Gynecology', icon: 'human-pregnant', bg: '#1E3A5C' },
  { name: 'Pediatrics', icon: 'baby-face-outline', bg: '#2D3748' },
  { name: 'Allergy', icon: 'allergy', bg: '#1E3A5C' },
  { name: 'Dentist', icon: 'tooth-outline', bg: '#1A5C5C' },
  { name: 'Urology', icon: 'pill', bg: '#4A1E28' },
  { name: 'Gastrology', icon: 'food-apple', bg: '#1E4D4D' },
];

const doctorFilters = [
  'All doctor',
  'Cardiology',
  'Neurology',
  'Dentist',
];

const HEALTHCARE_CATEGORIES: {
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

const POPULAR_PRODUCTS: {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  discountLabel?: string;
  image: { uri: string };
}[] = [
  {
    id: 'p1',
    title: 'Pantonix Tablet 20mg',
    subtitle: '10 tablets',
    price: '$8.55',
    originalPrice: '$10.99',
    discountLabel: '-30%',
    image: {
      uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    },
  },
  {
    id: 'p2',
    title: 'Vitamin D3 Softgel',
    subtitle: '30 capsules',
    price: '$12.00',
    image: {
      uri: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
    },
  },
  {
    id: 'p3',
    title: 'Cough Syrup 100ml',
    subtitle: '1 bottle',
    price: '$6.25',
    originalPrice: '$8.50',
    discountLabel: '-26%',
    image: {
      uri: 'https://images.unsplash.com/photo-1628771065518-0d82f826846c?w=400&h=400&fit=crop',
    },
  },
  {
    id: 'p4',
    title: 'Omega-3 Fish Oil',
    subtitle: '60 softgels',
    price: '$18.99',
    image: {
      uri: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop',
    },
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [filter, setFilter] = useState(0);
  const [fav1, setFav1] = useState(false);
  const [fav2, setFav2] = useState(true);
  const [productWishlist, setProductWishlist] = useState<Record<string, boolean>>({
    p2: true,
  });

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.push('/profile')}
            style={styles.headerLeft}
            accessibilityRole='button'
            accessibilityLabel='Open profile'>
            <Image source={{ uri: AVATAR }} style={styles.avatar} />
            <View>
              <Text style={[styles.hello, { color: theme.textSecondary }]}>
                Hello!
              </Text>
              <Text
                style={[
                  styles.userName,
                  { color: theme.textPrimary, fontFamily: fonts.semiBold },
                ]}>
                Zenifer Aniston
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={[styles.iconBtn, { backgroundColor: theme.card }]}
            accessibilityRole='button'
            accessibilityLabel='Notifications'>
            <Ionicons name='notifications-outline' size={22} color={theme.textPrimary} />
            <View style={styles.notifDot} />
          </Pressable>
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchWrap,
            { backgroundColor: theme.surfaceMuted },
          ]}>
          <Ionicons name='search' size={20} color={theme.textMuted} />
          <TextInput
            placeholder='Search by Doctor name or department'
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
        </View>

        {/* Services */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.textPrimary, fontFamily: fonts.semiBold },
          ]}>
          Services we offer
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesRow}>
          {services.map((s, i) => (
            <View
              key={s.title}
              style={[styles.serviceCard, { backgroundColor: theme.card }]}>
              <Image
                source={{ uri: SERVICE_IMAGES[i] }}
                style={styles.serviceImage}
              />
              <Text
                style={[
                  styles.serviceTitle,
                  { color: theme.textPrimary, fontFamily: fonts.semiBold },
                ]}>
                {s.title}
              </Text>
              <Text style={[styles.serviceSub, { color: theme.textSecondary }]}>
                {s.subtitle}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Departments */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.textPrimary, fontFamily: fonts.semiBold },
            ]}>
            Departments
          </Text>
          <Pressable>
            <Text style={[styles.seeAll, { color: theme.accent }]}>See All</Text>
          </Pressable>
        </View>
        <View style={styles.deptGrid}>
          {departments.map((d) => (
            <Pressable
              key={d.name}
              style={styles.deptItem}
              accessibilityRole='button'
              accessibilityLabel={d.name}>
              <View style={[styles.deptIconWrap, { backgroundColor: d.bg }]}>
                <MaterialCommunityIcons
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  name={d.icon as any}
                  size={28}
                  color='#FFFFFF'
                />
              </View>
              <Text
                style={[styles.deptLabel, { color: theme.textSecondary }]}
                numberOfLines={1}>
                {d.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Top doctors */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.textPrimary, fontFamily: fonts.semiBold },
            ]}>
            Top rated doctors
          </Text>
          <Pressable onPress={() => router.push('/make-appointment')}>
            <Text style={[styles.seeAll, { color: theme.accent }]}>See All</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}>
          {doctorFilters.map((label, i) => {
            const selected = filter === i;
            return (
              <Pressable
                key={label}
                onPress={() => setFilter(i)}
                style={[
                  styles.chip,
                  {
                    borderColor: selected ? theme.accent : theme.divider,
                    backgroundColor: selected ? 'transparent' : 'transparent',
                  },
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: selected ? theme.accent : theme.textSecondary,
                      fontFamily: selected ? fonts.medium : fonts.regular,
                    },
                  ]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.doctorCards}>
          <DoctorCard
            photo={DOCTOR_PHOTOS[0]}
            name='Dr. Alex Zender'
            title='Cardiology Specialist'
            rating='5.0 (150)'
            theme={theme}
            favorited={fav1}
            onToggleFav={() => setFav1((v) => !v)}
            online={false}
          />
          <DoctorCard
            photo={DOCTOR_PHOTOS[1]}
            name='Dr. Alex Zender'
            title='Cardiology Specialist'
            rating='5.0 (150)'
            theme={theme}
            favorited={fav2}
            onToggleFav={() => setFav2((v) => !v)}
            online
          />
        </View>

        {/* Promo */}
        <View
          style={[
            styles.promo,
            { backgroundColor: theme.promoBannerBg },
          ]}>
          <View style={styles.promoLeft}>
            <Text style={[styles.promoTitle, { color: theme.promoBannerText }]}>
              Get 20% OFF
            </Text>
            <Text style={[styles.promoSub, { color: theme.promoBannerText }]}>
              On all items on first order
            </Text>
            <Pressable
              style={[styles.promoBtn, { backgroundColor: theme.accent }]}
              accessibilityRole='button'>
              <Text style={[styles.promoBtnText, { fontFamily: fonts.semiBold }]}>
                Order Now
              </Text>
            </Pressable>
          </View>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
            }}
            style={styles.promoImage}
          />
        </View>

        {/* Healthcare Products */}
        <SectionHeader
          title='Healthcare Products'
          onPressSeeAll={() => {}}
        />
        <View style={styles.twoColGrid}>
          {HEALTHCARE_CATEGORIES.map((c) => (
            <CategoryCard
              key={c.id}
              label={c.label}
              backgroundColor={c.bg}
              image={c.image}
              onPress={() => {}}
            />
          ))}
        </View>

        {/* Popular products */}
        <SectionHeader
          title='Popular products'
          onPressSeeAll={() => {}}
        />
        <View style={styles.twoColGrid}>
          {POPULAR_PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              title={p.title}
              subtitle={p.subtitle}
              price={p.price}
              originalPrice={p.originalPrice}
              discountLabel={p.discountLabel}
              image={p.image}
              wishlisted={!!productWishlist[p.id]}
              onWishlistPress={() =>
                setProductWishlist((prev) => ({
                  ...prev,
                  [p.id]: !prev[p.id],
                }))
              }
              onAddPress={() => {}}
            />
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DoctorCard({
  photo,
  name,
  title,
  rating,
  theme,
  favorited,
  onToggleFav,
  online,
}: {
  photo: string;
  name: string;
  title: string;
  rating: string;
  theme: AppTheme;
  favorited: boolean;
  onToggleFav: () => void;
  online: boolean;
}) {
  return (
    <View style={[styles.docCard, { backgroundColor: theme.card }]}>
      <View style={styles.docPhotoWrap}>
        <Image source={{ uri: photo }} style={styles.docPhoto} />
        {online ? (
          <View style={[styles.onlineDot, { borderColor: theme.card }]} />
        ) : null}
      </View>
      <View style={styles.docBody}>
        <View style={styles.docTitleRow}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.docName,
                { color: theme.textPrimary, fontFamily: fonts.semiBold },
              ]}>
              {name}
            </Text>
            <Text style={[styles.docSpec, { color: theme.textSecondary }]}>
              {title}
            </Text>
          </View>
          <Pressable onPress={onToggleFav} hitSlop={12}>
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={22}
              color={favorited ? '#E53E3E' : theme.textSecondary}
            />
          </Pressable>
        </View>
        <View style={styles.ratingRow}>
          <Ionicons name='star' size={16} color='#FBBF24' />
          <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
            {rating}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 8 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  hello: { fontSize: 13 },
  userName: { fontSize: 18 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2DC2B1',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 24,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  sectionTitle: { fontSize: 18, marginBottom: 14 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  seeAll: { fontSize: 14, fontWeight: '600' },
  servicesRow: { gap: 12, paddingBottom: 4 },
  serviceCard: {
    width: 160,
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  serviceImage: { width: '100%', height: 100, borderRadius: 12 },
  serviceTitle: { fontSize: 14, marginTop: 10, paddingHorizontal: 10 },
  serviceSub: { fontSize: 12, marginTop: 4, paddingHorizontal: 10 },
  deptGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    rowGap: 16,
  },
  deptItem: { width: '22%', alignItems: 'center', minWidth: 72 },
  deptIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  deptLabel: { fontSize: 11, textAlign: 'center' },
  chipsRow: { gap: 10, marginBottom: 16, flexDirection: 'row' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13 },
  doctorCards: { gap: 14, marginBottom: 24 },
  docCard: { borderRadius: 16, overflow: 'hidden' },
  docPhotoWrap: { position: 'relative' },
  docPhoto: { width: '100%', height: 140, backgroundColor: '#CBD5E1' },
  onlineDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
  },
  docBody: { padding: 14 },
  docTitleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  docName: { fontSize: 16 },
  docSpec: { fontSize: 13, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  ratingText: { fontSize: 13 },
  promo: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  promoLeft: { flex: 1, paddingRight: 8 },
  promoTitle: { fontSize: 20, fontWeight: '700' },
  promoSub: { fontSize: 13, marginTop: 4, opacity: 0.85 },
  promoBtn: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  promoBtnText: { color: '#FFFFFF', fontSize: 14 },
  promoImage: { width: 100, height: 100, borderRadius: 12 },
  twoColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

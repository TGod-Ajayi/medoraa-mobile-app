import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import type { AppTheme } from '../../config/theme';
import type { ImageSourcePropType } from 'react-native';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryCard, ProductCard, SectionHeader } from '../../components/home';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';
import { allergy, brain, child, favourite, favouriteOutline, heart, kidney, pregnacy, stomach, teeth } from '@/config/svg';
import { SvgXml } from 'react-native-svg';

const doctorone = require('../../assets/images/doctorone.png');
const doctortwo = require('../../assets/images/doctortwo.png');
const doctorthree = require('../../assets/images/doctorthree.png');
const doctorfour = require('../../assets/images/doctorFour.png');
const doctorfive = require('../../assets/images/doctorFive.png');
const banner = require('../../assets/images/banner.png');
const cat1 = require('../../assets/images/cat1.png');
const cat2 = require('../../assets/images/cat2.png');
const cat3 = require('../../assets/images/cat3.png');
const cat4 = require('../../assets/images/cat4.png');
const product1 = require('../../assets/images/product3.png');
const product2 = require('../../assets/images/product4.png');
const product3 = require('../../assets/images/product5.png');
const product4 = require('../../assets/images/product6.png');

const AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop';

const SERVICE_IMAGES = [
  doctorone,
  doctortwo,
  doctorthree,
];

const DOCTOR_PHOTOS = [
  doctorfour,
  doctorfive,
];



const services = [
  { title: 'Instant Consultation', subtitle: 'Start from $50', image: doctorone, bgColor : "#D2F2F0" },
  { title: 'Book a Specialist', subtitle: 'Start from $100', image: doctortwo, bgColor: "#E9F0FF"},
  { title: 'Order Medicine', subtitle: 'Delivery in 1 hour', image: doctorthree, bgColor: "#FFDCDC"},
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
    bg: '#F0E2D9',
    image: cat1,
  },
  {
    id: 'herbal',
    label: 'Herbal Medicine',
    bg: '#D5E5DA',
    image: cat2,
  },
  {
    id: 'equip',
    label: 'Equipments',
    bg: '#F4EAF3',
    image: cat3, 
  },
  {
    id: 'wellness',
    label: 'Sexual Wellness',
    bg: '#F4EAF3',
    image: cat4,
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
    image: product1,
  },
  {
    id: 'p2',
    title: 'Vitamin D3 Softgel',
    subtitle: '30 capsules',
    price: '$12.00',
    image: product2,
  },
  {
    id: 'p3',
    title: 'Cough Syrup 100ml',
    subtitle: '1 bottle',
    price: '$6.25',
    originalPrice: '$8.50',
    discountLabel: '-26%',
    image: product3,
  },
  {
    id: 'p4',
    title: 'Omega-3 Fish Oil',
    subtitle: '60 softgels',
    price: '$18.99',
    image: product4,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [filter, setFilter] = useState(0);
  const [fav1, setFav1] = useState(false);
  const colorScheme = useColorScheme();
  const [fav2, setFav2] = useState(true);
  const [productWishlist, setProductWishlist] = useState<Record<string, boolean>>({
    p2: true,
  });

  

  const departments: { name: string; icon: string; bg: string }[] = [
    { name: 'Neurology', icon: brain, bg: colorScheme == "dark" ? "#30BE4533" : "#30BE4533" },
    { name: 'Cardiology', icon: heart, bg: colorScheme == "dark" ? "#FF5B6E33" : "#FF5B6E33" },
    { name: 'Gynecology', icon: pregnacy, bg: colorScheme == "dark" ? "#FFBDBC33" : "#FFBDBC33"},
    { name: 'Pediatrics', icon: child, bg: colorScheme == "dark" ? "#FC939333" : "#CBE6E7" },
    { name: 'Allergy', icon: allergy, bg: colorScheme == "dark" ? "#34459033" : "#34459033" },
    { name: 'Dentist', icon: teeth, bg: colorScheme == "dark" ? "#50BE9F33" : "#50BE9F33"},
    { name: 'Urology', icon: kidney, bg: colorScheme == "dark" ? "#842F3B33" : "#842F3B33" },
    { name: 'Gastrology', icon: stomach, bg: colorScheme == "dark" ? "#18989133" : "#18989133" },
  ];
  

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
              style={[styles.serviceCard, { backgroundColor: colorScheme == "dark" ? "#0F172A" : "#FFFFFF" }]}>
                <View style={[styles.serviceCardImage,{backgroundColor: s.bgColor}]}>
                <Image
                source={s.image}
                style={styles.serviceImage}
              />
                </View>
             
              <Text
                style={[
                  styles.serviceTitle,
                  { color: theme.textPrimary, fontFamily: fonts.semiBold, fontSize: 14, textAlign: 'center', fontWeight: '600' },
                ]}>
                {s.title}
              </Text>
              <Text style={[styles.serviceSub, { color: colorScheme == "dark" ? "#94A3B8" : "", textAlign: 'center', fontSize: 10, fontWeight: '600', }]}> 
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
              {color: colorScheme == "dark" ? "#FFFFFF" : "#0F172A", fontFamily: "500"},
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
                <SvgXml xml={d.icon} />
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.doctorCardsRow}
          nestedScrollEnabled>
          <DoctorCard
            photo={DOCTOR_PHOTOS[0]}
            name='Dr. Alex Zender'
            title='Cardiology Specialist'
            rating='5.0 (150)'
            theme={theme}
            bgColor='#CBE6E7'
            favorited={fav1}
            onToggleFav={() => setFav1((v) => !v)}
            online={false}
          />
          <DoctorCard
            photo={DOCTOR_PHOTOS[1]}
            name='Dr. Alex Zender'
            title='Cardiology Specialist'
            rating='5.0 (150)'
            bgColor='#C6E4FF'
            theme={theme}
            favorited={fav2}
            onToggleFav={() => setFav2((v) => !v)}
            online
          />
          <DoctorCard
            photo={DOCTOR_PHOTOS[1]}
            name='Dr. Alex Zender'
            title='Cardiology Specialist'
            rating='5.0 (150)'
            bgColor='#C6E4FF'
            theme={theme}
            favorited={fav2}
            onToggleFav={() => setFav2((v) => !v)}
            online
          />
          <DoctorCard
            photo={DOCTOR_PHOTOS[1]}
            name='Dr. Alex Zender'
            title='Cardiology Specialist'
            rating='5.0 (150)'
            bgColor='#C6E4FF'
            theme={theme}
            favorited={fav2}
            onToggleFav={() => setFav2((v) => !v)}
            online
          />
        </ScrollView>

        {/* Promo */}
        <View
          style={[
            styles.promo,
            { backgroundColor: theme.promoBannerBg },
          ]}>
          <View style={styles.promoLeft}>
            <Text style={[styles.promoTitle, { color: "#0A0A0A" }]}>
              Get 20% OFF
            </Text>
            <Text style={[styles.promoSub, { color: "#475569" }]}>
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
            source={banner}
            style={styles.promoImage}
          />
        </View>

        {/* Healthcare Products */}
        <View style={{marginTop:18}}>
        <SectionHeader
          title='Healthcare Products'
          onPressSeeAll={() => {}}
        />
        </View>
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
  bgColor,
  onToggleFav,
  online,
}: {
  photo: ImageSourcePropType;
  name: string;
  title: string;
  rating: string;
  theme: AppTheme;
  bgColor?: string;
  favorited: boolean;
  onToggleFav: () => void;
  online: boolean;
}) {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.docCard, { backgroundColor: colorScheme == "dark" ? "#0F172A" : "#FFFFFF" }]}>
      <View style={[styles.docPhotoWrap, {backgroundColor: bgColor}]}>
        <Image source={photo} style={styles.docPhoto} />
        {online ? (
          <View style={[styles.onlineDot, { borderColor: theme.card }]} />
        ) : null}
      </View>
      <View style={{paddingVertical:8, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start"}}> 
        <View style={{display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4}}>
        <Text
              style={[
                styles.docName,
                {
                  color: colorScheme == "dark" ? "#FFFFFF" : "#0F172A"
                }
              ]}>
              {name}
            </Text>
            <Text style={[styles.docSpec, { color:"#94A3B8",  fontSize: 12, fontWeight: "500" }]}>
              {title}
            </Text>
        </View>
         <View style={{display:"flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 4}}>
        <View style={styles.ratingRow}>
          <Ionicons name='star' size={16} color='#FBBF24' />
          <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
            {rating}
          </Text>
        </View>
        <Pressable onPress={onToggleFav} hitSlop={12}>
          {/* Render SVG strings directly (Ionicons `name` can't take JSX). */}
          <SvgXml xml={favorited ? favourite : favouriteOutline} width={22} height={22} />
          </Pressable>
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
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  sectionTitle: { fontSize: 16, marginBottom: 12, fontWeight: "500",},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  seeAll: { fontSize: 14, fontWeight: '500' },
  servicesRow: { gap: 12, paddingBottom: 24 },
  serviceCard: {
    width: 112,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  serviceCardImage: { width: 97 , height: 97, borderRadius: 10 , position: "relative"},
  serviceImage: { width: 67, height: 73, borderRadius: 12 , position: "absolute", bottom:1, marginHorizontal:"auto", left:"17%"},
  serviceTitle: { fontSize: 14, marginTop: 6,  },
  serviceSub: { fontSize: 12, marginTop: 4, },
  deptGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    rowGap: 16,
  },
  deptItem: { width: '22%', alignItems: 'center', minWidth: 72 },
  deptIconWrap: {
    width: 72,
    height: 72,
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
  doctorCardsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
    paddingRight: 4,
  },
  docCard: { borderRadius: 16, overflow: 'hidden',  width: 163, height: 192, padding :8},
  docPhotoWrap: { position: 'relative' , width: 147, height: 100, borderRadius: 7},
  docPhoto: { width: 81, height: 97,  left: "20%", position: "absolute", bottom: 0,},
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
  docTitleRow: { flexDirection: 'column', alignItems: 'flex-start' , display: "flex", gap: 8},
  docName: { fontSize: 14, fontWeight: "500" },
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
  promoSub: { fontSize: 14, marginTop: 3, fontWeight: "400" },
  promoBtn: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius:99,
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

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import type { AppTheme } from '../../config/theme';
import type { GestureResponderEvent, ImageSourcePropType } from 'react-native';
import {
  ActivityIndicator,
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
import { LogoutButton } from '../../components/profile';
import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';
import {
  allergy,
  brain,
  child,
  favourite,
  favouriteOutline,
  heart,
  kidney,
  lungs,
  medical,
  pregnacy,
  psycho,
  stomach,
  teeth,
  throat,
} from '@/config/svg';
import {
  useDepartments,
  useDoctors,
  useUser,
  useWellnessPrograms,
  type WellnessProgramListItem,
} from '@repo/ui/graphql';
import { SvgXml } from 'react-native-svg';

const doctorone = require('../../assets/images/doctorone.png');
const doctortwo = require('../../assets/images/doctortwo.png');
const doctorthree = require('../../assets/images/doctorthree.png');
const wellnessprogram = require('../../assets/images/wellness.png');
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
const DEFAULT_DOCTOR_IMAGE = require('../../assets/images/user.png');

const services = [
  { title: 'Instant Consultation', image: doctorone, bgColor : "#D2F2F0" },
  { title: 'Wellness Programs',  image: wellnessprogram, bgColor: "#E9F0FF"},
  { title: 'Order Medicine',  image: doctorthree, bgColor: "#FFDCDC"},
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

function getDisplayName(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter((value): value is string => Boolean(value?.trim())).join(' ');
}

type HomeDoctorListItem = {
  averageRating: number;
  doctorsSpecialties?: { specialty: { name: string } }[] | null;
  id: string;
  isOnline: boolean;
  totalReviews: number;
  user: {
    firstName: string;
    lastName: string;
    profilePhoto?: string | null;
  };
};

function getDoctorName(doctor: HomeDoctorListItem) {
  const fullName = [doctor.user.firstName, doctor.user.lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(' ');

  return fullName ? `Dr. ${fullName}` : 'Doctor';
}

function getDoctorSpecialty(doctor: HomeDoctorListItem) {
  const names =
    doctor.doctorsSpecialties
      ?.map((entry) => entry.specialty.name)
      .filter(Boolean) ?? [];

  return names.length > 0 ? `${names[0]} Specialist` : 'General practice';
}

function getDoctorRating(doctor: HomeDoctorListItem) {
  return `${doctor.averageRating.toFixed(1)} (${Math.round(doctor.totalReviews)})`;
}

function getDoctorImage(doctor: HomeDoctorListItem): ImageSourcePropType {
  return doctor.user.profilePhoto
    ? { uri: doctor.user.profilePhoto }
    : DEFAULT_DOCTOR_IMAGE;
}

type DepartmentListItem = {
  code: string;
  id: string;
  name: string;
  sortOrder?: number | null;
  specialties?: { id: string; name: string }[] | null;
};

type DepartmentCardData = {
  bg: string;
  icon: string;
  id: string;
  name: string;
};

function normalizeLabel(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

const WELLNESS_CARD_BACKGROUNDS = ['#D2F2F0', '#E9F0FF', '#FFDCDC', '#F0E2D9'];
const WELLNESS_FALLBACK_IMAGES = [cat1, cat2, cat3, cat4];

function getWellnessProgramImage(
  program: WellnessProgramListItem,
  index: number
): ImageSourcePropType {
  if (program.category?.iconUrl) {
    return { uri: program.category.iconUrl };
  }

  return WELLNESS_FALLBACK_IMAGES[index % WELLNESS_FALLBACK_IMAGES.length];
}

function getWellnessProgramLabel(program: WellnessProgramListItem) {
  return program.category?.name ?? program.title;
}

function getDepartmentUi(department: DepartmentListItem) {
  const keys = [
    normalizeLabel(department.code),
    normalizeLabel(department.name),
  ];

  if (keys.some((key) => key.includes('neuro'))) {
    return { icon: brain, bg: '#30BE4533' };
  }
  if (keys.some((key) => key.includes('cardio'))) {
    return { icon: heart, bg: '#FF5B6E33' };
  }
  if (keys.some((key) => key.includes('gyn') || key.includes('obstet'))) {
    return { icon: pregnacy, bg: '#FFBDBC33' };
  }
  if (keys.some((key) => key.includes('pedia') || key.includes('child'))) {
    return { icon: child, bg: '#FC939333' };
  }
  if (keys.some((key) => key.includes('allerg'))) {
    return { icon: allergy, bg: '#34459033' };
  }
  if (keys.some((key) => key.includes('dent'))) {
    return { icon: teeth, bg: '#50BE9F33' };
  }
  if (keys.some((key) => key.includes('uro'))) {
    return { icon: kidney, bg: '#842F3B33' };
  }
  if (keys.some((key) => key.includes('gastro') || key.includes('stomach'))) {
    return { icon: stomach, bg: '#18989133' };
  }
  if (keys.some((key) => key.includes('psych'))) {
    return { icon: psycho, bg: '#34459033' };
  }
  if (keys.some((key) => key.includes('onco') || key.includes('pulm'))) {
    return { icon: lungs, bg: '#842F3B33' };
  }
  if (
    keys.some(
      (key) =>
        key === 'ent' ||
        key.includes('ear nose throat') ||
        key.includes('otolaryng')
    )
  ) {
    return { icon: throat, bg: '#18989133' };
  }

  return { icon: medical, bg: '#50BE9F33' };
}

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useUser();
  const {
    departments,
    loading: departmentsLoading,
    error: departmentsError,
  } = useDepartments();
  const { doctors, loading: doctorsLoading, error: doctorsError } = useDoctors({
    limit: 6,
    page: 1,
  });
  const {
    wellnessPrograms,
    loading: wellnessProgramsLoading,
    error: wellnessProgramsError,
  } = useWellnessPrograms({
    limit: 10,
    page: 1,
  });

  console.log("wellnessPrograms", JSON.stringify(wellnessPrograms, null, 2));
  const [filter, setFilter] = useState(0);
  const colorScheme = useColorScheme();
  const [doctorWishlist, setDoctorWishlist] = useState<Record<string, boolean>>({});
  const [productWishlist, setProductWishlist] = useState<Record<string, boolean>>({
    p2: true,
  });
  const patientName = getDisplayName(user?.firstName, user?.lastName) || 'Patient';
  const patientAvatar = user?.profilePhoto ? { uri: user.profilePhoto } : { uri: AVATAR };
  const selectedDoctorFilter = doctorFilters[filter] ?? 'All doctor';
  const topDoctors = useMemo(() => {
    const sortedDoctors = [...doctors].sort(
      (left, right) => right.averageRating - left.averageRating
    );

    if (selectedDoctorFilter === 'All doctor') {
      return sortedDoctors;
    }

    return sortedDoctors.filter((doctor) =>
      doctor.doctorsSpecialties?.some((entry) =>
        entry.specialty.name
          .toLowerCase()
          .includes(selectedDoctorFilter.toLowerCase())
      )
    );
  }, [doctors, selectedDoctorFilter]);

  useEffect(() => {
    console.log(
      'getDepartments response\n' +
        JSON.stringify(
          {
            departments,
            loading: departmentsLoading,
            error: departmentsError,
          },
          null,
          2
        )
    );
  }, [departments, departmentsLoading, departmentsError]);

  const departmentCards = useMemo((): DepartmentCardData[] => {
    return [...departments]
      .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
      .map((department) => ({
        ...getDepartmentUi(department),
        id: department.id,
        name: department.name,
      }));
  }, [departments]);

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
            <Image source={patientAvatar} style={styles.avatar} />
            <View>
              <Text style={[styles.hello, { color: theme.textSecondary }]}>
                Hello!
              </Text>
              <Text
                style={[
                  styles.userName,
                  { color: theme.textPrimary, fontFamily: fonts.semiBold },
                ]}>
                {patientName}
              </Text>
            </View>
          </Pressable>
          <View style={styles.headerActions}>
            <LogoutButton variant='icon' />
            <Pressable
              style={[styles.iconBtn, { backgroundColor: theme.card }]}
              accessibilityRole='button'
              accessibilityLabel='Notifications'>
              <Ionicons name='notifications-outline' size={22} color={theme.textPrimary} />
              <View style={styles.notifDot} />
            </Pressable>
          </View>
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
              style={[styles.serviceCard, { backgroundColor: colorScheme === "dark" ? "#0F172A" : "#FFFFFF" }]}>
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
            </View>
          ))}
        </ScrollView>
        {/* Wellness program  */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.textPrimary, fontFamily: fonts.semiBold },
          ]}>
          Wellness Categories
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesRow}>
          {wellnessProgramsLoading ? (
            <View
              style={[
                styles.wellnessStatusCard,
                { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF' },
              ]}>
              <ActivityIndicator size='small' color={theme.accent} />
            </View>
          ) : wellnessProgramsError ? (
            <View
              style={[
                styles.wellnessStatusCard,
                { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF' },
              ]}>
              <Text style={[styles.wellnessStatusText, { color: theme.textSecondary }]}>
                Unable to load wellness categories right now.
              </Text>
            </View>
          ) : wellnessPrograms.length === 0 ? (
            <View
              style={[
                styles.wellnessStatusCard,
                { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF' },
              ]}>
              <Text style={[styles.wellnessStatusText, { color: theme.textSecondary }]}>
                No wellness categories available yet.
              </Text>
            </View>
          ) : (
            wellnessPrograms.map((program, index) => (
              <View
                key={program.id}
                style={[
                  styles.serviceCard,
                  { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF' },
                ]}>
                <View
                  style={[
                    styles.serviceCardImage,
                    {
                      backgroundColor:
                        WELLNESS_CARD_BACKGROUNDS[index % WELLNESS_CARD_BACKGROUNDS.length],
                    },
                  ]}>
                  <Image
                    source={getWellnessProgramImage(program, index)}
                    style={styles.serviceImage}
                  />
                </View>
                <Text
                  style={[
                    styles.serviceTitle,
                    {
                      color: theme.textPrimary,
                      fontFamily: fonts.semiBold,
                      fontSize: 14,
                      textAlign: 'center',
                      fontWeight: '600',
                    },
                  ]}
                  numberOfLines={2}>
                  {getWellnessProgramLabel(program)}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Departments */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A", fontFamily: "500"},
            ]}>
            Departments
          </Text>
          <Pressable>
            <Text style={[styles.seeAll, { color: theme.accent }]}>See All</Text>
          </Pressable>
        </View>
        {departmentsLoading ? (
          <View style={styles.departmentStatusContainer}>
            <ActivityIndicator size='small' color={theme.accent} />
          </View>
        ) : departmentsError ? (
          <View style={styles.departmentStatusContainer}>
            <Text style={[styles.departmentStatusText, { color: theme.textSecondary }]}>
              Unable to load departments right now.
            </Text>
          </View>
        ) : departmentCards.length === 0 ? (
          <View style={styles.departmentStatusContainer}>
            <Image
              source={require('../../assets/images/emptyDept.png')}
              style={styles.departmentEmptyImage}
              resizeMode='contain'
            />
            <Text style={[styles.departmentStatusText, { color: theme.textSecondary }]}>
              No departments available yet.
            </Text>
          </View>
        ) : (
          <View style={styles.deptGrid}>
            {departmentCards.map((department) => (
              <Pressable
                key={department.id}
                style={styles.deptItem}
                accessibilityRole='button'
                accessibilityLabel={department.name}>
                <View style={[styles.deptIconWrap, { backgroundColor: department.bg }]}>
                  <SvgXml xml={department.icon} />
                </View>
                <Text
                  style={[styles.deptLabel, { color: theme.textSecondary }]}
                  numberOfLines={1}>
                  {department.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Top doctors */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.textPrimary, fontFamily: fonts.semiBold },
            ]}>
            Top rated doctors
          </Text>
          <Pressable onPress={() => router.push('/doctors-list')}>
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
          {doctorsLoading ? (
            <View
              style={[
                styles.doctorStatusCard,
                { backgroundColor: colorScheme === "dark" ? "#0F172A" : "#FFFFFF" },
              ]}>
              <ActivityIndicator size='large' color={theme.accent} />
            </View>
          ) : doctorsError ? (
            <View
              style={[
                styles.doctorStatusCard,
                { backgroundColor: colorScheme === "dark" ? "#0F172A" : "#FFFFFF" },
              ]}>
              <Text style={[styles.doctorStatusText, { color: theme.textSecondary }]}>
                Unable to load doctors right now.
              </Text>
            </View>
          ) : topDoctors.length === 0 ? (
            <View
              style={[
                styles.doctorStatusCard,
                { backgroundColor: colorScheme === "dark" ? "#0F172A" : "#FFFFFF" },
              ]}>
              <Text style={[styles.doctorStatusText, { color: theme.textSecondary }]}>
                No doctors available yet.
              </Text>
            </View>
          ) : (
            topDoctors.map((doctor, index) => (
              <DoctorCard
                key={doctor.id}
                photo={getDoctorImage(doctor)}
                name={getDoctorName(doctor)}
                title={getDoctorSpecialty(doctor)}
                rating={getDoctorRating(doctor)}
                theme={theme}
                bgColor={index % 2 === 0 ? '#CBE6E7' : '#C6E4FF'}
                favorited={!!doctorWishlist[doctor.id]}
                onPress={() =>
                  router.push({
                    pathname: '/doctor-details',
                    params: { doctorId: doctor.id },
                  })
                }
                onToggleFav={() =>
                  setDoctorWishlist((prev) => ({
                    ...prev,
                    [doctor.id]: !prev[doctor.id],
                  }))
                }
                online={doctor.isOnline}
              />
            ))
          )}
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
  onPress,
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
  onPress?: () => void;
  onToggleFav: () => void;
  online: boolean;
}) {
  const colorScheme = useColorScheme();

  function handleFavoritePress(event: GestureResponderEvent) {
    event.stopPropagation();
    onToggleFav();
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.docCard, { backgroundColor: colorScheme === "dark" ? "#0F172A" : "#FFFFFF" }]}>
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
                  color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A"
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
        <Pressable onPress={handleFavoritePress} hitSlop={12}>
          {/* Render SVG strings directly (Ionicons `name` can't take JSX). */}
          <SvgXml xml={favorited ? favourite : favouriteOutline} width={22} height={22} />
          </Pressable>
         </View>
        
      </View>
    </Pressable>
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
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
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
  wellnessStatusCard: {
    width: 180,
    minHeight: 140,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  wellnessStatusText: {
    fontSize: 13,
    textAlign: 'center',
  },
  departmentStatusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  departmentEmptyImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  departmentStatusText: {
    fontSize: 14,
    textAlign: 'center',
  },
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
  doctorStatusCard: {
    width: 163,
    height: 192,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  doctorStatusText: {
    fontSize: 13,
    textAlign: 'center',
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

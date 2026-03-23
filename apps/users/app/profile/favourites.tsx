import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  FavouriteDoctorCard,
  RemoveFavouriteBottomSheet,
  type RemoveFavouriteDoctorPreview,
} from '../../components/profile';
import { ScreenHeader } from '../../components/doctor';
import { useTheme } from '../../config/theme';

type DoctorRow = {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  price: string;
  rating: string;
  uri: string;
  bg: string;
};

const INITIAL: DoctorRow[] = [
  {
    id: '1',
    name: 'Dr. Alex Zender',
    specialty: 'Cardiology',
    qualifications: 'MBBS, FCPS(Cardiology)',
    price: '$100',
    rating: '4.8 (150)',
    uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
    bg: '#99F6E4',
  },
  {
    id: '2',
    name: 'Dr. Akash basak',
    specialty: 'Neurology',
    qualifications: 'MBBS, FCPS(Neurology)',
    price: '$120',
    rating: '4.8 (150)',
    uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop',
    bg: '#BFDBFE',
  },
  {
    id: '3',
    name: 'Dr. Mizanur rahman',
    specialty: 'Cardiology',
    qualifications: 'MBBS, FCPS(Cardiology)',
    price: '$80',
    rating: '4.8 (150)',
    uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop',
    bg: '#DDD6FE',
  },
  {
    id: '4',
    name: 'Dr. Alex Zender',
    specialty: 'Orthopedic',
    qualifications: 'MBBS, MS(Ortho)',
    price: '$95',
    rating: '4.8 (150)',
    uri: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop',
    bg: '#A5F3FC',
  },
  {
    id: '5',
    name: 'Dr. Morshed alom',
    specialty: 'Orthopedic',
    qualifications: 'MBBS, MS(Ortho)',
    price: '$85',
    rating: '4.8 (150)',
    uri: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop',
    bg: '#FBCFE8',
  },
];

function toPreview(item: DoctorRow): RemoveFavouriteDoctorPreview {
  return {
    name: item.name,
    specialty: item.specialty,
    qualifications: item.qualifications,
    priceLabel: item.price,
    rating: item.rating,
    image: { uri: item.uri },
    imageBackgroundColor: item.bg,
  };
}

export default function FavouriteDoctorsScreen() {
  const theme = useTheme();
  const [doctors, setDoctors] = useState<DoctorRow[]>(INITIAL);
  const [removeTarget, setRemoveTarget] = useState<DoctorRow | null>(null);

  const sheetDoctor = useMemo(
    () => (removeTarget ? toPreview(removeTarget) : null),
    [removeTarget],
  );

  const openRemoveSheet = (item: DoctorRow) => setRemoveTarget(item);

  const confirmRemove = () => {
    if (!removeTarget) return;
    setDoctors((prev) => prev.filter((d) => d.id !== removeTarget.id));
    setRemoveTarget(null);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.inner}>
        <ScreenHeader
          title='Favourite Doctor'
          rightSlot={
            <Pressable
              style={[styles.headerIconBtn, { backgroundColor: theme.card }]}
              accessibilityRole='button'
              accessibilityLabel='Search'>
              <Ionicons name='search-outline' size={22} color={theme.textSecondary} />
            </Pressable>
          }
        />

        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FavouriteDoctorCard
              name={item.name}
              specialty={item.specialty}
              qualifications={item.qualifications}
              priceLabel={item.price}
              rating={item.rating}
              image={{ uri: item.uri }}
              imageBackgroundColor={item.bg}
              onPressRemove={() => openRemoveSheet(item)}
              onPressCard={() => openRemoveSheet(item)}
            />
          )}
        />
      </View>

      <RemoveFavouriteBottomSheet
        visible={!!removeTarget}
        doctor={sheetDoctor}
        onClose={() => setRemoveTarget(null)}
        onConfirmRemove={confirmRemove}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
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
  list: {
    paddingBottom: 32,
    paddingTop: 8,
  },
});

import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

export type RemoveFavouriteDoctorPreview = {
  name: string;
  specialty: string;
  qualifications: string;
  priceLabel: string;
  /** e.g. "4.8 (150)" */
  rating: string;
  image: ImageSourcePropType;
  imageBackgroundColor: string;
};

type Props = {
  visible: boolean;
  doctor: RemoveFavouriteDoctorPreview | null;
  onClose: () => void;
  onConfirmRemove: () => void;
};

const PHOTO = 72;

/**
 * Confirmation bottom sheet: remove doctor from favourites.
 */
export function RemoveFavouriteBottomSheet({
  visible,
  doctor,
  onClose,
  onConfirmRemove,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['48%', '58%'], []);

  const handleBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.45}
        pressBehavior='close'
      />
    ),
    [],
  );

  const handleDismiss = useCallback(() => {
    if (visible) {
      onClose();
    }
  }, [onClose, visible]);

  useEffect(() => {
    if (visible && doctor) {
      sheetRef.current?.present();
      return;
    }

    sheetRef.current?.dismiss();
  }, [doctor, visible]);

  if (!doctor) return null;

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose
      enableDynamicSizing={false}
      backdropComponent={handleBackdrop}
      onDismiss={handleDismiss}
      handleIndicatorStyle={[styles.handle, { backgroundColor: theme.divider }]}
      backgroundStyle={[styles.sheet, { backgroundColor: theme.card }]}
      bottomInset={Math.max(insets.bottom, 12)}>
      <BottomSheetView
        style={[
          styles.content,
          {
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}>
        <Text
          style={[styles.title, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}
          accessibilityRole='header'>
          Remove from Favourites?
        </Text>

        <View
          style={[
            styles.previewCard,
            { backgroundColor: theme.background, borderColor: theme.divider },
          ]}>
          <View style={[styles.photoWrap, { backgroundColor: doctor.imageBackgroundColor }]}>
            <Image source={doctor.image} style={styles.photo} resizeMode='cover' />
          </View>

          <View style={styles.body}>
            <View style={styles.topRow}>
              <View style={styles.textBlock}>
                <Text
                  style={[styles.name, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}
                  numberOfLines={1}>
                  {doctor.name}
                </Text>
                <Text style={[styles.specialty, { color: theme.textSecondary }]} numberOfLines={1}>
                  {doctor.specialty}
                </Text>
                <Text style={[styles.qual, { color: theme.textMuted }]} numberOfLines={2}>
                  {doctor.qualifications}
                </Text>
              </View>
              <Ionicons name='heart' size={22} color='#E53E3E' />
            </View>

            <View style={styles.bottomRow}>
              <View style={[styles.pricePill, { backgroundColor: theme.surfaceMuted }]}>
                <Text style={[styles.priceText, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}>
                  {doctor.priceLabel}
                </Text>
              </View>
              <View style={styles.ratingRow}>
                <Ionicons name='star' size={14} color='#FBBF24' />
                <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
                  {doctor.rating}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={onClose}
            style={[styles.btnOutline, { borderColor: theme.accent }]}
            accessibilityRole='button'
            accessibilityLabel='Cancel'>
            <Text style={[styles.btnOutlineText, { color: theme.accent, fontFamily: fonts.semiBold }]}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={onConfirmRemove}
            style={[styles.btnSolid, { backgroundColor: theme.accent }]}
            accessibilityRole='button'
            accessibilityLabel='Yes, remove from favourites'>
            <Text style={[styles.btnSolidText, { fontFamily: fonts.semiBold }]}>Yes, remove</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  previewCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 12,
    marginBottom: 20,
  },
  photoWrap: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
  },
  specialty: {
    fontSize: 13,
    marginTop: 2,
  },
  qual: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  pricePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  priceText: {
    fontSize: 13,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btnOutline: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    fontSize: 15,
  },
  btnSolid: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSolidText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});

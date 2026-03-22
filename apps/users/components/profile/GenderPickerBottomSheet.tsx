import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

export const GENDER_OPTIONS = ['Male', 'Female', 'Others'] as const;
export type GenderOption = (typeof GENDER_OPTIONS)[number];

type Props = {
  visible: boolean;
  selected: string;
  onSelect: (gender: string) => void;
  onClose: () => void;
};

/**
 * Bottom sheet to pick gender: Male, Female, Others.
 */
export function GenderPickerBottomSheet({ visible, selected, onSelect, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['38%'], []);

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
    if (visible) onClose();
  }, [onClose, visible]);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

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
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}>
        <Text
          style={[styles.title, { color: theme.textPrimary, fontFamily: fonts.semiBold }]}
          accessibilityRole='header'>
          Select Gender
        </Text>

        {GENDER_OPTIONS.map((option) => {
          const isSelected = selected === option;
          return (
            <Pressable
              key={option}
              onPress={() => {
                onSelect(option);
                sheetRef.current?.dismiss();
              }}
              style={({ pressed }) => [
                styles.row,
                { borderBottomColor: theme.divider },
                pressed && styles.rowPressed,
              ]}
              accessibilityRole='button'
              accessibilityLabel={option}
              accessibilityState={{ selected: isSelected }}>
              <Text
                style={[
                  styles.rowLabel,
                  {
                    color: isSelected ? theme.accent : theme.textPrimary,
                    fontFamily: isSelected ? fonts.semiBold : fonts.regular,
                  },
                ]}>
                {option}
              </Text>
              {isSelected ? (
                <Ionicons name='checkmark' size={20} color={theme.accent} />
              ) : null}
            </Pressable>
          );
        })}
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
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowLabel: {
    fontSize: 16,
  },
});

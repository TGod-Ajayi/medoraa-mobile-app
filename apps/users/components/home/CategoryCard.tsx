import type { ImageSourcePropType } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { fonts } from '../../config/fonts';
import { useTheme } from '../../config/theme';

type Props = {
  label: string;
  /** Pastel panel behind text + image */
  backgroundColor: string;
  image: ImageSourcePropType;
  onPress?: () => void;
  /** Override outer width (e.g. horizontal carousel item). */
  wrapStyle?: StyleProp<ViewStyle>;
};

export function CategoryCard({ label, backgroundColor, image, onPress, wrapStyle }: Props) {
  const theme = useTheme();
const colorScheme = useColorScheme();
  const content = (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.textCol}>
        <Text
          style={[styles.label, { color: colorScheme == "dark" ? "#171717": "#0F172A", fontFamily: fonts.semiBold }]}
         >
          {label}
        </Text>
      </View>
      <Image source={image} style={styles.image} resizeMode='contain'/>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.wrap, wrapStyle]}
        accessibilityRole='button'
        accessibilityLabel={label}>
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.wrap, wrapStyle]}>{content}</View>;
}

const styles = StyleSheet.create({
  wrap: {
    width: '48%',
    marginBottom: 12,
  },
  card: {
    borderRadius: 14,
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    paddingLeft: 12,
  },
  textCol: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    flexWrap: "nowrap",

  },
  image: {
    width: 76,
    height: 65,
    marginRight: -1,
  },
});

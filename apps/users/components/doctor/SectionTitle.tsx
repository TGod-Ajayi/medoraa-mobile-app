import { StyleSheet, Text, useColorScheme, View } from 'react-native';

import { fonts } from '../../config/fonts';


type Props = {
  children: string;
};

/** Bold section heading (no See All). */
export function SectionTitle({ children }: Props) {
  
  const colorScheme = useColorScheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.text, { color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A", fontWeight: "500"}]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
    marginTop: 8,
  },
  text: {
    fontSize: 16,
  },
});

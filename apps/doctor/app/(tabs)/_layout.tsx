import {
  activeRecord,
  doctorProfileActive,
  doctorProfileInactive,
  homeActive,
  homeInactive,
  inactiveRecord,
  patientActive,
  patientInactive,
  scheduleActive,
  scheduleInactive,
} from '@/config/svg';
import { useTheme } from '@/config/theme';
import { HapticTab } from '@repo/ui/components';
import { Colors } from '@repo/ui/constants';
import { Tabs } from 'expo-router';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

const ICON_SIZE = 24;

function TabSvg({ xml }: { xml: string }) {
  return (
    <View style={styles.iconSlot}>
      <SvgXml xml={xml} width={ICON_SIZE} height={ICON_SIZE} />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: (Colors as Record<string, typeof Colors.light>)[
          colorScheme === 'dark' ? 'dark' : 'light'
        ].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: theme.background,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabSvg xml={focused ? homeActive : homeInactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="patient"
        options={{
          title: 'Patients',
          tabBarIcon: ({ focused }) => (
            <TabSvg xml={focused ? patientActive : patientInactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ focused }) => (
            <TabSvg xml={focused ? scheduleActive : scheduleInactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: ({ focused }) => (
            <TabSvg xml={focused ? activeRecord : inactiveRecord} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabSvg xml={focused ? doctorProfileActive : doctorProfileInactive} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconSlot: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

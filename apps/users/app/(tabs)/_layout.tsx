import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  appointmentActive,
  appointmentInactive,
  doctorActive,
  doctorInactive,
  historyActive,
  historyInactive,
  homeActive,
  homeInactive,
  medicineActive,
  medicineInactive,
} from '../../config/svg';
import { useTheme } from '../../config/theme';

const ICON_SIZE = 24;

/** Active: SVG as designed (teal). Inactive: #94A3B8 → theme muted. */
function tabIconXml(
  activeXml: string,
  inactiveXml: string,
  focused: boolean,
  muted: string,
): string {
  if (focused) {
    return activeXml;
  }
  return inactiveXml.replace(/#94A3B8/g, muted);
}

function TabSvg({
  activeXml,
  inactiveXml,
  focused,
  muted,
}: {
  activeXml: string;
  inactiveXml: string;
  focused: boolean;
  muted: string;
}) {
  const xml = tabIconXml(activeXml, inactiveXml, focused, muted);
  return (
    <View style={styles.iconSlot}>
      <SvgXml xml={xml} width={ICON_SIZE} height={ICON_SIZE} />
    </View>
  );
}

export default function TabsLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const muted = theme.textMuted;
  const accent = theme.accent;

  const bottomPad = Math.max(insets.bottom, 8);
  const tabHeight = 56 + bottomPad;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.divider,
          height: tabHeight,
          paddingTop: 8,
          paddingBottom: bottomPad,
        },
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: muted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabSvg
              activeXml={homeActive}
              inactiveXml={homeInactive}
              focused={focused}
              muted={muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='doctor'
        options={{
          title: 'Doctor',
          tabBarIcon: ({ focused }) => (
            <TabSvg
              activeXml={doctorActive}
              inactiveXml={doctorInactive}
              focused={focused}
              muted={muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='medicine'
        options={{
          title: 'Medicine',
          tabBarIcon: ({ focused }) => (
            <TabSvg
              activeXml={medicineActive}
              inactiveXml={medicineInactive}
              focused={focused}
              muted={muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='appointment'
        options={{
          title: 'Appointment',
          tabBarIcon: ({ focused }) => (
            <TabSvg
              activeXml={appointmentActive}
              inactiveXml={appointmentInactive}
              focused={focused}
              muted={muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='history'
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <TabSvg
              activeXml={historyActive}
              inactiveXml={historyInactive}
              focused={focused}
              muted={muted}
            />
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
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  tabItem: {
    paddingTop: Platform.OS === 'ios' ? 0 : 4,
  },
});

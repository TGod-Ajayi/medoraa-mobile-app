import { homeActive, homeInactive, patientActive, patientInactive, scheduleActive, scheduleInactive, activeRecord, inactiveRecord, doctorProfileActive, doctorProfileInactive} from '@/config/svg';
import { HapticTab, IconSymbol } from '@repo/ui/components';
import { Colors } from '@repo/ui/constants';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SvgXml } from 'react-native-svg';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: (Colors as Record<string, typeof Colors.light>)[
          colorScheme ?? 'light'
        ].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            focused ? <SvgXml xml={homeActive} color={color} /> : <SvgXml xml={homeInactive} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="patient"
        options={{
          title: 'Patients',
          tabBarIcon: ({ color, focused }) => (
           focused ? <SvgXml xml={patientActive} color={color} /> : <SvgXml xml={patientInactive} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, focused }) => (
            focused ? <SvgXml xml={scheduleActive} color={color} /> : <SvgXml xml={scheduleInactive} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: ({ color, focused}) => (
            focused ? <SvgXml xml={activeRecord} color={color} /> : <SvgXml xml={inactiveRecord} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color , focused}) => (
          focused ? <SvgXml xml={doctorProfileActive} color={color} /> : <SvgXml xml={doctorProfileInactive} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

import type { ParamListBase } from '@react-navigation/native';
import type { StackNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { interpolate } from 'react-native-reanimated';
import {
  createBlankStackNavigator,
  type BlankStackNavigationEventMap,
  type BlankStackNavigationOptions,
} from 'react-native-screen-transitions/blank-stack';

/**
 * Profile stack with custom push transitions (`react-native-screen-transitions`).
 * Note: `expo-screen-transition` is not published on npm; this library documents
 * Expo Router integration via `withLayoutContext` (see package README).
 */
const { Navigator } = createBlankStackNavigator();

const ProfileStack = withLayoutContext<
  BlankStackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  BlankStackNavigationEventMap
>(Navigator);

const slideFromRight: BlankStackNavigationOptions = {
  screenStyleInterpolator: ({ progress, layouts: { screen } }) => {
    'worklet';
    return {
      contentStyle: {
        transform: [
          {
            translateX: interpolate(progress, [0, 1, 2], [screen.width, 0, -screen.width * 0.25]),
          },
        ],
      },
    };
  },
};

export default function ProfileLayout() {
  return (
    <ProfileStack
      screenOptions={({ route }) => {
        const base: BlankStackNavigationOptions = {};
        if (
          route.name === 'edit' ||
          route.name === 'favourites' ||
          route.name === 'payments' ||
          route.name === 'add-payment' ||
          route.name === 'language' ||
          route.name === 'help'
        ) {
          return { ...base, ...slideFromRight };
        }
        return base;
      }}
    />
  );
}

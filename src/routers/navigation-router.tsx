import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setModeType } from '../actions/settingsActions';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { GameScreen } from '../screens/GameScreen';
import { InitiationScreen } from '../screens/InitiationScreen';
import { DownloadScreen } from '../screens/LoaderScreen/DownloadScreen';
import { DownloadStartScreen } from '../screens/LoaderScreen/DownloadStartScreen';
import { LauncherDownloadScreen } from '../screens/LoaderScreen/LauncherDownloadScreen';
import { LauncherUpdateScreen } from '../screens/LoaderScreen/LauncherUpdateScreen';
import { UpdateScreen } from '../screens/LoaderScreen/UpdateScreen';
import { UpdateStartScreen } from '../screens/LoaderScreen/UpdateStartScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { navigationRef } from './RootNavigation';

const Stack = createNativeStackNavigator();

export const NavigationRouter = React.memo(() => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    AsyncStorage.getItem('modeType')
      .then(res => {
        // Standard map (0) is the default now that the map choice screen is removed.
        dispatch(setModeType(res !== null ? +res : 0));
      })
      .catch(() => {
        dispatch(setModeType(0));
      })
      .finally(() => {
        setIsLoading(true);
      });
  }, []);

  if (!isLoading) {
    return <></>;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        onReady={() => RNBootSplash.hide()}
        ref={navigationRef}
        theme={DarkTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar translucent backgroundColor="transparent" />
          <BottomSheetModalProvider>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                headerTransparent: true,
                gestureEnabled: false,
                animationTypeForReplace: 'push',
                animationDuration: 350,
                animation: 'flip',
              }}
              initialRouteName="Initiation">
              <Stack.Screen name="Main" component={GameScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Error" component={DownloadStartScreen} />
              <Stack.Screen name="Initiation" component={InitiationScreen} />
              <Stack.Screen name="UpdateScreen" component={UpdateScreen} />
              <Stack.Screen
                name="UpdateStartScreen"
                component={UpdateStartScreen}
              />
              <Stack.Screen name="DownloadScreen" component={DownloadScreen} />
              <Stack.Screen
                name="DownloadStartScreen"
                component={DownloadStartScreen}
              />
              <Stack.Screen
                name="LauncherDownloadScreen"
                component={LauncherDownloadScreen}
              />
              <Stack.Screen
                name="LauncherUpdateScreen"
                component={LauncherUpdateScreen}
              />
            </Stack.Navigator>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
});

import React from 'react';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { App } from './App';
import { name as appName } from './app.json';
import { onBackgroundEventReceived } from './src/helpers/pushNotification';
import { store } from './src/store/store';

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

messaging().setBackgroundMessageHandler(async () => {});

// Keeps the app process alive while game files download in the background.
// The promise never resolves on its own: the service is stopped from the download code.
notifee.registerForegroundService(() => new Promise(() => {}));
notifee.onBackgroundEvent(onBackgroundEventReceived);

AppRegistry.registerComponent(appName, () => RNRedux);

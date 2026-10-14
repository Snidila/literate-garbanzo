import { PACKAGE_NAME, PROJECT_NAME } from '@env';
import notifee, { AndroidImportance } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { onMessageReceived } from '../helpers/pushNotification';
import { AppThunk } from '../store/store';

let unsubscribeForeground: (() => void) | null = null;

// Returns the FCM token of this phone (used to send a test message from Firebase).
export const getPushToken = async (): Promise<string> => {
  try {
    await messaging().registerDeviceForRemoteMessages();
  } catch (e) {}

  return await messaging().getToken();
};

export const appRegisterDeviceForRemoteMessages = (): AppThunk => async () => {
  try {
    await notifee.requestPermission();
  } catch (e) {}

  try {
    // Android 13+ asks for the notification permission at runtime
    if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
      await PermissionsAndroid.request(
        'android.permission.POST_NOTIFICATIONS' as any,
      );
    }
  } catch (e) {}

  try {
    await messaging().registerDeviceForRemoteMessages();
  } catch (e) {}

  // show messages that arrive while the app is open
  if (!unsubscribeForeground) {
    unsubscribeForeground = messaging().onMessage(onMessageReceived);
  }

  return await notifee.createChannel({
    id: PACKAGE_NAME + '-default',
    name: PROJECT_NAME + ' Chanel',
    importance: AndroidImportance.HIGH,
  });
};

const DOWNLOAD_ID = PACKAGE_NAME + '-notification';
const DOWNLOAD_CHANNEL = PACKAGE_NAME + '-download';

export const createPushNotificationLoader = (): AppThunk => async dispatch => {
  await dispatch(onUploadTaskEventLoader({ status: 'cancel' }));

  // silent channel for the progress bar (no sound on every update)
  await notifee.createChannel({
    id: DOWNLOAD_CHANNEL,
    name: PROJECT_NAME + ' Downloads',
    importance: AndroidImportance.LOW,
  });

  // normal channel for the final "complete / stopped" message
  return await notifee.createChannel({
    id: PACKAGE_NAME + '-notification',
    name: PROJECT_NAME + ' Chanel',
  });
};

const openAppAction = { id: 'default', launchActivity: 'default' };

export const onUploadTaskEventLoader =
  (event: any): AppThunk =>
  async () => {
    try {
      if (event.status === 'download') {
        // foreground service: keeps downloading even when the app is closed from the screen
        await notifee.displayNotification({
          id: DOWNLOAD_ID,
          title: `Downloading game files - ${event.percent}%`,
          body: `${event.remaining} remaining · file ${event.filesDone} of ${event.filesTotal}`,
          android: {
            channelId: DOWNLOAD_CHANNEL,
            asForegroundService: true,
            ongoing: true,
            onlyAlertOnce: true,
            showTimestamp: true,
            pressAction: openAppAction,
            progress: { max: 100, current: event.percent },
          },
        });
      }

      if (event.status === 'complete') {
        await notifee.stopForegroundService();
        await notifee.displayNotification({
          id: DOWNLOAD_ID,
          title: 'Download complete',
          body: 'Game files are ready. Tap to play.',
          android: {
            channelId: PACKAGE_NAME + '-notification',
            autoCancel: true,
            pressAction: openAppAction,
          },
        });
      }

      if (event.status === 'error') {
        await notifee.stopForegroundService();
        await notifee.displayNotification({
          id: DOWNLOAD_ID,
          title: 'Download stopped',
          body: 'Open the app to continue downloading.',
          android: {
            channelId: PACKAGE_NAME + '-notification',
            autoCancel: true,
            pressAction: openAppAction,
          },
        });
      }

      if (event.status === 'cancel') {
        await notifee.stopForegroundService();
        await notifee.cancelNotification(DOWNLOAD_ID);
      }
    } catch (e) {
      console.log(e);
    }
  };

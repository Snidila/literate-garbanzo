import { SKIP_DOWNLOAD } from '@env';
import RNGpuInfo from 'react-native-gpu-info';
import { setGPU, setInitial } from '../actions/appActions';
import { AppThunk } from '../store/store';
import { fetchArticles } from './articleThunks';
import { fetchDistribution } from './distributionThunks';
import { appRegisterDeviceForRemoteMessages } from './notificationThunks';
import { fetchPermisions } from './permisionThunks';
import { fetchInitialSettings } from './settingsThunks';

export const fetchInitialApp = (): AppThunk => async dispatch => {
  const glRenderer = RNGpuInfo.getGlRenderer();
  dispatch(setGPU(glRenderer));

  await dispatch(fetchPermisions());
  await dispatch(fetchInitialSettings());
  // SKIP_DOWNLOAD=true (in .env) opens the app without the file download / server requests.
  // The download code is untouched: set it back to false to restore the normal flow.
  if (SKIP_DOWNLOAD !== 'true') {
    await dispatch(fetchDistribution());
    await dispatch(fetchArticles());
    await dispatch(appRegisterDeviceForRemoteMessages());
  }

  dispatch(setInitial({ initial: true }));
};

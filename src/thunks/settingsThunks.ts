import AsyncStorage from '@react-native-async-storage/async-storage';
import { setModeType, setSettings } from '../actions/settingsActions';
import {
  applySavedSettingsToIni,
  readIni,
  readSavedSettings,
  saveSetting,
  writeIni,
} from '../features/savedSettings';
import { AppThunk } from '../store/store';

// Loads the settings: the values saved by the launcher win over settings.ini.
export const fetchInitialSettings = (): AppThunk => async dispatch => {
  try {
    const saved = await readSavedSettings();
    const ini = await readIni();

    if (!ini && Object.keys(saved).length === 0) {
      return;
    }

    const get = (section: string, key: string, fallback: any) =>
      saved[`${section}.${key}`] ?? ini?.[section]?.[key] ?? fallback;

    dispatch(
      setSettings({
        userName: String(get('client', 'name', '')),
        fpsLimit: Number(get('gui', 'fps', 40)),
        serverid: Number(get('server', 'serverid', -1)),
        pageSize: Number(get('gui', 'ChatMaxMessages', 6)),
        graphic: Number(get('gui', 'graphic', 0)),
        fpscounter: Number(get('gui', 'fpscounter', 0)),
        androidKeyboard: Number(get('gui', 'androidKeyboard', 0)),
        localhost: Number(get('launcher', 'localhost', 0)),
        skip: Number(get('launcher', 'skip', 0)),
        chatPosX: Number(get('gui', 'ChatPosX', -1)),
        chatPosY: Number(get('gui', 'ChatPosY', -1)),
        timestamp: Number(get('server', 'timestamp', 0)),
      }),
    );

    // restore the saved values inside settings.ini (if the file exists)
    await applySavedSettingsToIni(false);
  } catch (errors) {}
};

// Remembers the value inside the app, and writes it to settings.ini when the file exists.
const patchIni = async (
  section: string,
  key: string,
  value: string | number,
) => {
  await saveSetting(section, key, value);

  try {
    const ini = await readIni();
    if (!ini) {
      return;
    }
    ini[section] = { ...(ini[section] ?? {}), [key]: value };
    await writeIni(ini);
  } catch (error) {}
};

export const fetchUserNameSetting =
  (userName: string): AppThunk =>
  async () => {
    await patchIni('client', 'name', userName);
  };

export const fetchFpsSetting =
  (value: number): AppThunk =>
  async () => {
    await patchIni('gui', 'fps', value);
  };

export const fetchPageSizeSetting =
  (value: number): AppThunk =>
  async () => {
    await patchIni('gui', 'ChatMaxMessages', value);
  };

export const fetchGraphicSetting =
  (value: number): AppThunk =>
  async () => {
    await patchIni('gui', 'graphic', value ? 1 : 0);
  };

export const fetchFPSSetting =
  (value: boolean): AppThunk =>
  async () => {
    await patchIni('gui', 'fpscounter', value ? 1 : 0);
  };

export const fetchKeyboardSetting =
  (value: boolean): AppThunk =>
  async () => {
    await patchIni('gui', 'androidKeyboard', value ? 1 : 0);
  };

export const fetchServerIdSetting =
  (value: number): AppThunk =>
  async () => {
    await patchIni('server', 'serverid', value ? 1 : 0);
  };

export const fetchModeSetting =
  (value: number): AppThunk =>
  async dispatch => {
    try {
      await AsyncStorage.setItem('modeType', `${value}`);
      dispatch(setModeType(value));
    } catch (error) {
      dispatch(setModeType(0));
    }
  };

export const fetchModeInverseSetting =
  (): AppThunk => async (dispatch, state) => {
    const value = state().settings.modeType ? 0 : 1;

    try {
      await AsyncStorage.setItem('modeType', `${value}`);
      dispatch(setModeType(value));
    } catch (error) {
      dispatch(setModeType(0));
    }
  };

export const fetchChatPosSetting =
  (axis: 'X' | 'Y', value: number): AppThunk =>
  async () => {
    await patchIni('gui', `ChatPos${axis}`, value);
  };

export const fetchTimestampSetting =
  (value: boolean): AppThunk =>
  async () => {
    await patchIni('server', 'timestamp', value ? 1 : 0);
  };

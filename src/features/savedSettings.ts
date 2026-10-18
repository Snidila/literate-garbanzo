import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { parseINIString, stringifyIni } from '../helpers';
import { FilePath } from './fileManager';

// The launcher settings are remembered inside the app (AsyncStorage) as well as in settings.ini.
// settings.ini can be missing (before the game files are downloaded) or replaced by an update,
// the saved copy makes sure the player's choices are never lost.
const STORAGE_KEY = 'launcherSettings';

type Saved = Record<string, string | number>;

export const readSavedSettings = async (): Promise<Saved> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : {};
  } catch (e) {
    return {};
  }
};

export const saveSetting = async (
  section: string,
  key: string,
  value: string | number,
) => {
  try {
    const saved = await readSavedSettings();
    saved[`${section}.${key}`] = value;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch (e) {}
};

// null when settings.ini does not exist yet
export const readIni = async (): Promise<Record<string, any> | null> => {
  try {
    const res = await RNFS.readFile(FilePath.getPathDirSetting(), 'utf8');
    return parseINIString(res) as Record<string, any>;
  } catch (e) {
    return null;
  }
};

export const writeIni = async (ini: Record<string, any>) => {
  const path = FilePath.getPathDirSetting();
  try {
    await RNFS.mkdir(path.substring(0, path.lastIndexOf('/')));
  } catch (e) {}
  await RNFS.writeFile(path, stringifyIni(ini), 'utf8');
};

export const mergeSaved = (ini: Record<string, any>, saved: Saved) => {
  const result = { ...ini };
  Object.keys(saved).forEach(k => {
    const dot = k.indexOf('.');
    const section = k.substring(0, dot);
    const key = k.substring(dot + 1);
    result[section] = { ...(result[section] ?? {}), [key]: saved[k] };
  });
  return result;
};

// Puts the saved settings into settings.ini.
// createIfMissing is used right before the game starts (the file must exist then).
export const applySavedSettingsToIni = async (createIfMissing = false) => {
  try {
    const saved = await readSavedSettings();
    const ini = await readIni();
    if (!ini && !createIfMissing) {
      return;
    }
    await writeIni(mergeSaved(ini ?? {}, saved));
  } catch (e) {}
};

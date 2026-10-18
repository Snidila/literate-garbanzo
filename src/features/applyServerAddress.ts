import { getServerAddress } from '../helpers/serverAddress';
import {
  mergeSaved,
  readIni,
  readSavedSettings,
  writeIni,
} from './savedSettings';

// Writes the (decrypted at runtime) server host/port and the saved launcher settings
// into settings.ini right before the game starts. The file is created if it is missing.
export const applyServerAddress = async () => {
  const [host, port] = getServerAddress().split(':');

  const saved = await readSavedSettings();
  const ini = mergeSaved((await readIni()) ?? {}, saved);
  ini.client = { ...(ini.client ?? {}), host, port: Number(port) };

  await writeIni(ini);
};

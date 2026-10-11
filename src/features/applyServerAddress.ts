import RNFS from 'react-native-fs';
import { getServerAddress } from '../helpers/serverAddress';
import { parseINIString, stringifyIni } from '../helpers';
import { FilePath } from './fileManager';

// Writes the (decrypted at runtime) server host/port into settings.ini right before the game starts.
export const applyServerAddress = async () => {
  const path = FilePath.getPathDirSetting();
  const [host, port] = getServerAddress().split(':');

  const res = await RNFS.readFile(path, 'utf8');
  const ini = parseINIString(res) as Record<string, any>;
  ini.client = { ...(ini.client ?? {}), host, port: Number(port) };

  await RNFS.writeFile(path, stringifyIni(ini), 'utf8');
};

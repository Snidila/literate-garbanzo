import { Alert, Platform, Share } from 'react-native';
import RNFS from 'react-native-fs';
import { APP_VERSION } from '@env';
import { FilePath } from './fileManager';

// The game log is huge (thousands of lines of "RPC: CreateObject(...)").
// We share only the end of the file (where a crash is written) and count the noisy lines
// instead of sending them, so the message stays small.
const LOG_NAMES = ['samplog.txt', 'samp_log.txt', 'crash_log.log'];
const TAIL_BYTES = 400 * 1024;
const MAX_CHARS = 60000;

const NOISE = [
  'RPC: CreateObject(',
  'RPC: DestroyObject',
  'RPC: ScrSetPlayerDrunkLevel',
  'RPC: SetTimeEx',
  'RPC: ScrNumberPlate',
  'RPC: ScrVehicleParamsEx',
  'RPC: WorldVehicleAdd',
  'RPC: WorldVehicleRemove',
  'RPC: Update3DTextLabel',
  'RPC: Create3DTextLabel',
  'SetWheelPoppedStatus',
  'VehicleId:',
  'engine: ',
];

const readTail = async (path: string) => {
  const stat = await RNFS.stat(path);
  const size = Number(stat.size);
  const length = Math.min(size, TAIL_BYTES);
  return await RNFS.read(path, length, size - length, 'utf8');
};

const compact = (text: string) => {
  const counts: Record<string, number> = {};
  const kept: string[] = [];

  text.split('\n').forEach(line => {
    const noise = NOISE.find(n => line.startsWith(n));
    if (noise) {
      counts[noise] = (counts[noise] ?? 0) + 1;
    } else {
      kept.push(line);
    }
  });

  const summary = Object.keys(counts)
    .map(k => `${k.trim()} x${counts[k]}`)
    .join('\n');

  return `--- repeated lines removed (counts) ---\n${summary}\n--- log ---\n${kept.join(
    '\n',
  )}`;
};

export const shareGameLog = async () => {
  try {
    const dir = FilePath.getPathDirSetting().replace('settings.ini', '');
    let message = `Snidila Launcher v${APP_VERSION}\nAndroid ${Platform.Version}\n`;
    let found = false;

    for (const name of LOG_NAMES) {
      const path = dir + name;
      if (await RNFS.exists(path)) {
        found = true;
        const tail = await readTail(path);
        message += `\n===== ${name} =====\n${compact(tail)}\n`;
      }
    }

    if (!found) {
      Alert.alert('Game log', 'No log file yet. Play the game first.');
      return;
    }

    if (message.length > MAX_CHARS) {
      message = message.slice(message.length - MAX_CHARS);
    }

    await Share.share({ message });
  } catch (e: any) {
    Alert.alert('Game log error', String(e?.message ?? e));
  }
};

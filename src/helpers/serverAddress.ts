import { KA } from './colorMath';
import { KB } from './dateFormat';
import { VA, VB } from './sizeUnits';

// Rebuilds "ip:port" at runtime. The address is never stored in plain text.
export const getServerAddress = (): string => {
  const key = [KA[0], KA[1], KB[0], KB[1]];
  const ip = VA.map((v, i) => v ^ key[i]).join('.');
  const port = ((VB[0] ^ key[2]) << 8) | (VB[1] ^ key[3]);
  return `${ip}:${port}`;
};

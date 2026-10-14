import { URL_DISTRIBUTION } from '@env';
import axios from 'axios';
import { CacheType } from '../actions/loaderActions';
import { getServerAddress } from '../helpers/serverAddress';

export const DistributionService = {
  async get() {
    const response = await axios
      .get<DistributionResponseType>(URL_DISTRIBUTION)
      .then(res => res.data);
    // The server address is built from the encrypted constants inside the app.
    // Any address sent by the remote JSON is ignored.
    const address = getServerAddress();
    response.servers = (response.servers ?? []).map(server => ({
      ...server,
      address,
    }));
    return response;
  },
};

type DistributionResponseType = DistributionResponse & {
  cache: CacheType[];
};

export type DistributionResponse = {
  cdnLauncher: string;
  cdnCache: string;
  cacheMode: CacheType[];
  rss: string;
  versionHash: string;
  packageName: string;
  projectName: string;
  servers: ServerType[];
  launcher: LauncherType;
  filesContinue: FileContinueType;
};

type FileContinueType = string[];

type LauncherType = {
  appVersion: string;
  name: string;
  hash: string;
  bytes: number;
  size: string;
};

type EventType = {
  title: string;
  style: 'red' | 'blue';
};

export type ServerType = {
  id: number;
  show: boolean;
  version: string;
  icon: string;
  events: EventType[];
  slot: number;
  bonus: boolean;
  name: string;
  description: string;
  address: string;
  sampVersion: string;
};

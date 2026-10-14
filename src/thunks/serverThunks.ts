import { setServers } from '../actions/serverActions';
import { getServerAddress } from '../helpers/serverAddress';
import { ServerService } from '../services/server.service';
import { AppThunk } from '../store/store';

export const fetchServers = (): AppThunk => async (dispatch, state) => {
  const servers = state().distribution.servers;

  if (servers.length > 0) {
    for (const server of servers) {
      // the real address is stored encrypted inside the app, distribution.json can leave it empty
      const address = server.address || getServerAddress();
      const [ip, portText] = address.split(':');
      try {
        const { players, maxplayers } = await ServerService.getOnline(
          ip,
          Number(portText) || 7777,
        );
        dispatch(
          setServers({
            ...server,
            online: players,
            slot: maxplayers,
            status: true,
            loading: false,
          }),
        );
      } catch (e) {
        dispatch(
          setServers({
            ...server,
            online: 0,
            slot: 1000,
            status: false,
            loading: false,
          }),
        );
      }
    }
  }
};

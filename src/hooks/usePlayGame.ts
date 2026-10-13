import { useCallback } from 'react';
import { setAlertUserName } from '../actions/alertActions';
import { applyServerAddress } from '../features/applyServerAddress';
import GtaSetupModule from '../modules/GtaSetupModule';
import { selectUserName } from '../selectors/settingSelectors';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

// Starts the game: asks for a nickname if it is empty, writes host/port, then launches GTA.
export const usePlayGame = () => {
  const userName = useAppSelector(selectUserName);
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    if (userName.length < 1) {
      dispatch(setAlertUserName(true));
      return;
    }

    try {
      await applyServerAddress();
    } catch (e) {}
    await GtaSetupModule.startGame();
  }, [userName]);
};

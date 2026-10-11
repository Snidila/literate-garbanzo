import { APP_VERSION } from '@env';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  setSettingChatPos,
  setSettingFps,
  setSettingFpsCounter,
  setSettingPageSize,
  setSettingTimestamp,
  setUserNameSetting,
} from '../actions/settingsActions';
import { MainContainer, SwitchLauncher } from '../components';
import { InputLauncher } from '../components/InputLauncher/InputLauncher';
import { SegmentedLauncher } from '../components/Segmented/Segmented';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectSettings } from '../selectors/settingSelectors';
import {
  fetchChatPosSetting,
  fetchFPSSetting,
  fetchFpsSetting,
  fetchPageSizeSetting,
  fetchTimestampSetting,
  fetchUserNameSetting,
} from '../thunks/settingsThunks';
import * as Icons from './../assets/svg';

const FPS_OPTIONS = [30, 40, 60, 90];
const CHAT_LINES_OPTIONS = [5, 10, 15];

type PosInputType = {
  label: string;
  value: number;
  onEnd: (value: number) => void;
};

const PosInput = React.memo(({ label, value, onEnd }: PosInputType) => {
  const [text, setText] = React.useState(value >= 0 ? String(value) : '');

  React.useEffect(() => {
    setText(value >= 0 ? String(value) : '');
  }, [value]);

  const onEndEditing = () => {
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed)) {
      onEnd(parsed);
    }
  };

  return (
    <View style={styles.posBox}>
      <Text style={styles.posLabel}>{label}</Text>
      <TextInput
        style={styles.posInput}
        value={text}
        onChangeText={setText}
        onEndEditing={onEndEditing}
        keyboardType="numeric"
        placeholder="auto"
        placeholderTextColor="#6b6478"
      />
    </View>
  );
});

export const SettingsScreen = React.memo(() => {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const onEndEditingUserName = React.useCallback((value: string) => {
    dispatch(fetchUserNameSetting(value));
    dispatch(setUserNameSetting({ userName: value }));
  }, []);

  const onChangeFps = React.useCallback((value: number) => {
    dispatch(setSettingFps({ fpsLimit: value }));
    dispatch(fetchFpsSetting(value));
  }, []);

  const onChangeChatLines = React.useCallback((value: number) => {
    dispatch(setSettingPageSize({ pageSize: value }));
    dispatch(fetchPageSizeSetting(value));
  }, []);

  const onChangeFpsCounter = React.useCallback((value: boolean) => {
    dispatch(setSettingFpsCounter({ fpscounter: value ? 1 : 0 }));
    dispatch(fetchFPSSetting(value));
  }, []);

  const onChangeTimestamp = React.useCallback((value: boolean) => {
    dispatch(setSettingTimestamp({ timestamp: value ? 1 : 0 }));
    dispatch(fetchTimestampSetting(value));
  }, []);

  const onEndPosX = React.useCallback((value: number) => {
    dispatch(setSettingChatPos({ chatPosX: value }));
    dispatch(fetchChatPosSetting('X', value));
  }, []);

  const onEndPosY = React.useCallback((value: number) => {
    dispatch(setSettingChatPos({ chatPosY: value }));
    dispatch(fetchChatPosSetting('Y', value));
  }, []);

  return (
    <MainContainer>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Settings</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <InputLauncher
              Icon={Icons.UnionSvg}
              title={'Your nickname'}
              value={settings.userName}
              onChangeText={onEndEditingUserName}
              placeholder={'Example: Name_Surname'}
            />

            <Text style={styles.section}>CHAT POSITION</Text>
            <View style={styles.posRow}>
              <PosInput label="X" value={settings.chatPosX} onEnd={onEndPosX} />
              <PosInput label="Y" value={settings.chatPosY} onEnd={onEndPosY} />
            </View>

            <SegmentedLauncher
              title={'Chat lines'}
              options={CHAT_LINES_OPTIONS}
              value={settings.pageSize}
              onChange={onChangeChatLines}
            />

            <View style={styles.switches}>
              <SwitchLauncher
                title={'Timestamp'}
                value={+settings.timestamp}
                onValueChange={onChangeTimestamp}
              />
              <SwitchLauncher
                title={'Display FPS'}
                value={+settings.fpscounter}
                onValueChange={onChangeFpsCounter}
              />
            </View>

            <SegmentedLauncher
              title={'FPS limit'}
              options={FPS_OPTIONS}
              value={settings.fpsLimit}
              onChange={onChangeFps}
            />
          </View>
        </ScrollView>
        <Text style={styles.version}>Version {APP_VERSION}</Text>
      </View>
    </MainContainer>
  );
});

const styles = StyleSheet.create({
  wrapper: { flex: 1, marginBottom: 15 },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  body: { paddingHorizontal: 5, paddingBottom: 20 },
  section: { color: '#827896', fontSize: 11, marginTop: 18, marginBottom: 8 },
  posRow: { flexDirection: 'row', justifyContent: 'space-between' },
  posBox: {
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14101a',
    borderColor: '#463a5c',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  posLabel: { color: '#a8a0b6', fontSize: 14, marginRight: 8 },
  posInput: { flex: 1, color: '#ffffff', fontSize: 14, paddingVertical: 10 },
  switches: {
    marginTop: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, .15)',
    paddingVertical: 4,
  },
  version: { textAlign: 'center', color: '#a5a5a5' },
});

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setInitial } from '../../actions/appActions';
import { DownloadSvg } from '../../assets/svg/index';
import { ButtonLauncher, LoaderContainer } from '../../components';
import { formatSizeUnits } from '../../helpers';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { usePermisionFile } from '../../hooks/usePermisionFile';
import { useSpaceDownlload } from '../../hooks/useSpaceDownload';
import { selectCdnCache, selectCompare } from '../../selectors/loaderSelectors';
import { fetchInitialApp } from '../../thunks/appThunks';

type InitiationScreenType = NativeStackScreenProps<any>;

export const DownloadStartScreen = React.memo(
  ({ navigation }: InitiationScreenType) => {
    const dispatch = useAppDispatch();
    const compare = useAppSelector(selectCompare);
    const cdnCache = useAppSelector(selectCdnCache);
    const { fetchPermision } = usePermisionFile();
    const { fetchSpace } = useSpaceDownlload();

    // The distribution list could not be loaded (no connection or wrong URL)
    const isOffline = cdnCache === '';
    const needBytes = Math.max(
      compare.distributionCacheBytes - compare.downloadsCacheBytes,
      0,
    );

    const onPressDownload = () => {
      if (isOffline) {
        dispatch(setInitial({ initial: false }));
        dispatch(fetchInitialApp());
        return navigation.replace('Initiation');
      }

      if (!fetchPermision()) {
        return;
      }

      if (!fetchSpace()) {
        return;
      }

      return navigation.replace('DownloadScreen');
    };

    const onPressSkip = () => navigation.replace('Main');

    return (
      <LoaderContainer>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <DownloadSvg width={22} height={22} fill={'#b98cff'} />
          </View>
          <Text style={styles.title}>
            {isOffline ? 'Can’t reach the server' : 'Game files needed'}
          </Text>
          <Text style={styles.subtitle}>
            {isOffline
              ? 'Check your internet connection and try again.'
              : 'Download once, then jump straight into the game.'}
          </Text>

          {!isOffline && (
            <View style={styles.rows}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Download size</Text>
                <Text style={styles.rowValue}>
                  {needBytes > 0 ? formatSizeUnits(needBytes) : '-'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Network</Text>
                <Text style={styles.rowValue}>Wi-Fi recommended</Text>
              </View>
            </View>
          )}

          <ButtonLauncher
            btnWidth={'100%'}
            background={'#e0243b'}
            onPress={onPressDownload}>
            {isOffline ? 'Try again' : 'Download now'}
          </ButtonLauncher>
        </View>

        <TouchableOpacity style={styles.skip} onPress={onPressSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </LoaderContainer>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(20,18,24,0.72)',
    borderColor: '#2a2433',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#8b4fe0',
    backgroundColor: '#2a1a3d',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    color: '#f6f4fa',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    color: '#9b93a8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  rows: {
    borderTopWidth: 1,
    borderTopColor: '#2a2433',
    paddingTop: 12,
    marginBottom: 18,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  rowLabel: { color: '#9b93a8', fontSize: 13 },
  rowValue: { color: '#f6f4fa', fontSize: 13, fontWeight: '500' },
  skip: { alignSelf: 'center', marginTop: 18, padding: 8 },
  skipText: { color: '#9b93a8', fontSize: 13 },
});

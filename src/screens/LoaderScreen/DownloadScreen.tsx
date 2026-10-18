import KeepAwake from '@sayem314/react-native-keep-awake';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { LoaderContainer } from '../../components/Provider/LoaderContainer';
import { formatSizeUnits } from '../../helpers';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  selectCompare,
  selectLoaderDownload,
} from '../../selectors/loaderSelectors';
import { cancelDownload, fetchStartDownload } from '../../thunks/loaderThunks';

const barWidth = Dimensions.get('window').width - 40;

export const DownloadScreen = React.memo(() => {
  const download = useAppSelector(selectLoaderDownload);
  const compare = useAppSelector(selectCompare);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchStartDownload());
  }, []);

  const downloaded = (download.downloadBytes || 0) + compare.downloadsCacheBytes;
  const total = compare.distributionCacheBytes;
  const percent =
    total > 0 ? Math.min(Math.floor((downloaded * 100) / total), 100) : 0;

  const fileNeed = download.needBytes || 0;
  const fileCurrent = download.currentBytes || 0;
  const filePercent =
    fileNeed > 0 ? Math.min(Math.floor((fileCurrent * 100) / fileNeed), 100) : 0;

  const filesDone = compare.successCount + (download.numberOfDownloads || 0);
  const filesTotal = compare.successCount + compare.rejectCount;

  const onCancel = React.useCallback(() => {
    dispatch(cancelDownload());
  }, []);

  return (
    <LoaderContainer>
      <KeepAwake />
      <View style={styles.center}>
        <Progress.Circle
          size={96}
          progress={percent / 100}
          showsText={true}
          formatText={() => `${percent}%`}
          color={'#e0243b'}
          unfilledColor={'#2a1a3d'}
          borderWidth={0}
          thickness={6}
          textStyle={styles.circleText}
        />
        <Text style={styles.title}>Downloading game files</Text>
        <Text style={styles.subtitle}>You can leave the app. Progress shows in the notification.</Text>
      </View>

      <Progress.Bar
        progress={percent / 100}
        animated={true}
        useNativeDriver={true}
        borderWidth={0}
        color={'#e0243b'}
        unfilledColor={'#34283f'}
        borderRadius={20}
        height={7}
        width={barWidth}
      />
      <Text style={styles.small}>
        {formatSizeUnits(downloaded)} of {formatSizeUnits(total)}
      </Text>

      <View style={styles.divider} />

      <View style={styles.fileHeader}>
        <Text style={styles.small}>Current file</Text>
        <Text style={styles.small}>
          File {Math.min(filesDone + 1, filesTotal)} of {filesTotal}
        </Text>
      </View>
      <Text style={styles.fileName} numberOfLines={1}>
        {download.fileName || '-'}
      </Text>
      <Progress.Bar
        progress={filePercent / 100}
        animated={true}
        useNativeDriver={true}
        borderWidth={0}
        color={'#8b4fe0'}
        unfilledColor={'#34283f'}
        borderRadius={20}
        height={5}
        width={barWidth}
      />
      <Text style={styles.small}>
        {filePercent}% · {formatSizeUnits(fileCurrent)} of{' '}
        {formatSizeUnits(fileNeed)}
      </Text>

      <TouchableOpacity style={styles.cancel} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel Downloading</Text>
      </TouchableOpacity>
    </LoaderContainer>
  );
});

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginBottom: 24 },
  circleText: { color: '#ffffff', fontSize: 20, fontWeight: '600' },
  title: { color: '#f6f4fa', fontSize: 19, fontWeight: '600', marginTop: 18 },
  subtitle: { color: '#9b93a8', fontSize: 13, marginTop: 6 },
  small: { color: '#9b93a8', fontSize: 12, marginTop: 8 },
  divider: { height: 1, backgroundColor: '#34283f', marginVertical: 16 },
  fileHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  fileName: {
    color: '#f6f4fa',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 6,
    marginBottom: 10,
  },
  cancel: {
    marginTop: 30,
    borderWidth: 1.5,
    borderColor: '#e0243b',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelText: { color: '#ff6b7d', fontSize: 15, fontWeight: '600' },
});

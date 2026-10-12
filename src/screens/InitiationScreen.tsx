import { APP_VERSION, SKIP_DOWNLOAD } from '@env';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appBackgroundSamp } from '../assets/images';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectInitial } from '../selectors/appSelectors';
import {
  selectIsSuccessDownload,
  selectRejectCount,
} from '../selectors/loaderSelectors';
import { fetchInitialApp } from '../thunks/appThunks';
import { autoUpdateLauncher } from '../thunks/launcherTunks';

type InitiationScreenType = NativeStackScreenProps<any>;

export const InitiationScreen = React.memo(
  ({ navigation }: InitiationScreenType) => {
    const dispatch = useAppDispatch();
    const isInitial = useAppSelector(selectInitial);
    const isSuccessDownload = useAppSelector(selectIsSuccessDownload);
    const rejectCount = useAppSelector(selectRejectCount);
    const [active, setActive] = useState(0);

    // three dots that light up one after another while the app starts
    useEffect(() => {
      const timer = setInterval(() => setActive(v => (v + 1) % 3), 400);
      return () => clearInterval(timer);
    }, []);

    useEffect(() => {
      dispatch(fetchInitialApp());
    }, []);

    useEffect(() => {
      if (isInitial) {
        if (SKIP_DOWNLOAD === 'true') {
          return;
        }

        if (rejectCount) {
          if (isSuccessDownload === false && rejectCount) {
            return navigation.replace('DownloadStartScreen');
          }

          if (rejectCount) {
            return navigation.replace('UpdateStartScreen');
          }
        }

        dispatch(autoUpdateLauncher());
      }
    }, [isInitial, isSuccessDownload, rejectCount]);

    useFocusEffect(
      React.useCallback(() => {
        if (isInitial) {
          return navigation.replace('Main');
        }

        return () => {};
      }, [isInitial]),
    );

    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={appBackgroundSamp}
          resizeMode="cover">
          <View pointerEvents="none" style={styles.shade} />
          <SafeAreaView style={styles.safe}>
            <Text style={styles.credit}>By Snidila</Text>
            <View style={styles.header}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>S</Text>
              </View>
              <Text style={styles.name}>SA-MP Mobile</Text>
            </View>

            <View style={styles.flex} />

            <Text style={styles.welcome}>Welcome to</Text>
            <Text style={styles.title}>SA-MP</Text>
            <Text style={[styles.title, styles.red]}>Mobile</Text>

            <View style={styles.loadRow}>
              {[0, 1, 2].map(i => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { backgroundColor: i === active ? '#e0243b' : '#46385c' },
                  ]}
                />
              ))}
              <Text style={styles.loading}>Loading...</Text>
              <View style={styles.flex} />
              <Text style={styles.version}>v{APP_VERSION}</Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0c' },
  background: { flex: 1 },
  shade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,6,12,0.35)' },
  safe: { flex: 1, paddingHorizontal: 18, paddingBottom: 24 },
  flex: { flex: 1 },
  credit: {
    position: 'absolute',
    top: 12,
    right: 16,
    fontSize: 11,
    color: 'rgba(255,255,255,0.12)',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e0243b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: { color: '#ffffff', fontSize: 21, fontWeight: '700' },
  name: { color: '#f6f4fa', fontSize: 16, fontWeight: '500' },
  welcome: { color: '#a8a0b6', fontSize: 14 },
  title: { color: '#ffffff', fontSize: 46, fontWeight: '800', lineHeight: 52 },
  red: { color: '#e0243b' },
  loadRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  dot: { width: 9, height: 9, borderRadius: 5, marginRight: 7 },
  loading: { color: '#a8a0b6', fontSize: 13, marginLeft: 4 },
  version: { color: '#5f566e', fontSize: 12 },
});

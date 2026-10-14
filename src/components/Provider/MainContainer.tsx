import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appBackgroundSamp } from '../../assets/images';
import { PADDING_HORIZONTAL, verticalScale } from '../../helpers/demensions';
import { styles } from '../../styles/MainStyle';
import { AlertProtectedFile } from '../AlertScreen/AlertProtectedFile';
import { AlertSound } from '../AlertScreen/AlertSound';
import { AlertSpace } from '../AlertScreen/AlertSpace';
import { AlertUpdate } from '../AlertScreen/AlertUpdate';
import { AlertUserName } from '../AlertScreen/AlertUserName';

type MainContainerType = {
  children: React.ReactNode;
  image?: boolean;
  paddingHorizontal?: number;
  // 0..1: how dark the layer above the background is
  dim?: number;
};

export const MainContainer = React.memo((props: MainContainerType) => {
  const {
    children,
    paddingHorizontal = PADDING_HORIZONTAL,
    dim = 0.4,
  } = props;

  return (
    <View style={[styles.container]}>
      <ImageBackground
        style={styles.imageBackground}
        source={appBackgroundSamp}
        resizeMode="cover">
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: `rgba(8,6,12,${dim})` },
          ]}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.wrapper}>
            <View
              style={[
                styles.body,
                { paddingHorizontal: verticalScale(paddingHorizontal) },
              ]}>
              <View style={styles.content}>{children}</View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
      <AlertProtectedFile />
      <AlertSound />
      <AlertUserName />
      <AlertUpdate />
      <AlertSpace />
    </View>
  );
});

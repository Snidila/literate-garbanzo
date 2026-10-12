import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appBackgroundSamp } from '../../assets/images';

type LoaderContainerType = {
  children: React.ReactNode;
};

export const LoaderContainer = React.memo((props: LoaderContainerType) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={appBackgroundSamp}
        resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <Text style={styles.credit}>By Snidila</Text>
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>S</Text>
            </View>
            <Text style={styles.name}>SA-MP Mobile</Text>
          </View>
          <View style={styles.content}>{props.children}</View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0c' },
  background: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 20 },
  credit: {
    position: 'absolute',
    top: 12,
    right: 16,
    fontSize: 11,
    color: 'rgba(255,255,255,0.12)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: '#e0243b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  logoText: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  name: { color: '#f6f4fa', fontSize: 18, fontWeight: '500' },
  content: { flex: 1, justifyContent: 'center' },
});

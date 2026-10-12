import { LINK_DISCORD, PROJECT_NAME } from '@env';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { discordLinkIcon } from '../assets/icons';
import * as Icons from '../assets/svg';
import { MainContainer } from '../components/Provider/MainContainer';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { usePlayGame } from '../hooks/usePlayGame';
import { selectServers } from '../selectors/serverSelectors';
import { fetchServers } from '../thunks/serverThunks';

export const GameScreen = React.memo(() => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const servers = useAppSelector(selectServers);
  const onPlay = usePlayGame();

  // Refresh the online counter now and every 30 seconds while this screen is open
  useEffect(() => {
    dispatch(fetchServers());
    const timer = setInterval(() => dispatch(fetchServers()), 30000);
    return () => clearInterval(timer);
  }, []);

  const server = servers[0];
  const title = server?.name || PROJECT_NAME;
  const isOnline = !!server && !server.loading && server.status;
  const statusText = !server
    ? 'No server set'
    : server.loading
    ? 'Checking...'
    : server.status
    ? `${server.online} / ${server.slot} online`
    : 'Offline';

  const onDiscord = React.useCallback(() => {
    Linking.openURL(LINK_DISCORD).catch(() => {});
  }, []);

  return (
    <MainContainer paddingHorizontal={0} dim={0.3}>
      <View style={styles.screen}>
        <Text style={styles.credit}>By Snidila</Text>

        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <Text style={styles.name}>SA-MP Mobile</Text>
        </View>

        <View style={styles.flex} />

        <Text style={styles.label}>SERVER</Text>
        <View style={styles.serverCard}>
          <View style={styles.serverLogo}>
            <Text style={styles.serverLogoText}>S</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.serverName} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isOnline ? '#46d682' : '#6b6478' },
                ]}
              />
              <Text style={styles.status}>{statusText}</Text>
            </View>
          </View>
          <View style={styles.radio}>
            <View style={styles.radioDot} />
          </View>
        </View>

        <Text style={[styles.label, styles.labelSpace]}>COMMUNITY</Text>
        <TouchableOpacity
          style={styles.discord}
          activeOpacity={0.85}
          onPress={onDiscord}>
          <View style={styles.discordIcon}>
            <Image source={discordLinkIcon} style={styles.discordImg} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.discordTitle}>Join our Discord</Text>
            <Text style={styles.discordSub}>News, events and support</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.bar}>
          <TouchableOpacity
            style={styles.play}
            activeOpacity={0.85}
            onPress={onPlay}>
            <Icons.PlaySvg width={18} height={18} fill={'#ffffff'} />
            <Text style={styles.playText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gear}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Settings')}>
            <Icons.SettingSvg width={24} height={24} fill={'#8c82a0'} />
          </TouchableOpacity>
        </View>
      </View>
    </MainContainer>
  );
});

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 18, paddingBottom: 14 },
  flex: { flex: 1 },
  credit: {
    position: 'absolute',
    top: 4,
    right: 16,
    fontSize: 11,
    color: 'rgba(255,255,255,0.12)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
  label: { color: '#968caa', fontSize: 11, marginBottom: 8, letterSpacing: 0.5 },
  labelSpace: { marginTop: 16 },
  serverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,12,22,0.8)',
    borderColor: '#46385c',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  serverLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e0243b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serverLogoText: { color: '#ffffff', fontSize: 22, fontWeight: '700' },
  serverName: { color: '#f6f4fa', fontSize: 15, fontWeight: '500' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  status: { color: '#a8a0b6', fontSize: 12 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#8b4fe0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#8b4fe0',
  },
  discord: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#36226a',
    borderColor: '#8b4fe0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
  },
  discordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8b4fe0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  discordImg: { width: 22, height: 22, resizeMode: 'contain' },
  discordTitle: { color: '#f6f4fa', fontSize: 14, fontWeight: '500' },
  discordSub: { color: '#bfb0dc', fontSize: 12, marginTop: 2 },
  chevron: { color: '#b98cff', fontSize: 26, marginRight: 6 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,12,22,0.92)',
    borderColor: '#3c324e',
    borderWidth: 1,
    borderRadius: 30,
    padding: 5,
    marginTop: 22,
  },
  play: {
    flex: 3,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0243b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playText: { color: '#ffffff', fontSize: 17, fontWeight: '600', marginLeft: 10 },
  gear: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

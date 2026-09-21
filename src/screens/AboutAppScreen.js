import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import Header from '../components/Header';

export default function AboutAppScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Header title="About App" />

        <View style={styles.content}>
          <View
            style={[
              styles.logoContainer,
              {backgroundColor: theme.primary + '10'},
            ]}>
            <Text style={{fontSize: 60}}>⚡</Text>
          </View>
          <Text style={[styles.appName, {color: theme.text}]}>GreenSteps</Text>
          <Text style={[styles.version, {color: theme.subtext}]}>
            Version 1.0.0 (Stable)
          </Text>

          <View
            style={[
              styles.card,
              {backgroundColor: theme.card, borderColor: theme.border},
            ]}>
            <Text style={[styles.description, {color: theme.text}]}>
              GreenSteps is your all-in-one companion for eco-friendly EV
              charging. Our mission is to accelerate the transition to
              sustainable energy by providing a seamless, rewarding, and
              efficient charging experience.
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              Our Mission
            </Text>
            <Text style={[styles.text, {color: theme.subtext}]}>
              We believe in a greener future where every step counts. By using
              GreenSteps, you are not just charging your vehicle; you are
              contributing to a global movement to reduce carbon emissions and
              preserve our planet for future generations.
            </Text>
          </View>

          <View style={[styles.divider, {backgroundColor: theme.border}]} />

          <View style={styles.footer}>
            <Text style={[styles.footerText, {color: theme.subtext}]}>
              © 2026 GreenSteps Team
            </Text>
            <Text style={[styles.footerText, {color: theme.subtext}]}>
              Powered by Renewable Innovation
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {padding: 24, paddingBottom: 40},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  content: {alignItems: 'center'},
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -1,
  },
  version: {fontSize: 14, fontWeight: '700', marginBottom: 32},
  card: {
    padding: 24,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  infoSection: {alignSelf: 'flex-start', width: '100%'},
  sectionTitle: {fontSize: 20, fontWeight: '900', marginBottom: 12},
  text: {fontSize: 15, lineHeight: 22, fontWeight: '500', marginBottom: 20},
  divider: {width: '100%', height: 1, marginVertical: 32},
  footer: {alignItems: 'center'},
  footerText: {fontSize: 13, fontWeight: '600', marginBottom: 4},
});

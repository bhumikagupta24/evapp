import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';

export default function CarbonOffsetScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [co2Saved, setCo2Saved] = useState(0);

  useEffect(() => {
    // Example logic
    const distanceWalked = 25;
    const saved = distanceWalked * 0.12;
    setCo2Saved(saved);

    const uid = auth().currentUser?.uid;
    if (uid) {
      firestore().collection('Users').doc(uid).collection('CarbonOffset').add({
        co2Saved: saved,
        distance: distanceWalked,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    }
  }, []);

  const donateTree = () => {
    Alert.alert(
      '🌳 Tree Planted!',
      "Congratulations! You've successfully converted your carbon savings into a newly planted tree. Thank you for contributing to the planet!",
      [{text: 'Great!'}],
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, {borderColor: theme.border}]}>
            <Text style={{fontSize: 20}}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.text}]}>
            Carbon Tracker
          </Text>
          <View style={{width: 44}} />
        </View>

        {/* Visual Impact */}
        <View style={styles.visualContainer}>
          <View
            style={[styles.circleBg, {backgroundColor: theme.primary + '10'}]}>
            <Text style={styles.treeEmoji}>🌳</Text>
          </View>
          <Text style={[styles.impactTitle, {color: theme.text}]}>
            Great Job!
          </Text>
          <Text style={[styles.impactSubtitle, {color: theme.subtext}]}>
            You are making a difference
          </Text>
        </View>

        {/* Stats Card */}
        <View style={[styles.statsCard, {backgroundColor: theme.primary}]}>
          <Text style={styles.statsLabel}>Total CO₂ Saved</Text>
          <View style={styles.valueRow}>
            <Text style={styles.statsValue}>{co2Saved.toFixed(2)}</Text>
            <Text style={styles.statsUnit}>kg</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, {width: '65%'}]} />
          </View>
          <Text style={styles.progressText}>
            65% of your weekly goal reached
          </Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoRow}>
          <View
            style={[
              styles.infoCard,
              {backgroundColor: theme.card, borderColor: theme.border},
            ]}>
            <Text style={styles.infoIcon}>🚶</Text>
            <Text style={[styles.infoVal, {color: theme.text}]}>25km</Text>
            <Text style={[styles.infoLab, {color: theme.subtext}]}>Walked</Text>
          </View>
          <View
            style={[
              styles.infoCard,
              {backgroundColor: theme.card, borderColor: theme.border},
            ]}>
            <Text style={styles.infoIcon}>⚡</Text>
            <Text style={[styles.infoVal, {color: theme.text}]}>12kWh</Text>
            <Text style={[styles.infoLab, {color: theme.subtext}]}>
              Charged
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.donateBtn, {backgroundColor: theme.primary}]}
          onPress={donateTree}
          activeOpacity={0.8}>
          <Text style={styles.donateText}>Plant a Virtual Tree 🌳</Text>
        </TouchableOpacity>

        <Text style={[styles.footerNote, {color: theme.subtext}]}>
          Every 5kg of CO₂ saved allows you to plant one tree in our virtual
          forest.
        </Text>
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
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  visualContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  circleBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  treeEmoji: {fontSize: 50},
  impactTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  impactSubtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  statsLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  statsValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    marginRight: 8,
  },
  statsUnit: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  infoCard: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoIcon: {fontSize: 24, marginBottom: 8},
  infoVal: {fontSize: 18, fontWeight: '800'},
  infoLab: {fontSize: 12, fontWeight: '600'},
  donateBtn: {
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  donateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
});

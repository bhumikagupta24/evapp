import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
// import { initGoogleFit, getTodayStepCount } from '../services/googleFitService';
import StepCard from '../components/StepCard';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function TrackerScreen() {
  const [steps, setSteps] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const co2Saved = (steps * 0.00018).toFixed(2);
  const ecoPoints = Math.floor(steps / 100);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
          {
            title: 'Activity Recognition Permission',
            message: 'This app needs access to your physical activity to count your steps.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('❌ ACTIVITY_RECOGNITION permission denied');
          Alert.alert('Permission Needed', 'Step tracking won’t work without permission.');
        }
      } catch (err) {
        console.warn('Permission error:', err);
      }
    }
  };

  const loadSteps = async () => {
    try {
      await requestPermissions();
      await initGoogleFit();
      const stepCount = await getTodayStepCount();
      setSteps(stepCount);
      await saveSteps(stepCount);
    } catch (err) {
      console.error('Google Fit error:', err);
      Alert.alert('Error', 'Google Fit authorization failed or not signed in.');
    }
  };

  const saveSteps = async (steps) => {
    const user = auth().currentUser;
    if (!user) return;

    const co2 = parseFloat((steps * 0.00018).toFixed(2));
    const points = Math.floor(steps / 100);
    const today = new Date().toISOString().split('T')[0];

    try {
      await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('StepHistory')
        .doc(today)
        .set(
          {
            steps,
            co2Saved: co2,
            ecoPoints: points,
            timestamp: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
    } catch (err) {
      console.error('Firestore save error:', err);
    }
  };

  useEffect(() => {
    loadSteps();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSteps();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>🏃 Google Fit Step Tracker</Text>
      <StepCard title="Steps Counted" value={steps} unit="steps" />
      <StepCard title="CO₂ Saved" value={co2Saved} unit="kg" backgroundColor="#d0f8ce" />
      <StepCard title="EcoPoints Earned" value={ecoPoints} unit="pts" backgroundColor="#fff9c4" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2e7d32',
    marginBottom: 20,
  },
});

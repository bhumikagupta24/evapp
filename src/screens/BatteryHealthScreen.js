import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function BatteryHealthScreen() {
  const [loading, setLoading] = useState(true);
  const [batteryHealth, setBatteryHealth] = useState(null);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    fetchBatteryHealth();
  }, []);

  const fetchBatteryHealth = async () => {
    try {
      const userId = auth().currentUser.uid;
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('chargingHistory')
        .get();

      if (!snapshot.empty) {
        let totalCycles = 0;
        let badHabits = [];

        snapshot.forEach(doc => {
          const data = doc.data();
          const charged = data.endLevel - data.startLevel;
          totalCycles += charged / 100;

          if (data.endLevel > 90) badHabits.push("Avoid charging above 90% too often");
          if (data.startLevel < 20) badHabits.push("Avoid letting charge drop below 20%");
          if (data.duration < 10) badHabits.push("Avoid very short charging sessions");
        });

        // Calculate health
        const degradationRate = 0.05; // % per cycle
        let health = 100 - (totalCycles * degradationRate);
        if (health < 50) health = Math.max(health, 50); // avoid unrealistic low values

        setBatteryHealth(health.toFixed(2));
        setTips([...new Set(badHabits)]); // remove duplicates
      } else {
        setBatteryHealth("No data available");
      }

    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2e7d32" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🔋 Battery Health</Text>
      <Text style={styles.healthValue}>{batteryHealth}%</Text>

      <Text style={styles.subHeading}>Suggestions for Longer Battery Life:</Text>
      {tips.length > 0 ? (
        tips.map((tip, index) => (
          <Text key={index} style={styles.tip}>• {tip}</Text>
        ))
      ) : (
        <Text style={styles.tip}>✅ Your charging habits are great!</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f9f4',
    flexGrow: 1
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  healthValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#43a047',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5
  },
  tip: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8
  }
});

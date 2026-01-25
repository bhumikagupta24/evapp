import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function CarbonOffsetScreen() {
  const [co2Saved, setCo2Saved] = useState(0);

  useEffect(() => {
    // Example: Assume 0.12 kg CO₂ saved per km walked instead of petrol
    const distanceWalked = 25; // Example km
    const saved = distanceWalked * 0.12;
    setCo2Saved(saved);

    firestore()
      .collection("Users")
      .doc(auth().currentUser.uid)
      .collection("CarbonOffset")
      .add({
        co2Saved: saved,
        distance: distanceWalked,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
  }, []);

  const donateTree = () => {
    Alert.alert(
      "🌳 Tree Planted!",
      "Thank you for contributing to the planet!"
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Carbon Offset Tracker</Text>
      <Text style={styles.co2Text}>{co2Saved.toFixed(2)} kg CO₂ Saved</Text>
      <TouchableOpacity style={styles.donateBtn} onPress={donateTree}>
        <Text style={styles.donateText}>Plant a Tree 🌳</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  co2Text: { fontSize: 20, marginBottom: 20 },
  donateBtn: {
    backgroundColor: "#2E7D32",
    padding: 12,
    borderRadius: 10,
  },
  donateText: { color: "#fff", fontWeight: "bold" },
});

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function EcoPointsScreen() {
  const [ecoPoints, setEcoPoints] = useState(0);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("Users")
      .doc(auth().currentUser.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setEcoPoints(doc.data().ecoPoints || 0);
        }
      });

    return () => unsubscribe();
  }, []);

  const addChargingPoints = async () => {
    const userRef = firestore().collection("Users").doc(auth().currentUser.uid);
    const userDoc = await userRef.get();
    const currentPoints = userDoc.exists ? userDoc.data().ecoPoints || 0 : 0;
    const newPoints = currentPoints + 10; // 10 points per charging session

    await userRef.set({ ecoPoints: newPoints }, { merge: true });

    firestore()
      .collection("Users")
      .doc(auth().currentUser.uid)
      .collection("ChargingHistory")
      .add({
        pointsAdded: 10,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

    Alert.alert("⚡ Charging Recorded", "You earned 10 EcoPoints!");
  };

  const redeemForTree = async () => {
    if (ecoPoints >= 50) {
      await firestore()
        .collection("Users")
        .doc(auth().currentUser.uid)
        .update({ ecoPoints: ecoPoints - 50 });

      Alert.alert("🌳 Tree Planted!", "Thank you for contributing!");
    } else {
      Alert.alert("Not Enough Points", "You need 50 EcoPoints to plant a tree.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 EcoPoints Tracker</Text>
      <Text style={styles.pointsText}>{ecoPoints} EcoPoints</Text>

      <TouchableOpacity style={styles.button} onPress={addChargingPoints}>
        <Text style={styles.buttonText}>+ Record Charging Session</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.treeBtn]} onPress={redeemForTree}>
        <Text style={styles.buttonText}>Plant a Tree (50 pts)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  pointsText: { fontSize: 20, marginBottom: 20 },
  button: {
    backgroundColor: "#0288D1",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    width: 220,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  treeBtn: { backgroundColor: "#2E7D32" },
});

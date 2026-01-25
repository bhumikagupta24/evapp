// src/screens/AddStationScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function AddStationScreen({ navigation }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [available, setAvailable] = useState(true);

  const handleAddStation = async () => {
    if (!name || !address || !price || !vehicleType) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    try {
      const user = auth().currentUser;

      const stationData = {
        name,
        address,
        price: parseFloat(price),
        vehicleType,
        available,
        createdAt: firestore.FieldValue.serverTimestamp(),
        addedBy: user?.uid || null,
      };

      await firestore().collection("stations").add(stationData);

      Alert.alert("✅ Success", "Station added successfully");
      setName("");
      setAddress("");
      setPrice("");
      setVehicleType("");
      setAvailable(true);
    } catch (error) {
      console.error("❌ Firestore error:", error);
      Alert.alert("Error", "Failed to add station");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Add Charging Station</Text>
        <TextInput
          style={styles.input}
          placeholder="Station Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor='#9a9a9a'

        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor='#9a9a9a'
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholderTextColor='#9a9a9a'

        />
        <TextInput
          style={styles.input}
          placeholder="Vehicle Type (e.g., Car, Bike)"
          value={vehicleType}
          onChangeText={setVehicleType}
          placeholderTextColor='#9a9a9a'
        />
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Available</Text>
          <Switch value={available} onValueChange={setAvailable} />
        </View>
        <Button
          title="Add Station"
          onPress={handleAddStation}
          color="#43a047"
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Find")}
        style={styles.viewBtn}
      >
        <Text style={styles.viewBtnText}>VIEW STATION</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e9",
    padding: 20,
    marginTop: 50,
  },
  form: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    shadowColor: "#388e3c",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#388e3c",
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: "#c8e6c9",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f1f8e9",
    color:"#000"
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#388e3c",
  },
  viewBtn: {
    backgroundColor: "#43a047",
    paddingHorizontal: 20,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  viewBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});

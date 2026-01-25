import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function BookingScreen({ route, navigation }) {
  const { stationId } = route.params;
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  // Fetch station from Firestore
  const fetchStation = async () => {
    try {
      const docRef = doc(db, "stations", stationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStation({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert("Error", "Station not found");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch station data");
    } finally {
      setLoading(false);
    }
  };

  // Handle booking: update `available` to false
  const handleBooking = async () => {
    if (booking) return;

    setBooking(true);
    try {
      const docRef = doc(db, "stations", stationId);
      await updateDoc(docRef, {
        available: false,
        lastBookedAt: serverTimestamp(), // ✅ Timestamp added
      });

      Alert.alert("Success", "Booking confirmed!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to book station");
    } finally {
      setBooking(false);
    }
  };

  useEffect(() => {
    fetchStation();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.stationImage}
      />

      <Text style={styles.title}>
        <Icon name="ev-station" size={28} color="#388e3c" /> {station.name}
      </Text>

      <Text style={styles.detail}>
        <Icon name="location-on" size={18} color="#388e3c" /> {station.address}
      </Text>

      <View style={styles.statusContainer}>
        <Icon
          name={station.available ? "check-circle" : "error"}
          size={24}
          color={station.available ? "#388e3c" : "red"}
        />
        <Text style={styles.statusText}>
          {station.available ? "Available" : "Occupied"}
        </Text>
      </View>

      {station.available ? (
        <View style={styles.buttonContainer}>
          <Button
            title={booking ? "Booking..." : "Confirm Booking"}
            onPress={handleBooking}
            color="#43a047"
            disabled={booking}
          />
        </View>
      ) : (
        <Text style={styles.occupied}>
          This station is already occupied.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop: 30,
  },
  stationImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#388e3c",
    marginBottom: 15,
    textAlign: "center",
  },
  detail: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: "#333",
    marginLeft: 10,
  },
  occupied: {
    fontSize: 16,
    color: "red",
    marginTop: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 40,
    borderRadius: 10,
    backgroundColor: "#388e3c",
    elevation: 5,
  },
});

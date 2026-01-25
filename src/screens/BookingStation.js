import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import firestore, { Timestamp } from "@react-native-firebase/firestore";

export default function BookingScreen({ route, navigation }) {
  const stationId = route?.params?.stationId || null;
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const fetchStation = async () => {
    if (!stationId) {
      Alert.alert("Error", "No station ID provided.");
      navigation.goBack();
      return;
    }

    try {
      const docSnap = await firestore().collection("stations").doc(stationId).get();
      if (docSnap.exists) {
        let data = docSnap.data();

        if (data.endTime && data.endTime.toDate() < new Date()) {
          await firestore().collection("stations").doc(stationId).update({
            available: true,
            startTime: null,
            endTime: null,
            durationHours: null,
          });
          data.available = true;
          data.startTime = null;
          data.endTime = null;
        }

        setStation({ id: docSnap.id, ...data });
      } else {
        Alert.alert("Not Found", "Station not found.");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch station: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (durationHours = 2) => {
    if (!station?.available) {
      Alert.alert("Unavailable", "This station is already occupied.");
      return;
    }

    setBooking(true);
    try {
      const startTime = Timestamp.now();
      const endTime = new Date(startTime.toDate().getTime() + durationHours * 60 * 60 * 1000);

      await firestore().collection("stations").doc(stationId).update({
        available: false,
        startTime,
        endTime: Timestamp.fromDate(endTime),
        durationHours,
      });

      Alert.alert("✅ Success", `Booking confirmed for ${durationHours} hours!`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Booking failed: " + error.message);
    } finally {
      setBooking(false);
    }
  };

  useEffect(() => {
    fetchStation();
  }, [stationId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#388e3c" />
      </View>
    );
  }

  if (!station) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "red", fontSize: 16 }}>❌ No station data available.</Text>
      </View>
    );
  }

  let remainingTime = "";
  if (!station.available && station.endTime) {
    const now = new Date();
    const diffMs = station.endTime.toDate() - now;
    if (diffMs > 0) {
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      remainingTime = `${diffHrs}h ${diffMins}m left`;
    } else {
      remainingTime = "Releasing soon...";
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.heading}>⚡ Book Your Eco Station</Text>

      <View style={styles.card}>
        <Image source={require("../assets/logo.png")} style={styles.image} />

        <View style={{flexDirection:'row',columnGap:8}}>
        <Image source={require("../assets/electric.png")} style={styles.icon} />
        <Text style={styles.title}>{station.name}</Text>
        </View>
        <View style={{flexDirection:'row',columnGap:2}}>
        <Image source={require("../assets/location.png")} style={styles.icon} />
        <Text style={styles.infoText}>{station.address}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Image source={require("../assets/rupee.png")} style={styles.icon} />
          <Text style={styles.infoText}>₹{station.price} / unit</Text>
        </View>
        <View style={styles.infoRow}>
          <Image source={require("../assets/type.png")} style={styles.icon} />
          <Text style={styles.infoText}>{station.vehicleType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Image
            source={
              station.available
                ? require("../assets/available.png")
                : require("../assets/error.png")
            }
            style={styles.icon}
          />
          <Text style={styles.infoText}>
            {station.available ? "Available" : `Occupied (${remainingTime})`}
          </Text>
        </View>
      </View>

      {station.available ? (
        <>
          <TouchableOpacity style={styles.button} onPress={() => handleBooking(1)}>
            <Text style={styles.buttonText}>Book for 1 Hour</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleBooking(2)}>
            <Text style={styles.buttonText}>Book for 2 Hours</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleBooking(3)}>
            <Text style={styles.buttonText}>Book for 3 Hours</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={[styles.button, styles.buttonDisabled]} disabled={true}>
          <Text style={styles.buttonText}>Station Occupied</Text>
        </TouchableOpacity>
      )}

   <View style={styles.ecoPointsContainer}>
  <Text style={styles.ecoPointsTitle}>EcoPoints</Text>
  {/* <Text style={styles.ecoPointsValue}>{ecoPoints}</Text> */}

  <Text style={styles.ecoPointsNote}>
    Earn EcoPoints every time you charge your EV at eco-friendly stations.  
    Redeem points for rewards or plant trees directly from the app.
  </Text>
</View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    backgroundColor: "#F5F7FA",
    flexGrow: 1,
    marginTop: 30,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    columnGap:10
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    // marginLeft: 12,
    fontWeight: "600",
  },
  icon: {
    height: 22,
    width: 22,
    tintColor: "#43a047",
  },
  button: {
    backgroundColor: "#43a047",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#9E9E9E",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1b5e20",
    marginBottom: 20,
    textAlign: "center",
    marginTop:10
  },
ecoPointsContainer: {
  backgroundColor: '#ffffff',
  padding: 16,
  marginVertical: 12,
  borderRadius: 12,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

ecoPointsTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#2e7d32', // Green tone
  marginBottom: 4,
},

ecoPointsValue: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#1b5e20', // Darker green
},

ecoPointsNote: {
  fontSize: 14,
  color: '#555',
  marginTop: 8,
  textAlign: 'center',
  fontStyle: 'italic',
  lineHeight: 20,
},


});

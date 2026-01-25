import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

export default function ViewStationsScreen() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchStations = async () => {
    try {
      const snapshot = await firestore()
        .collection("stations")
        .orderBy("createdAt", "desc")
        .get();

      const stationList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStations(stationList);
    } catch (error) {
      console.error("Firestore fetch error:", error);
      Alert.alert("Error", "Failed to fetch stations");
    } finally {
      setLoading(false);
    }
  };

  const openGoogleMapsWithName = (stationName) => {
    if (!stationName) {
      Alert.alert("Error", "Station name not found.");
      return;
    }
    const query = encodeURIComponent(stationName);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Failed to open Google Maps.")
    );
  };

  useEffect(() => {
    fetchStations();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <View style={{
        flexDirection: 'row', columnGap: 10,
        borderBottomWidth: 1, borderColor: "#acf194ff",
        marginBottom: 20
      }}>

        <Image source={require('../assets/logo.png')} style={{
          height: 30, width: 30,
        }} />
        <Text style={styles.heading}>GreenSteps</Text>
      </View>

      <FlatList
        data={stations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: "row", columnGap: 6 }}>
              <Image source={require("../assets/electric.png")} style={styles.icon} />
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
            <View style={{ flexDirection: "row", columnGap: 6 }}>
              <Image source={require("../assets/location.png")} style={styles.icon} />
              <Text style={styles.cardText}>{item.address}</Text>
            </View>
            <View style={{ flexDirection: "row", columnGap: 6 }}>

              <Image source={require("../assets/rupee.png")} style={styles.icon} />
              <Text style={styles.cardText}>Price: ₹{item.price}/Unit</Text>
            </View>
            <View style={{ flexDirection: "row", columnGap: 6 }}>

              <Image source={require("../assets/type.png")} style={styles.icon} />
              <Text style={styles.cardText}>Vehicle: {item.vehicleType}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() =>
                  navigation.navigate("Booking", {
                    stationId: item.id,
                    stationName: item.name,
                  })
                }
              >
                <Text style={styles.bookText}>⚡ Book</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => openGoogleMapsWithName(item.name)}
              >
                <Text style={styles.menuText}>🗺️ View on Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchStations} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
    // paddingTop: 20,
    backgroundColor: "#F4F9F4",
    padding: 20,
    marginTop: 30
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E0EDE0",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 15,
    color: "#4e7d4e",
    marginVertical: 2,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  bookButton: {
    flex: 1,
    backgroundColor: "#00C853",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
    shadowColor: "#00C853",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  bookText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
  menuButton: {
    flex: 1,
    backgroundColor: "#388e3c",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#388e3c",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  menuText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  icon: {
    height: 15,
    width: 15,
    tintColor: "#43a047",
  },
});

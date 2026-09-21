import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const stations = [
  { id: "1", name: "Tata Power EV Station", distance: "2 km", chargers: 3, type: "Fast" },
  { id: "2", name: "ChargeZone Fast Charger Hub", distance: "5 km", chargers: 1, type: "Fast" },
  { id: "3", name: "Ather Grid Charging Point", distance: "8 km", chargers: 0, type: "Slow" },
  { id: "4", name: "Statiq EV Charging Station", distance: "6 km", chargers: 2, type: "Fast" },
  { id: "5", name: "Jio-bp Pulse Charging Station", distance: "4 km", chargers: 1, type: "Slow" },
  { id: "6", name: "Fortum Charge & Drive", distance: "7 km", chargers: 2, type: "Fast" },
];

const Nearby = ({ navigation }) => {
  const [search, setSearch] = useState("");

  const filteredStations =
    search === ""
      ? stations
      : stations.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );

  const viewDetails = (station) => {
    Alert.alert(
      station.name,
      `📍 Distance: ${station.distance}\n⚡ Chargers Available: ${station.chargers}\n🔌 Type: ${station.type} Charging`
    );
  };

  const bookCharger = (station) => {
    if (station.chargers === 0) {
      Alert.alert("No Charger Available", "All chargers at this station are currently busy. Try again later.");
      return;
    }

    Alert.alert(
      "Confirm Booking",
      `Book a charger at ${station.name}?\n📍 Distance: ${station.distance}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Book Now",
          onPress: () => navigation.navigate("Booking", { station }),
        },
      ]
    );
  };

  const renderStation = ({ item }) => (
    <View style={styles.stationCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.stationName} numberOfLines={1}>{item.name}</Text>
        <View style={[styles.statusBadge, item.chargers > 0 ? styles.available : styles.unavailable]}>
          <Text style={styles.statusText}>{item.chargers > 0 ? "Available" : "Busy"}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.stationDetails}>📍 {item.distance}</Text>
        <Text style={styles.stationDetails}>⚡ {item.chargers} charger{item.chargers !== 1 ? "s" : ""}</Text>
        <Text style={[styles.typeBadge, item.type === "Fast" ? styles.fastType : styles.slowType]}>
          {item.type}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => viewDetails(item)}
        >
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bookBtn, item.chargers === 0 && styles.disabledBtn]}
          onPress={() => bookCharger(item)}
          disabled={item.chargers === 0}
        >
          <Text style={styles.buttonText}>{item.chargers === 0 ? "Busy" : "Book"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#5F8F97", "#8ED081"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5F8F97" />

      <Text style={styles.header}>Nearby Stations</Text>
      <Text style={styles.subheader}>{filteredStations.length} station{filteredStations.length !== 1 ? "s" : ""} found</Text>

      <TextInput
        style={styles.input}
        placeholder="🔍  Search charging station..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      {filteredStations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No stations found for "{search}"</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item.id}
          renderItem={renderStation}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </LinearGradient>
  );
};

export default Nearby;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },

  subheader: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 16,
  },

  input: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 16,
    fontSize: 15,
    color: "#333",
    elevation: 2,
  },

  stationCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C5A6A",
    flex: 1,
    marginRight: 8,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  available: {
    backgroundColor: "#5ED66B",
  },

  unavailable: {
    backgroundColor: "#e74c3c",
  },

  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    flexWrap: "wrap",
  },

  stationDetails: {
    fontSize: 13,
    color: "#666",
  },

  typeBadge: {
    fontSize: 11,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  fastType: {
    backgroundColor: "#FFF3CD",
    color: "#F39C12",
  },

  slowType: {
    backgroundColor: "#E8F4FD",
    color: "#2980B9",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },

  detailsBtn: {
    flex: 1,
    backgroundColor: "#3498db",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },

  bookBtn: {
    flex: 1,
    backgroundColor: "#1C5A6A",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },

  disabledBtn: {
    backgroundColor: "#bbb",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },

  emptyText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    textAlign: "center",
  },
});
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const Booking = ({ navigation }) => {
  const [bookings, setBookings] = useState([
    {
      id: "1",
      station: "EV Station A",
      date: "12 May 2025",
      time: "10:30 AM",
      status: "Completed",
      amount: 250,
    },
    {
      id: "2",
      station: "Fast Charger Hub",
      date: "15 May 2025",
      time: "02:00 PM",
      status: "Active",
      amount: 320,
    },
    {
      id: "3",
      station: "City Charging Point",
      date: "18 May 2025",
      time: "05:30 PM",
      status: "Upcoming",
      amount: 180,
    },
  ]);

  const showDetails = (item) => {
    Alert.alert(
      "📋 Booking Details",
      `Station: ${item.station}\nDate: ${item.date}\nTime: ${item.time}\nStatus: ${item.status}\nAmount: ₹${item.amount}`
    );
  };

  const cancelBooking = (id) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            setBookings((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, status: "Cancelled" } : item
              )
            );
          },
        },
      ]
    );
  };

  const goToPayment = (item) => {
    navigation.navigate("Payment", { booking: item });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed": return styles.completed;
      case "Active":    return styles.active;
      case "Upcoming":  return styles.upcoming;
      case "Cancelled": return styles.cancelled;
      default:          return {};
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case "Completed": return "✅";
      case "Active":    return "⚡";
      case "Upcoming":  return "🕐";
      case "Cancelled": return "❌";
      default:          return "";
    }
  };

  const renderBooking = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => showDetails(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.station} numberOfLines={1}>{item.station}</Text>
        <Text style={[styles.statusBadge, getStatusStyle(item.status)]}>
          {getStatusEmoji(item.status)} {item.status}
        </Text>
      </View>

      <Text style={styles.info}>📅 {item.date} &nbsp;•&nbsp; 🕐 {item.time}</Text>
      <Text style={styles.amountText}>₹{item.amount}</Text>

      <View style={styles.actionRow}>
        {item.status === "Upcoming" && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => cancelBooking(item.id)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}

        {(item.status === "Active" || item.status === "Upcoming") && (
          <TouchableOpacity
            style={styles.payBtn}
            onPress={() => goToPayment(item)}
          >
            <Text style={styles.payText}>💳 Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#5F8F97", "#8ED081"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5F8F97" />

      <Text style={styles.header}>My Bookings</Text>
      <Text style={styles.subheader}>{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </LinearGradient>
  );
};

export default Booking;

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
    marginBottom: 18,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  station: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C5A6A",
    flex: 1,
    marginRight: 8,
  },

  statusBadge: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  completed: {
    backgroundColor: "#E8F8EE",
    color: "#27ae60",
  },

  active: {
    backgroundColor: "#FEF9E7",
    color: "#f39c12",
  },

  upcoming: {
    backgroundColor: "#EBF5FB",
    color: "#2980b9",
  },

  cancelled: {
    backgroundColor: "#FDEDEC",
    color: "#e74c3c",
  },

  info: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },

  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C5A6A",
    marginBottom: 10,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: "#FDEDEC",
    padding: 10,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e74c3c",
  },

  cancelText: {
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: 14,
  },

  payBtn: {
    flex: 1,
    backgroundColor: "#1C5A6A",
    padding: 10,
    borderRadius: 14,
    alignItems: "center",
  },

  payText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const payments = [
  {
    id: "1",
    station: "EV Station A",
    date: "12 May 2025",
    amount: "₹250",
    method: "UPI",
    status: "Paid",
  },
  {
    id: "2",
    station: "Fast Charger Hub",
    date: "15 May 2025",
    amount: "₹320",
    method: "Card",
    status: "Paid",
  },
  {
    id: "3",
    station: "City Charging Point",
    date: "18 May 2025",
    amount: "₹180",
    method: "Wallet",
    status: "Pending",
  },
];

const PaymentHistory = () => {
  const showPaymentDetails = (item) => {
    if (item.status === "Pending") {
      Alert.alert(
        "⏳ Payment Pending",
        `Station: ${item.station}\nAmount: ${item.amount}\nMethod: ${item.method}\n\nPlease complete the payment.`
      );
    } else {
      Alert.alert(
        "✅ Payment Details",
        `Station: ${item.station}\nDate: ${item.date}\nAmount: ${item.amount}\nMethod: ${item.method}\nStatus: ${item.status}`
      );
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + parseInt(p.amount.replace("₹", "")), 0);

  const renderPayment = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => showPaymentDetails(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardTop}>
        <Text style={styles.station}>{item.station}</Text>
        <Text
          style={[
            styles.statusBadge,
            item.status === "Paid" ? styles.paid : styles.pending,
          ]}
        >
          {item.status === "Paid" ? "✅ Paid" : "⏳ Pending"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.info}>📅 {item.date}</Text>
        <Text style={styles.amount}>{item.amount}</Text>
      </View>

      <Text style={styles.info}>💳 {item.method}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#5F8F97", "#8ED081"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5F8F97" />

      <Text style={styles.title}>Payment History</Text>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Spent</Text>
        <Text style={styles.summaryAmount}>₹{totalPaid}</Text>
        <Text style={styles.summaryNote}>{payments.filter(p => p.status === "Paid").length} successful payments</Text>
      </View>

      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderPayment}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </LinearGradient>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    alignItems: "center",
  },

  summaryLabel: {
    fontSize: 13,
    color: "#888",
  },

  summaryAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1C5A6A",
    marginVertical: 4,
  },

  summaryNote: {
    fontSize: 13,
    color: "#999",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
    elevation: 4,
  },

  cardTop: {
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  info: {
    fontSize: 13,
    color: "#666",
  },

  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C5A6A",
  },

  paid: {
    backgroundColor: "#E8F8EE",
    color: "#27ae60",
  },

  pending: {
    backgroundColor: "#FEF3E2",
    color: "#e67e22",
  },
});
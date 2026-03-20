import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const Payment = ({ navigation, route }) => {
  const [selected, setSelected] = useState(null);

  // Amount may come from Booking params, fallback to default
  const amount = route?.params?.booking?.amount || 250;

  const payNow = () => {
    if (!selected) {
      Alert.alert("Select Payment Method", "Please choose a payment method to continue.");
      return;
    }

    Alert.alert(
      "✅ Payment Successful",
      `₹${amount} paid successfully via ${selected}.\n\nThank you for using EVServices!`,
      [
        {
          text: "Done",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const paymentMethods = [
    { id: "UPI", label: "📱 UPI", subtitle: "Google Pay, PhonePe, Paytm" },
    { id: "Card", label: "💳 Credit / Debit Card", subtitle: "Visa, Mastercard, RuPay" },
    { id: "Wallet", label: "👛 Wallet", subtitle: "Paytm, Amazon Pay" },
  ];

  return (
    <LinearGradient
      colors={["#5F8F97", "#8ED081"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#5F8F97" />

      <Text style={styles.title}>EV Charging Payment</Text>

      {/* Amount Card */}
      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amount}>₹{amount}</Text>
        <Text style={styles.amountSub}>Charging session fee</Text>
      </View>

      <Text style={styles.methodLabel}>Select Payment Method</Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[styles.method, selected === method.id && styles.selected]}
          onPress={() => setSelected(method.id)}
        >
          <View>
            <Text style={[styles.methodText, selected === method.id && styles.selectedText]}>
              {method.label}
            </Text>
            <Text style={styles.methodSub}>{method.subtitle}</Text>
          </View>
          {selected === method.id && (
            <Text style={styles.checkmark}>✅</Text>
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.payBtn, !selected && styles.payBtnDisabled]}
        onPress={payNow}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={selected ? ["#1C5A6A", "#5ED66B"] : ["#aaa", "#bbb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.payGradient}
        >
          <Text style={styles.payText}>Pay ₹{amount}</Text>
        </LinearGradient>
      </TouchableOpacity>

    </LinearGradient>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },

  amountCard: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 22,
    marginBottom: 22,
    elevation: 5,
    alignItems: "center",
  },

  amountLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },

  amount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1C5A6A",
  },

  amountSub: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 4,
  },

  methodLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  method: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#e8e8e8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selected: {
    borderColor: "#1C5A6A",
    backgroundColor: "#EAF6F8",
  },

  methodText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },

  selectedText: {
    color: "#1C5A6A",
    fontWeight: "bold",
  },

  methodSub: {
    fontSize: 12,
    color: "#999",
    marginTop: 3,
  },

  checkmark: {
    fontSize: 18,
  },

  payBtn: {
    marginTop: 20,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 4,
  },

  payBtnDisabled: {
    opacity: 0.7,
  },

  payGradient: {
    padding: 16,
    alignItems: "center",
    borderRadius: 30,
  },

  payText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
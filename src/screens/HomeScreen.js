// HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [ecoPoints, setEcoPoints] = useState(0);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = auth().currentUser?.uid;
      if (!uid) return;

      try {
        const userDoc = await firestore().collection("Users").doc(uid).get();
        const data = userDoc.data();
        setUserName(data?.fullName || "User");
        setEcoPoints(data?.ecoPoints || 0);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Greeting */}
      <Text style={styles.greeting}>👋 Welcome back, {userName}!</Text>

      {/* Points Card */}
      <View style={styles.pointsBox}>
        <Text style={styles.pointsLabel}>🌱 Your EcoPoints</Text>
        <Text style={styles.points}>{ecoPoints}</Text>
        <TouchableOpacity
          style={styles.redeemBtn}
          onPress={() => navigation.navigate("eco")}
        >
          <Text style={styles.redeemText}>Redeem Points</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <HomeButton
          title="🔌 Find Station"
          onPress={() => navigation.navigate("Find")}
        />
        <HomeButton
          title="📅 Book Now"
          onPress={() => navigation.navigate("Booking")}
        />
        <HomeButton
          title="🎁 Rewards"
          onPress={() => navigation.navigate("Rewards")}
        />
        <HomeButton
          title="🌱 Carbon Tracker"
          onPress={() => navigation.navigate("CarbonOffset")}
        />
      </View>

      {/* Eco Impact */}
      <Text style={styles.sectionTitle}>Your Eco Impact</Text>
      <ImpactCard
        title="CO₂ Saved"
        value="15 kg"
        subtitle="Compared to petrol cars"
      />
      <ImpactCard title="Distance" value="123 km" subtitle="Walked or biked" />
      <ImpactCard
        title="Charging Sessions"
        value="5"
        subtitle="Eco-friendly sessions"
      />

      {/* Offers */}
      <Text style={styles.sectionTitle}>Hot Offers</Text>
      <OfferCard text="₹50 OFF on your next charge" />
      <OfferCard text="Plant a tree for just 300 EcoPoints" />
    </ScrollView>
  );
}

const HomeButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.homeButton} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const ImpactCard = ({ title, value, subtitle }) => (
  <View style={styles.impactCard}>
    <Text style={styles.impactTitle}>{title}</Text>
    <Text style={styles.impactValue}>{value}</Text>
    <Text style={styles.impactSubtitle}>{subtitle}</Text>
  </View>
);

const OfferCard = ({ text }) => (
  <View style={styles.offerCard}>
    <Text style={styles.offerText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f9f4",
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 20,
  },
  pointsBox: {
    backgroundColor: "#dcedc8",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 25,
  },
  pointsLabel: { fontSize: 16, color: "#33691e" },
  points: { fontSize: 36, fontWeight: "bold", color: "#1b5e20" },
  redeemBtn: {
    marginTop: 10,
    backgroundColor: "#388e3c",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  redeemText: { color: "#fff", fontWeight: "600" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#388e3c",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: "#aed581",
    width: "48%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { fontWeight: "600", fontSize: 14, color: "#1b5e20" },
  impactCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  impactTitle: { fontSize: 16, fontWeight: "600", color: "#2e7d32" },
  impactValue: { fontSize: 20, fontWeight: "700", color: "#1b5e20" },
  impactSubtitle: { fontSize: 12, color: "#777" },
  offerCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },
  offerText: { fontSize: 14, color: "#444" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

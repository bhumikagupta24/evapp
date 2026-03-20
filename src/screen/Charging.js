import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const Charging = () => {
  const [percent, setPercent] = useState(72);
  const [time, setTime] = useState(23);
  const [cost, setCost] = useState(58.5);
  const [charging, setCharging] = useState(true);

  useEffect(() => {
    if (!charging) return;

    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCharging(false);
          Alert.alert("⚡ Charging Complete", "Your EV is fully charged!");
          return 100;
        }
        return prev + 1;
      });

      // Update time remaining (decrements toward 0)
      setTime((prev) => (prev > 0 ? prev - 1 : 0));

      // Update running cost
      setCost((prev) => parseFloat((prev + 2.5).toFixed(2)));
    }, 3000);

    return () => clearInterval(interval);
  }, [charging]);

  const stopCharging = () => {
    Alert.alert(
      "Stop Charging?",
      "Are you sure you want to stop the charging session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Stop",
          style: "destructive",
          onPress: () => {
            setCharging(false);
            Alert.alert("Session Ended", "Charging session has been stopped.");
          },
        },
      ]
    );
  };

  // Derive kWh from percentage (approx)
  const kwhCharged = ((percent - 72) * 0.5 + 18.5).toFixed(1);

  return (
    <LinearGradient colors={["#0D2A33", "#1C5A6A"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D2A33" />

      <Text style={styles.header}>⚡ Charging Status</Text>

      {/* Progress Circle */}
      <View style={styles.progressCard}>
        <View style={styles.circleOuter}>
          <View style={styles.circle}>
            <Text style={styles.percentText}>{percent}%</Text>
            <Text style={styles.chargedLabel}>Charged</Text>
          </View>
        </View>

        <Text style={styles.chargingText}>
          {charging ? "🔋 Charging in progress..." : "✅ Session Ended"}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${percent}%` }]} />
      </View>

      {/* Info Row */}
      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.label}>⏱ Time Left</Text>
          <Text style={styles.value}>{time} min</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>💰 Cost So Far</Text>
          <Text style={styles.value}>₹{cost}</Text>
        </View>
      </View>

      {/* Stop Button */}
      {charging && (
        <TouchableOpacity activeOpacity={0.8} onPress={stopCharging}>
          <LinearGradient
            colors={["#e74c3c", "#c0392b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.stopButton}
          >
            <Text style={styles.stopText}>Stop Charging</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Bottom Info */}
      <View style={styles.bottomCard}>
        <View style={styles.bottomInfo}>
          <Text style={styles.smallText}>Total Energy Charged</Text>
          <Text style={styles.smallValue}>{kwhCharged} kWh</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.bottomInfo}>
          <Text style={styles.smallText}>Rate</Text>
          <Text style={styles.smallValue}>₹45 / kWh</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.bottomInfo}>
          <Text style={styles.smallText}>Charging Type</Text>
          <Text style={[styles.smallValue, styles.fastTag]}>⚡ Fast</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Charging;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 28,
  },

  progressCard: {
    alignItems: "center",
    marginBottom: 20,
  },

  circleOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(94,214,107,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(94,214,107,0.3)',
  },

  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#5ED66B",
  },

  percentText: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#fff",
  },

  chargedLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },

  chargingText: {
    marginTop: 14,
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    fontWeight: '500',
  },

  barBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    marginBottom: 22,
    overflow: 'hidden',
  },

  barFill: {
    height: 8,
    backgroundColor: '#5ED66B',
    borderRadius: 4,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
    gap: 12,
  },

  infoCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 16,
    borderRadius: 18,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  label: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
  },

  value: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 6,
    color: "#5ED66B",
  },

  stopButton: {
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 22,
    elevation: 4,
  },

  stopText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  bottomCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  smallText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
  },

  smallValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },

  fastTag: {
    color: '#5ED66B',
  },
});
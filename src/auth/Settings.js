import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const Settings = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationAccess, setLocationAccess] = useState(true);

  const changeLanguage = () => {
    Alert.alert("Language", "Language settings will be available in a future update.");
  };

  const aboutApp = () => {
    Alert.alert(
      "About EVServices",
      "Version 1.0.0\n\nEVServices helps you find nearby EV charging stations, manage bookings, and track your payment history.\n\nBuilt with ❤️ for EV owners."
    );
  };

  const clearCache = () => {
    Alert.alert("Clear Cache", "Cache cleared successfully!");
  };

  const OptionRow = ({ label, icon, value, onValueChange, onPress, danger }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
      disabled={!!onValueChange}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.optionLeft}>
        <Text style={styles.optionIcon}>{icon}</Text>
        <Text style={[styles.optionText, danger && styles.dangerText]}>{label}</Text>
      </View>
      {onValueChange !== undefined ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#ccc", true: "#5ED66B" }}
          thumbColor={value ? "#1C5A6A" : "#f0f0f0"}
        />
      ) : (
        <Text style={styles.arrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#5F8F97", "#8ED081"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5F8F97" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        {/* Account */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <OptionRow
            icon="👤"
            label="Edit Profile"
            onPress={() => navigation.navigate("Profile")}
          />
        </View>

        {/* Preferences */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>PREFERENCES</Text>
          <OptionRow
            icon="🔔"
            label="Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
          <OptionRow
            icon="🌙"
            label="Dark Mode"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <OptionRow
            icon="📍"
            label="Location Access"
            value={locationAccess}
            onValueChange={setLocationAccess}
          />
          <OptionRow
            icon="🌐"
            label="Language"
            onPress={changeLanguage}
          />
        </View>

        {/* App Info */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>INFO</Text>
          <OptionRow
            icon="ℹ️"
            label="About App"
            onPress={aboutApp}
          />
          <OptionRow
            icon="🗑️"
            label="Clear Cache"
            onPress={clearCache}
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </LinearGradient>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1C5A6A",
    letterSpacing: 1.2,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 4,
  },

  option: {
    padding: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  optionIcon: {
    fontSize: 18,
    width: 28,
    textAlign: "center",
  },

  optionText: {
    fontSize: 15,
    color: "#333",
  },

  dangerText: {
    color: "#e74c3c",
  },

  arrow: {
    color: "#bbb",
    fontSize: 22,
    fontWeight: "300",
  },
});

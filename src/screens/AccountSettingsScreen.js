import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const SettingItem = ({ title, screen }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(screen)}>
      <Text style={styles.itemText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default function AccountSettingsScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Login');
    } catch (err) {
      alert('Logout failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <SettingItem title="Account Settings" screen="AccountSettings" />
      <SettingItem title="Payment Methods" screen="PaymentMethods" />
      <SettingItem title="Charging History" screen="ChargingHistory" />
      <SettingItem title="Notifications" screen="NotificationsSettings" />
      <SettingItem title="Privacy & Security" screen="PrivacySecurity" />
      <SettingItem title="Theme & Display" screen="ThemeDisplay" />
      <SettingItem title="Help & Support" screen="HelpSupport" />
      <SettingItem title="About App" screen="AboutApp" />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f9f4',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#c62828',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

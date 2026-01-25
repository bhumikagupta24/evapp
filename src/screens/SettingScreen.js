import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function SettingScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Logout Failed', 'Something went wrong.');
    }
  };

  const settingsOptions = [
    { id: 1, title: 'Manage Vehicle', icon: require('../assets/user.png'), onPress: () => navigation.navigate('manage') },
    { id: 2, title: 'Account Settings', icon: require('../assets/setting.png'), onPress: () => navigation.navigate('account') },
    { id: 3, title: 'Notifications', icon: require('../assets/bell.png'), onPress: () => navigation.navigate('notification') },
    { id: 4, title: 'Charging History', icon: require('../assets/history.png'), onPress: () => navigation.navigate('ChargingHistory') },
    { id: 5, title: 'Help & Support', icon: require('../assets/help.png'), onPress: () => navigation.navigate('HelpSupport') },
    { id: 6, title: 'About EcoCharger', icon: require('../assets/info.png'), onPress: () => navigation.navigate('About') },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>⚙️ Settings</Text>

      {settingsOptions.map(item => (
        <TouchableOpacity key={item.id} style={styles.option} onPress={item.onPress}>
          <Image source={item.icon} style={styles.icon} />
          <Text style={styles.optionText}>{item.title}</Text>
        </TouchableOpacity>
      ))}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9f4',
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    elevation: 2,
  },
  icon: {
    width: 26,
    height: 26,
    marginRight: 12,
    tintColor: '#2e7d32',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#c8e6c9',
    marginVertical: 20,
  },
  logoutButton: {
    backgroundColor: '#c62828',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

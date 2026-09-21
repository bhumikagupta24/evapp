import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const EditProfile = ({ route, navigation }) => {
  // Safe defaults if route.params is missing
  const { userData = {}, updateUser } = route?.params || {};

  const [name, setName] = useState(userData.name || '');
  const [email, setEmail] = useState(userData.email || '');
  const [phone, setPhone] = useState(userData.phone || '');
  const [vehicle, setVehicle] = useState(userData.vehicle || '');
  const [connector, setConnector] = useState(userData.connector || '');

  const saveData = () => {
    if (phone && phone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (updateUser) {
      updateUser({
        ...userData,
        name,
        email,
        phone,
        vehicle,
        connector,
      });
    }

    Alert.alert('✅ Saved', 'Your profile has been updated successfully!');
    navigation.goBack();
  };

  const InputField = ({ label, value, onChangeText, placeholder, keyboardType, maxLength }) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholder={placeholder || label}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        keyboardType={keyboardType || 'default'}
        maxLength={maxLength}
      />
    </View>
  );

  return (
    <LinearGradient colors={['#5F8F97', '#8ED081']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5F8F97" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Edit Profile</Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Personal Info</Text>

          <InputField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />

          <InputField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <InputField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Vehicle Info</Text>

          <InputField
            label="Vehicle Number"
            value={vehicle}
            onChangeText={setVehicle}
            placeholder="e.g. MH12AB1234"
          />

          <InputField
            label="Connector Type"
            value={connector}
            onChangeText={setConnector}
            placeholder="e.g. CCS2, CHAdeMO, Type 2"
          />
        </View>

        <TouchableOpacity onPress={saveData} activeOpacity={0.85} style={styles.btnWrapper}>
          <LinearGradient
            colors={['#1C5A6A', '#5ED66B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </LinearGradient>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C5A6A',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },

  fieldWrapper: {
    marginBottom: 14,
  },

  fieldLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#D0E8EC',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F4FAFB',
    color: '#222',
    fontSize: 15,
  },

  btnWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 4,
    marginTop: 4,
  },

  btn: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 30,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },

  cancelBtn: {
    marginTop: 14,
    alignItems: 'center',
  },

  cancelText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    fontWeight: '600',
  },
});
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const userId = auth().currentUser?.uid;
  const [profileImage, setProfileImage] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    vehicleType: '',
    vehicleNumber: '',
    batteryCapacity: '',
    profileImage: ''
  });

  // Fetch profile and image
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const doc = await firestore().collection('Users').doc(userId).get();
      if (doc.exists) {
        setForm(prev => ({ ...prev, ...doc.data() }));
        if (doc.data().profileImage) {
          setProfileImage(doc.data().profileImage);
        }
      }

      // Load from AsyncStorage (specific to user)
      const savedImage = await AsyncStorage.getItem(`profileImage_${userId}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // Pick and save image locally + Firestore
  const pickImage = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, async (response) => {
      if (!response.didCancel && !response.errorCode) {
        const uri = response.assets[0].uri;
        setProfileImage(uri);
        await AsyncStorage.setItem(`profileImage_${userId}`, uri);
        setForm(prev => ({ ...prev, profileImage: uri }));
      }
    });
  };

  // Save profile
  const handleSave = async () => {
    if (!form.fullName || !form.phone || !form.vehicleType) {
      Alert.alert('Incomplete', 'Please fill in required fields.');
      return;
    }

    setLoading(true);
    try {
      await firestore().collection('Users').doc(userId).set(form, { merge: true });
      Alert.alert('Saved', 'Your profile was updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}></Text>
        <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginBottom: 20 }}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/user.png')}
            style={{ height: 100, width: 100, borderRadius: 50 }}
          />
          <Image
            source={require('../assets/camera.png')}
            style={{
              height: 25,
              width: 25,
              alignSelf: "center",
              tintColor: '#2e7d32',
              bottom: 20,
              left: 30
            }}
          />
        </TouchableOpacity>

        {[
          { label: 'Full Name', key: 'fullName' },
          { label: 'Username', key: 'username' },
          { label: 'Email', key: 'email', disabled: true },
          { label: 'Phone', key: 'phone' },
          { label: 'Address', key: 'address' },
          { label: 'Vehicle Type', key: 'vehicleType' },
          { label: 'Vehicle Number', key: 'vehicleNumber' },
          { label: 'Battery Capacity (kWh)', key: 'batteryCapacity' },
        ].map(({ label, key, disabled }) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={label}
            value={form[key]}
            onChangeText={text => handleChange(key, text)}
            editable={!disabled}
            placeholderTextColor="#666"
          />
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    color: '#1B5E20',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 18,
    fontSize: 16,
    borderColor: '#A5D6A7',
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderBottomWidth: 1
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
});

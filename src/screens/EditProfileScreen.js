import React, {useEffect, useState} from 'react';
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
  Image,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const CustomInput = ({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  theme,
  focusedInput,
  setFocusedInput,
}) => {
  const isFocused = focusedInput === label;
  return (
    <View style={styles.inputGroup}>
      <Text
        style={[
          styles.label,
          {color: isFocused ? theme.primary : theme.subtext},
        ]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.card,
            borderColor: isFocused ? theme.primary : theme.border,
          },
          isFocused && styles.focusedWrapper,
          multiline && styles.textAreaWrapper,
        ]}>
        <Ionicons
          name={icon}
          size={20}
          color={isFocused ? theme.primary : theme.subtext}
          style={styles.inputIcon}
        />
        <TextInput
          style={[
            styles.input,
            {color: theme.text},
            multiline && styles.textArea,
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          placeholderTextColor={theme.subtext + '60'}
          onFocus={() => setFocusedInput(label)}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
    </View>
  );
};

export default function EditProfileScreen({navigation}) {
  const {theme} = useTheme();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
          const data = userDoc.data() || {};
          setFullName(data.fullName || '');
          setUsername(data.username || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          setDob(data.dob || '');
          setVehicleNumber(data.vehicleNumber || '');
          setBatteryCapacity(data.batteryCapacity || '');
        }

        const savedImage = await AsyncStorage.getItem(`profileImage_${userId}`);
        if (savedImage) {
          setProfileImage(savedImage);
        }

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    // Automatically generate username if it's empty or we are typing and it matches the auto-pattern
    if (
      !username ||
      username === 'choose a handle' ||
      username.startsWith(
        fullName.replace(/\s+/g, '').toLowerCase().substring(0, 5),
      )
    ) {
      if (fullName) {
        const namePart = fullName
          .replace(/\s+/g, '')
          .toLowerCase()
          .substring(0, 5);
        const phonePart = phone ? phone.replace(/\D/g, '').slice(-3) : '000';
        const email = auth().currentUser?.email;
        const emailPart = email ? email.split('@')[0].substring(0, 3) : 'eco';
        setUsername(`${namePart}${phonePart}${emailPart}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, phone]);

  const selectImage = () => {
    const options = {mediaType: 'photo', quality: 1};
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorMessage) {
        Alert.alert('Error', 'Image selection failed');
      } else {
        const source = response.assets[0].uri;
        setProfileImage(source);
      }
    });
  };

  const handleUpdate = async () => {
    if (!fullName || !username) {
      Alert.alert('Error', 'Full Name and Username are required');
      return;
    }

    try {
      setSaving(true);
      await firestore().collection('users').doc(userId).set(
        {
          fullName,
          username,
          phone,
          address,
          dob,
          vehicleNumber,
          batteryCapacity,
        },
        {merge: true},
      );

      if (profileImage) {
        await AsyncStorage.setItem(`profileImage_${userId}`, profileImage);
      }

      Alert.alert('✅ Success', 'Profile updated successfully!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('❌ Update Error:', error);
      Alert.alert('Error', 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, {backgroundColor: theme.background}]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, {borderColor: theme.border}]}>
            <Ionicons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.text}]}>
            Edit Identity
          </Text>
          <View style={{width: 44}} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <Animated.View style={{opacity: fadeAnim}}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={
                    profileImage
                      ? {uri: profileImage}
                      : require('../assets/user.png')
                  }
                  style={[styles.avatar, {borderColor: theme.primary}]}
                />
                <TouchableOpacity
                  style={[styles.cameraBtn, {backgroundColor: theme.primary}]}
                  onPress={selectImage}>
                  <Ionicons name="camera" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.avatarHint, {color: theme.subtext}]}>
                Change Profile Picture
              </Text>
            </View>

            {/* Form Fields Card */}
            <View
              style={[
                styles.formCard,
                {backgroundColor: theme.card, shadowColor: theme.primary},
              ]}>
              <Text style={[styles.sectionSubtitle, {color: theme.primary}]}>
                Personal Details
              </Text>

              <CustomInput
                theme={theme}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
                icon="person-outline"
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your name"
              />
              <CustomInput
                theme={theme}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
                icon="at-outline"
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Choose a handle"
              />
              <CustomInput
                theme={theme}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
                icon="call-outline"
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 00000 00000"
                keyboardType="phone-pad"
              />
              <CustomInput
                theme={theme}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
                icon="calendar-outline"
                label="Date of Birth"
                value={dob}
                onChangeText={setDob}
                placeholder="DD / MM / YYYY"
              />
              <CustomInput
                theme={theme}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
                icon="location-outline"
                label="Home Address"
                value={address}
                onChangeText={setAddress}
                placeholder="Your current city"
                multiline
              />

              <View style={[styles.divider, {backgroundColor: theme.border}]} />
              <Text style={[styles.sectionSubtitle, {color: theme.primary}]}>
                Vehicle Details
              </Text>

              <CustomInput
                theme={theme}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
                icon="card-outline"
                label="Vehicle Number"
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
                placeholder="MH 12 AB 1234"
              />
              <CustomInput
                theme={theme}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
                icon="battery-charging-outline"
                label="Battery Capacity"
                value={batteryCapacity}
                onChangeText={setBatteryCapacity}
                placeholder="e.g. 75 kWh"
              />

              <TouchableOpacity
                style={[styles.saveBtn, {backgroundColor: theme.primary}]}
                onPress={handleUpdate}
                disabled={saving}>
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.saveBtnContent}>
                    <Text style={styles.saveBtnText}>Apply Changes</Text>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  scrollContent: {paddingHorizontal: 24, paddingBottom: 40},
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 40,
    borderWidth: 4,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 40,
    height: 40,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarHint: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
  },
  formCard: {
    borderRadius: 36,
    padding: 24,
    marginBottom: 20,
    elevation: 8,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  focusedWrapper: {
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  textAreaWrapper: {
    height: 120,
    alignItems: 'flex-start',
    paddingTop: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '700',
  },
  textArea: {
    textAlignVertical: 'top',
  },
  divider: {
    height: 1,
    marginVertical: 32,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  saveBtn: {
    height: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 20,
  },
  saveBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const userId = auth().currentUser?.uid; // Unique key for this user's profile

  useFocusEffect(
    useCallback(() => {
      const loadImage = async () => {
        const savedImage = await AsyncStorage.getItem(`profileImage_${userId}`);
        if (savedImage) {
          setProfileImage(savedImage);
        }
      };
      loadImage();
    }, [])
  );

  // Function to load profile data
  const loadProfile = async () => {
    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    try {
      setLoading(true);
      const userRef = firestore().collection('Users').doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const data = userDoc.data();
        console.log('✅ Profile Data:', data);
        setUserInfo(data);
      } else {
        Alert.alert('Missing Data', 'User profile not found.');
      }

      // Fetch bookings
      const bookingSnap = await firestore()
        .collection('Bookings')
        .where('userId', '==', userId)
        .get();

      let totalSpent = 0;
      bookingSnap.forEach(doc => {
        const data = doc.data();
        totalSpent += data?.price || 0;
      });

      setBookingStats({
        totalBookings: bookingSnap.size,
        totalSpent,
      });
    } catch (err) {
      console.error('❌ Error loading profile:', err);
      Alert.alert('Error', 'Could not fetch profile');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.centered}>
        <Text>No profile data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2e7d32']} />
      }
    >

      <View style={{
          flex: 1, justifyContent: 'center',
          alignContent: 'center', marginTop: 20,
          padding: 20,
        }}>
      {/* HEADER */}
     <View style={styles.header}>
            <View style={{flexDirection:'row',columnGap:10}}>

              <Image source={require('../assets/logo.png')} style={{
                height: 30, width: 30,
              }} />
              <Text style={styles.heading}>GreenSteps</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('setting')}
            >
              <Image
                source={require('../assets/setting.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

      {/* PROFILE CARD */}
      <View style={styles.card}>
        <View style={styles.cardd}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/user.png')}
            style={styles.profileImage}
          />

          <View style={styles.infoContainer}>
            <ProfileField label="Name" value={userInfo.fullName || 'Not Provided'} />
            <ProfileField label="Username" value={userInfo.username || 'Not Provided'} />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={{
            backgroundColor: '#4CAF50',
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* PERSONAL INFO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>👤 Personal Info</Text>
        <ProfileField label="Email" value={userInfo.email} />
        <ProfileField label="Phone" value={userInfo.phone} />
        <ProfileField label="Address" value={userInfo.address} />
      </View>

      {/* VEHICLE INFO */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
          <Text style={styles.sectionTitle}>
            🚗 Vehicle Info {isOpen ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.details}>
            <ProfileField label="Vehicle Type" value={userInfo.vehicleType} />
            <ProfileField label="Vehicle Number" value={userInfo.vehicleNumber} />
            <ProfileField label="Battery Capacity" value={userInfo.batteryCapacity} />
          </View>
        )}
      </View>

      {/* CHARGING HISTORY */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📅 Charging History</Text>
        <ProfileField label="Total Bookings" value={bookingStats?.totalBookings || 0} />
        <ProfileField label="Total Amount Spent" value={`₹${bookingStats?.totalSpent || 0}`} />
      </View>

      </View>
    </ScrollView>
  );
}

const ProfileField = ({ label, value }) => (
  <View style={styles.fieldRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#f0f9f4' },
      heading: {
      fontSize: 26,
      fontWeight: '700',
      color: '#1b5e20',
      marginBottom: 20,
      textAlign: 'center',
    },

    editButton: {
      backgroundColor: '#1976d2',
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
    },

     icon: {
      height: 20,
      width: 20,
      tintColor: "#58de5eff"
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // paddingHorizontal: 20,
      // paddingVertical: 15,
      // backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#acf194ff',
      marginBottom: 10,
      // shadowColor: '#000',
      // shadowOpacity: 0.05,
      // shadowOffset: { width: 0, height: 2 },
      // shadowRadius: 4,
      // elevation: 2,
    },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
  },
  profileImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#2e7d32',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#388e3c',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#c8e6c9',
    paddingBottom: 5,
  },
  fieldRow: { marginBottom: 10 },
  infoContainer: { flex: 1 },
  label: { fontSize: 13, fontWeight: '500', color: '#888' },
  value: { fontSize: 16, fontWeight: '600', color: '#2e7d32' },
  editButton: { backgroundColor: '#e8f5e9', padding: 8, borderRadius: 8 },
  icon: { height: 25, width: 25, tintColor: '#2e7d32' },
  cardd: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    marginVertical: 10,
    columnGap: 20,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});


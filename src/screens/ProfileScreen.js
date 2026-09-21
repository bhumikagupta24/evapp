import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth, {getAuth, signOut} from '@react-native-firebase/auth';
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  query,
  where,
} from '@react-native-firebase/firestore';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

export default function ProfileScreen() {
  const {theme, isDarkMode} = useTheme();
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    totalKwh: 0,
  });
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const userId = auth().currentUser?.uid;

  useFocusEffect(
    useCallback(() => {
      const loadImage = async () => {
        const savedImage = await AsyncStorage.getItem(`profileImage_${userId}`);
        if (savedImage) {
          setProfileImage(savedImage);
        }
      };
      loadImage();
    }, [userId]),
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    setLoading(true);

    const db = getFirestore();
    const userDocRef = doc(db, 'users', userId);

    const unsubscribeUser = onSnapshot(
      userDocRef,
      docSnap => {
        if (docSnap.exists) {
          setUserInfo(docSnap.data());
        }
        setLoading(false);
        setRefreshing(false);
      },
      error => {
        console.error('❌ Error listening to profile:', error);
        setLoading(false);
        setRefreshing(false);
      },
    );

    const bookingsQuery = collection(db, 'users', userId, 'ChargingHistory');
    const unsubscribeBookings = onSnapshot(bookingsQuery, snapshot => {
      let totalSpent = 0;
      let totalKwh = 0;
      let totalSaved = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        const duration = data?.durationHours || 1;
        const kwh = data?.kwhCharged || duration * 50; // Fallback to 50kW if old data
        const cost = data?.totalCost || kwh * 15; // Fallback to 15 Rs if old data
        totalKwh += kwh;
        totalSpent += cost;
        totalSaved += kwh * 25; // Approx savings 25 Rs per kWh vs petrol
      });

      setBookingStats({
        totalBookings: snapshot.size,
        totalSpent,
        totalSaved,
        totalKwh,
      });

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      unsubscribeUser();
      unsubscribeBookings();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const onRefresh = () => {
    // onSnapshot handles updates automatically, just set refreshing for UI feedback
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            const authInstance = getAuth();
            if (authInstance.currentUser) {
              await signOut(authInstance);
            }
            navigation.reset({index: 0, routes: [{name: 'Login'}]});
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.centered, {backgroundColor: theme.background}]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const InfoItem = ({label, value, icon, isLast}) => (
    <View
      style={[
        styles.infoItem,
        !isLast && {borderBottomColor: theme.border, borderBottomWidth: 1},
      ]}>
      <View
        style={[styles.infoIconContainer, {backgroundColor: theme.background}]}>
        <Ionicons name={icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={[styles.infoLabel, {color: theme.subtext}]}>{label}</Text>
        <Text style={[styles.infoValue, {color: theme.text}]}>
          {value || 'Not set'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />

      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.headerBtn, {backgroundColor: theme.card}]}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.text}]}>
            My Profile
          </Text>
          <TouchableOpacity
            style={[styles.headerBtn, {backgroundColor: theme.card}]}
            onPress={() => navigation.navigate('setting')}>
            <Ionicons name="settings-outline" size={22} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={{opacity: fadeAnim}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
            />
          }>
          <View
            style={[
              styles.profileCard,
              {backgroundColor: theme.card, borderColor: theme.border},
            ]}>
            <View style={styles.avatarWrapper}>
              <View
                style={[
                  styles.avatarContainer,
                  {backgroundColor: theme.primary, borderColor: theme.card},
                ]}>
                <Image
                  source={
                    profileImage
                      ? {uri: profileImage}
                      : require('../assets/user.png')
                  }
                  style={styles.avatarImage}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.editAvatarButton,
                  {backgroundColor: theme.text, borderColor: theme.card},
                ]}
                onPress={() => navigation.navigate('EditProfile')}>
                <Ionicons name="camera" size={16} color={theme.card} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.userName, {color: theme.text}]}>
              {userInfo?.fullName || 'Eco User'}
            </Text>
            <Text style={[styles.userEmail, {color: theme.subtext}]}>
              {userInfo?.email ||
                auth().currentUser?.email ||
                userInfo?.phone ||
                'No contact info'}
            </Text>

            <View
              style={[
                styles.statsContainer,
                {backgroundColor: theme.background, borderColor: theme.border},
              ]}>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, {color: theme.text}]}>
                  {bookingStats.totalBookings}
                </Text>
                <Text style={styles.statLabel}>Charges</Text>
              </View>
              <View
                style={[styles.statDivider, {backgroundColor: theme.border}]}
              />
              <View style={styles.statBox}>
                <Text style={[styles.statValue, {color: theme.text}]}>
                  {bookingStats.totalKwh}
                </Text>
                <Text style={styles.statLabel}>kWh</Text>
              </View>
              <View
                style={[styles.statDivider, {backgroundColor: theme.border}]}
              />
              <View style={styles.statBox}>
                <Text style={[styles.statValue, {color: theme.text}]}>
                  ₹{bookingStats.totalSaved}
                </Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, {color: theme.primary}]}>
              Account Details
            </Text>
            <View style={[styles.infoCard, {backgroundColor: theme.card}]}>
              <InfoItem
                label="Username"
                value={`@${userInfo?.username || 'eco_driver'}`}
                icon="at-outline"
              />
              <InfoItem
                label="Phone"
                value={userInfo?.phone}
                icon="call-outline"
              />
              <InfoItem
                label="Address"
                value={userInfo?.address}
                icon="location-outline"
              />
              <InfoItem
                label="Date of Birth"
                value={userInfo?.dob}
                icon="calendar-number-outline"
              />
              <InfoItem
                label="Member Since"
                value={
                  userInfo?.createdAt
                    ? new Date(
                        userInfo.createdAt.seconds * 1000,
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })
                }
                icon="calendar-outline"
                isLast
              />
            </View>
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.editButton, {backgroundColor: theme.primary}]}
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.8}>
              <Text style={styles.editButtonText}>Edit Profile Details</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.logoutButton,
                {
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  borderColor: 'rgba(239, 68, 68, 0.1)',
                },
              ]}
              onPress={handleLogout}
              activeOpacity={0.7}>
              <View style={styles.logoutIconContainer}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              </View>
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 110, // Raised for floating tab bar clearance
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: 40,
    padding: 32,
    marginTop: 10,
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.05,
    shadowRadius: 20,
    borderWidth: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  userName: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  infoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginLeft: 4,
  },
  infoCard: {
    borderRadius: 30,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionSection: {
    gap: 16,
  },
  editButton: {
    height: 64,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 22,
    gap: 12,
    borderWidth: 1,
  },
  logoutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '800',
  },
});

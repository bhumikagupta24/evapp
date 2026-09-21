import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StatusBar,
  Dimensions,
  Animated,
  TextInput,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  getFirestore,
  collection,
  query,
  limit,
  getDocs,
  doc,
  getDoc,
  where,
  onSnapshot,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';

const {width, height} = Dimensions.get('window');

export default function HomeScreen({route}) {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [recommendedStations, setRecommendedStations] = useState([]);
  const [partnerStations, setPartnerStations] = useState([]);
  const [userRole, setUserRole] = useState('user');
  const [userData, setUserData] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    name: 'Model 3',
    battery: 65,
    range: 240,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(400)).current;
  const mapRef = useRef(null);

  const goToCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            },
            1000,
          );
        }
      },
      error => console.log('Location error', error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const filteredStations = recommendedStations.filter(
    s =>
      (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.address &&
        s.address.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  useEffect(() => {
    let unsubscribeStations = () => {};

    const fetchData = async () => {
      try {
        const db = getFirestore();
        const authUid = auth().currentUser?.uid;
        let isPartner = false;

        if (authUid) {
          const userSnap = await getDoc(doc(db, 'users', authUid));
          if (userSnap.exists) {
            const data = userSnap.data();
            setUserData(data);
            const role = data.role || 'user';
            setUserRole(role);
            isPartner = role === 'partner';

            // Calculate dynamic vehicle details
            const batCap = parseInt(data.batteryCapacity) || 60;
            const currentPct =
              data.batteryPercentage || Math.floor(Math.random() * 40) + 40; // 40-80%
            const estRange =
              data.vehicleRange || Math.floor(batCap * (currentPct / 100) * 6);

            setVehicleData({
              name: data.vehicleNumber || data.vehicleName || 'My EV',
              battery: currentPct,
              range: estRange,
            });
          }
        }

        if (isPartner && authUid) {
          // Listen to partner's stations in real-time
          const pQ = query(
            collection(db, 'stations'),
            where('ownerId', '==', authUid),
          );
          unsubscribeStations = onSnapshot(pQ, snapshot => {
            const pList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setPartnerStations(pList);
          });
        } else {
          // Listen to recommended stations in real-time
          const q = query(collection(db, 'stations'), limit(5));
          unsubscribeStations = onSnapshot(q, snapshot => {
            const stationList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setRecommendedStations(stationList);
          });
        }

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.warn('Data fetching warning:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => unsubscribeStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.searchStation]);

  useEffect(() => {
    if (route?.params?.searchStation) {
      setSearchQuery(route.params.searchStation);
      const matched = recommendedStations.find(
        s => s.name === route.params.searchStation,
      );
      if (matched && mapRef.current) {
        showStation(matched);
        mapRef.current.animateToRegion(
          {
            latitude: matched.latitude,
            longitude: matched.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.searchStation, recommendedStations]);

  const showStation = station => {
    setSelectedStation(station);
    Animated.spring(cardAnim, {
      toValue: 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const hideStation = () => {
    Animated.timing(cardAnim, {
      toValue: 400,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setSelectedStation(null));
  };

  if (loading) {
    return (
      <View style={[styles.centered, {backgroundColor: theme.background}]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (userRole === 'partner') {
    return (
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <StatusBar
          barStyle={theme.statusBarStyle}
          translucent
          backgroundColor="transparent"
        />
        <SafeAreaView style={{flex: 1}}>
          <View style={[styles.header, {marginTop: 20}]}>
            <View>
              <Text
                style={[styles.brandName, {color: theme.text, fontSize: 24}]}>
                Partner Dashboard
              </Text>
              <Text style={{color: theme.subtext, marginTop: 4}}>
                Manage your EV stations
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              {userData?.profileImage ? (
                <Image
                  source={{uri: userData.profileImage}}
                  style={[
                    styles.miniAvatar,
                    {width: 40, height: 40, borderRadius: 20},
                  ]}
                />
              ) : (
                <View
                  style={[styles.miniAvatar, {backgroundColor: theme.primary}]}>
                  <Text style={styles.avatarLetter}>
                    {userData?.fullName
                      ? userData.fullName.charAt(0).toUpperCase()
                      : 'P'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              gap: 15,
              marginBottom: 20,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: theme.primary + '10',
                padding: 20,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.primary + '30',
              }}>
              <Ionicons name="flash-outline" size={24} color={theme.primary} />
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '900',
                  color: theme.primary,
                  marginTop: 10,
                }}>
                {partnerStations.length}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: theme.subtext,
                  textTransform: 'uppercase',
                }}>
                Active Stations
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: theme.card,
                padding: 20,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.border,
              }}>
              <Ionicons name="wallet-outline" size={24} color="#10B981" />
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '900',
                  color: theme.text,
                  marginTop: 10,
                }}>
                ₹
                {Math.floor(
                  partnerStations.reduce(
                    (sum, s) => sum + (s.totalRevenue || 0),
                    0,
                  ),
                )}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: theme.subtext,
                  textTransform: 'uppercase',
                }}>
                Net Earnings (Post 18% GST)
              </Text>
            </View>
          </View>

          <View style={{paddingHorizontal: 20, marginBottom: 20}}>
            <TouchableOpacity
              style={{
                backgroundColor: theme.primary,
                padding: 16,
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
              onPress={() => navigation.navigate('AddStation')}>
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={{color: '#fff', fontSize: 16, fontWeight: '800'}}>
                Add New Station
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              color: theme.text,
              marginLeft: 20,
              marginBottom: 15,
            }}>
            Your Stations
          </Text>
          <ScrollView
            contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 110}}
            showsVerticalScrollIndicator={false}>
            {partnerStations.length > 0 ? (
              partnerStations.map((station, i) => (
                <TouchableOpacity
                  key={station.id || i}
                  style={{
                    backgroundColor: theme.card,
                    padding: 16,
                    borderRadius: 20,
                    marginBottom: 15,
                    borderWidth: 1,
                    borderColor: theme.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => navigation.navigate('AddStation', {station})}
                  activeOpacity={0.7}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 15,
                      backgroundColor: theme.primary + '15',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 15,
                    }}>
                    <Ionicons
                      name="ev-station"
                      size={24}
                      color={theme.primary}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '800',
                        color: theme.text,
                      }}
                      numberOfLines={1}>
                      {station.name}
                    </Text>
                    <Text
                      style={{fontSize: 12, color: theme.subtext, marginTop: 2}}
                      numberOfLines={1}>
                      {station.address || 'Unknown address'}
                    </Text>
                  </View>
                  <View style={{alignItems: 'flex-end', marginLeft: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor:
                            station.available !== false ? '#10B981' : '#F59E0B',
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '800',
                          color:
                            station.available !== false ? '#10B981' : '#F59E0B',
                        }}>
                        {station.available !== false ? 'ONLINE' : 'IN USE'}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '800',
                        color: theme.text,
                        marginTop: 4,
                      }}>
                      ₹{station.price || 15}/kWh
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={{alignItems: 'center', marginTop: 40}}>
                <Ionicons
                  name="map-outline"
                  size={48}
                  color={theme.subtext}
                  style={{opacity: 0.5}}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: theme.text,
                    marginTop: 10,
                  }}>
                  No Stations Found
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.subtext,
                    marginTop: 5,
                    textAlign: 'center',
                    paddingHorizontal: 20,
                  }}>
                  You haven't listed any stations yet. Add one to start earning!
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Google Maps View */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.fullMap}
        showsUserLocation={true}
        initialRegion={{
          latitude: 28.6139,
          longitude: 77.209,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        {filteredStations.map((station, index) => {
          const lat = station.latitude || 28.6139 + index * 0.01;
          const lng = station.longitude || 77.209 + index * 0.01;

          return (
            <Marker
              key={station.id}
              coordinate={{latitude: lat, longitude: lng}}
              onPress={() => showStation(station)}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <View
                  style={[styles.markerDot, {backgroundColor: theme.primary}]}>
                  <Ionicons name="flash" size={12} color="#fff" />
                </View>
                <View style={styles.markerLabel}>
                  <Text style={styles.markerLabelText}>₹{station.price}</Text>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Live Vehicle Hub */}
      <Animated.View style={[styles.vehicleHub, {opacity: fadeAnim}]}>
        <View style={styles.hubHeader}>
          <Ionicons name="car-sport" size={20} color={theme.primary} />
          <Text style={styles.hubTitle} numberOfLines={1}>
            {vehicleData.name}
          </Text>
        </View>
        <View style={styles.hubStats}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{vehicleData.battery}%</Text>
            <View style={styles.batteryBar}>
              <View
                style={[
                  styles.batteryFill,
                  {
                    width: `${vehicleData.battery}%`,
                    backgroundColor:
                      vehicleData.battery < 20 ? '#EF4444' : theme.primary,
                  },
                ]}
              />
            </View>
          </View>
          <View style={styles.hubDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{vehicleData.range}</Text>
            <Text style={styles.statUnit}>km range</Text>
          </View>
        </View>
      </Animated.View>

      {/* Top Floating Controls */}
      <SafeAreaView style={styles.floatingTop}>
        <View style={styles.header}>
          <View style={styles.brandBox}>
            <View style={[styles.logoIcon, {backgroundColor: theme.primary}]}>
              <Ionicons name="flash" size={20} color="#fff" />
            </View>
            <Text style={styles.brandName}>EVService</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => navigation.navigate('SupportChatScreen')}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => navigation.navigate('NotificationScreen')}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => navigation.navigate('Profile')}>
              <View
                style={[styles.miniAvatar, {backgroundColor: theme.primary}]}>
                <Text style={styles.avatarLetter}>U</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View
          style={[
            styles.searchBar,
            {opacity: fadeAnim, backgroundColor: 'rgba(255,255,255,0.95)'},
          ]}>
          <Ionicons
            name="search"
            size={20}
            color="#64748B"
            style={{marginRight: 10}}
          />
          <TextInput
            placeholder="Search stations, cities..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={text => {
              setSearchQuery(text);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {showSuggestions && searchQuery.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {filteredStations.length > 0 ? (
              filteredStations.map((station, index) => (
                <TouchableOpacity
                  key={station.id || index}
                  style={[
                    styles.suggestionItem,
                    index < filteredStations.length - 1 &&
                      styles.suggestionBorder,
                  ]}
                  onPress={() => {
                    setSearchQuery(station.name || station.address);
                    setShowSuggestions(false);
                    if (mapRef.current) {
                      mapRef.current.animateToRegion(
                        {
                          latitude: station.latitude || 28.6139,
                          longitude: station.longitude || 77.209,
                          latitudeDelta: 0.05,
                          longitudeDelta: 0.05,
                        },
                        1000,
                      );
                    }
                    showStation(station);
                  }}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={theme.primary}
                    style={{marginRight: 10}}
                  />
                  <View>
                    <Text style={styles.suggestionName} numberOfLines={1}>
                      {station.name}
                    </Text>
                    <Text style={styles.suggestionAddress} numberOfLines={1}>
                      {station.address}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.suggestionItem}>
                <Text style={styles.suggestionAddress}>No stations found</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.filterRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 20}}>
            {['All', 'Fast Charge', 'AC', 'DC', 'Available'].map(
              (filter, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.filterChip,
                    i === 0 && {backgroundColor: theme.primary},
                  ]}>
                  <Text style={[styles.filterText, i === 0 && {color: '#fff'}]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={goToCurrentLocation}>
          <Ionicons name="locate" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, {backgroundColor: theme.primary}]}
          onPress={() => navigation.navigate('Finder')}>
          <Ionicons name="map" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Contextual Station Card */}
      {selectedStation && (
        <Animated.View
          style={[styles.stationCard, {transform: [{translateY: cardAnim}]}]}>
          <View style={styles.cardHandle} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.cardMain}>
                <Text style={styles.stationName}>{selectedStation.name}</Text>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Available Now</Text>
                </View>
              </View>
              <TouchableOpacity onPress={hideStation} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Ionicons
                  name="navigate-circle"
                  size={18}
                  color={theme.primary}
                />
                <Text style={styles.detailText}>1.2 km</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="flash" size={18} color="#F59E0B" />
                <Text style={styles.detailText}>50 kW</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="wallet" size={18} color="#10B981" />
                <Text style={styles.detailText}>
                  ₹{selectedStation.price}/kWh
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.bookBtn, {backgroundColor: theme.primary}]}
              onPress={() => {
                hideStation();
                navigation.navigate('Booking', {stationId: selectedStation.id});
              }}>
              <Text style={styles.bookBtnText}>Initialize Charging</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  fullMap: {
    width: width,
    height: height,
    position: 'absolute',
    opacity: 0.8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerPulse: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    opacity: 0.3,
  },
  markerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5,
  },
  markerLabel: {
    position: 'absolute',
    bottom: -18,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  markerLabelText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  vehicleHub: {
    position: 'absolute',
    bottom: 120, // Raised to clear floating tab bar
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 16,
    width: 140,
    elevation: 10,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 20,
  },
  hubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  hubTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  hubStats: {
    gap: 10,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  statUnit: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  batteryBar: {
    width: 40,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 3,
  },
  hubDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  floatingTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBtn: {
    marginLeft: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 18,
    elevation: 10,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {color: '#fff', fontWeight: '900', fontSize: 14},
  suggestionsContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginHorizontal: 20,
    marginTop: 5,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  suggestionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  suggestionAddress: {
    fontSize: 13,
    color: '#64748B',
  },
  filterRow: {marginTop: 15},
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  filterText: {fontSize: 13, fontWeight: '700', color: '#64748B'},
  fabContainer: {
    position: 'absolute',
    bottom: 120, // Raised to clear floating tab bar
    right: 20,
    gap: 12,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  stationCard: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 110, // Added padding to clear floating tab bar
    elevation: 30,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: -10},
    shadowRadius: 30,
  },
  cardHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
  },
  cardContent: {padding: 24},
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardMain: {flex: 1},
  stationName: {fontSize: 22, fontWeight: '900', color: '#0F172A'},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4},
  statusDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981'},
  statusText: {fontSize: 12, fontWeight: '700', color: '#10B981'},
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  detailText: {fontSize: 13, fontWeight: '800', color: '#475569'},
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 64,
    borderRadius: 22,
  },
  bookBtnText: {color: '#fff', fontSize: 18, fontWeight: '900'},
});

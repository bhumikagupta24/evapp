import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Image,
  StatusBar,
  Animated,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
} from '@react-native-firebase/firestore';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

export default function ViewStationsScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return Number.MAX_VALUE;
    }
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchStations = () => {
    try {
      const q = query(
        collection(getFirestore(), 'stations'),
        orderBy('createdAt', 'desc'),
      );
      return onSnapshot(q, snapshot => {
        const stationList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStations(stationList);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
        setLoading(false);
        setRefreshing(false);
      });
    } catch (error) {
      console.warn('Firestore fetch warning:', error.message);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let unsubscribe = () => {};
    const sub = fetchStations();
    if (sub) {
      unsubscribe = sub;
    }

    loadSearchHistory();

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLocation({latitude, longitude});
        setMapRegion(prev => ({
          ...prev,
          latitude,
          longitude,
        }));
      },
      error => console.log('Location error', error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history !== null) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.log('Error loading search history', error);
    }
  };

  const saveSearchHistory = async queryToSave => {
    if (!queryToSave.trim()) {
      return;
    }
    try {
      let newHistory = [
        queryToSave,
        ...searchHistory.filter(item => item !== queryToSave),
      ];
      newHistory = newHistory.slice(0, 5); // Keep last 5 searches
      setSearchHistory(newHistory);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.log('Error saving search history', error);
    }
  };

  const getFilteredAndSortedStations = () => {
    let filtered = stations;

    if (searchQuery.trim() !== '') {
      filtered = stations.filter(
        s =>
          (s.name &&
            s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (s.address &&
            s.address.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    if (userLocation) {
      filtered = [...filtered].sort((a, b) => {
        const distA = getDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude,
        );
        const distB = getDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude,
        );
        return distA - distB;
      });
    }

    return filtered;
  };

  const displayedStations = getFilteredAndSortedStations();

  const onRefresh = () => {
    setRefreshing(true);
    fetchStations();
  };

  const openGoogleMapsWithName = stationName => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      stationName,
    )}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Failed to open Google Maps.'),
    );
  };

  const renderItem = React.useCallback(
    ({item, index}) => (
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <View style={styles.cardHeader}>
          <View style={styles.imgPlaceholder}>
            <Ionicons name="flash" size={40} color={theme.primary + '30'} />
            <View style={[styles.statusBadge, {backgroundColor: '#10B981'}]}>
              <View style={styles.pulseDot} />
              <Text style={styles.statusLabel}>AVAILABLE</Text>
            </View>
          </View>
          <View style={styles.mainInfo}>
            <Text
              style={[styles.cardTitle, {color: theme.text}]}
              numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.locRow}>
              <Ionicons name="location" size={14} color={theme.subtext} />
              <Text
                style={[styles.locText, {color: theme.subtext}]}
                numberOfLines={1}>
                {item.address}
              </Text>
            </View>
            <View style={styles.techRow}>
              <View
                style={[
                  styles.techChip,
                  {backgroundColor: theme.primary + '10'},
                ]}>
                <Ionicons
                  name="battery-charging"
                  size={12}
                  color={theme.primary}
                />
                <Text style={[styles.techText, {color: theme.primary}]}>
                  50 kW
                </Text>
              </View>
              <View style={[styles.techChip, {backgroundColor: '#F59E0B10'}]}>
                <Ionicons name="time" size={12} color="#F59E0B" />
                <Text style={[styles.techText, {color: '#F59E0B'}]}>Fast</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, {color: theme.subtext}]}>
              Rate per kWh
            </Text>
            <Text style={[styles.priceVal, {color: theme.text}]}>
              ₹{item.price}
            </Text>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.goBtn, {borderColor: theme.border}]}
              onPress={() =>
                navigation.navigate('Home', {searchStation: item.name})
              }>
              <Ionicons
                name="navigate-outline"
                size={20}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bookBtn, {backgroundColor: theme.primary}]}
              onPress={() =>
                navigation.navigate('Booking', {stationId: item.id})
              }>
              <Text style={styles.bookBtnText}>Book Now</Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    ),
    [theme, fadeAnim, slideAnim, navigation],
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.centered, {backgroundColor: theme.background}]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.headerTitle, {color: theme.text}]}>
                Discovery
              </Text>
              <Text style={[styles.headerSub, {color: theme.subtext}]}>
                Finding the best ports for you
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                zIndex: 10,
              },
            ]}>
            <Ionicons name="search" size={20} color={theme.subtext} />
            <TextInput
              placeholder="Search by area or station..."
              placeholderTextColor={theme.subtext}
              style={[styles.searchInput, {color: theme.text}]}
              value={searchQuery}
              onChangeText={text => {
                setSearchQuery(text);
                setShowHistory(true);
              }}
              onFocus={() => setShowHistory(true)}
              onSubmitEditing={() => {
                setShowHistory(false);
                saveSearchHistory(searchQuery);
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setShowHistory(false);
                }}>
                <Ionicons name="close-circle" size={20} color={theme.subtext} />
              </TouchableOpacity>
            )}
          </View>

          {showHistory && searchHistory.length > 0 && (
            <View
              style={[
                styles.historyContainer,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}>
              {searchHistory.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.historyItem,
                    index < searchHistory.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.border,
                    },
                  ]}
                  onPress={() => {
                    setSearchQuery(item);
                    setShowHistory(false);
                    saveSearchHistory(item);
                  }}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={theme.subtext}
                    style={{marginRight: 8}}
                  />
                  <Text style={{color: theme.text, flex: 1}}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <FlatList
          ListHeaderComponent={
            <View style={styles.listHeaderWrapper}>
              <View style={styles.mapContainer}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.mapStyle}
                  region={mapRegion}
                  showsUserLocation={true}>
                  {displayedStations.map((station, index) => (
                    <Marker
                      key={station.id || index}
                      coordinate={{
                        latitude:
                          station.latitude ||
                          28.6139 + (Math.random() * 0.05 - 0.025),
                        longitude:
                          station.longitude ||
                          77.209 + (Math.random() * 0.05 - 0.025),
                      }}
                      title={station.name}
                      description={station.address}
                    />
                  ))}
                </MapView>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterBar}>
                {[
                  'Nearby',
                  'Superfast',
                  'Available',
                  'Top Rated',
                  'Open 24/7',
                ].map((f, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.filterTab,
                      i === 0 && {backgroundColor: theme.primary},
                    ]}>
                    <Text
                      style={[
                        styles.filterTabText,
                        i === 0 && {color: '#fff'},
                      ]}>
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          }
          data={displayedStations}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
            />
          }
          renderItem={renderItem}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={11}
          removeClippedSubviews={true}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  historyContainer: {
    position: 'absolute',
    top: 130, // Adjust based on your header height
    left: 24,
    right: 24,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 9,
    paddingTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  listHeaderWrapper: {
    paddingHorizontal: 24,
  },
  mapContainer: {
    height: 220,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  headerSub: {
    fontSize: 14,
    fontWeight: '600',
  },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  filterBar: {
    marginBottom: 10,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  listContent: {
    paddingBottom: 110,
    paddingTop: 10,
  },
  card: {
    borderRadius: 32,
    padding: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imgPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  statusLabel: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
  },
  mainInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  locText: {
    fontSize: 12,
    fontWeight: '600',
  },
  techRow: {
    flexDirection: 'row',
    gap: 8,
  },
  techChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  techText: {
    fontSize: 10,
    fontWeight: '900',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priceVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  goBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    gap: 8,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
});

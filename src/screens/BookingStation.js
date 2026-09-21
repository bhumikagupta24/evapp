import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  TextInput,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore, {
  getFirestore,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  addDoc,
  increment,
  Timestamp,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useTheme} from '../context/ThemeContext';

const {width} = Dimensions.get('window');

export default function BookingStation({route, navigation}) {
  const {theme} = useTheme();
  const db = getFirestore();
  const stationId = route?.params?.stationId || null;
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [isCharging, setIsCharging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchStation = () => {
    if (!stationId) {
      Alert.alert('Error', 'No station ID provided.');
      navigation.goBack();
      return;
    }

    const docRef = doc(db, 'stations', stationId);
    // Real-time listener — station re-enables automatically after charging ends
    const unsubscribe = onSnapshot(
      docRef,
      async docSnap => {
        if (docSnap.exists) {
          const data = docSnap.data();
          // Auto-heal: if availablePoints is negative (bad data), fix it in Firestore
          if (data.availablePoints !== undefined && data.availablePoints < 0) {
            try {
              const healedPoints = data.totalPoints || 1;
              await updateDoc(docRef, {
                availablePoints: healedPoints,
                available: healedPoints > 0,
              });
            } catch (e) {
              /* silent */
            }
          }
          setStation({id: docSnap.id, ...data});
        } else {
          Alert.alert('Not Found', 'Station not found.');
          navigation.goBack();
        }
        setLoading(false);
      },
      error => {
        Alert.alert('Error', 'Failed to fetch station: ' + error.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  };

  const handleBooking = async () => {
    if (!station?.available) {
      Alert.alert('Unavailable', 'This station is already occupied.');
      return;
    }

    setBooking(true);
    try {
      const startTime = Timestamp.now();
      const endTime = new Date(
        startTime.toDate().getTime() + selectedDuration * 60 * 60 * 1000,
      );

      try {
        const stationRef = doc(db, 'stations', stationId);
        const speed = station.chargerSpeed || 50;
        const kwhCharged = speed * selectedDuration;
        const pricePerKwh = station.price || 15;
        const grossRevenue = kwhCharged * pricePerKwh;
        // Apply 18% GST deduction for net revenue to partner
        const netRevenue = grossRevenue - grossRevenue * 0.18;

        // Guard: ensure availablePoints never goes negative
        const totalPts = station.totalPoints || 1;
        const currentPoints =
          station.availablePoints !== undefined
            ? Math.max(station.availablePoints, 0)
            : totalPts;
        const newPoints = Math.max(currentPoints - 1, 0);
        const newAvailable = newPoints > 0;

        await updateDoc(stationRef, {
          available: newAvailable,
          availablePoints: newPoints, // Set directly, not increment, to prevent drift
          startTime,
          endTime: Timestamp.fromDate(endTime),
          durationHours: selectedDuration,
          totalRevenue: increment(netRevenue),
          totalBookings: increment(1),
        });

        const uid = auth().currentUser?.uid;
        if (uid) {
          const userRef = doc(db, 'users', uid);
          const historyRef = collection(userRef, 'ChargingHistory');

          await addDoc(historyRef, {
            stationId,
            stationName: station.name,
            durationHours: selectedDuration,
            kwhCharged: speed * selectedDuration,
            totalCost: speed * selectedDuration * pricePerKwh,
            timestamp: startTime,
            pointsAdded: selectedDuration * 10,
          });

          await updateDoc(userRef, {
            ecoPoints: increment(selectedDuration * 10),
          });
        }
      } catch (dbError) {
        console.warn('DB Error (Permissions?):', dbError.message);
      }

      setIsCharging(true);
      // Calculate real-time charging interval based on duration hours
      // 100 ticks (1% each). Total time = selectedDuration hours
      const totalTimeMs = selectedDuration * 60 * 60 * 1000;
      const intervalMs = totalTimeMs / 100;

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            handleStopCharging();
            return 100;
          }
          return prev + 1;
        });
      }, intervalMs);
    } catch (error) {
      Alert.alert('Error', 'Unexpected failure: ' + error.message);
    } finally {
      setBooking(false);
    }
  };

  const handleStopCharging = async () => {
    const speed = station.chargerSpeed || 50;
    const pricePerKwh = station.price || 15;
    const actualDurationCharged = selectedDuration * (progress / 100);
    const kwhCharged = speed * actualDurationCharged;
    const amount = Math.max(pricePerKwh * kwhCharged, 10);

    try {
      const stationRef = doc(db, 'stations', stationId);
      await updateDoc(stationRef, {
        available: true,
        availablePoints: increment(1),
        startTime: null,
        endTime: null,
      });
    } catch (error) {
      console.warn('Failed to free station:', error.message);
    }

    // Build receipt and pass it through to payment → history
    const receipt = {
      stationName: station.name,
      stationAddress: station.address || '',
      chargerSpeed: speed,
      kwhCharged: parseFloat(kwhCharged.toFixed(2)),
      durationHours: parseFloat(actualDurationCharged.toFixed(2)),
      pricePerKwh,
      totalCost: parseFloat(amount.toFixed(2)),
      pointsAdded: Math.round(actualDurationCharged * 10),
      timestamp: new Date().toISOString(),
    };

    navigation.navigate('PaymentMethods', {amount, receipt});
  };

  useEffect(() => {
    const unsubscribe = fetchStation();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }; // Clean up listener on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId]);

  if (loading) {
    return (
      <View style={[styles.centered, {backgroundColor: theme.background}]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!station) {
    return (
      <View style={[styles.centered, {backgroundColor: theme.background}]}>
        <Text style={{color: theme.text, fontSize: 16}}>
          ❌ No station data available.
        </Text>
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, {borderColor: theme.border}]}>
            <Text style={{fontSize: 20}}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.text}]}>
            {isCharging ? 'Active Session' : 'Booking'}
          </Text>
          <View style={{width: 44}} />
        </View>

        {isCharging ? (
          <View style={styles.chargingContainer}>
            <View
              style={[
                styles.progressCircle,
                {borderColor: theme.primary + '30'},
              ]}>
              <Text style={[styles.progressText, {color: theme.primary}]}>
                {progress}%
              </Text>
              <Text style={[styles.progressSub, {color: theme.subtext}]}>
                Charging...
              </Text>
            </View>

            <View
              style={[
                styles.statsCard,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}>
              <View style={styles.statLineItem}>
                <Text style={[styles.statLabel, {color: theme.subtext}]}>
                  Energy Delivered
                </Text>
                <Text style={[styles.statValue, {color: theme.text}]}>
                  {(
                    (progress / 100) *
                    (station.chargerSpeed || 50) *
                    selectedDuration
                  ).toFixed(1)}{' '}
                  kWh
                </Text>
              </View>
              <View style={styles.statLineItem}>
                <Text style={[styles.statLabel, {color: theme.subtext}]}>
                  Time Remaining
                </Text>
                <Text style={[styles.statValue, {color: theme.text}]}>
                  {Math.floor(
                    ((100 - progress) / 100) * (selectedDuration * 60),
                  )}{' '}
                  min
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.stopBtn, {backgroundColor: '#EF4444'}]}
              onPress={handleStopCharging}>
              <Text style={styles.stopBtnText}>Stop Charging</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* Station Card */}
            <View
              style={[
                styles.card,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}>
              <View style={[styles.logoIcon, {backgroundColor: theme.primary}]}>
                <Text style={{fontSize: 40}}>⚡</Text>
              </View>
              <Text style={[styles.stationName, {color: theme.text}]}>
                {station.name}
              </Text>
              <View style={styles.locationRow}>
                <Image
                  source={require('../assets/location.png')}
                  style={[styles.smallIcon, {tintColor: theme.subtext}]}
                />
                <Text style={[styles.addressText, {color: theme.subtext}]}>
                  {station.address || 'Sector 62, Noida'}
                </Text>
              </View>
            </View>

            {/* Pricing & Info */}
            <View style={styles.infoGrid}>
              <InfoBox
                label="Price"
                value={`₹${station.price || 15}`}
                unit="/ unit"
                icon="💰"
              />
              <InfoBox
                label="Type"
                value={station.vehicleType || '4 Wheeler'}
                unit=""
                icon="🚗"
              />
              <InfoBox
                label="Points"
                value={`${Math.max(
                  station.availablePoints ?? (station.available ? 1 : 0),
                  0,
                )}/${station.totalPoints || 1}`}
                unit={
                  Math.max(station.availablePoints ?? 0, 0) > 0 ||
                  station.available
                    ? 'Available'
                    : 'Full'
                }
                icon={
                  Math.max(station.availablePoints ?? 0, 0) > 0 ||
                  station.available
                    ? '✅'
                    : '⏳'
                }
                highlight={
                  Math.max(station.availablePoints ?? 0, 0) > 0 ||
                  station.available
                }
              />
            </View>

            {/* Booking Options */}
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              Select Duration (Hours)
            </Text>
            <View style={styles.durationRow}>
              {[1, 2, 3, 4].map(hrs => (
                <TouchableOpacity
                  key={hrs}
                  style={[
                    styles.durationChip,
                    {borderColor: theme.primary},
                    selectedDuration === hrs &&
                      !isCustomDuration && {backgroundColor: theme.primary},
                  ]}
                  onPress={() => {
                    setIsCustomDuration(false);
                    setSelectedDuration(hrs);
                  }}>
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color:
                          selectedDuration === hrs && !isCustomDuration
                            ? '#fff'
                            : theme.primary,
                      },
                    ]}>
                    {hrs}h
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.durationChip,
                  {borderColor: theme.primary},
                  isCustomDuration && {backgroundColor: theme.primary},
                ]}
                onPress={() => setIsCustomDuration(true)}>
                <Text
                  style={[
                    styles.chipText,
                    {color: isCustomDuration ? '#fff' : theme.primary},
                  ]}>
                  Custom
                </Text>
              </TouchableOpacity>
            </View>

            {isCustomDuration && (
              <View
                style={[
                  styles.wheelPickerWrapper,
                  {backgroundColor: theme.card, borderColor: theme.border},
                ]}>
                <WheelPicker
                  values={Array.from({length: 13}, (_, i) => `${i} hr`)}
                  selectedIndex={customHours}
                  onValueChange={i => {
                    setCustomHours(i);
                    const total = i + customMinutes / 60;
                    setSelectedDuration(Math.max(total, 0.1));
                  }}
                  theme={theme}
                />
                <Text style={[styles.wheelColon, {color: theme.text}]}>:</Text>
                <WheelPicker
                  values={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(
                    m => `${String(m).padStart(2, '0')} min`,
                  )}
                  selectedIndex={Math.floor(customMinutes / 5)}
                  onValueChange={i => {
                    const mins = i * 5;
                    setCustomMinutes(mins);
                    const total = customHours + mins / 60;
                    setSelectedDuration(Math.max(total, 0.1));
                  }}
                  theme={theme}
                />
              </View>
            )}

            <View
              style={[
                styles.ecoNote,
                {
                  backgroundColor: theme.primary + '05',
                  borderColor: theme.primary + '30',
                  marginTop: isCustomDuration ? 5 : 20,
                },
              ]}>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, {color: theme.text}]}>
                  Estimated Cost
                </Text>
                <Text style={[styles.priceValue, {color: theme.primary}]}>
                  ₹
                  {(
                    (station.price || 15) *
                    (station.chargerSpeed || 50) *
                    selectedDuration
                  ).toFixed(2)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.bookBtn,
                {
                  backgroundColor: station.available
                    ? theme.primary
                    : theme.subtext,
                },
              ]}
              onPress={handleBooking}
              disabled={!station.available || booking}>
              {booking ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.bookBtnText}>Confirm Booking</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoBox = ({label, value, unit, icon, highlight}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.infoBox,
        {backgroundColor: theme.card, borderColor: theme.border},
      ]}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={[styles.infoLabel, {color: theme.subtext}]}>{label}</Text>
      <Text
        style={[
          styles.infoValue,
          {color: highlight ? theme.primary : theme.text},
        ]}>
        {value}
      </Text>
      {unit ? (
        <Text style={[styles.infoUnit, {color: theme.subtext}]}>{unit}</Text>
      ) : null}
    </View>
  );
};

const ITEM_HEIGHT = 54;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const WheelPicker = ({values, selectedIndex, onValueChange, theme}) => {
  const scrollRef = useRef(null);
  const [internalIndex, setInternalIndex] = useState(selectedIndex);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
      setInternalIndex(selectedIndex);
    }, 80);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrollEnd = e => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, values.length - 1));
    setInternalIndex(clamped);
    onValueChange(clamped);
  };

  const handleScroll = e => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, values.length - 1));
    setInternalIndex(clamped);
  };

  return (
    <View style={[styles.wheelColumn, {height: PICKER_HEIGHT}]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.9}
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingVertical: ITEM_HEIGHT * 2}}
        nestedScrollEnabled>
        {values.map((val, i) => {
          const dist = Math.abs(i - internalIndex);
          const opacity =
            dist === 0 ? 1 : dist === 1 ? 0.55 : dist === 2 ? 0.25 : 0.1;
          const scale = dist === 0 ? 1 : dist === 1 ? 0.88 : 0.76;
          const fontSize = dist === 0 ? 22 : dist === 1 ? 17 : 14;
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              style={[styles.wheelItem]}
              onPress={() => {
                setInternalIndex(i);
                onValueChange(i);
                scrollRef.current?.scrollTo({
                  y: i * ITEM_HEIGHT,
                  animated: true,
                });
              }}>
              <Text
                style={[
                  styles.wheelItemText,
                  {
                    color: dist === 0 ? theme.primary : theme.subtext,
                    opacity,
                    fontSize,
                    fontWeight: dist === 0 ? '900' : dist === 1 ? '600' : '400',
                    transform: [{scaleY: scale}],
                  },
                ]}>
                {val}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Highlight strip rendered OVER scroll so it's visible */}
      <View
        pointerEvents="none"
        style={[
          styles.wheelHighlight,
          {
            borderColor: theme.primary,
            backgroundColor: theme.primary + '12',
            top: ITEM_HEIGHT * 2,
          },
        ]}
      />

      {/* Fade overlays at top and bottom */}
      <View
        pointerEvents="none"
        style={[styles.wheelFadeTop, {backgroundColor: theme.card}]}
      />
      <View
        pointerEvents="none"
        style={[styles.wheelFadeBottom, {backgroundColor: theme.card}]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {padding: 24, paddingBottom: 100},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  card: {
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stationName: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  infoBox: {
    width: '31%',
    padding: 12,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoIcon: {fontSize: 22, marginBottom: 6},
  infoLabel: {fontSize: 10, fontWeight: '700', textTransform: 'uppercase'},
  infoValue: {fontSize: 16, fontWeight: '800'},
  infoUnit: {fontSize: 10, fontWeight: '600'},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 32,
  },
  durationChip: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 16,
    fontWeight: '800',
  },
  ecoNote: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 32,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  wheelPickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    marginVertical: 12,
    height: PICKER_HEIGHT,
    overflow: 'hidden',
    paddingHorizontal: 8,
  },
  wheelColumn: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  wheelHighlight: {
    position: 'absolute',
    left: 6,
    right: 6,
    height: ITEM_HEIGHT,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderRadius: 14,
    zIndex: 1,
  },
  wheelFadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    opacity: 0.65,
    zIndex: 2,
  },
  wheelFadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    opacity: 0.65,
    zIndex: 2,
  },
  wheelColon: {
    fontSize: 28,
    fontWeight: '900',
    paddingHorizontal: 4,
  },
  bookBtn: {
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  chargingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  progressText: {
    fontSize: 48,
    fontWeight: '900',
  },
  progressSub: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: -5,
  },
  statsCard: {
    width: '100%',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 32,
  },
  statLineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  stopBtn: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});

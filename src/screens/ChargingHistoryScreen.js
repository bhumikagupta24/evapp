import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

function ReceiptRow({label, value, bold, accent, theme}) {
  return (
    <View style={receiptStyles.row}>
      <Text style={[receiptStyles.label, {color: theme.subtext}]}>{label}</Text>
      <Text
        style={[
          receiptStyles.value,
          {
            color:
              bold || accent
                ? accent
                  ? theme.primary
                  : theme.text
                : theme.text,
          },
          bold && {fontWeight: '900'},
        ]}>
        {value}
      </Text>
    </View>
  );
}

const receiptStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
  },
  label: {fontSize: 14, fontWeight: '600'},
  value: {fontSize: 15, fontWeight: '700'},
});

export default function ChargingHistoryScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const db = getFirestore();
    const currentUser = auth().currentUser;
    const uid = currentUser?.uid;
    if (!uid) {
      return;
    }

    const historyRef = collection(doc(db, 'users', uid), 'ChargingHistory');
    const historyQuery = query(historyRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      historyQuery,
      snapshot => {
        const historyData = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }));
        setHistory(historyData);
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      },
      err => {
        console.error('History Error:', err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = ts => {
    if (!ts) {
      return '—';
    }
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return `${d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })} • ${d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, {borderColor: theme.border}]}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.text}]}>
          Charging History
        </Text>
        <View style={{width: 44}} />
      </View>

      <Animated.View style={{flex: 1, opacity: fadeAnim}}>
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            history.length > 0 ? (
              <View
                style={[
                  styles.infoCard,
                  {backgroundColor: theme.primary + '15'},
                ]}>
                <Ionicons name="flash" size={18} color={theme.primary} />
                <Text style={[styles.infoText, {color: theme.primary}]}>
                  {history.length} session{history.length > 1 ? 's' : ''}{' '}
                  completed — tap any card for receipt
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIconBox,
                  {backgroundColor: theme.card, borderColor: theme.border},
                ]}>
                <Ionicons
                  name="calendar-outline"
                  size={48}
                  color={theme.subtext}
                />
              </View>
              <Text style={[styles.emptyText, {color: theme.text}]}>
                No History Yet
              </Text>
              <Text style={[styles.emptySubText, {color: theme.subtext}]}>
                Your charging sessions will appear here.
              </Text>
            </View>
          }
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.historyCard,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}
              activeOpacity={0.75}
              onPress={() => setSelectedReceipt(item)}>
              <View
                style={[
                  styles.iconBox,
                  {backgroundColor: theme.primary + '15'},
                ]}>
                <Ionicons name="flash" size={24} color={theme.primary} />
              </View>
              <View style={styles.infoContainer}>
                <Text
                  style={[styles.stationName, {color: theme.text}]}
                  numberOfLines={1}>
                  {item.stationName || 'Charging Session'}
                </Text>
                <Text style={[styles.dateText, {color: theme.subtext}]}>
                  {formatDate(item.timestamp)}
                </Text>
                <View style={{flexDirection: 'row', gap: 10, marginTop: 6}}>
                  <View
                    style={[
                      styles.badge,
                      {backgroundColor: theme.primary + '15'},
                    ]}>
                    <Text style={[styles.badgeText, {color: theme.primary}]}>
                      {item.kwhCharged || '—'} kWh
                    </Text>
                  </View>
                  <View
                    style={[styles.badge, {backgroundColor: '#10B981' + '15'}]}>
                    <Text style={[styles.badgeText, {color: '#10B981'}]}>
                      ₹{item.totalCost?.toFixed(2) || '—'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.pointsContainer}>
                <Text style={[styles.pointsVal, {color: theme.primary}]}>
                  +{item.pointsAdded || 0}
                </Text>
                <Text style={[styles.pointsLab, {color: theme.subtext}]}>
                  pts
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      {/* Receipt Modal */}
      <Modal
        visible={!!selectedReceipt}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedReceipt(null)}>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.receiptSheet, {backgroundColor: theme.background}]}>
            {/* Receipt Header */}
            <View
              style={[styles.receiptHeader, {backgroundColor: theme.primary}]}>
              <Ionicons name="receipt" size={36} color="#fff" />
              <Text style={styles.receiptTitle}>Charging Receipt</Text>
              <Text style={styles.receiptSubtitle}>
                {formatDate(selectedReceipt?.timestamp)}
              </Text>
            </View>

            <ScrollView
              contentContainerStyle={styles.receiptBody}
              showsVerticalScrollIndicator={false}>
              {/* Station */}
              <View
                style={[
                  styles.receiptSection,
                  {borderBottomColor: theme.border},
                ]}>
                <Text style={[styles.sectionLabel, {color: theme.subtext}]}>
                  STATION
                </Text>
                <Text style={[styles.sectionValue, {color: theme.text}]}>
                  {selectedReceipt?.stationName || '—'}
                </Text>
                {selectedReceipt?.stationAddress ? (
                  <Text style={[styles.sectionSub, {color: theme.subtext}]}>
                    {selectedReceipt.stationAddress}
                  </Text>
                ) : null}
              </View>

              {/* Details */}
              <View
                style={[
                  styles.receiptSection,
                  {borderBottomColor: theme.border},
                ]}>
                <Text style={[styles.sectionLabel, {color: theme.subtext}]}>
                  SESSION DETAILS
                </Text>
                <ReceiptRow
                  label="Duration"
                  value={`${(selectedReceipt?.durationHours || 0).toFixed(
                    2,
                  )} hrs`}
                  theme={theme}
                />
                <ReceiptRow
                  label="Charger Speed"
                  value={`${selectedReceipt?.chargerSpeed || 50} kW`}
                  theme={theme}
                />
                <ReceiptRow
                  label="Energy Delivered"
                  value={`${selectedReceipt?.kwhCharged || '—'} kWh`}
                  theme={theme}
                />
                <ReceiptRow
                  label="Rate"
                  value={`₹${selectedReceipt?.pricePerKwh || 15}/kWh`}
                  theme={theme}
                />
              </View>

              {/* Eco Points */}
              <View
                style={[
                  styles.receiptSection,
                  {borderBottomColor: theme.border},
                ]}>
                <Text style={[styles.sectionLabel, {color: theme.subtext}]}>
                  ECO POINTS EARNED
                </Text>
                <View
                  style={[
                    styles.pointsBadge,
                    {backgroundColor: theme.primary + '15'},
                  ]}>
                  <Ionicons name="leaf" size={18} color={theme.primary} />
                  <Text
                    style={[styles.pointsBadgeText, {color: theme.primary}]}>
                    +{selectedReceipt?.pointsAdded || 0} Green Points
                  </Text>
                </View>
              </View>

              {/* Total */}
              <View style={[styles.totalRow, {backgroundColor: theme.primary}]}>
                <Text style={styles.totalLabel}>Total Paid</Text>
                <Text style={styles.totalValue}>
                  ₹{selectedReceipt?.totalCost?.toFixed(2) || '—'}
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeReceiptBtn, {borderColor: theme.border}]}
              onPress={() => setSelectedReceipt(null)}>
              <Text style={[styles.closeReceiptText, {color: theme.text}]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {fontSize: 20, fontWeight: '800', letterSpacing: -0.5},
  listContent: {paddingHorizontal: 24, paddingBottom: 110},
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    marginBottom: 20,
    gap: 10,
  },
  infoText: {fontSize: 13, fontWeight: '700', flex: 1},
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContainer: {flex: 1},
  stationName: {fontSize: 15, fontWeight: '800', marginBottom: 2},
  dateText: {fontSize: 11, fontWeight: '600'},
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {fontSize: 12, fontWeight: '800'},
  pointsContainer: {alignItems: 'flex-end'},
  pointsVal: {fontSize: 18, fontWeight: '900'},
  pointsLab: {fontSize: 10, fontWeight: '700', textTransform: 'uppercase'},
  emptyContainer: {alignItems: 'center', marginTop: 100},
  emptyIconBox: {
    width: 100,
    height: 100,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  emptyText: {fontSize: 20, fontWeight: '800', marginBottom: 8},
  emptySubText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  receiptSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '92%',
    overflow: 'hidden',
  },
  receiptHeader: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
    gap: 6,
  },
  receiptTitle: {fontSize: 22, fontWeight: '900', color: '#fff', marginTop: 4},
  receiptSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  receiptBody: {padding: 24},
  receiptSection: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  sectionValue: {fontSize: 18, fontWeight: '900', marginBottom: 2},
  sectionSub: {fontSize: 13, fontWeight: '500'},
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  pointsBadgeText: {fontSize: 16, fontWeight: '800'},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  totalLabel: {fontSize: 18, fontWeight: '700', color: '#fff'},
  totalValue: {fontSize: 26, fontWeight: '900', color: '#fff'},
  closeReceiptBtn: {
    margin: 20,
    marginTop: 0,
    borderWidth: 1,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeReceiptText: {fontSize: 16, fontWeight: '700'},
});

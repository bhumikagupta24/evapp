import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

export default function EcoPointsScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [ecoPoints, setEcoPoints] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }

    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          setEcoPoints(doc.data().ecoPoints || 0);
        }
      });

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addChargingPoints = async () => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }

    try {
      const userRef = firestore().collection('users').doc(uid);
      const userDoc = await userRef.get();
      const currentPoints = userDoc.exists ? userDoc.data().ecoPoints || 0 : 0;
      const newPoints = currentPoints + 10;

      await userRef.set({ecoPoints: newPoints}, {merge: true});

      firestore()
        .collection('users')
        .doc(uid)
        .collection('ChargingHistory')
        .add({
          pointsAdded: 10,
          timestamp: firestore.FieldValue.serverTimestamp(),
          activity: 'Charging Session',
        });

      Alert.alert(
        '⚡ Energy Secured',
        'Your contribution to the grid has earned you 10 EcoPoints.',
      );
    } catch (error) {
      console.error(error);
    }
  };

  const redeemForTree = async () => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }

    if (ecoPoints >= 50) {
      await firestore()
        .collection('users')
        .doc(uid)
        .update({ecoPoints: ecoPoints - 50});

      Alert.alert(
        '🌳 Legacy Created',
        '50 points have been successfully converted into a real-world tree planting. You are making history.',
      );
    } else {
      Alert.alert(
        'Energy Low',
        `You require ${
          50 - ecoPoints
        } more points to initialize this legacy action.`,
      );
    }
  };

  const RewardItem = ({icon, title, desc, points, type, onPress}) => (
    <TouchableOpacity
      style={[styles.rewardCard, {backgroundColor: theme.card}]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View
        style={[styles.rewardIconBox, {backgroundColor: theme.primary + '10'}]}>
        <Ionicons name={icon} size={28} color={theme.primary} />
      </View>
      <View style={styles.rewardContent}>
        <Text style={[styles.rewardTitle, {color: theme.text}]}>{title}</Text>
        <Text style={[styles.rewardDesc, {color: theme.subtext}]}>{desc}</Text>
      </View>
      <View
        style={[
          styles.pointsChip,
          {backgroundColor: type === 'earn' ? '#10B981' : '#EF4444'},
        ]}>
        <Text style={styles.pointsChipText}>
          {type === 'earn' ? '+' : '-'}
          {points}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Mesh Background */}
      <View style={[styles.meshBg, {backgroundColor: theme.primary + '05'}]}>
        <View
          style={[
            styles.meshCircle,
            {backgroundColor: theme.primary + '10', top: -100, left: -50},
          ]}
        />
      </View>

      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, {backgroundColor: theme.card}]}>
            <Ionicons name="chevron-back" size={26} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.text}]}>
            Eco Rewards
          </Text>
          <TouchableOpacity
            style={[styles.infoBtn, {backgroundColor: theme.card}]}>
            <Ionicons
              name="information-circle-outline"
              size={26}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={{opacity: fadeAnim, transform: [{translateY: slideAnim}]}}>
          {/* Main Hero Card */}
          <View style={[styles.heroCard, {backgroundColor: theme.primary}]}>
            <Animated.View
              style={[styles.pointsRing, {transform: [{scale: pulseAnim}]}]}>
              <View style={styles.pointsRingInner}>
                <Text style={styles.pointsMainVal}>{ecoPoints}</Text>
                <Text style={styles.pointsMainLabel}>AVAILABLE</Text>
              </View>
            </Animated.View>
            <Text style={styles.heroTitle}>Earth Guardian Status</Text>
            <Text style={styles.heroSubtitle}>
              Your energy choices are shaping a cleaner tomorrow.
            </Text>

            {/* Progress Bar to next Milestone */}
            <View style={styles.progressSection}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>Next Goal: 50 Pts</Text>
                <Text style={styles.progressPercent}>
                  {Math.min(100, (ecoPoints / 50) * 100).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {width: `${Math.min(100, (ecoPoints / 50) * 100)}%`},
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              Available Initiatives
            </Text>
          </View>

          <RewardItem
            icon="flash-outline"
            title="Session Master"
            desc="Complete a high-speed charge"
            points="10"
            type="earn"
            onPress={addChargingPoints}
          />

          <RewardItem
            icon="leaf-outline"
            title="Global Reforestation"
            desc="Plant a real tree worldwide"
            points="50"
            type="spend"
            onPress={redeemForTree}
          />

          <RewardItem
            icon="gift-outline"
            title="Premium Upgrade"
            desc="Unlock exclusive UI themes"
            points="100"
            type="spend"
            onPress={() =>
              Alert.alert(
                'Coming Soon',
                'The designer is still crafting these elite themes.',
              )
            }
          />

          {/* Pro Tip Card */}
          <View style={[styles.tipCard, {backgroundColor: theme.card}]}>
            <View
              style={[styles.tipIconBox, {backgroundColor: '#F59E0B' + '20'}]}>
              <Ionicons name="bulb" size={24} color="#F59E0B" />
            </View>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, {color: theme.text}]}>
                Strategic Charging
              </Text>
              <Text style={[styles.tipDesc, {color: theme.subtext}]}>
                Charge during off-peak hours (10PM - 6AM) to earn double
                EcoPoints!
              </Text>
            </View>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  meshBg: {
    position: 'absolute',
    top: 0,
    width: width,
    height: height,
    zIndex: -1,
  },
  meshCircle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 15,
    marginBottom: 20,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  infoBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  scrollContent: {paddingHorizontal: 24, paddingBottom: 60},
  heroCard: {
    padding: 35,
    borderRadius: 45,
    alignItems: 'center',
    marginBottom: 35,
    elevation: 25,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 20},
    shadowRadius: 35,
  },
  pointsRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    marginBottom: 25,
  },
  pointsRingInner: {
    flex: 1,
    borderRadius: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  pointsMainVal: {
    fontSize: 52,
    fontWeight: '900',
    color: '#000',
  },
  pointsMainLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.5)',
    letterSpacing: 2,
    marginTop: -4,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 30,
  },
  progressSection: {
    width: '100%',
    marginTop: 10,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  progressPercent: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    opacity: 0.8,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  sectionHead: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 30,
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 20,
  },
  rewardIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  rewardDesc: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  pointsChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  pointsChipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 32,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tipIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  tipDesc: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
});

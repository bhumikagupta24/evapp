import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

const {width} = Dimensions.get('window');

export default function BatteryHealthScreen() {
  const {theme, isDarkMode} = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [batteryLevel] = useState(new Animated.Value(0));

  const [batteryData, setBatteryData] = useState({
    health: 94,
    temperature: 32,
    capacity: '75.2 kWh',
    cycles: 245,
    lastChecked: '2 days ago',
    status: 'Excellent',
    voltage: '400V',
    efficiency: '98.5%',
  });

  const tips = [
    {
      id: '1',
      title: 'Optimal Charging',
      desc: 'Maintain battery between 20% and 80% for long-term health.',
      icon: 'flash-outline',
      color: '#FFB020',
    },
    {
      id: '2',
      title: 'Avoid Extremes',
      desc: 'Try not to leave your EV in very hot or very cold temperatures.',
      icon: 'thermometer-outline',
      color: '#FF4842',
    },
    {
      id: '3',
      title: 'Gentle Acceleration',
      desc: 'Smooth driving reduces strain on the battery cells.',
      icon: 'speedometer-outline',
      color: '#10B981',
    },
    {
      id: '4',
      title: 'Firmware Updates',
      desc: 'Keep your vehicle software updated for improved battery management.',
      icon: 'refresh-outline',
      color: '#1976D2',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(batteryLevel, {
          toValue: batteryData.health / 100,
          duration: 1500,
          easing: Easing.out(Easing.exp),
          useNativeDriver: false,
        }),
      ]).start();
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <Header
        title="Battery Health"
        rightElement={
          <TouchableOpacity
            style={[
              styles.backBtn,
              {backgroundColor: theme.card, borderColor: theme.border},
            ]}
            onPress={() => alert('Settings coming soon')}>
            <Ionicons name="options-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        }
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{opacity: fadeAnim}}>
        {/* Main Gauge Card */}
        <View
          style={[
            styles.mainCard,
            {backgroundColor: theme.card, borderColor: theme.border},
          ]}>
          <View style={styles.gaugeContainer}>
            <View style={[styles.outerCircle, {borderColor: theme.border}]}>
              <View
                style={[
                  styles.innerCircle,
                  {backgroundColor: theme.background},
                ]}>
                <Text style={[styles.healthVal, {color: theme.primary}]}>
                  {batteryData.health}%
                </Text>
                <Text style={[styles.healthStatus, {color: theme.subtext}]}>
                  {batteryData.status}
                </Text>
              </View>
              {/* Simple CSS-like Ring approximation using border on a View with rotate */}
              <View
                style={[
                  styles.progressRing,
                  {
                    borderTopColor: theme.primary,
                    transform: [{rotate: '45deg'}],
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.summaryRow}>
            <SummaryItem
              label="Voltage"
              value={batteryData.voltage}
              icon="flash"
              color="#FFB020"
            />
            <View style={[styles.divider, {backgroundColor: theme.border}]} />
            <SummaryItem
              label="Efficiency"
              value={batteryData.efficiency}
              icon="leaf"
              color="#10B981"
            />
          </View>
        </View>

        {/* Technical Stats Grid */}
        <Text style={[styles.sectionTitle, {color: theme.text}]}>
          Technical Overview
        </Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Temperature"
            value={`${batteryData.temperature}°C`}
            icon="thermometer"
            color="#FF4842"
          />
          <StatCard
            label="Capacity"
            value={batteryData.capacity}
            icon="battery-charging"
            color="#1976D2"
          />
          <StatCard
            label="Cycles"
            value={batteryData.cycles}
            icon="repeat"
            color="#7C4DFF"
          />
          <StatCard
            label="Status"
            value="Healthy"
            icon="checkmark-circle"
            color="#10B981"
          />
        </View>

        {/* Maintenance Section */}
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, {color: theme.text, marginBottom: 0}]}>
            Maintenance Tips
          </Text>
          <TouchableOpacity>
            <Text style={{color: theme.primary, fontWeight: '700'}}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {tips.map(tip => (
          <TouchableOpacity
            key={tip.id}
            style={[
              styles.tipCard,
              {backgroundColor: theme.card, borderColor: theme.border},
            ]}
            activeOpacity={0.8}>
            <View
              style={[styles.tipIconBox, {backgroundColor: tip.color + '15'}]}>
              <Ionicons name={tip.icon} size={24} color={tip.color} />
            </View>
            <View style={styles.tipText}>
              <Text style={[styles.tipTitle, {color: theme.text}]}>
                {tip.title}
              </Text>
              <Text style={[styles.tipDesc, {color: theme.subtext}]}>
                {tip.desc}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.subtext} />
          </TouchableOpacity>
        ))}

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.actionBtn, {backgroundColor: theme.primary}]}
          onPress={() => alert('Diagnostic started...')}>
          <Ionicons
            name="pulse"
            size={24}
            color="#fff"
            style={{marginRight: 8}}
          />
          <Text style={styles.actionBtnText}>Run Deep Diagnostic</Text>
        </TouchableOpacity>

        <Text style={[styles.footerText, {color: theme.subtext}]}>
          Last full scan: {batteryData.lastChecked}
        </Text>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const SummaryItem = ({label, value, icon, color}) => {
  const {theme} = useTheme();
  return (
    <View style={styles.summaryItem}>
      <View style={[styles.smallIconBox, {backgroundColor: color + '10'}]}>
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <View>
        <Text style={[styles.summaryLabel, {color: theme.subtext}]}>
          {label}
        </Text>
        <Text style={[styles.summaryValue, {color: theme.text}]}>{value}</Text>
      </View>
    </View>
  );
};

const StatCard = ({label, value, icon, color}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.statCard,
        {backgroundColor: theme.card, borderColor: theme.border},
      ]}>
      <View style={[styles.statIconBox, {backgroundColor: color + '10'}]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, {color: theme.text}]}>{value}</Text>
      <Text style={[styles.statLabel, {color: theme.subtext}]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  scrollContent: {padding: 24, paddingBottom: 40},
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
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  mainCard: {
    borderRadius: 35,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 20,
  },
  gaugeContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  innerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  progressRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: 'transparent',
  },
  healthVal: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
  },
  healthStatus: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: -4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    width: '100%',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  smallIconBox: {
    padding: 8,
    borderRadius: 10,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  divider: {
    width: 1,
    height: 30,
    marginHorizontal: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  tipIconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipText: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  tipDesc: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  actionBtn: {
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    fontWeight: '600',
  },
});

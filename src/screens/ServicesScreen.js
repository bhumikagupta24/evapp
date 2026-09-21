import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

export default function ServicesScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const mainServices = [
    {
      id: '1',
      title: 'Battery Health',
      desc: 'Monitor your EV battery status & longevity',
      icon: 'battery-charging',
      color: '#10B981',
      route: 'BatteryHealth',
    },
    {
      id: '2',
      title: 'Payment History',
      desc: 'View your billing and transaction logs',
      icon: 'receipt',
      color: '#3B82F6',
      route: 'ChargingHistory', // Redirecting to charging history for now as payments are tied to sessions
    },
    {
      id: '3',
      title: 'Eco Points',
      desc: 'Check your rewards and green milestones',
      icon: 'star',
      color: '#F59E0B',
      route: 'eco',
    },
    {
      id: '4',
      title: 'History',
      desc: 'Review your past charging sessions',
      icon: 'time',
      color: '#1976D2',
      route: 'ChargingHistory',
    },
  ];

  const secondaryServices = [
    {
      id: '5',
      title: 'Route Planner',
      icon: 'navigate',
      color: '#6366F1',
      route: 'Find',
    },
    {
      id: '6',
      title: 'Activity Tracker',
      icon: 'stats-chart',
      color: '#EC4899',
      route: 'Tracker',
    },
    {
      id: '7',
      title: 'Green Tips',
      icon: 'bulb',
      color: '#8B5CF6',
      route: 'Tips',
    },
    {
      id: '8',
      title: 'Community',
      icon: 'people',
      color: '#F43F5E',
      route: 'Home',
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, {color: theme.text}]}>
            Services
          </Text>
          <Text style={[styles.headerSub, {color: theme.subtext}]}>
            Everything for your EV journey
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.profileIcon,
            {backgroundColor: theme.card, borderColor: theme.border},
          ]}>
          <Ionicons name="grid-outline" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Featured Card */}
        <TouchableOpacity
          style={[styles.featuredCard, {backgroundColor: '#3B82F6'}]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ChargingHistory')}>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredLabel}>Transactions</Text>
            <Text style={styles.featuredTitle}>Quick Payment Access</Text>
            <Text style={styles.featuredDesc}>
              Review your latest charging invoices.
            </Text>
            <View style={styles.featuredBtn}>
              <Text style={[styles.featuredBtnText, {color: '#3B82F6'}]}>
                View All
              </Text>
            </View>
          </View>
          <View style={styles.featuredIconBg}>
            <Ionicons name="card" size={100} color="rgba(255,255,255,0.2)" />
          </View>
        </TouchableOpacity>

        {/* Main Services Grid */}
        <Text style={[styles.sectionTitle, {color: theme.text}]}>
          Main Services
        </Text>
        <View style={styles.servicesGrid}>
          {mainServices.map(service => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}
              onPress={() => navigation.navigate(service.route)}>
              <View
                style={[
                  styles.serviceIconBox,
                  {backgroundColor: service.color + '15'},
                ]}>
                <Ionicons name={service.icon} size={28} color={service.color} />
              </View>
              <Text style={[styles.serviceTitle, {color: theme.text}]}>
                {service.title}
              </Text>
              <Text style={[styles.serviceDesc, {color: theme.subtext}]}>
                {service.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, {color: theme.text}]}>
          Quick Utilities
        </Text>
        <View style={styles.quickGrid}>
          {secondaryServices.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.quickItem,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}
              onPress={() => item.route && navigation.navigate(item.route)}>
              <View
                style={[
                  styles.quickIcon,
                  {backgroundColor: item.color + '10'},
                ]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={[styles.quickText, {color: theme.text}]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  featuredCard: {
    borderRadius: 30,
    padding: 24,
    marginBottom: 32,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 20,
  },
  featuredContent: {
    flex: 1,
    zIndex: 1,
  },
  featuredLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  featuredDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
  featuredBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  featuredBtnText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '800',
  },
  featuredIconBg: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceCard: {
    width: '48%',
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  serviceIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  serviceDesc: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickItem: {
    width: (width - 48 - 12) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

export default function TrackerScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Weekly');

  const stats = [
    {day: 'Mon', value: 45, co2: 2.1},
    {day: 'Tue', value: 30, co2: 1.4},
    {day: 'Wed', value: 65, co2: 3.2},
    {day: 'Thu', value: 50, co2: 2.5},
    {day: 'Fri', value: 80, co2: 4.1},
    {day: 'Sat', value: 40, co2: 1.9},
    {day: 'Sun', value: 55, co2: 2.7},
  ];

  const maxVal = Math.max(...stats.map(s => s.value));

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
          Activity Tracker
        </Text>
        <TouchableOpacity style={[styles.backBtn, {borderColor: theme.border}]}>
          <Ionicons name="share-social-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Summary Card */}
        <View style={[styles.summaryCard, {backgroundColor: theme.primary}]}>
          <View>
            <Text style={styles.summaryLabel}>Total CO2 Saved</Text>
            <Text style={styles.summaryValue}>154.5 kg</Text>
            <View style={styles.trendRow}>
              <Ionicons name="trending-up" size={16} color="#fff" />
              <Text style={styles.trendText}>+12% from last week</Text>
            </View>
          </View>
          <View style={styles.summaryIconBox}>
            <Ionicons name="leaf" size={40} color="#fff" />
          </View>
        </View>

        {/* Tab Selector */}
        <View
          style={[
            styles.tabBar,
            {backgroundColor: theme.card, borderColor: theme.border},
          ]}>
          {['Daily', 'Weekly', 'Monthly'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && {backgroundColor: theme.primary},
              ]}>
              <Text
                style={[
                  styles.tabText,
                  {color: activeTab === tab ? '#fff' : theme.subtext},
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Section */}
        <View
          style={[
            styles.chartCard,
            {backgroundColor: theme.card, borderColor: theme.border},
          ]}>
          <Text style={[styles.chartTitle, {color: theme.text}]}>
            Weekly Savings
          </Text>
          <View style={styles.chartArea}>
            {stats.map((s, i) => (
              <View key={i} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (s.value / maxVal) * 150,
                      backgroundColor:
                        i === 4 ? theme.primary : theme.primary + '30',
                    },
                  ]}
                />
                <Text style={[styles.barLabel, {color: theme.subtext}]}>
                  {s.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Milestones */}
        <Text style={[styles.sectionTitle, {color: theme.text}]}>
          Recent Milestones
        </Text>
        <MilestoneItem
          title="Forest Hero"
          desc="You've saved enough CO2 to equal 50 trees!"
          icon="ribbon"
          color="#10B981"
        />
        <MilestoneItem
          title="EV Enthusiast"
          desc="1,000 km driven with zero emissions."
          icon="trophy"
          color="#F59E0B"
        />
        <MilestoneItem
          title="Night Owl"
          desc="Completed 5 charging sessions at night."
          icon="moon"
          color="#6366F1"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const MilestoneItem = ({title, desc, icon, color}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.milestoneCard,
        {backgroundColor: theme.card, borderColor: theme.border},
      ]}>
      <View style={[styles.milestoneIcon, {backgroundColor: color + '15'}]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.milestoneText}>
        <Text style={[styles.milestoneTitle, {color: theme.text}]}>
          {title}
        </Text>
        <Text style={[styles.milestoneDesc, {color: theme.subtext}]}>
          {desc}
        </Text>
      </View>
    </View>
  );
};

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
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  summaryCard: {
    borderRadius: 30,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  trendText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '800',
  },
  chartCard: {
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    marginBottom: 32,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 24,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 28,
    borderRadius: 8,
    marginBottom: 12,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 20,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  milestoneIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  milestoneText: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  milestoneDesc: {
    fontSize: 13,
    fontWeight: '500',
  },
});

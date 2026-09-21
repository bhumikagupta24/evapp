import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '../components/Header';

const Section = ({number, title, content, theme}) => (
  <View style={[styles.section, {borderBottomColor: theme.border}]}>
    <View style={styles.sectionHeader}>
      <View
        style={[styles.numberBadge, {backgroundColor: theme.primary + '15'}]}>
        <Text style={[styles.numberText, {color: theme.primary}]}>
          {number}
        </Text>
      </View>
      <Text style={[styles.sectionTitle, {color: theme.text}]}>{title}</Text>
    </View>
    <Text style={[styles.sectionContent, {color: theme.subtext}]}>
      {content}
    </Text>
  </View>
);

export default function TermsConditionsScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const sections = [
    {
      title: 'Acceptance of Terms',
      content:
        'By downloading, installing, or using the evservice application, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the application.',
    },
    {
      title: 'User Account',
      content:
        'You must create an account to use evservice services. You are responsible for maintaining the confidentiality of your login credentials. You must provide accurate and complete information during registration and keep your profile up to date.',
    },
    {
      title: 'Charging Services',
      content:
        'evservice connects EV owners with charging station partners. We do not own or operate charging stations directly. Charging availability, pricing, and station conditions are managed by individual station partners. evservice is not responsible for station downtime, hardware malfunctions, or pricing changes.',
    },
    {
      title: 'Payments & Billing',
      content:
        "All charges are calculated based on actual energy consumed (kWh) at the station's listed rate. Payments are processed through the app using your linked payment method. GST and applicable taxes are included in the final billing amount. Refunds for disputed charges are handled on a case-by-case basis.",
    },
    {
      title: 'Eco Points & Rewards',
      content:
        'Eco Points are earned through charging sessions and represent your environmental impact. Points have no monetary value and cannot be exchanged for cash. evservice reserves the right to modify or discontinue the rewards program at any time with prior notice.',
    },
    {
      title: 'Partner Responsibilities',
      content:
        'Station partners are responsible for maintaining accurate station information including pricing, availability, charger type, and operational hours. Partners must ensure their equipment meets safety standards. evservice may remove stations that violate these requirements.',
    },
    {
      title: 'Privacy & Data',
      content:
        'We collect and process your personal data as described in our Privacy Policy. This includes location data for station discovery, usage data for billing, and account information. We do not sell your personal data to third parties.',
    },
    {
      title: 'Prohibited Conduct',
      content:
        'Users must not: (a) misuse the platform for fraudulent activities, (b) tamper with charging equipment, (c) create multiple accounts, (d) reverse-engineer or copy the application, (e) harass other users or station partners.',
    },
    {
      title: 'Limitation of Liability',
      content:
        "evservice is provided 'as is' without warranties. We are not liable for any indirect, incidental, or consequential damages arising from use of the application. Our total liability is limited to the amount you paid for services in the preceding 12 months.",
    },
    {
      title: 'Changes to Terms',
      content:
        'We may update these Terms and Conditions from time to time. Continued use of the application after changes constitutes acceptance of the new terms. We will notify you of significant changes through the app or email.',
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />

      <Header title="Terms & Conditions" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={[styles.heroCard, {backgroundColor: theme.primary}]}>
          <Ionicons name="document-text" size={36} color="#fff" />
          <Text style={styles.heroTitle}>Terms of Service</Text>
          <Text style={styles.heroSub}>Last updated: May 2026</Text>
        </View>

        <View
          style={[
            styles.introCard,
            {backgroundColor: theme.card, borderColor: theme.border},
          ]}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={theme.primary}
          />
          <Text style={[styles.introText, {color: theme.subtext}]}>
            Please read these terms carefully before using evservice. By using
            our services, you agree to the following terms.
          </Text>
        </View>

        {sections.map((sec, i) => (
          <Section
            key={i}
            number={i + 1}
            title={sec.title}
            content={sec.content}
            theme={theme}
          />
        ))}

        {/* Footer */}
        <View
          style={[
            styles.footerCard,
            {backgroundColor: theme.card, borderColor: theme.border},
          ]}>
          <Text style={[styles.footerTitle, {color: theme.text}]}>
            Questions about our terms?
          </Text>
          <Text style={[styles.footerSub, {color: theme.subtext}]}>
            Contact us at legal@greensteps.com
          </Text>
          <TouchableOpacity
            style={[styles.footerBtn, {borderColor: theme.primary}]}
            onPress={() => navigation.navigate('HelpSupport')}>
            <Text style={[styles.footerBtnText, {color: theme.primary}]}>
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {padding: 24, paddingBottom: 110},
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

  heroCard: {
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  heroTitle: {fontSize: 22, fontWeight: '900', color: '#fff'},
  heroSub: {fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)'},

  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 24,
    gap: 10,
  },
  introText: {fontSize: 13, fontWeight: '600', flex: 1, lineHeight: 19},

  section: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {fontSize: 14, fontWeight: '900'},
  sectionTitle: {fontSize: 16, fontWeight: '800', flex: 1},
  sectionContent: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    paddingLeft: 44,
  },

  footerCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  footerTitle: {fontSize: 16, fontWeight: '800'},
  footerSub: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBtnText: {fontSize: 15, fontWeight: '800'},
});

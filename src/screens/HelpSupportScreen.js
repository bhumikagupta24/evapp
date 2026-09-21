import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FAQItem = ({question, answer, theme}) => {
  const [expanded, setExpanded] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));

  const toggle = () => {
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity
      style={[
        styles.faqCard,
        {backgroundColor: theme.card, borderColor: theme.border},
      ]}
      onPress={toggle}
      activeOpacity={0.8}>
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, {color: theme.text}]}>
          {question}
        </Text>
        <Animated.View style={{transform: [{rotate}]}}>
          <Ionicons name="chevron-down" size={20} color={theme.subtext} />
        </Animated.View>
      </View>
      {expanded && (
        <Text style={[styles.faqAnswer, {color: theme.subtext}]}>{answer}</Text>
      )}
    </TouchableOpacity>
  );
};

export default function HelpSupportScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const faqs = [
    {
      q: 'How do I find a nearby charging station?',
      a: "Go to the Finder tab and use 'Locate Me' to see stations near your current location. You can also search by city or area name.",
    },
    {
      q: 'How is the charging cost calculated?',
      a: 'Cost is based on the energy consumed (kWh) × station rate (₹/kWh). If you stop early, you only pay for the energy actually delivered.',
    },
    {
      q: 'Can I cancel a booking mid-charge?',
      a: "Yes! Tap 'Stop Charging' anytime. You'll be billed only for the energy consumed up to that point.",
    },
    {
      q: 'What are Eco Points?',
      a: 'Eco Points are rewards earned for every charging session. They reflect your contribution to reducing carbon emissions. Check your points in the Eco Points section.',
    },
    {
      q: 'How do I become a Partner and add a station?',
      a: "Contact us via the support options below. Once approved, a 'Partner' role is assigned to your account and you can add stations from Settings.",
    },
    {
      q: 'My payment failed. What should I do?',
      a: 'Ensure your payment method is valid. If the issue persists, contact support. Your charging session data is saved and can be reviewed in History.',
    },
  ];

  const contactOptions = [
    {
      icon: 'mail-outline',
      title: 'Email Support',
      subtitle: 'support@greensteps.com',
      color: '#3B82F6',
      onPress: () => Linking.openURL('mailto:support@greensteps.com'),
    },
    {
      icon: 'call-outline',
      title: 'Phone Support',
      subtitle: '+91 1800-123-4567',
      color: '#10B981',
      onPress: () => Linking.openURL('tel:+911800123457'),
    },
    {
      icon: 'chatbubble-ellipses-outline',
      title: 'Live Chat',
      subtitle: 'Chat with our team',
      color: '#8B5CF6',
      onPress: () => navigation.navigate('SupportChatScreen'),
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, {borderColor: theme.border}]}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.text}]}>
          Help & Support
        </Text>
        <View style={{width: 44}} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={[styles.heroCard, {backgroundColor: theme.primary}]}>
          <Ionicons name="help-buoy" size={42} color="#fff" />
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSub}>
            Browse FAQs or reach out to our support team
          </Text>
        </View>

        {/* Contact Options */}
        <Text style={[styles.sectionTitle, {color: theme.subtext}]}>
          CONTACT US
        </Text>
        <View style={styles.contactGrid}>
          {contactOptions.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.contactCard,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}
              onPress={opt.onPress}
              activeOpacity={0.75}>
              <View
                style={[
                  styles.contactIcon,
                  {backgroundColor: opt.color + '15'},
                ]}>
                <Ionicons name={opt.icon} size={24} color={opt.color} />
              </View>
              <Text style={[styles.contactTitle, {color: theme.text}]}>
                {opt.title}
              </Text>
              <Text style={[styles.contactSub, {color: theme.subtext}]}>
                {opt.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <Text style={[styles.sectionTitle, {color: theme.subtext}]}>
          FREQUENTLY ASKED QUESTIONS
        </Text>
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.q} answer={faq.a} theme={theme} />
        ))}

        {/* Footer CTA */}
        <View
          style={[
            styles.footerCard,
            {backgroundColor: theme.card, borderColor: theme.border},
          ]}>
          <Ionicons
            name="chatbox-ellipses-outline"
            size={28}
            color={theme.primary}
          />
          <Text style={[styles.footerTitle, {color: theme.text}]}>
            Still need help?
          </Text>
          <Text style={[styles.footerSub, {color: theme.subtext}]}>
            Our support team is available 24/7
          </Text>
          <TouchableOpacity
            style={[styles.footerBtn, {backgroundColor: theme.primary}]}
            onPress={() => navigation.navigate('SupportChatScreen')}>
            <Text style={styles.footerBtnText}>Start Live Chat</Text>
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
    padding: 32,
    alignItems: 'center',
    marginBottom: 28,
    gap: 8,
  },
  heroTitle: {fontSize: 24, fontWeight: '900', color: '#fff', marginTop: 4},
  heroSub: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 14,
    marginLeft: 4,
  },

  contactGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  contactCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactTitle: {fontSize: 13, fontWeight: '800', textAlign: 'center'},
  contactSub: {fontSize: 10, fontWeight: '600', textAlign: 'center'},

  faqCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {fontSize: 15, fontWeight: '700', flex: 1, marginRight: 12},
  faqAnswer: {fontSize: 13, fontWeight: '500', lineHeight: 20, marginTop: 12},

  footerCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  footerTitle: {fontSize: 18, fontWeight: '800', marginTop: 4},
  footerSub: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerBtn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  footerBtnText: {color: '#fff', fontSize: 16, fontWeight: '800'},
});

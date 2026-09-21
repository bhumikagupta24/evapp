import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import Header from '../components/Header';

const SettingItem = ({title, screen, icon}) => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[
        styles.item,
        {backgroundColor: theme.card, borderColor: theme.border},
      ]}
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.7}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemIcon}>{icon}</Text>
        <Text style={[styles.itemText, {color: theme.text}]}>{title}</Text>
      </View>
      <Text style={{color: theme.subtext, fontSize: 18}}>›</Text>
    </TouchableOpacity>
  );
};

export default function AccountSettingsScreen() {
  const {theme} = useTheme();

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
        <Header title="Account" />

        <View style={styles.section}>
          <SettingItem title="Profile Details" screen="EditProfile" icon="👤" />
          <SettingItem
            title="Payment Methods"
            screen="PaymentMethods"
            icon="💳"
          />
          <SettingItem
            title="Privacy & Security"
            screen="PrivacySecurity"
            icon="🛡️"
          />
          <SettingItem
            title="Password & Security"
            screen="ChangePassword"
            icon="🔑"
          />
        </View>

        <Text style={[styles.sectionTitle, {color: theme.subtext}]}>
          Preferences
        </Text>
        <View style={styles.section}>
          <SettingItem title="Notifications" screen="notification" icon="🔔" />
          <SettingItem
            title="Theme & Display"
            screen="ThemeDisplay"
            icon="🎨"
          />
          <SettingItem title="Language" screen="Language" icon="🌐" />
        </View>

        <Text style={[styles.sectionTitle, {color: theme.subtext}]}>
          App Info
        </Text>
        <View style={styles.section}>
          <SettingItem title="Help & Support" screen="HelpSupport" icon="🎧" />
          <SettingItem title="About evservice" screen="AboutApp" icon="ℹ️" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {padding: 24, paddingBottom: 40},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

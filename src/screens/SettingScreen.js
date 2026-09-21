import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth, {getAuth, signOut} from '@react-native-firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
} from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const [userRole, setUserRole] = useState('user');

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth().currentUser;
      if (user) {
        const db = getFirestore();
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role || 'user');
        }
      }
    };
    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            const authInstance = getAuth();
            if (authInstance.currentUser) {
              await signOut(authInstance);
            }
            navigation.reset({index: 0, routes: [{name: 'Login'}]});
          } catch (err) {
            Alert.alert('Error', 'Something went wrong while logging out.');
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Second confirmation for safety
            Alert.alert(
              'Final Confirmation',
              'Are you absolutely sure? All your charging history, eco points, and payment methods will be permanently lost.',
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Delete Forever',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      const user = auth().currentUser;
                      if (!user) {
                        return;
                      }
                      const db = getFirestore();

                      // Delete user subcollections
                      const subCollections = [
                        'ChargingHistory',
                        'paymentMethods',
                      ];
                      for (const sub of subCollections) {
                        const subRef = collection(
                          doc(db, 'users', user.uid),
                          sub,
                        );
                        const subSnap = await getDocs(subRef);
                        for (const d of subSnap.docs) {
                          await deleteDoc(d.ref);
                        }
                      }

                      // Delete user document
                      await deleteDoc(doc(db, 'users', user.uid));

                      // Clear local storage
                      await AsyncStorage.clear();

                      // Delete the Firebase Auth account
                      await user.delete();

                      Alert.alert(
                        'Account Deleted',
                        'Your account has been permanently deleted.',
                      );
                    } catch (error) {
                      if (error.code === 'auth/requires-recent-login') {
                        Alert.alert(
                          'Re-authentication Required',
                          'For security, please log out and log back in, then try deleting your account again.',
                        );
                      } else {
                        Alert.alert(
                          'Error',
                          'Failed to delete account: ' + error.message,
                        );
                      }
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  const settingsOptions = [
    {
      id: 1,
      title: 'Manage Vehicle',
      icon: require('../assets/type.png'),
      onPress: () => navigation.navigate('manage'),
    },
    {
      id: 2,
      title: 'Account Settings',
      icon: require('../assets/user.png'),
      onPress: () => navigation.navigate('account'),
    },
    {
      id: 3,
      title: 'Notifications',
      icon: require('../assets/bell.png'),
      onPress: () => navigation.navigate('notification'),
    },
    {
      id: 4,
      title: 'Charging History',
      icon: require('../assets/history.png'),
      onPress: () => navigation.navigate('ChargingHistory'),
    },
    {
      id: 5,
      title: 'Help & Support',
      icon: require('../assets/help.png'),
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      id: 6,
      title: 'Terms & Conditions',
      icon: require('../assets/info.png'),
      onPress: () => navigation.navigate('TermsConditions'),
    },
    {
      id: 7,
      title: 'About App',
      icon: require('../assets/info.png'),
      onPress: () => navigation.navigate('About'),
    },
  ];

  if (userRole === 'partner') {
    settingsOptions.push({
      id: 8,
      title: 'Add Station (Partner)',
      icon: require('../assets/location.png'),
      onPress: () => navigation.navigate('AddStation'),
    });
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
            Settings
          </Text>
          <View style={{width: 44}} />
        </View>

        {/* Options List */}
        <View style={styles.optionsSection}>
          {settingsOptions.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.option,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.iconBox,
                  {backgroundColor: theme.primary + '10'},
                ]}>
                <Image
                  source={item.icon}
                  style={[styles.icon, {tintColor: theme.primary}]}
                />
              </View>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {item.title}
              </Text>
              <Text style={{color: theme.subtext, fontSize: 18}}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Account Actions */}
        <Text style={[styles.sectionTitle, {color: theme.subtext}]}>
          Account Actions
        </Text>

        <TouchableOpacity
          style={[styles.actionButton, {borderColor: '#FF3B30'}]}
          onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteButton, {backgroundColor: '#FF3B30'}]}
          onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>

        <Text style={[styles.deleteNote, {color: theme.subtext}]}>
          Deleting your account will remove all data permanently including
          charging history, eco points, and payment methods.
        </Text>
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
  optionsSection: {
    marginBottom: 32,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    width: 22,
    height: 22,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  actionButton: {
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: 12,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '800',
  },
  deleteButton: {
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  deleteNote: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

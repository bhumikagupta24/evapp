import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function NotificationScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .collection('notifications')
      .orderBy('timestamp', 'desc')
      .onSnapshot(
        snapshot => {
          if (snapshot) {
            const notifs = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setNotifications(notifs);
          }
          setLoading(false);
        },
        error => {
          console.error('Error fetching notifications:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, []);

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
          <Text style={{fontSize: 20}}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.text}]}>
          Notifications
        </Text>
        <View style={{width: 44}} />
      </View>

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{alignItems: 'center', marginTop: 100}}>
              <Text style={{fontSize: 40, marginBottom: 10}}>📭</Text>
              <Text
                style={{color: theme.text, fontSize: 18, fontWeight: '700'}}>
                No Notifications
              </Text>
              <Text style={{color: theme.subtext, marginTop: 4}}>
                You're all caught up!
              </Text>
            </View>
          }
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.card,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}>
              <View
                style={[
                  styles.iconBox,
                  {backgroundColor: theme.primary + '10'},
                ]}>
                <Text style={{fontSize: 24}}>{item.icon || '🔔'}</Text>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, {color: theme.text}]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.time, {color: theme.subtext}]}>
                    {item.time || 'Just now'}
                  </Text>
                </View>
                <Text
                  style={[styles.message, {color: theme.subtext}]}
                  numberOfLines={2}>
                  {item.message}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
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
  listContent: {padding: 24, paddingTop: 0},
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {flex: 1},
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {fontSize: 16, fontWeight: '800'},
  time: {fontSize: 11, fontWeight: '600'},
  message: {fontSize: 13, fontWeight: '500', lineHeight: 18},
});

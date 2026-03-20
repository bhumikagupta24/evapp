import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Profile = ({navigation}) => {
  const [userData, setUserData] = useState({
    name: 'EV User',
    email: 'user@evservices.in',
    phone: 'Not set',
    vehicle: 'Not set',
    connector: 'Not set',
  });

  const changePhoto = () => {
    Alert.alert(
      'Profile Photo',
      'Choose option',
      [
        {text: 'Camera', onPress: () => Alert.alert('Coming Soon', 'Camera access coming soon')},
        {text: 'Gallery', onPress: () => Alert.alert('Coming Soon', 'Gallery access coming soon')},
        {text: 'Cancel', style: 'cancel'},
      ]
    );
  };

  const logoutUser = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => navigation.replace('Home'),
      },
    ]);
  };

  const deleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone! All your data will be permanently deleted.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
            navigation.replace('Home');
          },
        },
      ]
    );
  };

  const Item = ({title, value, danger, onPress}) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text style={[styles.itemTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        {!value && <Text style={styles.arrow}>›</Text>}
      </View>
      {value && <Text style={styles.itemValue}>{value}</Text>}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#5F8F97', '#8ED081']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5F8F97" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Profile Header */}
        <View style={styles.profileBox}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../assets/account.png')}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraBtn} onPress={changePhoto}>
              <Text style={styles.cameraText}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>

        {/* Charging Info Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.section}>CHARGING INFO</Text>

          <Item title="Phone" value={userData.phone} />
          <Item title="Vehicle Number" value={userData.vehicle} />
          <Item title="Connector Type" value={userData.connector} />

          <Item
            title="✏️  Edit Profile & Charging Info"
            onPress={() =>
              navigation.navigate('EditProfile', {
                userData,
                updateUser: setUserData,
              })
            }
          />
        </View>

        {/* App Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.section}>APP</Text>
          <Item
            title="📜  Terms & Conditions"
            onPress={() => Alert.alert('Terms', 'Coming soon')}
          />
          <Item
            title="💬  Send Feedback"
            onPress={() => Alert.alert('Feedback', 'Thank you for your feedback!')}
          />
          <Item
            title="⚙️  Settings"
            onPress={() => navigation.navigate('Settings')}
          />
          <Item
            title="🗑️  Delete Account"
            danger
            onPress={deleteAccount}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logoutUser} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{height: 30}} />
      </ScrollView>
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  profileBox: {
    alignItems: 'center',
    marginBottom: 22,
    marginTop: 10,
  },

  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EAF4F4',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },

  cameraBtn: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#2ECC71',
    borderRadius: 18,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },

  cameraText: {
    fontSize: 14,
  },

  name: {
    color: '#0F3D3E',
    fontSize: 22,
    fontWeight: 'bold',
  },

  email: {
    color: '#1B5E60',
    marginTop: 4,
    fontSize: 14,
  },

  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    marginBottom: 14,
    paddingHorizontal: 18,
    overflow: 'hidden',
    elevation: 3,
  },

  section: {
    color: '#1C5A6A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    paddingVertical: 12,
    paddingTop: 16,
  },

  item: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  itemTitle: {
    color: '#1C5A6A',
    fontSize: 15,
  },

  dangerText: {
    color: '#e74c3c',
  },

  itemValue: {
    color: '#5A9EA0',
    marginTop: 4,
    fontSize: 14,
  },

  arrow: {
    color: '#aaa',
    fontSize: 22,
    fontWeight: '300',
  },

  logoutBtn: {
    backgroundColor: '#1C5A6A',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 4,
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
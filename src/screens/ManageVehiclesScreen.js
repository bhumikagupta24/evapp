import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const {width} = Dimensions.get('window');

export default function ManageVehiclesScreen({navigation}) {
  const {theme} = useTheme();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) {
      return;
    }

    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .collection('vehicles')
      .onSnapshot(
        snapshot => {
          const vehiclesList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVehicles(vehiclesList);
          setLoading(false);
        },
        error => {
          console.error('Error fetching vehicles:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, []);

  const handleRemove = id => {
    Alert.alert(
      'Remove Vehicle',
      'Are you sure you want to remove this vehicle?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const uid = auth().currentUser?.uid;
            if (!uid) {
              return;
            }
            try {
              await firestore()
                .collection('users')
                .doc(uid)
                .collection('vehicles')
                .doc(id)
                .delete();
            } catch (error) {
              console.error('Error deleting vehicle:', error);
              Alert.alert('Error', 'Could not remove vehicle.');
            }
          },
        },
      ],
    );
  };

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
          My Vehicles
        </Text>
        <View style={{width: 44}} />
      </View>

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <View
              style={[
                styles.vehicleCard,
                {backgroundColor: theme.card, borderColor: theme.border},
              ]}>
              <View
                style={[
                  styles.iconBox,
                  {backgroundColor: theme.primary + '15'},
                ]}>
                <Ionicons name="car-sport" size={28} color={theme.primary} />
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={[styles.vehicleName, {color: theme.text}]}>
                  {item.name || 'Unknown Vehicle'}
                </Text>
                <Text style={[styles.vehicleDetail, {color: theme.subtext}]}>
                  {item.type || 'Electric'} • {item.battery || 'N/A'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemove(item.id)}
                style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, {color: theme.subtext}]}>
                No vehicles added yet.
              </Text>
            </View>
          }
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addBtn, {backgroundColor: theme.primary}]}
          onPress={() =>
            Alert.alert(
              'Add Vehicle',
              'You can add vehicle from Edit Profile for now, full functionality coming soon.',
            )
          }>
          <Ionicons
            name="add"
            size={24}
            color="#fff"
            style={{marginRight: 8}}
          />
          <Text style={styles.addBtnText}>Add New Vehicle</Text>
        </TouchableOpacity>
      </View>
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
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  vehicleDetail: {
    fontSize: 13,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
  },
  addBtn: {
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

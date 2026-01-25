// src/screens/ManageVehiclesScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

export default function ManageVehiclesScreen() {
  const [vehicles, setVehicles] = useState([
    { id: '1', name: 'Tesla Model 3' },
    { id: '2', name: 'Nissan Leaf' },
  ]);

  const handleRemove = (id) => {
    Alert.alert('Remove Vehicle', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setVehicles(v => v.filter(item => item.id !== id)) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Vehicles</Text>

      <FlatList
        data={vehicles}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Text style={styles.removeBtn}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('Add Vehicle')}>
        <Text style={styles.addBtnText}>+ Add Vehicle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f9f4' },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginBottom: 20 },
  vehicleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#ccc',
  },
  vehicleName: { fontSize: 16, color: '#333' },
  removeBtn: { color: '#c62828', fontWeight: 'bold' },
  addBtn: {
    backgroundColor: '#2e7d32', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 20,
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

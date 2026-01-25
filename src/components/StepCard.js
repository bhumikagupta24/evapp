import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StepCard({
  title = 'Stat',
  value = 0,
  unit = '',
  backgroundColor = '#e0f2f1',
}) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>
        {value}{' '}
        <Text style={styles.unit}>
          {unit}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e7d32',
    marginBottom: 6,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  unit: {
    fontSize: 16,
    color: '#616161',
  },
});

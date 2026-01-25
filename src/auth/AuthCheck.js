// src/screens/Auth/AuthCheck.js
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function AuthCheck({ navigation }) {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.replace('TabBar'); // User is signed in
      } else {
        navigation.replace('Login'); // Not signed in
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2e7d32" />
    </View>
  );
}

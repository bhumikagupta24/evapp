// src/screens/Auth/AuthCheck.js
import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import auth from '@react-native-firebase/auth';

import {getFirestore, doc, getDoc} from '@react-native-firebase/firestore';

export default function AuthCheck({navigation}) {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      try {
        if (user) {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (userDoc.exists) {
            navigation.replace('TabBar'); // Profile exists, go to home
          } else {
            navigation.replace('CompleteProfile'); // Profile incomplete
          }
        } else {
          navigation.replace('Onboarding'); // Not signed in
        }
      } catch (error) {
        console.log('AuthCheck error:', error);
        navigation.replace('Onboarding');
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#2e7d32" />
    </View>
  );
}

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
          let userDoc = null;
          try {
            const db = getFirestore();
            userDoc = await getDoc(doc(db, 'users', user.uid));
          } catch (dbError) {
            console.log(
              'Firestore read warning (check security rules):',
              dbError.message,
            );
          }

          if (userDoc && userDoc.exists) {
            navigation.replace('TabBar'); // Profile exists, go to home
          } else {
            navigation.replace('CompleteProfile'); // Profile incomplete or first sign-in
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

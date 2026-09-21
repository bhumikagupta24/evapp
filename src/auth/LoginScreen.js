// src/screens/Auth/LoginScreen.js

import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import auth, {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {getFirestore, doc, getDoc} from '@react-native-firebase/firestore';
import {useTheme} from '../context/ThemeContext';

export default function LoginScreen({navigation}) {
  const {theme} = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1006939023844-r3r5rg8a3nlpac9akn3ns82ibbrh08uu.apps.googleusercontent.com', // ✅ Real Web Client ID
      offlineAccess: true,
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Please enter both email and password');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth(),
        email,
        password,
      );
      if (userCredential.user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

        if (userDoc.exists) {
          navigation.replace('TabBar');
        } else {
          navigation.navigate('PhoneLogin');
        }
      }
    } catch (error) {
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found'
      ) {
        try {
          const newUserCredential = await createUserWithEmailAndPassword(
            auth(),
            email,
            password,
          );
          if (newUserCredential.user) {
            Alert.alert('Success', 'New Account Created & Logged In!');
            navigation.navigate('PhoneLogin');
          }
        } catch (signUpError) {
          Alert.alert('Error', signUpError.message);
        }
      } else {
        Alert.alert('Login Failed', error.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || userInfo.idToken;

      if (!idToken) {
        throw new Error('No ID token found!');
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(
        auth(),
        googleCredential,
      );
      const user = userCredential.user;

      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists) {
          navigation.replace('TabBar');
        } else {
          navigation.navigate('PhoneLogin');
        }
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Login Failed', error.message || 'Google Sign-In failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: theme.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.inner}>
          <Image
            source={require('../assets/Logo1.png')} // ✅ Updated logo
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={[styles.title, {color: theme.text}]}>
            Welcome to GreenSteps
          </Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholderTextColor={theme.subtext}
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholderTextColor={theme.subtext}
          />

          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.primary}]}
            onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In / Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#db4437'}]}
            onPress={handleGoogleLogin}>
            <Text style={[styles.buttonText, {color: '#fff'}]}>
              Sign in with Google
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f5ec',
  },
  inner: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b2dfdb',
    marginBottom: 16,
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#388e3c',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    color: '#0a0a0a',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },
});

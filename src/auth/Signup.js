import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// NOTE: This screen is the Login/Sign-In screen (named Signup.js for legacy reasons)
const Signup = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!mobile.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter mobile number and password');
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert('Invalid Mobile', 'Enter a valid 10-digit mobile number');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    // Navigate to the main tab app after successful login
    Alert.alert('Login Successful', 'Welcome back!', [
      {
        text: 'OK',
        onPress: () => navigation.replace('Map'), // 'Map' is the TapNavigation entry
      },
    ]);
  };

  return (
    <LinearGradient
      colors={['#5F8F97', '#8ED081']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#5F8F97" />

      {/* Image */}
      <View style={styles.imageCard}>
        <Image source={require('../assets/car.png')} style={styles.image} />
      </View>

      {/* Form */}
      <View style={styles.formCard}>
        <Text style={styles.title}>Welcome Back!</Text>

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        {/* Sign In Button */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
          <LinearGradient
            colors={['#1C5A6A', '#5ED66B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Navigate to Sign Up */}
        <Text style={styles.bottomText}>
          Don't have an account?{' '}
          <Text
            style={styles.signUp}
            onPress={() => navigation.navigate('Account')}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 25,
    marginTop: 0,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C5A6A',
    textAlign: 'center',
    marginBottom: 10,
  },
  imageCard: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 220,
    resizeMode: 'contain',
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#D0E8EC',
    borderRadius: 14,
    color: '#222',
    paddingHorizontal: 15,
    marginTop: 12,
    backgroundColor: '#F4FAFB',
    fontSize: 15,
  },
  button: {
    height: 52,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  bottomText: {
    textAlign: 'center',
    marginTop: 18,
    color: '#666',
    fontSize: 14,
  },
  signUp: {
    color: '#1C5A6A',
    fontWeight: 'bold',
  },
});
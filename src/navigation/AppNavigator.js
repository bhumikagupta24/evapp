import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegisterScreen from '../auth/RegisterScreen';
import LoginScreen from '../auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TabNavigation from './TabNavigation';
import AuthCheck from '../auth/AuthCheck';
import FindStation from '../screens/FindStation'
import BookingStation from '../screens/BookingStation'
import AddStation from '../screens/AddStation';
import EditProfileScreen from '../screens/EditProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
// import BatteryHealthScreen from '../screens/BatteryHealthScreen'
import CarbonOffsetScreen from "../screens/CarbonOffsetScreen";
import EcoPointsScreen from '../screens/EcoPointsScreen';

const Stack = createNativeStackNavigator();


const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthCheck" component={AuthCheck} />
      <Stack.Screen name="TabBar" component={TabNavigation} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Find" component={FindStation} />
      <Stack.Screen name="Booking" component={BookingStation} />
      <Stack.Screen name='AddStation' component={AddStation} />
      <Stack.Screen name='Profile' component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="setting" component={SettingScreen} />
      <Stack.Screen name="account" component={AccountSettingsScreen} />
      <Stack.Screen name='notification' component={NotificationSettingsScreen} />
      {/* <Stack.Screen name="BatteryHealth" component={BatteryHealthScreen} /> */}
      <Stack.Screen name="CarbonOffset" component={CarbonOffsetScreen} />
      <Stack.Screen name='eco' component={EcoPointsScreen} />
      {/* <Stack.Screen name="Tracker" component={TrackerScreen} /> */}
    </Stack.Navigator>

  );
};

export default AppNavigator;

const styles = StyleSheet.create({});

import {StyleSheet} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../auth/LoginScreen';
import PhoneLoginScreen from '../auth/PhoneLoginScreen';
import OTPScreen from '../auth/OTPScreen';
import CompleteProfileScreen from '../auth/CompleteProfileScreen';
import AddVehiclePromptScreen from '../auth/AddVehiclePromptScreen';
import HomeScreen from '../screens/HomeScreen';
import TabNavigation from './TabNavigation';
import AuthCheck from '../auth/AuthCheck';
import FindStation from '../screens/FindStation';
import BookingStation from '../screens/BookingStation';
import AboutAppScreen from '../screens/AboutAppScreen';
import ManageVehiclesScreen from '../screens/ManageVehiclesScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import BatteryHealthScreen from '../screens/BatteryHealthScreen';
import CarbonOffsetScreen from '../screens/CarbonOffsetScreen';
import EcoPointsScreen from '../screens/EcoPointsScreen';
import ChargingHistoryScreen from '../screens/ChargingHistoryScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SupportChatScreen from '../screens/SupportChatScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import ServicesScreen from '../screens/ServicesScreen';
import TrackerScreen from '../screens/TrackerScreen';
import TipsScreen from '../screens/TipsScreen';
import AddStation from '../screens/AddStation';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AuthCheck"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="AuthCheck" component={AuthCheck} />
      <Stack.Screen name="TabBar" component={TabNavigation} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      <Stack.Screen
        name="AddVehiclePrompt"
        component={AddVehiclePromptScreen}
      />

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Find" component={FindStation} />
      <Stack.Screen name="Booking" component={BookingStation} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="setting" component={SettingScreen} />
      <Stack.Screen name="account" component={AccountSettingsScreen} />
      <Stack.Screen name="notification" component={NotificationScreen} />
      <Stack.Screen name="BatteryHealth" component={BatteryHealthScreen} />
      <Stack.Screen name="CarbonOffset" component={CarbonOffsetScreen} />
      <Stack.Screen name="eco" component={EcoPointsScreen} />
      <Stack.Screen name="ChargingHistory" component={ChargingHistoryScreen} />
      <Stack.Screen name="SupportChatScreen" component={SupportChatScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="ServicesScreen" component={ServicesScreen} />
      <Stack.Screen name="Tracker" component={TrackerScreen} />
      <Stack.Screen name="Tips" component={TipsScreen} />
      <Stack.Screen name="About" component={AboutAppScreen} />
      <Stack.Screen name="manage" component={ManageVehiclesScreen} />
      <Stack.Screen name="AddStation" component={AddStation} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});

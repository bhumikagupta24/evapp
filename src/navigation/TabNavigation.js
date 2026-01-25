import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FindStation from '../screens/FindStation';
import AddStation from '../screens/AddStation';
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#388e3c',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          elevation: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          switch (route.name) {
            case 'Home':
              icon = require('../assets/home.png');
              break;
            case 'Find':
              icon = require('../assets/activity-tracker.png');
              break;
            case 'Add':
              icon = require('../assets/medal-ribbon.png');
              break;
            case 'Profile':
              icon = require('../assets/user.png');
              break;
          }

          return (
            <Image
              source={icon}
              style={[
                styles.icon,
                { tintColor: color, width: size, height: size },
              ]}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add" component={AddStation} />
      <Tab.Screen name="Find" component={FindStation} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: -4,
  },
});



// keytool -list -v -keystore "$env:USERPROFILE\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android

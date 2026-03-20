import { Image, StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Charging from '../screen/Charging'
import Profile from '../screen/Profile'
import Booking from '../auth/Booking'
import Map from '../screen/Map'

const Tab = createBottomTabNavigator()

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#5ED66B',
        tabBarInactiveTintColor: '#9DB8BE',
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => {
          let iconName

          if (route.name === 'Map') {
            iconName = require('../assets/google-maps.png')
          } else if (route.name === 'Charging') {
            iconName = require('../assets/charging-station.png')
          } else if (route.name === 'Booking') {
            iconName = require('../assets/event.png')
          } else if (route.name === 'Profile') {
            iconName = require('../assets/user.png')
          }

          return (
            <Image
              source={iconName}
              style={[
                styles.tabIcon,
                { tintColor: focused ? '#5ED66B' : '#9DB8BE' },
              ]}
            />
          )
        },
      })}
    >
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Charging" component={Charging} />
      <Tab.Screen name="Booking" component={Booking} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0D2A33',
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tabIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
})

export default TabNavigation
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../context/ThemeContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FindStation from '../screens/FindStation';
import ChargingHistoryScreen from '../screens/ChargingHistoryScreen';
import ServicesScreen from '../screens/ServicesScreen';

const {width} = Dimensions.get('window');
const Tab = createBottomTabNavigator();

function MyTabBar({state, descriptors, navigation}) {
  const {theme} = useTheme();

  return (
    <View style={[styles.tabBarWrapper, {shadowColor: theme.primary}]}>
      <View
        style={[
          styles.tabBarContainer,
          {backgroundColor: 'rgba(255, 255, 255, 0.95)'},
        ]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          let iconName;
          if (route.name === 'Home') {
            iconName = isFocused ? 'home' : 'home-outline';
          } else if (route.name === 'Finder') {
            iconName = isFocused ? 'map' : 'map-outline';
          } else if (route.name === 'Services') {
            iconName = isFocused ? 'grid' : 'grid-outline';
          } else if (route.name === 'History') {
            iconName = isFocused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = isFocused ? 'person' : 'person-outline';
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.iconWrapper,
                  isFocused && {backgroundColor: theme.primary + '15'},
                ]}>
                <Ionicons
                  name={iconName}
                  size={isFocused ? 24 : 22}
                  color={isFocused ? theme.primary : '#64748B'}
                />
              </View>
              {isFocused && (
                <Text style={[styles.tabLabel, {color: theme.primary}]}>
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarLabel: 'Home'}}
      />
      <Tab.Screen
        name="Finder"
        component={FindStation}
        options={{tabBarLabel: 'Finder'}}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{tabBarLabel: 'Services'}}
      />
      <Tab.Screen
        name="History"
        component={ChargingHistoryScreen}
        options={{tabBarLabel: 'History'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{tabBarLabel: 'Profile'}}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 20,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: 72,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 6,
    letterSpacing: -0.2,
  },
});

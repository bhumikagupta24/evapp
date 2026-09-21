import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* Tab Navigator */
import TapNavigation from "./TapNavigation";

/* Auth Screens */
import HomeScreen from "../screen/Homescreen";
import Account from "../auth/Account";
import Signup from "../auth/Signup";
import OtpScreen from "../auth/OtpScreen";

/* Sub-screens (pushed on top of tabs) */
import Nearby from "../screen/Nearby";
import Payment from "../screen/Payment";
import PaymentHistory from "../screen/Paymenthistory";
import EditProfile from "../screen/EditProfile";
import Settings from "../auth/Settings";

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Splash / Auth Flow */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />

        {/* Main App (Tab Navigator as a screen) */}
        <Stack.Screen name="Map" component={TapNavigation} />

        {/* Screens pushed on top of tabs */}
        <Stack.Screen name="Nearby" component={Nearby} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Paymenthistory" component={PaymentHistory} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
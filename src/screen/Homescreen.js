import React from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, StatusBar} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = ({navigation}) => {
  return (
    <LinearGradient
      colors={["#5F8F97", "#8ED081"]}
      start={{x:0,y:0}}
      end={{x:0,y:1}}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#5F8F97" />

      {/* EV Image */}
      <Image
        source={require("../assets/charging.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Charge Your EV</Text>
      <Text style={styles.title}>On The Go!</Text>

      <Text style={styles.subtitle}>
        Experience the convenience of charging your electric vehicle anywhere,
        anytime with our user-friendly app.
      </Text>

      {/* Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Account")}
      >
        <LinearGradient
          colors={["#1C5A6A","#5ED66B"]}
          start={{x:0,y:0}}
          end={{x:1,y:0}}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>

    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({

  container:{
    flex:1,
    padding:25,
    alignItems:"center",
    justifyContent:"center",
  },

  image:{
    width:350,
    height:350,
    resizeMode:"contain",
    marginBottom:20,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    color: "#0F3D3E",
    textShadowColor: "rgba(255,255,255,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#1B4D3E",
    marginTop: 15,
    marginBottom: 40,
    paddingHorizontal: 10,
    lineHeight: 22,
  },

  button:{
    height:60,
    width:280,
    borderRadius:30,
    alignItems:"center",
    justifyContent:"center",
    elevation:6
  },

  buttonText:{
    color:"#fff",
    fontSize:18,
    fontWeight:"bold"
  }

});
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const Account = ({ navigation }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!name.trim() || !mobile.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert("Invalid Mobile", "Enter a valid 10 digit mobile number");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Invalid Email", "Enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters");
      return;
    }

    navigation.navigate("OtpScreen", { mobile });
  };

  return (
    <LinearGradient
      colors={["#5F8F97", "#8ED081"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#5F8F97" />

      <View style={styles.imageCard}>
        <Image source={require("../assets/car.png")} style={styles.image} />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.title}>Create an Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity activeOpacity={0.8} onPress={handleSignup}>
          <LinearGradient
            colors={["#1C5A6A", "#5ED66B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Already have an account?{" "}
          <Text
            style={styles.signIn}
            onPress={() => navigation.navigate("Signup")}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageCard: {
    alignItems: "center",
    marginTop: -60,
  },
  image: {
    width: 320,
    height: 240,
    resizeMode: "contain",
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 25,
    marginTop: 0,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1C5A6A",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    color: "#222",
    borderColor: "#D0E8EC",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginTop: 12,
    backgroundColor: "#F4FAFB",
    fontSize: 15,
  },
  button: {
    height: 52,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  bottomText: {
    textAlign: "center",
    marginTop: 18,
    color: "#666",
    fontSize: 14,
  },
  signIn: {
    color: "#1C5A6A",
    fontWeight: "bold",
  },
});
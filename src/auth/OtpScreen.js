import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const OtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance to next input
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
    // Auto-go back on delete
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      Alert.alert("Invalid OTP", "Please enter the complete 4-digit OTP");
      return;
    }

    // In production, validate against server-sent OTP
    // For demo, hardcoded as "1234"
    if (enteredOtp === "1234") {
      Alert.alert("Success", "OTP Verified! Welcome aboard! 🎉", [
        {
          text: "Continue",
          onPress: () => navigation.replace("Map"), // 'Map' = TapNavigation
        },
      ]);
    } else {
      Alert.alert("Error", "Incorrect OTP. Please try again.");
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", ""]);
    inputs.current[0]?.focus();
    Alert.alert("OTP Sent", "A new OTP has been sent to your mobile.");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      {/* Image */}
      <View style={styles.imageCard}>
        <Image
          source={require("../assets/otp.png")}
          style={styles.image}
        />
      </View>

      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        We have sent a 4-digit code to your mobile number
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={[styles.otpInput, value ? styles.otpFilled : null]}
            keyboardType="numeric"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(text, index)}
            ref={(ref) => (inputs.current[index] = ref)}
          />
        ))}
      </View>

      <TouchableOpacity activeOpacity={0.8} onPress={handleVerify}>
        <LinearGradient
          colors={["#1C5A6A", "#5ED66B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Verify OTP</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
        <Text style={styles.resendText}>Didn't receive it? Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#f4f9f9",
  },
  imageCard: {
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C5A6A",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 20,
    marginBottom: 35,
  },
  otpInput: {
    width: 62,
    height: 62,
    borderWidth: 1.5,
    borderColor: "#C5DDE3",
    borderRadius: 14,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C5A6A",
    backgroundColor: "#fff",
    elevation: 2,
  },
  otpFilled: {
    borderColor: "#1C5A6A",
    backgroundColor: "#EAF6F8",
  },
  button: {
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  resendBtn: {
    marginTop: 5,
    alignItems: 'center',
  },
  resendText: {
    color: "#1C5A6A",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
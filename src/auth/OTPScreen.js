import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OTPScreen = ({navigation, route}) => {
  const {theme} = useTheme();
  const {phoneNumber} = route.params || {phoneNumber: '+91 98765 43210'};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) {
      alert('Please enter the full code');
      return;
    }
    alert('Phone Verified successfully!');
    navigation.replace('CompleteProfile', {verifiedPhoneNumber: phoneNumber});
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      alert('OTP Resent!');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.content}>
              <Text style={[styles.title, {color: theme.text}]}>
                Verification Code 🔐
              </Text>
              <Text style={[styles.subtitle, {color: theme.subtext}]}>
                We have sent a 6-digit verification code to{' '}
                <Text style={{color: theme.text, fontWeight: '700'}}>
                  {phoneNumber}
                </Text>
                . Please enter it below.
              </Text>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => (inputs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      {
                        backgroundColor: theme.card,
                        borderColor: digit ? theme.primary : theme.border,
                        color: theme.text,
                      },
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={value => handleOtpChange(value, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                  />
                ))}
              </View>

              <View style={styles.resendContainer}>
                <Text style={[styles.resendText, {color: theme.subtext}]}>
                  Didn't receive the code?{' '}
                </Text>
                <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                  <Text
                    style={[
                      styles.resendButton,
                      {color: timer > 0 ? theme.subtext : theme.primary},
                    ]}>
                    {timer > 0 ? `Resend in ${timer}s` : 'Resend Now'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  {backgroundColor: theme.primary},
                  otp.join('').length < 6 && {opacity: 0.6},
                ]}
                onPress={handleVerify}
                disabled={otp.join('').length < 6}>
                <Text style={styles.verifyText}>Verify & Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
    fontWeight: '400',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 15,
  },
  resendButton: {
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  verifyButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  verifyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OTPScreen;

import React, {useState, useRef, useEffect} from 'react';
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
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

const PhoneLoginScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: '+91',
    flag: '🇮🇳',
    name: 'India',
    placeholder: '98765 43210',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const countries = [
    {code: '+91', flag: '🇮🇳', name: 'India', placeholder: '98765 43210'},
    {code: '+234', flag: '🇳🇬', name: 'Nigeria', placeholder: '906 422 4976'},
    {code: '+1', flag: '🇺🇸', name: 'USA', placeholder: '202 555 0123'},
    {code: '+44', flag: '🇬🇧', name: 'UK', placeholder: '7700 900123'},
    {code: '+971', flag: '🇦🇪', name: 'UAE', placeholder: '50 123 4567'},
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    if (phoneNumber.length < 8) {
      alert('Please enter a valid phone number');
      return;
    }
    if (!isChecked) {
      alert('Please agree to the terms and conditions');
      return;
    }
    navigation.navigate('OTP', {
      phoneNumber: `${selectedCountry.code} ${phoneNumber}`,
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      {/* Decorative Circles for Glassmorphism Effect */}
      <View
        style={[
          styles.decorCircle,
          {backgroundColor: theme.primary, opacity: 0.05, top: -50, right: -50},
        ]}
      />
      <View
        style={[
          styles.decorCircle,
          {
            backgroundColor: theme.primary,
            opacity: 0.05,
            bottom: -100,
            left: -100,
            width: 300,
            height: 300,
          },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                navigation.canGoBack() ? navigation.goBack() : null
              }
              activeOpacity={0.7}>
              <View
                style={[
                  styles.backIconContainer,
                  {backgroundColor: theme.card},
                ]}>
                <Icon name="chevron-left" size={28} color={theme.text} />
              </View>
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.content,
                {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
              ]}>
              <Text style={[styles.title, {color: theme.text}]}>
                Hello there 👋
              </Text>
              <Text style={[styles.subtitle, {color: theme.subtext}]}>
                Please enter your phone number. You will receive an OTP code in
                the next step for the verification process.
              </Text>

              <View style={styles.inputSection}>
                <Text style={[styles.label, {color: theme.text, opacity: 0.7}]}>
                  Phone Number
                </Text>
                <View
                  style={[
                    styles.phoneInputWrapper,
                    {
                      backgroundColor: theme.card,
                      borderColor: isFocused ? theme.primary : theme.border,
                      borderWidth: 1.5,
                    },
                  ]}>
                  <TouchableOpacity
                    style={styles.countryPicker}
                    onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.flag}>{selectedCountry.flag}</Text>
                    <Text style={[styles.countryCode, {color: theme.text}]}>
                      {selectedCountry.code}
                    </Text>
                    <Icon name="chevron-down" size={18} color={theme.subtext} />
                  </TouchableOpacity>

                  <View
                    style={[styles.divider, {backgroundColor: theme.border}]}
                  />

                  <TextInput
                    style={[styles.input, {color: theme.text}]}
                    placeholder={selectedCountry.placeholder}
                    placeholderTextColor={theme.subtext}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={text =>
                      setPhoneNumber(text.replace(/[^0-9]/g, ''))
                    }
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsChecked(!isChecked)}
                activeOpacity={0.8}>
                <View
                  style={[
                    styles.checkbox,
                    {borderColor: theme.primary},
                    isChecked && {backgroundColor: theme.primary},
                  ]}>
                  {isChecked && <Icon name="check" size={16} color="#FFF" />}
                </View>
                <Text style={[styles.checkboxText, {color: theme.subtext}]}>
                  I agree to{' '}
                  <Text style={{color: theme.primary, fontWeight: '700'}}>
                    Terms & Conditions
                  </Text>{' '}
                  and{' '}
                  <Text style={{color: theme.primary, fontWeight: '700'}}>
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  {backgroundColor: theme.primary},
                  (!phoneNumber || !isChecked) && {opacity: 0.5},
                ]}
                onPress={handleContinue}
                disabled={!phoneNumber || !isChecked}
                activeOpacity={0.8}>
                <Text style={styles.continueText}>Continue</Text>
                <Icon
                  name="arrow-right"
                  size={20}
                  color="#FFF"
                  style={{marginLeft: 8}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Custom Country Picker Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, {backgroundColor: theme.background}]}>
            <Text style={[styles.modalTitle, {color: theme.text}]}>
              Select Country
            </Text>
            {countries.map(item => (
              <TouchableOpacity
                key={item.code}
                style={styles.countryItem}
                onPress={() => {
                  setSelectedCountry(item);
                  setIsModalVisible(false);
                }}>
                <Text style={styles.modalFlag}>{item.flag}</Text>
                <Text style={[styles.modalCountryName, {color: theme.text}]}>
                  {item.name}
                </Text>
                <Text style={[styles.modalCountryCode, {color: theme.subtext}]}>
                  {item.code}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.closeButton, {backgroundColor: theme.primary}]}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    zIndex: 0,
  },
  flex: {
    flex: 1,
    zIndex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 20,
    width: 48,
    height: 48,
  },
  backIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    marginTop: 35,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
    fontWeight: '500',
    opacity: 0.8,
  },
  inputSection: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
    borderRadius: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  flag: {
    fontSize: 22,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 17,
    fontWeight: '700',
    marginRight: 4,
  },
  divider: {
    width: 1,
    height: '50%',
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    paddingLeft: 12,
    letterSpacing: 1.5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    height: 62,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  continueText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  modalCountryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  modalCountryCode: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    marginTop: 20,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PhoneLoginScreen;

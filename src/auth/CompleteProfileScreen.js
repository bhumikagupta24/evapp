import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import auth from '@react-native-firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';

import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

const CompleteProfileScreen = ({navigation, route}) => {
  const {theme} = useTheme();
  const verifiedPhoneNumber = route?.params?.verifiedPhoneNumber || '';
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState(verifiedPhoneNumber);
  const [address, setAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [towerBlock, setTowerBlock] = useState('');
  const [nearbyLandmark, setNearbyLandmark] = useState('');
  const [addressType, setAddressType] = useState('Home');
  const [role, setRole] = useState('user');
  const [isFocused, setIsFocused] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      try {
        DateTimePickerAndroid.open({
          value: date instanceof Date ? date : new Date(),
          onChange: (event, selectedDate) => {
            if (event.type === 'set' && selectedDate) {
              setDate(selectedDate);
              const formattedDate = `${String(selectedDate.getDate()).padStart(
                2,
                '0',
              )} / ${String(selectedDate.getMonth() + 1).padStart(
                2,
                '0',
              )} / ${selectedDate.getFullYear()}`;
              setDob(formattedDate);
            }
          },
          mode: 'date',
          maximumDate: new Date(),
        });
      } catch (err) {
        console.warn('DatePicker open error:', err);
      }
    } else {
      setShowDatePicker(true);
    }
  };

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

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleLocateMe = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'GreenStepsApp/1.0 (contact@greensteps.com)',
              'Accept-Language': 'en-US,en;q=0.9',
            },
          },
        )
          .then(res => {
            if (!res.ok) {
              throw new Error('Geocoding blocked or rate limited');
            }
            return res.json();
          })
          .then(data => {
            if (data && data.display_name) {
              setAddress(data.display_name);

              if (data.address) {
                if (data.address.house_number) {
                  setHouseNumber(data.address.house_number);
                }
                if (data.address.building || data.address.residential) {
                  setTowerBlock(
                    data.address.building || data.address.residential,
                  );
                }
                if (
                  data.address.neighbourhood ||
                  data.address.suburb ||
                  data.address.landmark
                ) {
                  setNearbyLandmark(
                    data.address.neighbourhood ||
                      data.address.suburb ||
                      data.address.landmark,
                  );
                }
              }
            }
          })
          .catch(err => console.log('Geocoding error:', err));
      },
      error => console.log('Location error:', error),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleFinish = async () => {
    if (!fullName) {
      alert('Please enter your full name');
      return;
    }

    try {
      const user = auth().currentUser;
      if (user) {
        // Generate Username based on name, phone, email combination
        const namePart = fullName
          .replace(/\s+/g, '')
          .toLowerCase()
          .substring(0, 5);
        const phonePart = phone
          ? phone.replace(/\D/g, '').slice(-3)
          : Math.floor(100 + Math.random() * 900).toString();
        const emailPart = user.email
          ? user.email.split('@')[0].substring(0, 3)
          : 'eco';
        const generatedUsername = `${namePart}${phonePart}${emailPart}`;

        // Save profile data to Firestore
        const db = getFirestore();
        await setDoc(doc(db, 'users', user.uid), {
          fullName,
          dob,
          gender,
          phone,
          address: `${houseNumber ? houseNumber + ', ' : ''}${
            floor ? 'Floor ' + floor + ', ' : ''
          }${towerBlock ? towerBlock + ', ' : ''}${
            nearbyLandmark ? nearbyLandmark + ', ' : ''
          }${address}`,
          addressDetails: {
            houseNumber,
            floor,
            towerBlock,
            nearbyLandmark,
            type: addressType,
            rawAddress: address,
          },
          username: generatedUsername,
          profileImage,
          role,
          email: user.email || '',
          createdAt: serverTimestamp(),
        });
      }
      alert('Profile Completed Successfully!');
      if (role === 'partner') {
        navigation.replace('AddStation', {fromOnboarding: true}); // Partners must add their station
      } else {
        navigation.replace('AddVehiclePrompt', {fromOnboarding: true}); // Users can add their vehicle
      }
    } catch (error) {
      alert('Error saving data: ' + error.message);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      {/* Decorative Circles */}
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.inner,
              {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
            ]}>
            <View style={styles.header}>
              <Text style={[styles.title, {color: theme.text}]}>
                Complete Profile 📝
              </Text>
              <Text style={[styles.subtitle, {color: theme.subtext}]}>
                Please provide your basic details to personalize your
                experience.
              </Text>
            </View>

            {/* Profile Picture Placeholder */}
            <View style={styles.profilePicContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.profilePic,
                  {backgroundColor: theme.card, borderColor: theme.primary},
                ]}
                onPress={handleImagePick}>
                {profileImage ? (
                  <Image
                    source={{uri: profileImage}}
                    style={styles.profilePicInner}
                  />
                ) : (
                  <View
                    style={[
                      styles.profilePicInner,
                      {backgroundColor: theme.primary + '10'},
                    ]}>
                    <Icon
                      name="camera-outline"
                      size={45}
                      color={theme.primary}
                    />
                    <Text style={[styles.uploadText, {color: theme.primary}]}>
                      Upload
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editBadge, {backgroundColor: theme.primary}]}
                onPress={handleImagePick}>
                <Icon name="plus" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: theme.text}]}>
                  Full Name
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: theme.card,
                      borderColor:
                        isFocused === 'name' ? theme.primary : theme.border,
                      borderWidth: 1.5,
                    },
                  ]}>
                  <Icon
                    name="account-outline"
                    size={22}
                    color={isFocused === 'name' ? theme.primary : theme.subtext}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, {color: theme.text}]}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.subtext}
                    value={fullName}
                    onChangeText={setFullName}
                    onFocus={() => setIsFocused('name')}
                    onBlur={() => setIsFocused('')}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: theme.text}]}>
                  Phone Number
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: theme.card,
                      borderColor:
                        isFocused === 'phone' ? theme.primary : theme.border,
                      borderWidth: 1.5,
                    },
                  ]}>
                  <Icon
                    name="phone-outline"
                    size={22}
                    color={
                      isFocused === 'phone' ? theme.primary : theme.subtext
                    }
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      {color: verifiedPhoneNumber ? theme.subtext : theme.text},
                    ]}
                    placeholder="Enter your mobile number"
                    placeholderTextColor={theme.subtext}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    editable={!verifiedPhoneNumber} // Prevent editing if already verified
                    onFocus={() => setIsFocused('phone')}
                    onBlur={() => setIsFocused('')}
                  />
                  {verifiedPhoneNumber ? (
                    <Icon
                      name="check-decagram"
                      size={20}
                      color="#10B981"
                      style={{marginLeft: 10}}
                    />
                  ) : null}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: 8,
                  }}>
                  <Text
                    style={[
                      styles.label,
                      {color: theme.text, marginBottom: 0},
                    ]}>
                    Address
                  </Text>
                  <TouchableOpacity
                    onPress={handleLocateMe}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: theme.primary + '20',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}>
                    <Icon
                      name="crosshairs-gps"
                      size={14}
                      color={theme.primary}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: theme.primary,
                        marginLeft: 4,
                      }}>
                      Locate Me
                    </Text>
                  </TouchableOpacity>
                </View>

                <GooglePlacesAutocomplete
                  placeholder="Search for street, city..."
                  fetchDetails={true}
                  onPress={data => setAddress(data.description)}
                  query={{
                    key: 'AIzaSyBHvb7pkgEmQ89VOxfmZrDZnEKHBwS5ooI',
                    language: 'en',
                  }}
                  renderLeftButton={() => (
                    <View style={{justifyContent: 'center', paddingLeft: 16}}>
                      <Icon
                        name="map-marker-outline"
                        size={22}
                        color={
                          isFocused === 'address'
                            ? theme.primary
                            : theme.subtext
                        }
                      />
                    </View>
                  )}
                  textInputProps={{
                    placeholderTextColor: theme.subtext,
                    value: address,
                    onChangeText: setAddress,
                    onFocus: () => setIsFocused('address'),
                    onBlur: () => setIsFocused(''),
                  }}
                  styles={{
                    container: {flex: 0, width: '100%'},
                    textInputContainer: {
                      width: '100%',
                      backgroundColor: theme.card,
                      borderColor:
                        isFocused === 'address' ? theme.primary : theme.border,
                      borderWidth: 1.5,
                      borderRadius: 16,
                      height: 60,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.05,
                      shadowRadius: 5,
                      elevation: 2,
                    },
                    textInput: {
                      backgroundColor: 'transparent',
                      color: theme.text,
                      paddingHorizontal: 12,
                      height: 60,
                      borderRadius: 16,
                      fontSize: 16,
                      fontWeight: '700',
                    },
                    listView: {
                      backgroundColor: theme.card,
                      borderRadius: 12,
                      marginTop: 4,
                      borderWidth: 1,
                      borderColor: theme.border,
                    },
                    row: {
                      backgroundColor: theme.card,
                      padding: 13,
                      minHeight: 44,
                      flexDirection: 'row',
                    },
                    description: {color: theme.text},
                  }}
                />
              </View>

              {/* Address Type Chips */}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 16,
                  marginBottom: 8,
                  gap: 10,
                }}>
                {['Home', 'Work', 'Other'].map(type => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setAddressType(type)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor:
                        addressType === type ? theme.primary : theme.border,
                      backgroundColor:
                        addressType === type
                          ? theme.primary + '10'
                          : theme.background,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: addressType === type ? '700' : '500',
                        color:
                          addressType === type ? theme.primary : theme.subtext,
                      }}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Granular Address Fields in a Grid */}
              <View style={{flexDirection: 'row', gap: 12, marginTop: 12}}>
                <View style={[styles.inputGroup, {flex: 1}]}>
                  <Text style={[styles.label, {color: theme.text}]}>
                    House number *
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.card,
                        borderColor:
                          isFocused === 'houseNumber'
                            ? theme.primary
                            : theme.border,
                        borderWidth: 1.5,
                      },
                    ]}>
                    <TextInput
                      style={[styles.input, {color: theme.text}]}
                      placeholder="e.g. 4B"
                      placeholderTextColor={theme.subtext}
                      value={houseNumber}
                      onChangeText={setHouseNumber}
                      onFocus={() => setIsFocused('houseNumber')}
                      onBlur={() => setIsFocused('')}
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, {flex: 1}]}>
                  <Text style={[styles.label, {color: theme.text}]}>Floor</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.card,
                        borderColor:
                          isFocused === 'floor' ? theme.primary : theme.border,
                        borderWidth: 1.5,
                      },
                    ]}>
                    <TextInput
                      style={[styles.input, {color: theme.text}]}
                      placeholder="e.g. 2nd"
                      placeholderTextColor={theme.subtext}
                      value={floor}
                      onChangeText={setFloor}
                      onFocus={() => setIsFocused('floor')}
                      onBlur={() => setIsFocused('')}
                    />
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 12}}>
                <View style={[styles.inputGroup, {flex: 1}]}>
                  <Text style={[styles.label, {color: theme.text}]}>
                    Tower / Block *
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.card,
                        borderColor:
                          isFocused === 'towerBlock'
                            ? theme.primary
                            : theme.border,
                        borderWidth: 1.5,
                      },
                    ]}>
                    <TextInput
                      style={[styles.input, {color: theme.text}]}
                      placeholder="e.g. Block A"
                      placeholderTextColor={theme.subtext}
                      value={towerBlock}
                      onChangeText={setTowerBlock}
                      onFocus={() => setIsFocused('towerBlock')}
                      onBlur={() => setIsFocused('')}
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, {flex: 1}]}>
                  <Text style={[styles.label, {color: theme.text}]}>
                    Nearby landmark
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: theme.card,
                        borderColor:
                          isFocused === 'nearbyLandmark'
                            ? theme.primary
                            : theme.border,
                        borderWidth: 1.5,
                      },
                    ]}>
                    <TextInput
                      style={[styles.input, {color: theme.text}]}
                      placeholder="Optional"
                      placeholderTextColor={theme.subtext}
                      value={nearbyLandmark}
                      onChangeText={setNearbyLandmark}
                      onFocus={() => setIsFocused('nearbyLandmark')}
                      onBlur={() => setIsFocused('')}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: theme.text}]}>
                  Date of Birth
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: theme.card,
                      borderColor: showDatePicker
                        ? theme.primary
                        : theme.border,
                      borderWidth: 1.5,
                    },
                  ]}
                  onPress={openDatePicker}>
                  <Icon
                    name="calendar-outline"
                    size={22}
                    color={theme.primary}
                    style={styles.inputIcon}
                  />
                  <Text
                    style={[
                      styles.input,
                      {
                        color: dob ? theme.text : theme.subtext,
                        textAlignVertical: 'center',
                        marginTop: Platform.OS === 'android' ? 4 : 0,
                      },
                    ]}>
                    {dob || 'DD / MM / YYYY'}
                  </Text>
                </TouchableOpacity>
                {Platform.OS === 'ios' && showDatePicker && (
                  <DateTimePicker
                    value={date instanceof Date ? date : new Date()}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setDate(selectedDate);
                        const formattedDate = `${String(
                          selectedDate.getDate(),
                        ).padStart(2, '0')} / ${String(
                          selectedDate.getMonth() + 1,
                        ).padStart(2, '0')} / ${selectedDate.getFullYear()}`;
                        setDob(formattedDate);
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: theme.text}]}>Gender</Text>
                <View style={styles.genderContainer}>
                  {[
                    {id: 'Male', icon: 'gender-male'},
                    {id: 'Female', icon: 'gender-female'},
                    {id: 'Other', icon: 'gender-non-binary'},
                  ].map(item => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      style={[
                        styles.genderOption,
                        {
                          backgroundColor:
                            gender === item.id ? theme.primary : theme.card,
                          borderColor:
                            gender === item.id ? theme.primary : theme.border,
                        },
                      ]}
                      onPress={() => setGender(item.id)}>
                      <Icon
                        name={item.icon}
                        size={20}
                        color={gender === item.id ? '#FFF' : theme.subtext}
                        style={{marginBottom: 4}}
                      />
                      <Text
                        style={[
                          styles.genderText,
                          {
                            color: gender === item.id ? '#FFF' : theme.text,
                            fontSize: 13,
                          },
                        ]}>
                        {item.id}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: theme.text}]}>
                  How do you want to use the app?
                </Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.roleBtn,
                      role === 'user' && {
                        backgroundColor: theme.primary,
                        borderColor: theme.primary,
                      },
                    ]}
                    onPress={() => setRole('user')}>
                    <Icon
                      name="car-outline"
                      size={24}
                      color={role === 'user' ? '#fff' : theme.subtext}
                    />
                    <Text
                      style={[
                        styles.roleText,
                        {color: role === 'user' ? '#fff' : theme.text},
                      ]}>
                      Regular User
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.roleBtn,
                      role === 'partner' && {
                        backgroundColor: theme.primary,
                        borderColor: theme.primary,
                      },
                    ]}
                    onPress={() => setRole('partner')}>
                    <Icon
                      name="ev-station"
                      size={24}
                      color={role === 'partner' ? '#fff' : theme.subtext}
                    />
                    <Text
                      style={[
                        styles.roleText,
                        {color: role === 'partner' ? '#fff' : theme.text},
                      ]}>
                      Station Partner
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.finishButton, {backgroundColor: theme.primary}]}
              onPress={handleFinish}>
              <Text style={styles.finishText}>Finish & Explore</Text>
              <Icon
                name="arrow-right"
                size={22}
                color="#FFF"
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  profilePicContainer: {
    alignSelf: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    padding: 5,
  },
  profilePicInner: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 4,
  },
  form: {
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    marginHorizontal: 5,
    gap: 8,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  genderOption: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  genderText: {
    fontSize: 15,
    fontWeight: '800',
  },
  finishButton: {
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  finishText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

export default CompleteProfileScreen;

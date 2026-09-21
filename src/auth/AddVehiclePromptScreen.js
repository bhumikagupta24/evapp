import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

const AddVehiclePromptScreen = ({route, navigation}) => {
  const isFromOnboarding = route?.params?.isFromOnboarding;
  const {theme} = useTheme();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showVehicleOptions, setShowVehicleOptions] = useState(false);
  const [showPlugOptions, setShowPlugOptions] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vehicleTypes = [
    {
      id: '1',
      name: '2 Wheeler',
      icon: 'motorbike',
      desc: 'Electric Scooters & Bikes',
    },
    {id: '2', name: '3 Wheeler', icon: 'rickshaw', desc: 'Electric Rickshaws'},
    {
      id: '3',
      name: '4 Wheeler',
      icon: 'car-electric',
      desc: 'Electric Cars & SUVs',
    },
  ];

  const getPlugTypes = () => {
    switch (selectedVehicle) {
      case '2 Wheeler':
        return [
          {
            id: 'p4',
            name: '16A Socket',
            desc: 'Standard Home Plug (Scooters)',
            icon: 'power-socket-uk',
          },
          {
            id: 'p2',
            name: 'Type 2',
            desc: 'AC Standard Charging (Bikes)',
            icon: 'power-plug-outline',
          },
        ];
      case '3 Wheeler':
        return [
          {
            id: 'p4',
            name: '16A Socket',
            desc: 'Standard Home Plug',
            icon: 'power-socket-uk',
          },
          {
            id: 'p3',
            name: 'GB/T',
            desc: 'Indian Standard Fast DC',
            icon: 'flash',
          },
        ];
      case '4 Wheeler':
        return [
          {
            id: 'p1',
            name: 'CCS2',
            desc: 'DC Fast Charging (Cars)',
            icon: 'power-plug',
          },
          {
            id: 'p2',
            name: 'Type 2',
            desc: 'AC Standard Charging',
            icon: 'power-plug-outline',
          },
          {
            id: 'p3',
            name: 'GB/T',
            desc: 'DC Charging (Specific Cars)',
            icon: 'flash',
          },
        ];
      default:
        return [
          {
            id: 'p1',
            name: 'CCS2',
            desc: 'DC Fast Charging',
            icon: 'power-plug',
          },
          {
            id: 'p2',
            name: 'Type 2',
            desc: 'AC Standard Charging',
            icon: 'power-plug-outline',
          },
          {
            id: 'p3',
            name: 'GB/T',
            desc: 'Indian Standard Fast DC',
            icon: 'flash',
          },
          {
            id: 'p4',
            name: '16A Socket',
            desc: 'Standard Home Plug',
            icon: 'power-socket-uk',
          },
        ];
    }
  };

  const handleAddLater = () => {
    setShowLocationModal(true);
  };

  const handleAddVehiclePress = () => {
    setShowVehicleOptions(true);
  };

  const handleSelectVehicle = type => {
    setSelectedVehicle(type);
    setShowVehicleOptions(false);
    // Delay slightly for smooth transition
    setTimeout(() => setShowPlugOptions(true), 300);
  };

  const handleSelectPlug = plug => {
    setShowPlugOptions(false);
    setTimeout(() => setShowLocationModal(true), 300);
  };

  const handleEnableLocation = () => {
    setShowLocationModal(false);
    navigation.replace('TabBar');
  };

  const handleCancelLocation = () => {
    setShowLocationModal(false);
    navigation.replace('TabBar');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      <View
        style={[
          styles.decorCircle,
          {
            backgroundColor: theme.primary,
            opacity: 0.05,
            top: -50,
            right: -50,
            width: 250,
            height: 250,
          },
        ]}
      />
      <View
        style={[
          styles.decorCircle,
          {
            backgroundColor: theme.primary,
            opacity: 0.03,
            bottom: 100,
            left: -80,
            width: 200,
            height: 200,
          },
        ]}
      />

      {!isFromOnboarding && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : null)}>
          <View
            style={[styles.backIconContainer, {backgroundColor: theme.card}]}>
            <MIcon name="chevron-left" size={28} color={theme.text} />
          </View>
        </TouchableOpacity>
      )}

      <Animated.View
        style={[
          styles.inner,
          {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
        ]}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: theme.text}]}>
            Personalize your experience by adding a vehicle
          </Text>
          <Text style={[styles.subtitle, {color: theme.subtext}]}>
            Your vehicle is used to determine compatible charging stations
            around your location.
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Animated.View
            style={[
              styles.illustrationBg,
              {
                backgroundColor: theme.primary + '08',
                transform: [{translateY: floatAnim}],
              },
            ]}>
            <Image
              source={require('../assets/car1.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
            <View style={[styles.signalIcon, {top: 30, right: 50}]}>
              <MIcon name="wifi" size={45} color={theme.primary} />
            </View>
            <View style={[styles.pinIcon, {top: 60, left: 40}]}>
              <MIcon name="map-marker" size={50} color="#FF5252" />
            </View>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.skipButton,
              {borderColor: theme.primary + '40', borderWidth: 2},
            ]}
            onPress={handleAddLater}>
            <Text style={[styles.skipText, {color: theme.primary}]}>
              Add Later
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.addButton, {backgroundColor: theme.primary}]}
            onPress={handleAddVehiclePress}>
            <Text style={styles.addText}>Add Vehicle</Text>
            <MIcon name="plus" size={20} color="#FFF" style={{marginLeft: 6}} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Vehicle Selection Modal */}
      <Modal visible={showVehicleOptions} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, {backgroundColor: theme.background}]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: theme.text}]}>
                Select Vehicle Type
              </Text>
              <Text style={[styles.modalSubtitle, {color: theme.subtext}]}>
                Choose your electric vehicle type.
              </Text>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{width: '100%'}}>
              {vehicleTypes.map(vehicle => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.optionCard,
                    {backgroundColor: theme.card, borderColor: theme.border},
                  ]}
                  onPress={() => handleSelectVehicle(vehicle.name)}>
                  <View
                    style={[
                      styles.iconBox,
                      {backgroundColor: theme.primary + '15'},
                    ]}>
                    <MIcon
                      name={vehicle.icon}
                      size={30}
                      color={theme.primary}
                    />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionName, {color: theme.text}]}>
                      {vehicle.name}
                    </Text>
                    <Text style={[styles.optionDesc, {color: theme.subtext}]}>
                      {vehicle.desc}
                    </Text>
                  </View>
                  <MIcon name="chevron-right" size={20} color={theme.subtext} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowVehicleOptions(false)}>
              <Text style={[styles.closeText, {color: theme.subtext}]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Plug Selection Modal */}
      <Modal visible={showPlugOptions} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, {backgroundColor: theme.background}]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: theme.text}]}>
                Select Charging Plug
              </Text>
              <Text style={[styles.modalSubtitle, {color: theme.subtext}]}>
                Choose the compatible plug for your {selectedVehicle}.
              </Text>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{width: '100%'}}>
              {getPlugTypes().map(plug => (
                <TouchableOpacity
                  key={plug.id}
                  style={[
                    styles.optionCard,
                    {backgroundColor: theme.card, borderColor: theme.border},
                  ]}
                  onPress={() => handleSelectPlug(plug.name)}>
                  <View
                    style={[styles.iconBox, {backgroundColor: '#3B82F615'}]}>
                    <MIcon name={plug.icon} size={28} color="#3B82F6" />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionName, {color: theme.text}]}>
                      {plug.name}
                    </Text>
                    <Text style={[styles.optionDesc, {color: theme.subtext}]}>
                      {plug.desc}
                    </Text>
                  </View>
                  <MIcon name="chevron-right" size={20} color={theme.subtext} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowPlugOptions(false)}>
              <Text style={[styles.closeText, {color: theme.subtext}]}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Modal */}
      <Modal visible={showLocationModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalContent, {backgroundColor: theme.background}]}>
            <View
              style={[
                styles.locationIconContainer,
                {backgroundColor: theme.primary + '15'},
              ]}>
              <View
                style={[
                  styles.locationIconInner,
                  {backgroundColor: theme.primary},
                ]}>
                <MIcon name="map-marker-radius" size={45} color="#FFF" />
              </View>
            </View>
            <Text style={[styles.modalTitle, {color: theme.text}]}>
              Enable Location
            </Text>
            <Text style={[styles.modalSubtitle, {color: theme.subtext}]}>
              We need access to your location to find EV charging spot around
              you.
            </Text>
            <TouchableOpacity
              style={[
                styles.modalPrimaryButton,
                {backgroundColor: theme.primary},
              ]}
              onPress={handleEnableLocation}>
              <Text style={styles.modalPrimaryButtonText}>Enable Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalSecondaryButton,
                {backgroundColor: theme.primary + '15'},
              ]}
              onPress={handleCancelLocation}>
              <Text
                style={[
                  styles.modalSecondaryButtonText,
                  {color: theme.primary},
                ]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, overflow: 'hidden'},
  decorCircle: {position: 'absolute', borderRadius: 150, zIndex: 0},
  backButton: {marginTop: 20, marginLeft: 24, zIndex: 10},
  backIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inner: {flex: 1, paddingHorizontal: 24, paddingTop: 15, zIndex: 1},
  header: {marginBottom: 30},
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 16,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  subtitle: {fontSize: 16, lineHeight: 26, opacity: 0.8, fontWeight: '500'},
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  illustrationBg: {
    width: width * 0.88,
    height: width * 0.88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  illustration: {width: '85%', height: '65%'},
  signalIcon: {position: 'absolute', opacity: 0.5},
  pinIcon: {position: 'absolute', opacity: 0.9},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 15,
  },
  skipButton: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {fontSize: 16, fontWeight: '900', letterSpacing: 0.5},
  addButton: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  addText: {color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.5},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    padding: 28,
    borderRadius: 32,
    alignItems: 'center',
    elevation: 20,
  },
  modalHeader: {width: '100%', alignItems: 'center', marginBottom: 24},
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {flex: 1},
  optionName: {fontSize: 16, fontWeight: '800', marginBottom: 2},
  optionDesc: {fontSize: 11, fontWeight: '500'},
  closeBtn: {marginTop: 10, padding: 10},
  closeText: {fontSize: 14, fontWeight: '700'},
  locationIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationIconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  modalPrimaryButton: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalPrimaryButtonText: {color: '#FFF', fontSize: 16, fontWeight: '800'},
  modalSecondaryButton: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSecondaryButtonText: {fontSize: 16, fontWeight: '800'},
});

export default AddVehiclePromptScreen;
